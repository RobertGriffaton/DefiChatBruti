// CommonJS-compatible imports (works with ts-node/tsx and Node without ESM config)
const express = require('express');
const cors = require('cors');
require('dotenv/config');
const OpenAI = require('openai');

const app = express();
app.use(
  cors({
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
    credentials: true,
  })
);
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/health', (_req: any, res: any) => {
  res.status(200).json({ ok: true });
});

app.post("/api/chat/stream", async (req: any, res: any) => {
  const { messages, style } = req.body as {
    messages: { role: "user" | "assistant" | "system"; content: string }[];
    style?: "CYNIC" | "POET" | "GURU";
  };

  const safeMessages = Array.isArray(messages) ? messages : [];
  const safeStyle = style ?? 'CYNIC';

  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  // Immediately open the stream
  res.write(':ok\n\n');

  if (!process.env.OPENAI_API_KEY) {
    res.write(`data: ${JSON.stringify({ error: 'missing_openai_api_key' })}\n\n`);
    return res.end();
  }

  const system = {
    role: "system" as const,
    content:
      `Tu es "Chat Perché", un chatbot volontairement à côté de la plaque (drôle, philosophe du dimanche). ` +
      `Style=${safeStyle}. ` +
      `Tu ne donnes PAS de sources inventées. Si tu ajoutes des liens, ce sont des liens de recherche génériques. ` +
      `Réponses courtes, vivantes, avec tics de langage.`,
  };

  let ping: ReturnType<typeof setInterval> | undefined;

  try {
    const ac = new AbortController();
    let openaiStream: any;

    const cleanup = () => {
      if (ping) clearInterval(ping);
      try {
        // OpenAI SDK stream supports controller.abort() in recent versions
        openaiStream?.controller?.abort?.();
        openaiStream?.abort?.();
      } catch {
        // ignore
      }
      // Ensure response is closed
      try {
        res.end();
      } catch {
        // ignore
      }
    };

    req.on('close', () => {
      ac.abort();
      cleanup();
    });

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      temperature: 0.9,
      messages: [system, ...safeMessages],
      signal: ac.signal,
    });
    openaiStream = stream;

    ping = setInterval(() => {
      res.write(`:ping\n\n`);
    }, 15000);

    for await (const event of stream) {
      const delta = event.choices?.[0]?.delta?.content;
      if (delta) res.write(`data: ${JSON.stringify({ delta })}\n\n`);
    }

    if (ping) clearInterval(ping);
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (e: any) {
    if (ping) clearInterval(ping);
    const payload = {
      error: 'server_error',
      name: e?.name ?? 'Error',
      message: e?.message ?? String(e),
    };
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
      res.end();
    }
  }
});

app.listen(3001, () => console.log("Server: http://localhost:3001"));
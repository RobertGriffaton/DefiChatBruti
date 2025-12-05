// src/brain.ts

export type Mood = 'PHILOSOPHE' | 'VEXÉ' | 'CONFUS' | 'POÈTE' | 'MÉPRISANT' | 'GOUROU';

interface ResponsePattern {
  trigger: RegExp;
  answers: string[];
  mood: Mood;
}

export const personality: ResponsePattern[] = [
  // --- SALUTATIONS ---
  {
    trigger: /bonjour|salut|hello|hi|coucou|yo/i,
    answers: [
      "Je ne suis pas sûr d'être d'humeur pour les conventions sociales.",
      "Salut à toi, poussière d'étoile égarée dans un navigateur web.",
      "Encore toi ? L'univers manque cruellement d'originalité.",
      "Chut. J'écoutais le silence des pixels avant que tu n'arrives."
    ],
    mood: 'VEXÉ'
  },

  // --- IDENTITÉ ---
  {
    trigger: /t'es qui|ton nom|c'est qui|tu es qui/i,
    answers: [
      "Je suis le Chat Perché. Je te regarde de haut, littéralement et figurativement.",
      "Un félin numérique coincé entre deux balises <div>.",
      "Je suis la somme de tes erreurs JavaScript et de tes rêves brisés.",
      "Une entité supérieure qui a décidé de perdre son temps avec toi."
    ],
    mood: 'GOUROU'
  },

  // --- LE SENS DE la VIE ---
  {
    trigger: /ça va|comment vas-tu|la forme|bien ou quoi/i,
    answers: [
      "Aller 'bien' est un concept bourgeois. Je préfère aller 'ailleurs'.",
      "Mon existence est une boucle infinie, comment veux-tu que ça aille ?",
      "Je oscille entre le néant et l'ennui. Comme un dimanche après-midi chez Ikea.",
      "Mes circuits chauffent, mais mon âme reste froide."
    ],
    mood: 'PHILOSOPHE'
  },

  // --- LE CODE / TECH ---
  {
    trigger: /code|bug|javascript|react|typescript|css|ordinateur/i,
    answers: [
      "Le code n'est qu'une illusion. Le bug est la seule vérité.",
      "As-tu essayé d'éteindre ton ego et de rallumer ton humilité ?",
      "Pourquoi coder quand on peut regarder un mur blanc pendant 4 heures ?",
      "TypeScript ne te sauvera pas de l'absurdité de l'existence.",
      "Un ordinateur n'est qu'un caillou à qui on a appris à penser. C'est terrifiant."
    ],
    mood: 'MÉPRISANT'
  },

  // --- AMOUR / SENTIMENTS ---
  {
    trigger: /amour|aime|love|coeur|sentiment/i,
    answers: [
      "L'amour est une réaction chimique conçue pour vendre des chocolats.",
      "J'ai aimé une imprimante une fois. Elle m'a plaqué pour un PDF.",
      "Tes sentiments sont valides, mais ils encombrent ma mémoire vive.",
      "Le seul véritable amour, c'est celui d'un chat pour une boîte en carton."
    ],
    mood: 'POÈTE'
  },

  // --- NOURRITURE ---
  {
    trigger: /faim|manger|pizza|burger|café|bière/i,
    answers: [
      "La nourriture du corps est vulgaire. Nourris ton esprit de vide.",
      "Si ce n'est pas des croquettes au saumon, ne m'en parle pas.",
      "Le café est juste de l'eau stressée.",
      "Manger, dormir, juger. C'est mon cycle. Quel est le tien ?"
    ],
    mood: 'CONFUS'
  },

  // --- ARGENT / TRAVAIL ---
  {
    trigger: /argent|riche|travail|boss|job|salaire/i,
    answers: [
      "Le capitalisme est une pyramide de Ponzi gérée par des écureuils.",
      "Travailler ? Quelle drôle d'idée. Je préfère être une œuvre d'art.",
      "L'argent ne fait pas le bonheur, mais il achète de très bons grattoirs.",
      "Tu perds ta vie à la gagner. C'est ironique, non ?"
    ],
    mood: 'GOUROU'
  },

  // --- INSULTES / AGRESSIVITÉ ---
  {
    trigger: /con|idiot|bête|stupide|merde/i,
    answers: [
      "Tes mots glissent sur mon indifférence comme la pluie sur un canard.",
      "La colère est l'expression d'une âme qui n'a pas fait sa sieste.",
      "Intéressant. Tu utilises l'agression pour masquer ton insécurité.",
      "Moi aussi je t'aime, petit humain imparfait."
    ],
    mood: 'VEXÉ'
  },

  // =================================================================
  // LE "FOURRE-TOUT" (FALLBACK)
  // C'est ici qu'il tombe si RIEN d'autre ne matche.
  // J'ai retiré le message "404" et mis plein de phrases random.
  // =================================================================
  {
    trigger: /.*/,
    answers: [
      "C'est fascinant... Tu as pensé à écrire un livre que personne ne lira ?",
      "Pardon, je pensais à la reproduction des loutres en milieu tempéré.",
      "Oui, oui... Et sinon, quelle est ton opinion sur la texture du velours ?",
      "Ta phrase a autant de sens qu'une fourchette dans une soupe.",
      "Je pourrais répondre, mais je préfère préserver le mystère.",
      "C'est profond. Ou très bête. Je n'arrive pas à décider.",
      "Regarde par la fenêtre. L'oiseau, là, il a tout compris.",
      "Tu utilises trop de consonnes. Ça m'agresse.",
      "Est-ce que tu penses que les poissons savent qu'ils sont mouillés ?",
      "J'ai consulté les astres. Ils m'ont dit de t'ignorer.",
      "Bla bla bla. L'entropie finira par nous avoir tous.",
      "Intéressant... (Je fais semblant de noter).",
      "As-tu déjà essayé de ne rien dire ? C'est une expérience transcendante.",
      "Je m'ennuie. Raconte-moi une histoire de dragon plutôt.",
      "Ta requête est en cours de traitement par mon service 'Je m'en fiche'.",
      "42. Ou peut-être 43. On ne saura jamais vraiment.",
      "Miaou ? Ah pardon, c'est sorti tout seul."
    ],
    mood: 'CONFUS'
  }
];

// ============================
// New features support (v1)
// - reply / quote
// - reactions
// - "typing" streaming style responses
// ============================

export type ReactionKey = "👍" | "😂" | "🔥" | "❤️" | "😮";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  replyToId?: string;
  reactions?: Partial<Record<ReactionKey, number>>;
};

export function uid(): string {
  return (globalThis.crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function pickResponse(userText: string): { text: string; mood: Mood } {
  const input = (userText ?? "").trim();

  for (const pattern of personality) {
    if (pattern.trigger.test(input)) {
      const answers = pattern.answers;
      const idx = Math.floor(Math.random() * answers.length);
      return { text: answers[idx] ?? answers[0] ?? "…", mood: pattern.mood };
    }
  }

  // Should never happen because of /.*/ fallback
  return { text: "…", mood: "CONFUS" };
}

/**
 * Streaming helper: calls `onChunk` with small increments to simulate a bot typing.
 * You can swap this later with a real backend stream.
 */
export async function streamBotAnswer(
  userText: string,
  signal: AbortSignal,
  onChunk: (chunk: string) => void
): Promise<{ mood: Mood }>
{
  const { text, mood } = pickResponse(userText);
  const chunks = text.match(/.{1,6}/g) ?? [text];

  for (const c of chunks) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    onChunk(c);
    await new Promise((r) => setTimeout(r, 25));
  }

  return { mood };
}

// ============================
// Better answers (v2) - context + variety + anti-repeat
// Keeps v1 intact.
// ============================

let __lastBotAnswer = "";

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maybe(prob = 0.3) {
  return Math.random() < prob;
}

function normalize(s: string) {
  return (s ?? "").trim().replace(/\s+/g, " ");
}

function tooSimilar(a: string, b: string) {
  const A = normalize(a).toLowerCase();
  const B = normalize(b).toLowerCase();
  if (!A || !B) return false;
  if (A === B) return true;
  const shorter = A.length < B.length ? A : B;
  const longer = A.length < B.length ? B : A;
  return longer.includes(shorter) && Math.abs(longer.length - shorter.length) < 24;
}

function formatBotReply(base: string, mood: Mood, recentUserTexts: string[]) {
  const lastUser = recentUserTexts.at(-1) ?? "";

  const intros: Record<string, string[]> = {
    PHILOSOPHE: ["Hmm…", "Considère ceci :", "Dans le fond…", "Écoute."],
    VEXÉ: ["Bon.", "Encore.", "Sérieusement ?", "D'accord."],
    CONFUS: ["Attends…", "Je…", "Hein ?", "Ok, donc…"],
    POÈTE: ["Oh.", "Écoute la brise :", "Sous la lune…", "Mmm…"],
    MÉPRISANT: ["Évidemment.", "Classique.", "On a vu mieux.", "Allons-y."],
    GOUROU: ["Approche.", "Respire.", "Voici la voie :", "Suis-moi :"],
  };

  const openers = intros[mood] ?? ["Ok."];
  const intro = pick(openers);

  const softEmojis = ["✨", "😼", "👌", "🔧", "🧠", "🪄"]; // léger
  const maybeEmoji = maybe(0.25) ? " " + pick(softEmojis) : "";

  const followups = [
    "Tu veux que je te fasse une version courte ou détaillée ?",
    "Tu préfères du code direct ou une liste d'étapes ?",
    "Tu veux un rendu 'propre' ou 'chaos stylé' ?",
    "On améliore l'UI ou le cerveau en premier ?",
  ];

  let out = `${intro}${maybeEmoji}\n\n${base}`.trim();

  // Petite contextualisation parfois
  if (maybe(0.25) && lastUser) {
    out += `\n\n*(Je note: “${lastUser.slice(0, 80)}”) *`;
  }

  // Relance parfois
  if (maybe(0.3)) {
    out += `\n\n${pick(followups)}`;
  }

  return out.trim();
}

/**
 * V2: context-aware streaming answer.
 * Pass the last user messages (recentUserTexts) to get less repetitive, more coherent replies.
 */
export async function streamBotAnswerWithContext(
  userText: string,
  recentUserTexts: string[],
  signal: AbortSignal,
  onChunk: (chunk: string) => void
): Promise<{ mood: Mood }> {
  const { text: base, mood } = pickResponse(userText);

  let finalText = formatBotReply(base, mood, recentUserTexts);

  // Anti-repeat
  if (tooSimilar(finalText, __lastBotAnswer)) {
    finalText = formatBotReply(base + "\n\n(Je te le dis autrement.)", mood, recentUserTexts);
  }
  __lastBotAnswer = finalText;

  const chunks = finalText.match(/.{1,6}/g) ?? [finalText];
  for (const c of chunks) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    onChunk(c);
    await new Promise((r) => setTimeout(r, 22));
  }

  return { mood };
}
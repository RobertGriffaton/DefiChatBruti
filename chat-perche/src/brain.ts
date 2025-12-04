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
// All the French text of the public site. locales/en.ts must have exactly the same keys.
export const fr = {
  networkError: "Impossible de joindre la librairie pour le moment, réessayez dans un instant.",
  // "14:00" → "14h00"
  time: (hhmm: string) => hhmm.replace(":", "h"),
  days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
  address: "238 rue de Belleville, 75020 Paris",
  metro: "Métro Télégraphe (ligne 11)",

  header: {
    browse: "Parcourir les livres",
    otherLanguage: "EN",
    otherLanguageLabel: "Read this page in English",
  },

  hero: {
    alt: "Les rayonnages de la librairie Hurlevent",
    title: "Librairie Hurlevent",
    tagline: "Librairie indépendante · Paris 20e",
    directions: "Voir l’itinéraire",
  },

  openStatus: {
    closedToday: "Fermé aujourd’hui",
    opensUntil: (closing: string) => `Ouvert · ferme à ${closing}`,
    closedNow: "Fermé en ce moment",
  },

  events: {
    title: "Rencontres & dédicaces",
    none: "Pas de rencontre prévue pour le moment. Suivez-nous sur Instagram !",
    showPast: "Voir les rencontres passées",
    hidePast: "Masquer les rencontres passées",
  },

  picks: {
    title: "Nos coups de cœur",
  },

  about: {
    title: "La librairie",
    paragraphs: [
      "Hurlevent est une librairie indépendante et généraliste installée en haut de la rue de Belleville, face au métro Télégraphe.",
      "Romans, essais, bandes dessinées, jeunesse : nos libraires choisissent chaque livre et vous conseillent avec plaisir. Tout au long de l’année, nous accueillons des rencontres et des dédicaces avec les auteurs.",
      "Un livre n’est pas en rayon ? Nous le commandons pour vous, à retirer en librairie.",
    ],
  },

  info: {
    title: "Infos pratiques",
    hours: "Horaires",
    closed: "Fermé",
    address: "Adresse",
    contact: "Contact",
  },

  bookCard: {
    coverAlt: (title: string) => `Couverture de ${title}`,
    note: (text: string) => `« ${text} »`,
    reserve: "Réserver",
  },

  reservation: {
    title: (title: string) => `Réserver « ${title} »`,
    thanks:
      "Merci ! Votre réservation est enregistrée. La librairie vous contactera dès que le livre sera prêt. Le paiement se fait sur place.",
    close: "Fermer",
    name: "Nom",
    phone: "Téléphone",
    email: "Email (facultatif)",
    cancel: "Annuler",
    send: "Réserver",
    sending: "Envoi…",
    missingFields: "Merci d'indiquer votre nom et votre téléphone.",
    failed: "La réservation a échoué, réessayez dans un instant.",
  },

  books: {
    metaTitle: "Parcourir les livres — Librairie Hurlevent",
    metaDescription:
      "Parcourez les livres de la librairie Hurlevent, réservez-les en ligne et venez les retirer au 238 rue de Belleville. Paiement sur place.",
    title: "Parcourir les livres",
    intro:
      "Parcourez nos livres, réservez-les en ligne et venez les retirer en librairie. Le paiement se fait sur place.",
    searchPlaceholder: "Titre, auteur, ISBN…",
    searchLabel: "Rechercher un livre",
    search: "Rechercher",
    searching: "Recherche…",
    searchFailed: "La recherche a échoué, réessayez dans un instant.",
    resultsFor: (query: string) => `Résultats pour « ${query} »`,
    clear: "Effacer",
    noResults: "Aucun livre trouvé. Essayez avec un autre titre ou le nom de l’auteur.",
    orderHint: "Un livre n’est pas en rayon ? Réservez-le quand même : nous le commandons pour vous.",
    catalogSoon: "Le catalogue en ligne arrive bientôt. En attendant, utilisez la recherche.",
    categories: "Catégories",
  },

  home: {
    metaTitle: "Librairie Hurlevent — Belleville, Paris 20e",
    metaDescription:
      "Librairie indépendante au 238 rue de Belleville, Paris 20e. Rencontres, dédicaces, coups de cœur et réservation en ligne avec retrait en librairie.",
  },

  notFound: {
    metaTitle: "Page introuvable — Librairie Hurlevent",
    title: "Page introuvable",
    text: "Cette page n’existe pas ou a été déplacée.",
    back: "Retour à l’accueil",
  },

  chat: {
    launcher: "Conseil d’un libraire",
    open: "Ouvrir l’assistant de la librairie",
    label: "Assistant de la librairie",
    greeting: "Bonjour ! Je peux vous aider à trouver un livre. Que cherchez-vous ?",
    unavailable: "L’assistant est indisponible pour le moment, réessayez dans un instant.",
    close: "Fermer",
    placeholder: "Un polar, un roman jeunesse…",
    messageLabel: "Votre message",
    send: "Envoyer",
  },
};

export type Dictionary = typeof fr;

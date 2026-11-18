import type { Dictionary } from "@/locales/fr";

// The compiler checks that this object has exactly the same keys as the French one
export const en: Dictionary = {
  networkError: "We can't reach the bookshop right now, please try again in a moment.",
  time: (hhmm) => hhmm,
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  address: "238 rue de Belleville, 75020 Paris",
  metro: "Télégraphe metro station (line 11)",

  header: {
    browse: "Browse books",
    otherLanguage: "FR",
    otherLanguageLabel: "Lire cette page en français",
  },

  hero: {
    alt: "The shelves of the Hurlevent bookshop",
    title: "Librairie Hurlevent",
    tagline: "Independent bookshop · Paris 20th",
    directions: "Get directions",
  },

  openStatus: {
    closedToday: "Closed today",
    opensUntil: (closing) => `Open · closes at ${closing}`,
    closedNow: "Closed right now",
  },

  events: {
    title: "Author meetings & signings",
    none: "No event planned for the moment. Follow us on Instagram!",
    showPast: "Show past events",
    hidePast: "Hide past events",
  },

  picks: {
    title: "Our favourites",
  },

  about: {
    title: "The bookshop",
    paragraphs: [
      "Hurlevent is an independent general bookshop at the top of rue de Belleville, opposite Télégraphe metro station.",
      "Novels, essays, comics, children's books: our booksellers choose every book and are happy to advise you. All year round, we host author meetings and signings.",
      "A book isn't on the shelf? We'll order it for you, to collect in the shop.",
    ],
  },

  info: {
    title: "Practical information",
    hours: "Opening hours",
    closed: "Closed",
    address: "Address",
    contact: "Contact",
  },

  bookCard: {
    coverAlt: (title) => `Cover of ${title}`,
    note: (text) => `“${text}”`,
    reserve: "Reserve",
  },

  reservation: {
    title: (title) => `Reserve “${title}”`,
    thanks:
      "Thank you! Your reservation is saved. The shop will contact you as soon as the book is ready. You pay in the shop.",
    close: "Close",
    name: "Name",
    phone: "Phone",
    email: "Email (optional)",
    cancel: "Cancel",
    send: "Reserve",
    sending: "Sending…",
    missingFields: "Please enter your name and your phone number.",
    failed: "The reservation failed, please try again in a moment.",
  },

  books: {
    metaTitle: "Browse books — Librairie Hurlevent",
    metaDescription:
      "Browse the books of the Hurlevent bookshop, reserve them online and collect them at 238 rue de Belleville. Pay in the shop.",
    title: "Browse books",
    intro: "Browse our books, reserve them online and collect them in the shop. You pay in the shop.",
    searchPlaceholder: "Title, author, ISBN…",
    searchLabel: "Search for a book",
    search: "Search",
    searching: "Searching…",
    searchFailed: "The search failed, please try again in a moment.",
    resultsFor: (query) => `Results for “${query}”`,
    clear: "Clear",
    noResults: "No book found. Try another title or the author's name.",
    orderHint: "A book isn't on the shelf? Reserve it anyway: we'll order it for you.",
    catalogSoon: "The online catalogue is coming soon. In the meantime, use the search.",
    categories: "Categories",
  },

  home: {
    metaTitle: "Librairie Hurlevent — Belleville, Paris 20th",
    metaDescription:
      "Independent bookshop at 238 rue de Belleville, Paris 20th. Author meetings, signings, favourites and online reservation with collection in the shop.",
  },

  notFound: {
    metaTitle: "Page not found — Librairie Hurlevent",
    title: "Page not found",
    text: "This page doesn't exist or has been moved.",
    back: "Back to the home page",
  },

  chat: {
    launcher: "Ask a bookseller",
    open: "Open the bookshop assistant",
    label: "Bookshop assistant",
    greeting: "Hello! I can help you find a book. What are you looking for?",
    unavailable: "The assistant is unavailable right now, please try again in a moment.",
    close: "Close",
    placeholder: "A crime novel, a children's book…",
    messageLabel: "Your message",
    send: "Send",
  },
};

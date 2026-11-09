/*
 * All of the site's content lives in this one file.
 *
 * To add a project: copy one of the entries in `projects`, give it a new id,
 * then put that id into one or more `rows` below.
 *
 * Project fields
 *   title         Name shown on the card and the listing
 *   font          Any font loaded in index.html (Bungee, Pacifico, Monoton, ...)
 *   palette       Two or three colors used to paint the card art
 *   image         (optional) path to a real thumbnail, e.g. "assets/heart.jpg"
 *   video         (optional) demo video URL; autoplays muted on the listing
 *   link          Where "Watch Now" goes (usually the GitHub repo)
 *   badge         (optional) "New Season", "Recently Added", "New Episodes"...
 *   top10         (optional) true shows the TOP 10 flag
 *   tags          Short labels shown on the listing and hover preview
 *   episodes      Components of the project: { title, duration, description, image? }
 *
 * NOTE: dates/collaborators/episodes below are placeholders unless you've
 * replaced them. Descriptions are pulled from the GitHub repos where they exist.
 */

// Placeholder demo clip (CC0, hosted by MDN) until real demo videos are recorded
const SAMPLE_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

window.PORTFOLIO = {
  owner: {
    name: "Anika Lakhani",
    github: "https://github.com/Anika-Lakhani",
  },

  // The big banner at the top of the homepage. `pitch` is optional (falls back to the description).
  featured: {
    id: "heart-risk",
    pitch: "Three clinical calculators, one heart, and a lot of uncertainty. See how sure your risk score really is, built with South Asians in mind.",
  },

  rows: [
    { title: "Recently Added", ids: ["heart-risk", "speedhacks", "vapi", "shopping", "safespace"] },
    { title: "Feel-Good Viewing", ids: ["safespace", "heart-risk", "paycheck", "rent", "subscriptions"] },
    { title: "Science in Action", ids: ["bio-inspired", "codemic", "tte", "thesis", "nn-playground"] },
    { title: "Personal Tools", ids: ["expenses", "subscriptions", "paycheck", "rent", "shopping"] },
    { title: "Workplace Favorites", ids: ["andromeda", "vapi", "tte", "codemic", "speedhacks"] },
  ],

  projects: {
    "heart-risk": {
      title: "South Asian Heart Risk",
      font: "Abril Fatface",
      palette: ["#7a0b1c", "#e2264d", "#ffb199"],
      badge: "New Season",
      top10: true,
      video: SAMPLE_VIDEO,
      link: "https://github.com/Anika-Lakhani/south-asian-heart-risk",
      description:
        "How sure is your heart risk? Three clinical calculators (PCE, PREVENT, QRISK3) side by side, with measurement uncertainty made visible. Built with South Asians in mind.",
      created: "Nov 2026",
      revised: "Nov 2026",
      collaborators: "Solo",
      audience: "South Asian adults and the clinicians who care for them",
      inspiration: "Standard risk calculators under-predict risk for South Asians",
      tags: ["Health", "Data viz", "TypeScript"],
      episodes: [
        { title: "Three Calculators Walk Into a Clinic", duration: "4m", description: "PCE, PREVENT and QRISK3 run on the same inputs so you can see where they agree — and where they don't." },
        { title: "The Uncertainty Band", duration: "6m", description: "A small change in a blood-pressure reading can move your risk category. This view shows how much." },
        { title: "Built for South Asians", duration: "5m", description: "Why ethnicity adjustments matter, and how the app surfaces them without burying the user in jargon." },
      ],
    },

    speedhacks: {
      title: "Speedhacks '26",
      font: "Press Start 2P",
      palette: ["#0f0c29", "#302b63", "#00e5ff"],
      badge: "Recently Added",
      link: "https://github.com/Anika-Lakhani/speedhacks-hackathon26",
      description: "A 24-hour hackathon build. Placeholder description — tell me what this one does!",
      created: "Oct 2026",
      revised: "Oct 2026",
      collaborators: "Hackathon team",
      audience: "Judges with very little time",
      inspiration: "Caffeine and a deadline",
      tags: ["Hackathon", "Python"],
      episodes: [
        { title: "Hour Zero", duration: "3m", description: "Picking an idea in fifteen minutes." },
        { title: "The Demo", duration: "2m", description: "What we shipped when the clock ran out." },
      ],
    },

    vapi: {
      title: "Vapi Sentiment Analyzer",
      font: "Righteous",
      palette: ["#1d2b64", "#5b4bd8", "#f8cdda"],
      badge: "New Episodes",
      video: SAMPLE_VIDEO,
      link: "https://github.com/Anika-Lakhani",
      description: "Listens to voice-agent calls and scores how the conversation is going in real time. Placeholder description.",
      created: "2026",
      revised: "2026",
      collaborators: "Solo",
      audience: "Teams running voice AI agents",
      inspiration: "Wanting to know when a call is going sideways before it ends",
      tags: ["Voice AI", "NLP"],
      episodes: [
        { title: "Pilot", duration: "4m", description: "Hooking into call transcripts as they stream in." },
        { title: "Reading the Room", duration: "5m", description: "Turning words into a sentiment score you can act on." },
      ],
    },

    shopping: {
      title: "Cart Check",
      font: "Shrikhand",
      palette: ["#ff512f", "#f09819", "#ffe259"],
      link: "https://github.com/Anika-Lakhani",
      description: "A browser extension that makes you pause before you buy. Placeholder description.",
      created: "2026",
      revised: "2026",
      collaborators: "Solo",
      audience: "Impulse shoppers (hi)",
      inspiration: "One too many late-night carts",
      tags: ["Chrome extension"],
      episodes: [
        { title: "Add to Cart?", duration: "3m", description: "Detecting a checkout page and stepping in at the right moment." },
      ],
    },

    safespace: {
      title: "SafeSpace",
      font: "Pacifico",
      palette: ["#5f2c82", "#a83279", "#ffafbd"],
      badge: "Work in Progress",
      video: SAMPLE_VIDEO,
      link: "https://github.com/Anika-Lakhani/safespace",
      description: "A women's safety app, co-built with Pierce Cousins.",
      created: "Jul 2025",
      revised: "Jul 2025",
      collaborators: "Pierce Cousins",
      audience: "Anyone walking home alone",
      inspiration: "Texting friends “home safe?” every night",
      tags: ["Mobile", "JavaScript"],
      episodes: [
        { title: "Check-In", duration: "4m", description: "Let friends know you've arrived — or let them know if you haven't." },
        { title: "Circle of Trust", duration: "3m", description: "Choosing who gets notified, and when." },
      ],
    },

    paycheck: {
      title: "Paycheck Budgeter",
      font: "Bungee",
      palette: ["#134e5e", "#71b280", "#d4fc79"],
      link: "https://github.com/Anika-Lakhani",
      description: "Splits each paycheck into buckets the moment it lands. Placeholder description.",
      created: "2026",
      revised: "2026",
      collaborators: "Solo",
      audience: "Anyone paid biweekly",
      inspiration: "Budgets that think in months when pay comes every two weeks",
      tags: ["Finance"],
      episodes: [
        { title: "Payday", duration: "3m", description: "Rules that divide income automatically." },
      ],
    },

    rent: {
      title: "Rent Calculator",
      font: "Fredoka",
      palette: ["#2193b0", "#6dd5ed", "#fff1c1"],
      link: "https://github.com/Anika-Lakhani",
      description: "Splits rent fairly between roommates by room size and perks. Placeholder description.",
      created: "2026",
      revised: "2026",
      collaborators: "Solo",
      audience: "Roommates who want to stay friends",
      inspiration: "The big-bedroom debate",
      tags: ["Finance", "Utility"],
      episodes: [
        { title: "Who Gets the Big Room?", duration: "3m", description: "Weighting square footage, closets and private bathrooms." },
      ],
    },

    subscriptions: {
      title: "Sub Tracker",
      font: "Monoton",
      palette: ["#232526", "#e53935", "#ff8a80"],
      link: "https://github.com/Anika-Lakhani",
      description: "Finds the subscriptions you forgot you had. (Yes, including this kind.) Placeholder description.",
      created: "2026",
      revised: "2026",
      collaborators: "Solo",
      audience: "Everyone with a free trial they meant to cancel",
      inspiration: "A bank statement full of $4.99s",
      tags: ["Finance"],
      episodes: [
        { title: "The Free Trial", duration: "2m", description: "Reminders before the trial converts." },
      ],
    },

    expenses: {
      title: "Expense Tracker",
      font: "Permanent Marker",
      palette: ["#11998e", "#38ef7d", "#e0ffe9"],
      top10: true,
      link: "https://github.com/Anika-Lakhani",
      description: "A simple, friendly place to log spending and see where it goes. Placeholder description.",
      created: "2026",
      revised: "2026",
      collaborators: "Solo",
      audience: "People who've never stuck with a budgeting app",
      inspiration: "Spreadsheets that never got opened twice",
      tags: ["Finance"],
      episodes: [
        { title: "Where Did It Go?", duration: "4m", description: "Categories and a monthly picture of your spending." },
      ],
    },

    "bio-inspired": {
      title: "Bio-Inspired CNNs",
      font: "Bungee Shade",
      palette: ["#000428", "#004e92", "#7ef9ff"],
      badge: "Award Winner",
      video: SAMPLE_VIDEO,
      link: "https://github.com/Anika-Lakhani/bio-inspired",
      description:
        "Mechanisms that modify CNNs based on human neurobiological mechanisms that reduce noise in image recognition.",
      created: "May 2025",
      revised: "Jun 2025",
      collaborators: "Solo",
      audience: "ML researchers and the neuro-curious",
      inspiration: "The brain is very good at ignoring noise. CNNs aren't.",
      tags: ["Deep learning", "Neuroscience"],
      episodes: [
        { title: "Lateral Inhibition", duration: "7m", description: "Borrowing a trick from the retina to sharpen feature maps." },
        { title: "Noise Trials", duration: "6m", description: "How the modified networks hold up as images get noisier." },
        { title: "Results", duration: "5m", description: "Where biology helps, and where it doesn't." },
      ],
    },

    codemic: {
      title: "CODEMIC",
      font: "Black Ops One",
      palette: ["#141e30", "#243b55", "#f7971e"],
      top10: true,
      link: "https://github.com/Anika-Lakhani/CODEMIC",
      description:
        "A novel image classification debugging method that uses concepts to flag spurious correlations.",
      created: "Dec 2024",
      revised: "Dec 2024",
      collaborators: "Meghna Behari, Thomas Garity",
      audience: "Anyone shipping an image classifier",
      inspiration: "Models that learn “snow” instead of “wolf”",
      tags: ["Interpretability", "Python"],
      episodes: [
        { title: "The Spurious Suspect", duration: "5m", description: "What a spurious correlation looks like in the wild." },
        { title: "Concept Probes", duration: "6m", description: "Using human-readable concepts to interrogate the model." },
      ],
    },

    tte: {
      title: "Time-to-Event",
      font: "Special Elite",
      palette: ["#3a1c71", "#d76d77", "#ffaf7b"],
      link: "https://github.com/Anika-Lakhani/tte-predictions",
      description:
        "Tests TTE prediction methods on real-world data from the 2024 SCANIA dataset, showing when low-fidelity approaches beat ML-based ones.",
      created: "May 2025",
      revised: "May 2025",
      collaborators: "Solo",
      audience: "Reliability engineers and data scientists",
      inspiration: "Sometimes the simple model wins",
      tags: ["Survival analysis", "Data science"],
      episodes: [
        { title: "The SCANIA Files", duration: "5m", description: "Exploring truck component failure data." },
        { title: "Simple vs. Smart", duration: "6m", description: "Head-to-head comparison of prediction approaches." },
      ],
    },

    thesis: {
      title: "The Thesis",
      font: "Abril Fatface",
      palette: ["#0f2027", "#2c5364", "#c9d6ff"],
      badge: "Series Finale",
      link: "https://github.com/Anika-Lakhani/thesis",
      description: "My senior thesis. Placeholder description — tell me the topic!",
      created: "Nov 2024",
      revised: "Jul 2025",
      collaborators: "Thesis advisor",
      audience: "Academic committee (and my parents)",
      inspiration: "A question I couldn't stop thinking about",
      tags: ["Research", "Python"],
      episodes: [
        { title: "Chapter One", duration: "8m", description: "The question and why it matters." },
        { title: "Methods", duration: "9m", description: "How I went about answering it." },
        { title: "Defense", duration: "7m", description: "Results and what's next." },
      ],
    },

    "nn-playground": {
      title: "NN Playground",
      font: "Rubik Mono One",
      palette: ["#ee0979", "#ff6a00", "#ffe000"],
      link: "https://github.com/Anika-Lakhani/nn-playground",
      description: "Just me playing around with PyTorch as I get more familiar with neural network architecture.",
      created: "Feb 2025",
      revised: "Feb 2025",
      collaborators: "Solo",
      audience: "Future me",
      inspiration: "Learning by breaking things",
      tags: ["PyTorch", "Learning"],
      episodes: [
        { title: "Hello, Tensor", duration: "3m", description: "First steps with PyTorch." },
      ],
    },

    andromeda: {
      title: "Andromeda",
      font: "Monoton",
      palette: ["#0b0c2a", "#4b1d6b", "#ff9a9e"],
      link: "https://github.com/Anika-Lakhani/andromeda",
      description:
        "An intern onboarding interface (web and CLI) for future interns at Andromeda Protocol to practice working with the OpenAI API.",
      created: "Jan 2025",
      revised: "Jan 2025",
      collaborators: "Andromeda Protocol team",
      audience: "New engineering interns",
      inspiration: "Making week one less overwhelming",
      tags: ["Onboarding", "LLMs", "Python"],
      episodes: [
        { title: "Day One", duration: "4m", description: "A guided first call to the API." },
        { title: "Two Front Doors", duration: "3m", description: "The same lessons in the browser or the terminal." },
      ],
    },
  },
};

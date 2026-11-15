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
 *   image         (optional) path to a real card thumbnail, e.g. "assets/heart.jpg"
 *   poster        (optional) screenshot shown behind the listing/billboard when there's no video
 *   video         (optional) demo video URL; autoplays muted on the listing
 *   link          Where "Watch Now" goes (usually the GitHub repo); "" hides the button
 *   badge         (optional) "New Season", "Recently Added", "New Episodes"...
 *   top10         (optional) true shows the TOP 10 flag
 *   tags          Short labels shown on the listing and hover preview
 *   pitch         The two-sentence version for a hiring manager; shown as the listing description
 *   episodes      Short stories about the project, each answering one question (`kind`):
 *                   why      What was going wrong, or what need started it?
 *                   change   What it does that the old way didn't
 *                   impact   Why it matters beyond the project (who's affected, at what scale)
 *                   split    My calls vs. what the agents built (use `you` and `agents`
 *                            instead of `description`; my judgement is the main point)
 *                   moment   One concrete story: a decision, a bug caught, some feedback
 *                   trust    How I made sure it was right
 *                   outcome  Who uses it, what changed, who said what (by role)
 *                   open     What's still open, or what I'd do differently
 *                 Each one: { kind, title, description, image?, full? }
 *                 `image` is the 16:9 thumbnail; `full` is the uncropped version shown when it's clicked
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
    { title: "Recently Added", ids: ["heart-risk", "swarmshield", "vapi", "fit-for-me", "safespace"] },
    { title: "Feel-Good Viewing", ids: ["safespace", "heart-risk", "paycheck", "rent", "subscriptions"] },
    { title: "Science in Action", ids: ["bio-inspired", "codemic", "tte", "thesis", "nn-playground"] },
    { title: "Personal Tools", ids: ["moneymate", "subscriptions", "paycheck", "rent", "fit-for-me"] },
    { title: "Workplace Favorites", ids: ["andromeda", "vapi", "tte", "codemic", "swarmshield"] },
  ],

  projects: {
    "heart-risk": {
      title: "South Asian Heart Risk",
      font: "Abril Fatface",
      palette: ["#7a0b1c", "#e2264d", "#ffb199"],
      badge: "New Season",
      top10: true,
      poster: "assets/heart-risk/results.jpg",
      video: "assets/heart-risk/demo.mp4?v=2",
      link: "https://anika-lakhani.github.io/south-asian-heart-risk/",
      pitch:
        "Heart-risk calculators give South Asians answers that differ threefold, and a single blood-pressure reading can't tell you which side of a treatment line you're on. I built a tool that makes both kinds of uncertainty visible, grounded in published clinical models and HCI research, plus a privacy-first way to collect the South Asian data that's missing.",
      description:
        "How sure is your heart risk? Three clinical calculators (PCE, PREVENT, QRISK3) side by side, with measurement uncertainty made visible. Built with South Asians in mind.",
      created: "Fall 2024 · rebuilt Nov 2026",
      revised: "Nov 2026",
      collaborators: "Sanjna Kedia & Krisha Patel (original class project); Claude Code (rebuild)",
      audience: "South Asian adults, and the clinicians who talk with them about statins",
      inspiration: "Harvard CS 2790r (HCI): how do you show risk uncertainty so people understand it and keep trusting it?",
      tags: ["Health", "HCI", "Data viz", "React + TypeScript"],
      episodes: [
        {
          kind: "why",
          title: "Same Person, Three Answers",
          image: "assets/heart-risk/results.jpg",
          full: "assets/heart-risk/results-full.jpg",
          description:
            "For one 48-year-old Pakistani man with ordinary numbers, the three calculators clinicians use report risks of 4.0%, 2.4% and 7.5%. Depending on the risk score used, he could be left untreated or put on a statin, and those differences matter all the more for South Asians, since we face elevated heart risk. South Asians are owed ample context on their heart risk so they can take preventive action early.",
        },
        {
          kind: "change",
          title: "Three Answers, Not One Verdict",
          image: "assets/heart-risk/peers.jpg",
          full: "assets/heart-risk/peers-full.jpg",
          description:
            "The class prototype's risk score always returned zero, and its \"South Asian adjustment\" was a guessed ×1.5. The rebuild shows all three published calculators side by side, uses quantile dotplots of 20 equally likely re-measurements, and compares you with measured peers from NHANES, telling you plainly when the data lumps all Asian Americans together.",
        },
        {
          kind: "impact",
          title: "A Billion Hearts, Barely Studied",
          image: "assets/heart-risk/donate-flatten.jpg",
          full: "assets/heart-risk/donate-full.jpg",
          description:
            "Heart disease is a serious health need for the more than a billion South Asians worldwide, whose first heart attacks come about six years earlier on average. Yet research barely sees them: from 1992 to 2018, just 0.17% of the NIH budget went to clinical research on Asian Americans and Pacific Islanders, and US health surveys file every South Asian group under \"Asian.\" A dataset built with and for South Asians is how risk tools start to fit the people who need them most.",
        },
        {
          kind: "moment",
          title: "Whose Detail Goes First?",
          image: "assets/heart-risk/privacy.jpg",
          full: "assets/heart-risk/privacy-full.jpg",
          description:
            "To anonymize donated data, rare combinations get coarsened until each describes at least 5 people. The first version blurred rare South Asian groups first, which is the very detail the dataset exists for. Reordering so region and age give way first took releasable donors from 50% to about 94%, and kept Sri Lankan and Nepali donors' exact ancestry.",
        },
        {
          kind: "trust",
          title: "Trying to Break It",
          image: "assets/heart-risk/results-dark.jpg",
          full: "assets/heart-risk/results-dark-full.jpg",
          description:
            "Two kinds of confidence. First, that the numbers are right: each calculator reproduces its authors' published reference values (QRISK3 matches 48 profiles scored by its original code), and the browser's models must match the Python ones on 300 random profiles to 12 decimal places or the site won't deploy, 506 automated tests in all. Second, that the privacy promises hold: I attacked my own live database with the website's public key, trying to read, change, delete, backdate and flood it. Every attempt was refused, and the two real bugs it surfaced are now covered by tests.",
        },
        {
          kind: "outcome",
          title: "The Data Got It Backwards",
          image: "assets/heart-risk/explanation.png",
          full: "assets/heart-risk/explanation.png",
          description:
            "The app is live and accepting anonymous data donations. A model trained on 273,266 CDC respondents incorrectly shows that being Asian lowers heart risk, because the survey pools every Asian group into one box. That's the opposite of what the clinical research shows for South Asians: being South Asian elevates one's heart risk. Building a South Asian-specific dataset can help correct this dangerous underemphasis on South Asian heart risk.",
        },
        {
          kind: "open",
          title: "Next Season",
          image: "assets/heart-risk/intake.jpg",
          full: "assets/heart-risk/intake-full.jpg",
          description:
            "A five-person usability study to check whether people read the dotplots correctly. Recruiting donors through South Asian student associations and community groups, so \"people like you\" can compare against South Asian peers. Calibrating against the MASALA study, and asking clinicians whether the results page helps a real conversation about statins. And, hopefully, partnering with the South Asian Heart Center in California's Bay Area to bring this free tool to the people who need it.",
        },
      ],
    },

    swarmshield: {
      title: "SwarmShield",
      font: "Press Start 2P",
      palette: ["#0f0c29", "#302b63", "#00e5ff"],
      badge: "Recently Added",
      poster: "assets/swarmshield/finding-lg.jpg",
      link: "https://github.com/Anika-Lakhani/speedhacks-hackathon26",
      pitch:
        "Startups landing their first enterprise customer face a security review with a team of one and a pentest they can afford once a year. At SpeedHacks, our team of three built SwarmShield, which safely attacks every release in minutes, and I built its memory: how each customer's findings become privacy-scrubbed lessons that protect every other customer.",
      description:
        "A security team of one gets a swarm: continuous, simulated pentesting for every release, where an AI plans what to test and code decides what's real.",
      created: "Oct 2026 · SpeedHacks, SF Tech Week",
      revised: "Oct 2026",
      collaborators: "Eleyn Xiong & Sriya Sthanikam",
      audience: "Startups whose first security hire is a team of one",
      inspiration: "The 200-question security questionnaire that arrives with your first enterprise deal",
      tags: ["Security", "AI agents", "Privacy", "Python"],
      episodes: [
        {
          kind: "why",
          title: "The 200-Question Questionnaire",
          image: "assets/swarmshield/home.jpg",
          full: "assets/swarmshield/home-lg.jpg",
          description:
            "Your first enterprise deal arrives with a security questionnaire. A traditional pentest takes 6 to 10 weeks and costs around $18K, so a security team of one runs it once a year, while engineers ship every day, increasingly with AI-written code that Veracode found has security flaws 45% of the time.",
        },
        {
          kind: "change",
          title: "AI Plans, Code Decides",
          image: "assets/swarmshield/finding.jpg",
          full: "assets/swarmshield/finding-lg.jpg",
          description:
            "Instead of one annual snapshot, SwarmShield tests every release in minutes. An AI planner picks what's most worth testing from a fixed catalog, safe and clearly marked probes run it against simulated targets, and a deterministic verifier, not the AI, decides whether a weakness is real. Nothing real is ever attacked.",
        },
        {
          kind: "moment",
          title: "Copy Nothing, Template Everything",
          image: "assets/swarmshield/shared.jpg",
          full: "assets/swarmshield/shared-lg.jpg",
          description:
            "I owned the memory layer, where one mistake could leak a customer's details to every other customer. So shared lessons are never copied from a customer's notes: they're rendered from tenant-neutral templates, scanned for secrets, personal data and re-identifying details, and quarantined for a human whenever anything looks off. Provenance is a keyed token, never a customer name.",
        },
        {
          kind: "trust",
          title: "One Customer's Lesson, Another's Catch",
          image: "assets/swarmshield/confirmed.jpg",
          full: "assets/swarmshield/confirmed-lg.jpg",
          description:
            "An end-to-end test proves the loop works and stays contained: customer A's broken-ownership bug becomes a lesson that reaches customer B's planner but not customer C's, where it doesn't apply. B's run then confirms a related bug, and the lesson's confidence rises only because two independent customers reproduced it. Promoting any finding to \"verified\" needs a human's approval.",
        },
        {
          kind: "outcome",
          title: "Built in a Day",
          image: "assets/swarmshield/scan.jpg",
          full: "assets/swarmshield/scan-lg.jpg",
          description:
            "Built and demoed in a single day at SpeedHacks during SF Tech Week on October 11, 2026. The attack harness, dashboard, event store and memory layer run end to end on simulated customers, backed by more than 400 automated tests.",
        },
        {
          kind: "open",
          title: "Next Season",
          image: "assets/swarmshield/memory.jpg",
          full: "assets/swarmshield/memory-lg.jpg",
          description:
            "The demo customer sites were still in progress, so the demo runs on simulated ones, and the connection to the sponsor's event store is a stub. And if one customer disproves a shared lesson, the network isn't told automatically yet: for now a reviewer retracts or replaces it by hand, with the reason logged.",
        },
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

    "fit-for-me": {
      title: "Fit For Me",
      font: "Shrikhand",
      palette: ["#ff512f", "#f09819", "#ffe259"],
      link: "https://github.com/anikalakhani/try-on-extension",
      pitch:
        "Product photos show clothes on one body type, so most shoppers can't tell how something will fit them. Fit For Me is a Chrome extension that re-renders the product photo on a model built from your own height, weight and measurements, and does the fit math in code so the AI can't fudge where a hem lands.",
      description:
        "A Chrome extension that puts the clothes you're browsing on a model with your body, right on the product page.",
      created: "Aug 2026",
      revised: "Nov 2026",
      collaborators: "Solo, with Claude Code",
      audience: "Shoppers whose bodies don't match the model in the photo",
      inspiration: "Product photos that only ever show one body type",
      tags: ["Chrome extension", "Generative AI", "Claude API", "JavaScript"],
      episodes: [
        {
          kind: "why",
          title: "Not Your Body, Not Your Fit",
          description:
            "Online clothing photos show every garment on the retailer's own model, so anyone with a different body has to guess how it will actually look on them. I built Fit For Me for my own shopping, and with no settings entered it defaults to a plus-size model, the tool's original purpose.",
        },
        {
          kind: "change",
          title: "Try This On",
          description:
            "On any product page, one click scrapes the garment photo, its measurements and the reference model's size. Claude writes a prompt from your saved height, weight, cup size and skin tone, FLUX generates your model, and FASHN puts the real garment on her. The result replaces the photo right on the page in 30 to 60 seconds, for about 9 cents.",
        },
        {
          kind: "moment",
          title: "The Face That Changed",
          description:
            "An extra editing step nudges the hem to where it would really land. Sending it the retailer's photo as insurance seemed sensible, until the final images showed a stranger's face. Comparing every stage side by side showed the face was right after try-on and only changed after the edit, which was borrowing the retailer's model's identity. The fix was to send it nothing extra.",
        },
        {
          kind: "trust",
          title: "Don't Let the AI Do the Math",
          description:
            "Twice, Claude stated the rule for shorter-versus-taller models correctly and then reversed it in its own conclusion. So the arithmetic moved into code: hem shift = garment length × (1 − your height ÷ the reference model's height), and ease = garment bust − your bust, both parsed from the page's own text. Claude only phrases a sentence around the number. Fixed seeds keep runs comparable, and an offline test suite runs with no API calls.",
        },
        {
          kind: "outcome",
          title: "An Honest Mirror",
          description:
            "I use it for my own shopping. When the math says a garment is more than 5 inches off your measurements, it doesn't soften the result: the generated image arrives blurred, with a note that the item doesn't seem to come in your size, and you choose whether to see it anyway.",
        },
        {
          kind: "open",
          title: "Next Season",
          description:
            "It's personal-use only, running on my own API keys. Some retailers publish no measurements at all, so it falls back to their written fit language (\"slightly cropped, hits above the hip\") instead of a number. And the try-on model accepts images only, so precise fit instructions can reach it only indirectly.",
        },
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

    moneymate: {
      title: "MoneyMate",
      font: "Permanent Marker",
      palette: ["#11998e", "#38ef7d", "#e0ffe9"],
      top10: true,
      poster: "assets/moneymate/dashboard-lg.jpg",
      link: "",
      pitch:
        "New grads managing money for the first time often stall at an empty budget form. MoneyMate is a friendly weekly budget tracker that suggests realistic starting budgets from your actual take-home pay and rent, and shows exactly how it got each number.",
      description:
        "A friendly weekly budget tracker for anyone managing their own money for the first time.",
      created: "Jul 2026",
      revised: "Jul 2026",
      collaborators: "Solo",
      audience: "Recent grads managing their own money for the first time",
      inspiration: "Graduating college is hard; adult finances can feel even harder",
      tags: ["Personal finance", "Flask", "Python"],
      episodes: [
        {
          kind: "why",
          title: "The Blank Budget Form",
          image: "assets/moneymate/add.jpg",
          full: "assets/moneymate/add-lg.jpg",
          description:
            "Graduating college is hard, and managing adult finances can feel even harder. Most budgeting tools open on an empty form, which is exactly where someone handling their own money for the first time gets stuck: what's a reasonable amount to spend on groceries?",
        },
        {
          kind: "change",
          title: "Numbers to Start From",
          image: "assets/moneymate/dashboard.jpg",
          full: "assets/moneymate/dashboard-lg.jpg",
          description:
            "Share your take-home pay and rent, both optional, and MoneyMate suggests weekly budgets using the 50/30/20 rule: half for needs, with rent taken out first, 30% for wants, and 20% nudged toward savings. Color-coded bars show each category as on track, getting close, or over, and everything stays on your own computer.",
        },
        {
          kind: "moment",
          title: "When Rent Eats Everything",
          image: "assets/moneymate/rent.jpg",
          full: "assets/moneymate/rent-lg.jpg",
          description:
            "Rent comes out of the \"needs\" half before groceries and transportation are split. If rent alone is bigger than that whole pool, MoneyMate doesn't invent numbers to make the math work: it suggests $0 for both and flags that rent may be taking an outsized share of your pay.",
        },
        {
          kind: "trust",
          title: "Show Your Work",
          image: "assets/moneymate/math.jpg",
          full: "assets/moneymate/math-lg.jpg",
          description:
            "Every suggested number comes with a \"How are the suggested amounts calculated?\" button that walks through the full math using your own income and rent. It started as a command-line tool, then a desktop app, then this web app, and all three still share one local data file, so anything logged in one shows up in the others.",
        },
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

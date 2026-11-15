# Persona personalization plan

Status: **agreed, not built yet.** We're filling in more projects first, since
personalization mostly reorders content and needs real content to reorder.

Visitors pick a persona on the "Who's watching?" screen (already built; the choice is
stored as `<body data-persona="...">` and `window.Profiles.current()`).

## What changes per persona

1. **Featured banner:** which project leads, and a pitch written for that audience.
2. **Row order**, plus one curated row at the top.
3. **Episode order:** the episode types that persona cares about come first in each listing.
4. **About page:** the one-line intro and the buttons (résumé, email, calendar, visual work).

| Persona | Banner pitch angle | Top row | Episodes first | About page leads with |
|---|---|---|---|---|
| Recruiter | What I built and the skills it shows | **Top Picks** (strongest 4–5) | why → trust → outcome | Role I'm seeking, skills, Résumé button |
| Product / Business | The user problem and the decision I made | **Feel-Good Viewing** | why → moment → outcome | How I make product calls, contact |
| Investor | Scale of the need and traction | **We Think You'll Love These** (biggest impact) | impact → outcome → open | Vision and what's next, Get in touch |
| Creative | The experience and the design choices | **Boredom Busters** (demo videos, most visual) | change → moment | Design process, Figma work, playful intro |
| Guest | Current version | Current order | Current order | Current About page |

## How to build it

A `personas` section in `data/projects.js`, one entry per persona:

```js
personas: {
  recruiter: {
    featured: { id: "heart-risk", pitch: "..." },
    topRow: { title: "Top Picks", ids: [...] },
    rowOrder: ["Recently Added", "Workplace Favorites", ...],
    episodeOrder: ["why", "trust", "outcome"],
    about: { logline: "...", buttons: [...] },
  },
  ...
}
```

The page reads the chosen persona and applies its settings; anything a persona doesn't
set falls back to the Guest view. Changing what a persona sees is then a text edit.

## Needed from Anika before building

- Résumé PDF, and which contact links are OK to make public (email, LinkedIn, calendar).
- Which projects are strongest, for the Top Picks row.
- Target role (assumed: product / HCI / engineering).

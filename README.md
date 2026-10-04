# Just Fucking Ask Your Agent

An original, agent-agnostic rant for **justfuckingaskyouragent.com**. Plain HTML, CSS, and JavaScript. No dependencies or build step.

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Deploy `index.html`, `style.css`, `script.js`, and `favicon.svg` to any static host. The domain is set in the canonical and Open Graph metadata; DNS and hosting still need to be configured.

## Share links

The page reads optional query params and personalizes the hero, LMGTFY-style:

```
/?to=Dave&from=Priya&q=how+do+I+make+a+pivot+table
```

- `to` / `from` (max 40 chars) rewrite the eyebrow: “Hey Dave, Priya sent you this. On purpose.”
- `q` (max 200 chars) gets typed into the fake agent box once the tab is visible, then shows the punchline.
- Without params, the box cycles through example questions. Reduced motion shows static text.
- Everything is written with `textContent`; nothing from the URL is parsed as HTML.

The “Send to a Dave” section (`#send`) builds these links.

## Content direction

The site is for everyone, not just developers. It covers work, money and paperwork, health (with a real “not a doctor” caveat), learning, life advice, and tech support. Running gag: Dave, who you keep DMing, and who just asks *his* agent and pastes you the answer.

Researched the 41 sites listed at [justfuckinguse.com](https://justfuckinguse.com/) on October 4, 2026, including the directory’s archived AI and Laravel links. Client-rendered pages were inspected in the browser. The references are inspiration, not sources of technical claims about particular agents.

- **HTML, React, CSS, Postgres, Rails, Docker:** direct second-person rants, escalating objections, practical examples, a repeated imperative.
- **Cursor and Copilot:** code/diff presentation and excuses. This version avoids vendor rankings and unverifiable productivity claims.
- **Gemini, Figma, Perplexity, DeepSeek:** committed parody formats. This version uses a printed public-service announcement with a small terminal-like prompt box.
- **Cron, Plain Text, Standards, SharePoint:** ordinary tasks inflated into elaborate systems; practical limits underneath the joke.
- **What You Want, Brain, Stop Already:** context matters. The point is to try a useful task, review the result, and retain judgment.

The remaining framework, language, infrastructure, and AI sites reinforce the family’s huge typography, blunt calls to action, demonstrations, and cross-links. All site copy here is original. The footer and essay link back to the inspiration.

## Quick browser check

Check a desktop and a 375px viewport for overflow. Select each prompt and copy one; deny clipboard permission to check the selection fallback. Build a share link, open it, and confirm the question types out and the punchline appears. Open objections with the keyboard, follow the section links, and check the page with JavaScript disabled. Restore any viewport emulation after checking.

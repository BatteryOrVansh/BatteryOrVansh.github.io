# Old site: content notes

Read from the old site (tag `old-site-v1`, commit `f3ce870`, and the earlier
Vite/React version at `1944ce6`). Content only: no code or design was carried
over. The Next.js version read most of its copy from Supabase tables, which are
not in the repo, so most of what is below comes from the older Vite version.

## Identity

- Vansh Dixit. Handle: BatteryOrVansh.
- B.Tech undergraduate at BBD University, Lucknow, Uttar Pradesh (CSE per the old `context.md`).
- Co-founder of **WaterPlane** (team offers digital solutions to clients). Old
  `context.md` called him "Co-Founder & Tech Lead".
- Co-founded **Juvenile Foundation** at 16 (leadership, graphic design, SEO, project management).
- "Coming from a defence background, discipline is deep rooted in my work ethics."
- Old hero line: "Full Stack Developer, Software Engineer, and Graphic Designer".
- Old fallback interests line: "Software development and generative AI."

## Hackathons (old site, as written there)

| Event | When | Where | Note |
|---|---|---|---|
| Hack-A-Run | Nov 2023 | BBD University, Lucknow | 1st position. Student session site: Pomodoro, live music, notes, to-do, focus sessions. |
| Smart India Hackathon | 2024 | National | Multilingual chatbot ticketing for museums (proposal). |
| TechKriti with NFRA | Mar 2025 | IIT Kanpur | PRAMAAN: LLM financial statement simplifier. Role: data cleaning and visualisation. |
| Bhartiya Antariksh Hackathon | Jul 2025 | ISRO | Vaayu Darshak: hyperlocal air-quality monitoring/forecasting. |
| Smart India Hackathon | 2025 | National | MANOBAL: mental-health support for college students. Role: GAD-7 research. |
| Vaultheist ISTE Hackathon | Oct 2025 | CGC University, Mohali | Glide UpSkill: AI career-learning platform. Role: frontend, control flow, product strategy. |

## Skills listed on the old site

- Languages: Java, Python, C, C++, JavaScript, HTML, CSS.
- Frameworks/tools: React, Node.js, MongoDB, Pandas, NumPy, Matplotlib, Seaborn,
  Linux CLI, Git/GitHub, "GenAI / LLMs".
- Interests: web development, AI/ML integration, real-time systems, responsive UI.

## Certifications

- IBM Cognitive Class (two certificates).
- Microsoft Learn (one achievement).

## Links

- Email: officialvanshdixit@gmail.com (public on the old site).
- GitHub: https://github.com/BatteryOrVansh
- LinkedIn: https://www.linkedin.com/in/vanshdixit/
- LeetCode: listed as both `vanshdixit` and `VanshDixit` in different versions.

## Not found anywhere in the old site

- FocusBoard, AdOps Toolkit, AdPulse (the three projects the redesign features).
- InMobi Group (new; from the redesign brief).
- Resume link, photo.

## Security scan

Scanned all commits on all branches for API keys, tokens, private keys and
committed `.env` files. Nothing found: only `.env.example` with empty values.
The old README and `context.md` name the Supabase project ref and Firebase
project id; those are identifiers, not secrets. The old Vercel deployment and
its Supabase/Firebase projects still exist outside this repo.

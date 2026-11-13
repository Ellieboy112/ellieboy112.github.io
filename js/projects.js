/* =========================================================
   MY PROJECTS
   ---------------------------------------------------------
   To add a new project, copy one block below, paste it at
   the TOP of the list, and fill it in. Save, push to GitHub,
   and the new card appears on the site.

   Fields:
     title        Project name
     tagline      One short line under the title
     description  2 to 3 sentences: what it does, who it's for
     image        Screenshot path (put the file in assets/screens/)
     url          Where the card goes when clicked (live app/website)
     caseStudy    (optional) page with more details, e.g. "projects/my-app.html"
     repo         (optional) public GitHub link
     tags         Tech used
     type         e.g. "Web App", "Mobile App", "Website"
     year         e.g. "2026"
     status       "live", "in-progress", or "coming-soon"
   ========================================================= */

const PROJECTS = [
  {
    title: "I-Judge",
    tagline: "Real-time judging & tabulation platform",
    description:
      "Replaces paper scoresheets at Pangasinan State University events. Judges score from their phones with QR + PIN sign-in, even offline. Rankings update live, and official results print after every judge verifies. Rated 4.60 / 5 by 50 evaluators.",
    image: "assets/screens/projector.webp",
    url: "https://i-judge-psu.vercel.app",
    caseStudy: "projects/i-judge.html",
    repo: "",
    tags: ["Flutter", "Supabase", "PostgreSQL", "Realtime", "Vercel"],
    type: "Web App",
    year: "2026",
    status: "live",
    role: "Developer · Capstone",
  },

  // ----- Placeholders for upcoming projects (delete or replace these) -----
  {
    title: "Next project",
    tagline: "Currently in the works",
    description: "A new app is being built. Check back soon, or reach out to hear what I'm working on.",
    tags: ["Flutter", "Firebase"],
    status: "coming-soon",
  },
  {
    title: "Your idea here?",
    tagline: "Open to collaborations",
    description: "Have a project in mind or a team I could help? I'd love to build something together.",
    tags: ["Let's talk"],
    status: "coming-soon",
    url: "#contact",
  },
];

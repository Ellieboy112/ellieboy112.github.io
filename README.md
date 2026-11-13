# Ellison Olivo — Portfolio

A static portfolio site (HTML, CSS, JavaScript). No build step, so it works on GitHub Pages as-is.

```
index.html              Home: hero, about, project cards, skills, experience, contact
projects/i-judge.html   I-Judge case study (screens, interactive demo, results)
js/projects.js          ← YOUR PROJECT LIST (edit this to add projects)
js/main.js              Animations, demo, command menu (Ctrl+K)
css/style.css           All styles
assets/                 Resume PDF, screenshots, favicon, social preview image
```

## Put it online with GitHub Pages (free)

1. Sign in to GitHub as **Ellieboy112**.
2. Create a **new public repository** named exactly `ellieboy112.github.io`.
3. On the repo page, click **Add file → Upload files**, and drag in **everything inside this folder**
   (`index.html`, `css`, `js`, `assets`, `projects`, `README.md`). Click **Commit changes**.
4. Go to **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**,
   **Branch: main**, folder **/ (root)**, then **Save**.
5. Wait 1–2 minutes. Your site is live at **https://ellieboy112.github.io**

If you use a different repository name (e.g. `portfolio`), the address becomes
`https://ellieboy112.github.io/portfolio/`. In that case, update the `og:image` URL at the top of
`index.html` and `projects/i-judge.html` so link previews show the image.

## Add a new project

Open `js/projects.js`, copy the I-Judge block, paste it at the **top** of the list, and fill it in:

```js
{
  title: "My New App",
  tagline: "One short line about it",
  description: "Two or three sentences: what it does and who it's for.",
  image: "assets/screens/my-new-app.webp",   // add a screenshot to assets/screens/
  url: "https://my-new-app.vercel.app",      // clicking the card opens this
  caseStudy: "",                              // optional: "projects/my-new-app.html"
  repo: "",                                   // optional: public GitHub link
  tags: ["Flutter", "Firebase"],
  type: "Mobile App",
  year: "2027",
  status: "live",                             // "live", "in-progress", or "coming-soon"
},
```

Then delete one of the "Coming soon" placeholder cards. Upload the changed files to GitHub
(or `git push`); the site updates in about a minute.

Tip: a screenshot around 1200×750 px works best. Save it as `.webp` or `.png`.

## Update the resume

Replace `assets/Ellison_Olivo_Resume.pdf` with your new file, keeping the same name, so every
"Download Resume" button keeps working.

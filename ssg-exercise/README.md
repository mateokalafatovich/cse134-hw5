# Project Structure

Inside of the Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│    │──components/
│    │  └── Footer.astro
│    └── pages/
│       │── index.astro
│       └── contact.astro
└── package.json
```

The two pages to review are index.astro, the homage page, and contact.astro, the contact page. They both reuse the Footer component.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
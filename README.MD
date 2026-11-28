# Astro Project

## Project Structure

Inside of the Astro project, you'll see the following folders and files:

```text
/
├── ssg-exercise/
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

All commands are run from /ssg, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

The project will not run unless the Node version is >=22.23.4.

## URLs
| Field | Value | 
| --- | --- |
| Repository URL | https://github.com/mateokalafatovich/cse134-hw5 |
| Deployed portfolio URL | https://cse134-hw5-swart.vercel.app/ |
| Part 2 Deployed URL | https://cse134-hw5-swart.vercel.app/interests.html |

## Design Note
On the Interests page, I added a Fun Facts section. The goal is to add some entertainment for the user after, hopefully, learning about a few interesting things that I like.

The way it works is by having a custom fun-fact web component. In it, there is a button called "Get Fact." When users click the button, the button is disabled and the status text is updated to "Loading a new fact...". fetch() makes a GET request to the Useless Facts API. Then, if the response is ok, the data is processed into text, source and sourceUrl. These are stored in the fact object, and then an update function is called. This update function then updates the text content of the fact paragraph and the text content of the source paragraph. Upon success, the user will see a new random fact alongside "Source: " followed by a link to the source of the fact. On failure, the previous fact stays and a console warning is issued. After success or failure, the button is then re-enabled.

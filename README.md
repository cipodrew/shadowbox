## For reference:
project started on Node 20.12.2

## Running the docker container
usage:
```bash
docker build -t sveltekit-shadowbox-dev:latest .  && \
docker run --name=svelte-shadowbox -p 4000:4000 sveltekit-shadowbox-dev
```
add -d to the run command to launch the container in detached mode.
open browser on localhost 4000

Docker image assumes you are using the SSR target (with node)

## Installing dependecies (embedded portion)
see [embedded/README.md](./embedded/README.md)

## Installing dependecies (Sveltekit project)
Using npm ci instead of npm install should ensure you get the exact versions specified in the lock file. npm install uses the semanthics of package.json instead
```bash
# inside the project folder
npm ci
```

## Type Checking
To disable Type Checking with JSDOC edit the jsconfig.json file by setting the field checkJS to false

## UI with Chart.js
### live session screen
![LiveSession](https://github.com/user-attachments/assets/732e7dce-31f5-4856-b3f0-805b59ecd960)

### completed session screen
![CompletedSession](https://github.com/user-attachments/assets/d2c33463-2edb-4807-ba30-9767ad31d145)

---
Made with
# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.




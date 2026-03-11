# traxy docs

This repo contains the public user documentation for `traxy`, published at [docs.traxy.ai](https://docs.traxy.ai).

## Local preview

1. Install the [Mintlify CLI](https://www.npmjs.com/package/mint):

```bash
npm i -g mint
```

2. Start the local preview server from the repo root:

```bash
mint dev
```

3. Open `http://localhost:3000`.

## Checks

Run broken link checks before you open a PR:

```bash
mint broken-links
```

## Contribution rules

- Keep docs public and user-facing.
- Do not document internal, unfinished, or implementation-specific behavior.
- Use `traxy` in lowercase.
- Open a PR for review instead of pushing directly to `main`.

## Research source

If you need product behavior that is not obvious from the docs repo, read from the local `trace-frontend` repo as a source of public UI behavior only. Do not make changes there from this repo.

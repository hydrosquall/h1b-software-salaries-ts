# H1B Salaries Data Browser - Typescript Edition

This project is a variation on Swizec Teller's demo from a lesson for a React/D3 hybrid course to practice using some new tools, including

- [x] Using Typescript 2.8
- [x] Using React 16.4 (making use of CreateRef API)
- [x] Refining various "exercise for reader" items from the original application that were not covered in the original text.
- [x] Host application on github-pages

Other things I'd like to implement going forward:

- [ ] Use Redux to centralize data filtering logic
- [ ] Write some tests with Enzyme + Jest
- [ ] Swap in D3 v5 in place of v4 (d3.queue deprecated in favor of Promises API).
- [ ] Using `cypress.io` for e2e testing
- [ ] CI with Travis for JS application
- [ ] Further Redux concepts from Dan Abramov's video course
- [ ] Swap in components from Material-UI / Semiotic


## Development

```bash
npm install
npm run start
```

To deploy

```bash
npm run deploy
```

To run integration tests

```bash
npm run cypress
```

## Progress

See [Changelog](./CHANGELOG.md) for notes on what was accomplished by each tag.

Original CRA readme is [available here](./CRA-README.md). This application has not been ejected yet.

# platcon-server

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-FFFFDD?logo=node.js&" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-D5F3FE?logo=typescript&" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NestJS-FFCCCB?logo=nestjs&logoColor=red" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeORM-FFFFDB?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAYAAAA/mJfHAAAACXBIWXMAAAETAAABEwGpfUaAAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAkNJREFUOI2Nkjtok2EUhp/z/WnTVKExg1iEDlWKi0ulgqLiKF28IaW4xEkMVFJwr128QIUsUnCoi4iLFkFwcCkiCg51ES9Lijg12jRaG/vb/N/rkPxprIH2wFm+95znOzckoUsc1U0W9QCvLMOS2NKzDOsh8jco6TInJOEAVLNpwHjJCEvMsR1bYo7nnDJD6uY+gElCmeCTHeIRL6LrAJOTk4menp5jkXMrcW7gvfL5/Px/0IvBHb3mtC1E+x0Aa3Twyr7EeiaT6ZYkk/pjl+TaVvjE3rOIASQaT0lAm8JWzfuSmXXQRmwxD3S1wrqAqDXCzDokpb1ZZ2MelUKh0C/pcDKZfJbL5X5thjnMDOjGWG+FSVoHKk5adtIyQD6fLzrnPkRRtNFyPS+FmTm6gmydHDVnVi6X/wC9CoJEM8dsZ/suoyKQoivIOplmBNNU9SaWJyYm1oB55/0CUASKYRi+a8uq6q1gWqYZZ9g5gxwpOx7rU1NTOyQNRM7tij2RSh1sC0vZSYMrZnbGUa3NAlUs2BvryWQycM79CLxvXeLvtjALeoEqq7WnrhkoOlpjvPcR9U01rVAo9HvvD4RhuLF5kYg/ige8BvxzlM65bkmdgff1O5Mq+fHxIvUZtlrQyG8Cws2wxmlsx6yRXwdYH2JUg7E6Nja2AoRm9rVRSbGWSCy3RY1qkP4GVRK6ah/pY4995hrfecysKlvWc9bS7GaEAW5Rosxt7atXVuGCValwhHukGdpWc2mGGOIuP/lGifMAfwEjcxQRk2A5YgAAAABJRU5ErkJggg==" alt="TypeORM" />
</p>

## docs

- [API.md](API.md)
- [Swagger](https://swagger.io/) - route `/docs`

## to-do

- [TODO.md](TODO.md)

## code quality

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Hooks: [Husky](https://typicode.github.io/husky/#/)
- Lint: [ESLint](https://eslint.org/)
- Formatter: [Prettier](https://prettier.io/)
- Unit Test: [Jest](https://jestjs.io/)
- E2E Test: [Jest](https://jestjs.io/) + [Supertest](https://npmjs.com/supertest)
- Coverage: [Istanbul](https://istanbul.js.org/)
- [SonarCloud](https://sonarcloud.io/dashboard?id=jrmsrs_platcon-server) + CI/CD: GitHub Actions

<p align="center">
<a href="https://conventionalcommits.org">
  <img src="https://img.shields.io/badge/conventional%20commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white" alt="Conventional Commits" />
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jrmsrs_platcon-server" target="_blank">
  <img alt="Quality Gate Status" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=alert_status" />
  <img alt="Bugs" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=bugs" />
  <img alt="Code Smells" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=code_smells" />
  <img alt="Coverage" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=coverage" />
  <img alt="Duplicated Lines (%)" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=duplicated_lines_density" />
  <img alt="Lines of Code" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=ncloc" />
  <img alt="Reliability Rating" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=reliability_rating" />
  <img alt="Security Rating" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=security_rating" />
  <img alt="Technical Debt" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=sqale_index" />
  <img alt="Maintainability Rating" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=sqale_rating" />
  <img alt="Vulnerabilities" src="https://sonarcloud.io/api/project_badges/measure?project=jrmsrs_platcon-server&metric=vulnerabilities" />
</a>
</p>

## development

### prereqs

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

### install

```bash
$ yarn install
```

### run

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### test

```bash
# unit tests
$ yarn run test
$ yarn run test:watch

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

### add resorce

```bash
yarn resgen {resource-name}
```

### sync orm

- migration to your local postgres
  - at [./src/db.config.ts](./src/db.config.ts) change to `synchronize: true`

```bash
yarn start:dev
```

### sync API.md with App Swagger

```bash
yarn swaggergen # autohooked to husky pre-commit
```

## license

[MIT](LICENSE)

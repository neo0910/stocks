## Installation

For the first time install dependencies in each service locally:

```bash
$ yarn
```

Then start docker-compose:

```bash
$ docker-compose up -d
```

Finally start services:

```bash
$ yarn start:dev
```

```bash
$ yarn start:dev stocks-data-collector
```

## Links

- pgAdmin - [http://localhost:5050](http://localhost:5050/)
- Kafka dev environment - [http://localhost:3040/](http://localhost:3040/)
- API - [http://localhost:3000](http://localhost:3000/)

# Example battle bot service for Showdown-ChatBot

This repository contains an example battle bot service for [Showdown-ChatBot](https://github.com/AgustinSRG/Showdown-ChatBot), made for testing purposes.

This can also serve as a reference to implement other battle bot services.

## Configuration

You can configure the project using environment variables.

Place the variables in a `.env` file. You can copy the `.env.example` file as a template:

```sh
cp .env.example .env
```

### HTTP configuration

| Variable          | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| HTTP_ENABLED      | Can be `YES` or `NO`. Set it to `YES` to enable HTTP.                |
| HTTP_PORT         | Listening port. Default: `8081`.                                     |
| HTTP_BIND_ADDRESS | Bind address. Set it to an empty string to listen to all interfaces. |

### HTTPS configuration

| Variable               | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| HTTPS_ENABLED          | Can be `YES` or `NO`. Set it to `YES` to enable HTTPS.               |
| HTTPS_PORT             | Listening port. Default: `8443`.                                     |
| HTTPS_BIND_ADDRESS     | Bind address. Set it to an empty string to listen to all interfaces. |
| HTTPS_CERTIFICATE_PATH | Path to the certificate file, in PEM format.                         |
| HTTPS_KEY_PATH         | Path to the private key file, in PEM format.                         |

### Auth configuration

| Variable       | Description                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| API_AUTH_TOKEN | The required value for the `Authorization` header. Make sure to also configure it in Showdown-ChatBot. |

### Logs configuration

| Variable Name | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| LOG_ERROR     | Log error messages? Set to `YES` or `NO`. By default is `YES`   |
| LOG_WARNING   | Log warning messages? Set to `YES` or `NO`. By default is `YES` |
| LOG_INFO      | Log info messages? Set to `YES` or `NO`. By default is `YES`    |
| LOG_DEBUG     | Log debug messages? Set to `YES` or `NO`. By default is `NO`    |
| LOG_TRACE     | Log trace messages? Set to `YES` or `NO`. By default is `NO`    |

## Running (Docker)

You can run the project using [Docker](https://www.docker.com/) and [Docker compose](https://docs.docker.com/compose/).

In order to run the project, type the following command:

```sh
docker compose up -d
```

If you want tgo stop the project, run;

```sh
docker compose down
```

## Running (NodeJS)

You can also run the project with [NodeJS](https://nodejs.org/).

In order to install the dependencies, run:

```sh
npm install
```

In order to build the project, run:

```sh
npm run build
```

In order to start the project, run:

```sh
npm start
```

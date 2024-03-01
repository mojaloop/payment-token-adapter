# Payment Token Adapter

[![Git Releases](https://img.shields.io/github/release/mojaloop/payment-token-adapter.svg?style=flat)](https://github.com/mojaloop/payment-token-adapter/releases)
[![Npm Version](https://img.shields.io/npm/v/@mojaloop/payment-token-adapter.svg?style=flat)](https://www.npmjs.com/package/@mojaloop/payment-token-adapter)
[![NPM Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@mojaloop/payment-token-adapter.svg?style=flat)](https://www.npmjs.com/package/@mojaloop/payment-token-adapter)
[![CircleCI](https://circleci.com/gh/mojaloop/payment-token-adapter.svg?style=svg)](https://circleci.com/gh/mojaloop/payment-token-adapter)

# Overview
An adpater that facilitates payment token mapping between a Mojaloop Connector (SDK Scheme Adapter) and a  Core Banking system Connector to support G2P payments

> This project is still in development

# Running the project

To run the project clone the repository into your local machine 

```bash
git clone https://github.com/mojaloop/payment-token-adapter.git
```


Change directory into the project folder

```bash
cd payment-token-adapter
```

# Set node version

```bash
nvm use
```

# Install dependencies

```bash
npm install
```

# Build 
```bash
npm run build
```

# Run 
```bash
npm run start
```

# Test
Before you run functional tests, make sure to run the ttk backend using this command.

```bash
docker compose -f ./test/func/ttk-docker-compose.yml up -d
```

Then you can execute the functional tests

```bash
npm run test:functional
```

Then you can tear the ttk backend down using this command.

```bash
docker compose -f ./test/func/ttk-docker-compose.yml down 
```
# Build and Run
```bash
npm run start:build
```
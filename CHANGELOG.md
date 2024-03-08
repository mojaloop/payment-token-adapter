# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.1](https://github.com/mojaloop/payment-token-adapter/compare/v1.1.0...v1.1.1) (2024-03-08)

## [1.1.0](https://github.com/mojaloop/payment-token-adapter/compare/v0.0.2...v1.1.0) (2024-03-08)


### Features

* implemented /quoterequests function ([112cee4](https://github.com/mojaloop/payment-token-adapter/commit/112cee4eeb18fcdea691bef3f6b0ae76548056fc))
* implemented /quoterequests function and /transfers ([7d432aa](https://github.com/mojaloop/payment-token-adapter/commit/7d432aa92909285502024170287603367f9997af))
* implemented request schema validation ([e621bcb](https://github.com/mojaloop/payment-token-adapter/commit/e621bcb9c9e6f831742956a482c3869e5ec47a37))


### Bug Fixes

* changed script name in pre-commit file ([12d3156](https://github.com/mojaloop/payment-token-adapter/commit/12d3156fe127397b99ef91f5d6cddcbd1686877d))
* make error messages more descriptive and clear ([97b8e34](https://github.com/mojaloop/payment-token-adapter/commit/97b8e3433e52889c62ecd6749d5fe85c5c2104ed))
* split api specs and imported types from api-snippets ([e6b85ef](https://github.com/mojaloop/payment-token-adapter/commit/e6b85efb4b598c8402ede544f2aa70ad5650842c))

### [0.0.2](https://github.com/mojaloop/payment-token-adapter/compare/v0.0.1...v0.0.2) (2024-02-15)


### Features

* added get Parties functionality and seperated core connetor server from sdk server ([9c3df17](https://github.com/mojaloop/payment-token-adapter/commit/9c3df17c3e88a4fee014dd6329aefe9524289cd8))
* added get Parties functionality and seperated core connetor server from sdk server ([56ef3bb](https://github.com/mojaloop/payment-token-adapter/commit/56ef3bb17ae9e9a67de5aad3d1c8f4572c31ad3a))
* added new tests cases and files to support both unit and functional tests ([164f1cd](https://github.com/mojaloop/payment-token-adapter/commit/164f1cde696d152f1fb8c72bfe51c0ad230f93ee))
* completed implementation GET /parties/{Type}/{ID} in discovery phase ([3f41bae](https://github.com/mojaloop/payment-token-adapter/commit/3f41bae7c34b1c6f7d9ba6ef8a92ca9df9362832))


### Bug Fixes

* changed core connector naming to external portal ([91f3f8e](https://github.com/mojaloop/payment-token-adapter/commit/91f3f8ee2a598db10367a3bca8240dcadd01afa2))
* changed npm run start script to use correct file path ([c53fc20](https://github.com/mojaloop/payment-token-adapter/commit/c53fc204b5f497652f3b0b6b4987b11b2784309c))
* fix start command in package.json ([167e5be](https://github.com/mojaloop/payment-token-adapter/commit/167e5bed7bffc2a70d2c52529fae3ffce2cddeed))
* naming in dockerfile ([c87b1a2](https://github.com/mojaloop/payment-token-adapter/commit/c87b1a2d5ccec2b742806e47dd8595c23cd9941a))
* naming in service.ts ([e4ad38e](https://github.com/mojaloop/payment-token-adapter/commit/e4ad38ed7690398ce83f8e8df63e827712810e86))
* removed test folder from ts compiler scope ([3e8e00f](https://github.com/mojaloop/payment-token-adapter/commit/3e8e00f9173fdcd1a2f2cb1f2cea60d48104bb44))
* removed test folder from ts compiler scope ([f7a504c](https://github.com/mojaloop/payment-token-adapter/commit/f7a504c58d9b39e24d5df77889a9cba9fa67526c))
* replaced fetch calls with axios to make the pipeline run successfull and added unit tests ([2919cb0](https://github.com/mojaloop/payment-token-adapter/commit/2919cb0afec8f6fdd7707d3df49bed073adc05b2))
* upgrade packages to fix failing ci jobs ([3419c3c](https://github.com/mojaloop/payment-token-adapter/commit/3419c3c988f42bae2cc40771808cb0ce55afa69e))

### 0.0.1 (2024-02-08)


### Features

* added a function and a route to handle get parties. added unit tests to test the functionality ([97f4c19](https://github.com/mojaloop/payment-token-adapter/commit/97f4c19113ef184c1c4231c3ad6815433b9b6e2a))
* added a function and a route to handle get parties. added unit tests to test the functionality ([1fa79d8](https://github.com/mojaloop/payment-token-adapter/commit/1fa79d8f93b63a7df8508a93d7354ca0279d8dda))
* added docker-compose.yml file to facilitate functional tests with ttk ([39e3701](https://github.com/mojaloop/payment-token-adapter/commit/39e37014fc83af094233d9695188d1c4417b0573))


### Bug Fixes

* added a ttk ui service in the docker-compose.yml ([7006836](https://github.com/mojaloop/payment-token-adapter/commit/700683648c654a62e84c52733507209f29d37799))
* added test dir to included folders in tsconfig ([c95dcf1](https://github.com/mojaloop/payment-token-adapter/commit/c95dcf18e5ed8fe8fd139558f29392b448ee5699))
* added test dir to included folders in tsconfig ([21c7206](https://github.com/mojaloop/payment-token-adapter/commit/21c72061262ed372b6435fc165f99cd462c92f3e))
* set version in package.json to 0.0.0 ([263881d](https://github.com/mojaloop/payment-token-adapter/commit/263881d26fcfef3dcd571495da45dc5c16bde308))
* set version in package.json to 0.0.0 ([b6a3144](https://github.com/mojaloop/payment-token-adapter/commit/b6a3144354f9f9cff94d37240e2989f12bea5141))
* set version in package.json to 0.0.1 ([e05b906](https://github.com/mojaloop/payment-token-adapter/commit/e05b906a739efd3b468f6db3f18eb0c6d0f8e2a5))

### 0.0.2 (2024-02-08)


### Features

* added a function and a route to handle get parties. added unit tests to test the functionality ([97f4c19](https://github.com/mojaloop/payment-token-adapter/commit/97f4c19113ef184c1c4231c3ad6815433b9b6e2a))
* added a function and a route to handle get parties. added unit tests to test the functionality ([1fa79d8](https://github.com/mojaloop/payment-token-adapter/commit/1fa79d8f93b63a7df8508a93d7354ca0279d8dda))
* added docker-compose.yml file to facilitate functional tests with ttk ([39e3701](https://github.com/mojaloop/payment-token-adapter/commit/39e37014fc83af094233d9695188d1c4417b0573))


### Bug Fixes

* added a ttk ui service in the docker-compose.yml ([7006836](https://github.com/mojaloop/payment-token-adapter/commit/700683648c654a62e84c52733507209f29d37799))
* added test dir to included folders in tsconfig ([c95dcf1](https://github.com/mojaloop/payment-token-adapter/commit/c95dcf18e5ed8fe8fd139558f29392b448ee5699))
* added test dir to included folders in tsconfig ([21c7206](https://github.com/mojaloop/payment-token-adapter/commit/21c72061262ed372b6435fc165f99cd462c92f3e))
* set version in package.json to 0.0.1 ([e05b906](https://github.com/mojaloop/payment-token-adapter/commit/e05b906a739efd3b468f6db3f18eb0c6d0f8e2a5))

## 1.1.0 (2024-02-08)


### Features

* added a function and a route to handle get parties. added unit tests to test the functionality ([97f4c19](https://github.com/mojaloop/payment-token-adapter/commit/97f4c19113ef184c1c4231c3ad6815433b9b6e2a))
* added a function and a route to handle get parties. added unit tests to test the functionality ([1fa79d8](https://github.com/mojaloop/payment-token-adapter/commit/1fa79d8f93b63a7df8508a93d7354ca0279d8dda))
* added docker-compose.yml file to facilitate functional tests with ttk ([39e3701](https://github.com/mojaloop/payment-token-adapter/commit/39e37014fc83af094233d9695188d1c4417b0573))


### Bug Fixes

* added a ttk ui service in the docker-compose.yml ([7006836](https://github.com/mojaloop/payment-token-adapter/commit/700683648c654a62e84c52733507209f29d37799))
* added test dir to included folders in tsconfig ([c95dcf1](https://github.com/mojaloop/payment-token-adapter/commit/c95dcf18e5ed8fe8fd139558f29392b448ee5699))
* added test dir to included folders in tsconfig ([21c7206](https://github.com/mojaloop/payment-token-adapter/commit/21c72061262ed372b6435fc165f99cd462c92f3e))

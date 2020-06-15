# IDA serverless API

Guideline and examples for IDA serverless API , encouraging consistency, maintainability, and best practices across applications.   

## Prerequisites

* [Download and install NodeJS](https://nodejs.org)
* [Download and install Yarn](https://yarnpkg.com)
* [Download and install MongoDB](https://docs.mongodb.com/manual/installation/)
* Download and install Code editor that you prefer

## Running Locally

All Serverless setup you find [here](https://serverless.com/framework/docs/getting-started/)

Before start, install the serverless using the yarn:

```
yarn global add serverless
```
Or via npm
```
nom i -g serverless
```

First clone the project: 

```
git clone git@github.com:midianinja/ida-auth-serverless.git
```

Or via https: 

```
git clone https://github.com/midianinja/ida-auth-serverless.git
```

Go to the project root folder:

```
cd som-api
```

In root directory install the dependecies:

```
yarn
```

or via npm
```
npm i
```

Run the mongoDB:

```
sudo service mongod start
```

Start the server locally:

```
yarn dev
```

or you can run using IP and port
```
yarn dev --host 192.168.0.1 --port 3000
```

The default port is 3000


## Running the tests

[...]

## Deployment

[...]

## Built With

* [Serverless](https://serverless.com/) - Component library
* [Yarn](https://yarnpkg.com) - Dependency Management
* [ESLint](https://eslint.org/) - Source analyze Tool. [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) 
* [JSDOC](http://usejsdoc.org) - JavaScript Documentation

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/midianinja/som-api/tags). 

# FIS WP API

A simple offers API written as a coding exercise.

## Setup

* Software required: Node JS, Docker
* Clone this repository.
* Start the redis (database) container: `docker run --name nodejs-hapijs-redis -p 6379:6379 -d redis`
* Run `npm install` from the main directory.
* Run `npm start` to start the API server.

## Available routes

* `offers/`: A "hello world" test route.
* `offers/{id}`: Request a single offer.


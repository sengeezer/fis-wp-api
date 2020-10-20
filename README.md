# FIS WP API

A simple offers API written as a coding exercise.

## Setup

**Software required: Node JS, Docker**

* Clone this repository.
* Start the redis (database) container: `docker run --name nodejs-hapijs-redis -p 6379:6379 -d redis`
* Run `npm install` from the main directory.
* Run `npm start` to start the API server.

## Available routes

* Go to [http://localhost:3000] after starting the server to see the API documentation.

## Next steps

* Use UUID to generate unique offer IDs and update routes to resolve these.
* Provide a means of seeding the database with sample data.
* Move documentation to OpenAPI format (e.g. Swagger) to make it more useful.
* Use MongoDB instead of Redis for better structured database operations.

## Credits

* Some of the techincal architecture featured in this application was based on an [Auth0 article](https://auth0.com/blog/developing-modern-apis-with-nodejs-hapijs-and-redis).


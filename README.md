# ChatApp Api Service
A simple backend web service with dependencies of **HapiJS** as web framework, **MongoDB** as NoSQL Database, **SocketIO (Server)** as two-way communication and **Swagger** as REST web documentation

# Architecture Overview
This project's architecture highlights separation of concerns.

## Services
- Encapsulates the interaction between 3rd party service or API.
- Acts as wrapper or adapter to another service.
- This layer should strictly implements *dependency inversion* and *unit-testable*.

## Workers
- Contains the business or presentation logic and make them reusable.
- Should declare the blueprints or protocols for dependency inversion of `Service`.
- This layer should *dependency inject* the `Service` and *unit-testable*.

## Interface
- The UI and/or API that can be easily added or swapped in and out without changing any business logic.

# Includes
- REST Endpoints
    - `POST` /users/login => User
    - `POST` /users/signup => User
    - `GET`, `POST` /messages => Message
- SocketIO Events
    - /
        - connection
        - disconnect
        - messages => Message

# Room for improvements
- Unit testing
- Hash/Salting of Passwords
- JWT Client Header Authentication

# Requirements
- NPM
- Node.js
- MongoDB Server
- Docker / Docker Compose


# Setup locally
Install npm packages.
```
$ npm install
```
Add environment-specific variables in `.env` file. (Warning: Do not commit)
```
PORT=
HOST=
MONGODB_URI=
MONGODB_DB_NAME=
```

## Run the app
```
$ npm start
```

## Visit the Swagger documentation
```
http://{HOST}:{PORT}/documentation
```

# Setup docker
```
$ docker-compose up -d --build
```

# Run the tests
Runs all test.
```
$ npm test
```
`Routes`
```
$ npm run test:api
```
`Workers`
``` 
$ npm run test:workers
```
`Services`
```
$ npm run test:services
```

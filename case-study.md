# Case Study for _200 OK_


## Abstract

- "what is 200 OK?" in a few words
- core challenges
  - fully dynamic data storage with relationships -> materialized path
  - full CORS support
  - separation of concerns (frontend/backend?), single instance, multi-tenancy architecture ?
  - real-time communication of request/response cycles (Redis pubsub + SSE)

_200 OK_ is a no-configuration, ephemeral backend service that provisions RESTful APIs. Following a model based on resources, each API is capable of powering a CRUD frontend and can be augmented to mock particular responses while also providing real-time inspection of the request/response cycle. With its no-setup approach _200 OK_ was developed as a hassle-free drop-in backend for learning projects, hackathons or to serve as a temporary mock API.

Obtaining a personal API is as simple as clicking a button and no registration or signup is required in order to use the RESTful operation mode of the API. Multiple levels of nested resources are supported along with the four traditional REST operations of data retrieval, creation, updating and deletion. Each API handles all valid JSON payloads, supports CORS and is therefore easy to integrate in all kinds of projects, from React frontends over exploratory code sandbox scripts to command-line applications.

The _200 OK_ deployment consists of two Node.js processes behind an NGINX reverse proxy. The two processes share a NoSQL data store (MongoDB) that stores all API data and metadata, as well as an in-memory store (Redis) for interprocess communication.

### Core Challenges

_200 OK_ was designed with a single-instance, multi-tenancy approach which required a unique approach to handle dynamic routing as well as flexibly storing dynamically schemed, relational data. In spite of the single-instance approach, the should remain stateless to be able to scale to either Node.js' cluster mode or a containerized multi-instance design with relative ease.

With the need to properly handle nested relationships for user-provided data, a performant and flexible solution for the data persistence was needed. A _materialized path_ approach backed by a MongoDB document database constitutes a solution that brings many advantages to the table while also supporting a potential sharded database approach if the need arises.

In order to separate concerns and allow for independent scaling, the main backend handling all user-generated API requests was separated from the user-facing frontend configuration platform. Since both processes need a way to quickly exchange information about user-initiated requests, a Redis store used with its publish-subscribe mode together with the use of server-sent events provides easy interprocess communication without much additional overhead.


## Motivation behind 200 OK

- goal of providing a no-config, no-setup ephemeral REST API
- (easydb.io, mock APIs, request/response inspectors)


## REST APIs

- RESTfulness vs. what REST is in today's API ecosystem
- REST API vs. BaaS vs. PaaS and ease of use for 200 OK
- representing RESTful APIS in a data store (SQL vs. NoSQL, materialized path, incrementing id's)


## Architectural Choices

- Redis Pubsub + SSE for real-time inspection of requests/responses
  vs. WebSockets vs. document store
- implementing CORS support from scratch
- System Architecture (NGINX reverse proxy and SSL termination point, wildcard SSL cert)
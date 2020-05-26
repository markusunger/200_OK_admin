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

_200 OK_ was designed with a single-instance, multi-tenancy approach which required unique measures to handle dynamic routing as well as flexibly storing dynamically schemed, relational data. In spite of the single-instance approach, the instance itself should remain stateless to be able to scale to either Node.js' cluster mode or a containerized multi-instance design with relative ease.

With the need to properly handle nested relationships for user-provided data, a performant and flexible solution for the data persistence was needed. A _materialized path_ approach backed by a MongoDB document database constitutes a solution that brings many advantages to the table while also supporting a potential sharded database approach if the need arises.

In order to separate concerns and allow for independent scaling, the main backend handling all user-generated API requests was separated from the user-facing frontend configuration platform. Since both processes need a way to quickly exchange information about user-initiated requests, a Redis store used with its publish/subscribe mode together with the use of server-sent events provides easy interprocess communication without much additional overhead.


## Motivation behind 200 OK

- goal of providing a no-config, no-setup ephemeral REST API
- (easydb.io, mock APIs, request/response inspectors)


## _200 OK_ as a BaaS

- RESTfulness vs. what REST is in today's API ecosystem
- REST API vs. BaaS vs. PaaS and ease of use for 200 OK
- representing RESTful APIS in a data store (SQL vs. NoSQL, materialized path, incrementing id's)
 
Web applications typically consist of two parts: a frontend and a backend. The frontend portion is usually concerned with the presentation layer, how a user interacts with the the application and how it is displayed across a range of devices. The backend, in contrast, is responsible for managing all underlying data and how the business logic transforms that data. 

There is a huge variety of providers across different levels of abstraction when it comes to web application backends and those offerings demand different levels of effort to manage while providing varying degrees of abstraction and control over the backend itself.

Relying on bare-metal deployment is at the root of the abstraction level, as are offerings in the Infrastructure-as-a-Service (IaaS) space. Both put the responsibility of dealing with an applications operating system and code into the hands of a developer. A Platform-as-a-Service (PaaS) instead abstracts away another layer: it manages all tasks related to an applications' deployment, letting the developer control only the application code itself.

At the highest layer of abstraction stands the Backend-as-a-Service (BaaS) which also manages any backend functionality, exposing only a defined set of interactions with it. An application developer's responsibility is now limited to the frontend part only. An example of a popular BaaS offering is Google Firebase which provides a Software Development Kit (SDK) to facilitate access to its different backend features like a data store, authentication services or analytics.

_200 OK_ falls into the BaaS category but provides a few unique advantages over a more complex BaaS like Google's Firebase or Amazon Amplify. Those services are closed-source platforms whose features are determined completely by the provider itself. Implementation details are mostly hidden behind the rspective SDK's interface. BaaS services also come with a certain learning curve: features require knowledge of the SDK and integration into the provider's ecosystem means that skills are rarely trasnferable between providers.

In contrast, _200 OK_ provides a feature set focused on the pure data storage and management functionality. It also closely follows the popular REST (Representational State Transfer) model for providing a simple but powerful interface. It retains the general benefits of abstraction that a BaaS offers but has greatly reduced setup times and requires almost no prerequisite user knowledge besides the ubiquitous REST standard.

## Providing a REST interface

The original REST architecture specification (Roy Fielding, 2000, https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) layed out guiding principles for an interface to provide interoperability between networked computers:

- a uniform interface for
- a client-server architecture that is
- stateless and
- cacheable inside of
- a layered system

Modern APIs often do not follow all of those principles closely and should thus be called _RESTful_, meaning that they follow most but not all of the REST style guidelines. Seldomly does an API provide the exploratory functionality that Fielding described as an interface constraint: HATEOAS (_Hypermedia As The Engine Of Application State_) would mean that responses should include contextual hyperlinks to related resources, allowing API usage without any prior knowledge of its design [1].Many APIs labelled as _RESTful_ do also not adhere strictly to mapping all possible actions to a resource.

_200 OK_ follows most REST principles in that it:

- provides a uniform interface (following the resource model and HTTP methods to field operations to those resources)
- is stateless (with no request being dependent on any knowledge from a former request)
- is cacheable (with metadata indicating changes of the requested representation and whether it actually needs to be transferred again)
- lives in a flexible layered system, with the response-serving process being decoupled from the data store itself

The basic item of a _200 OK_ API is the resource. It represents a collection of data items, each of which can be accessed individually as well. The representation of the collection always matches its original data format which is JSON (JavaScript Object Notation), one of the most popular data exchange formats of the web ecosystem. The state of a collection or a collection item can be manipulated through a defined set of interactions represented by the HTTP verbs `GET`, `POST`, `PUT` and `DELETE`.

| HTTP Method | Target | Operation |
|---|---|---|
| GET | a resource collection or individual item | target data retrieval |
| POST | a resource collection | creating a new collection item |
| PUT | an individual resource item | changing an existing collection item |
| DELETE | a resource collection or individual item | deleting the target collection or item |

The decision to not implement a HATEOAS system stems primarily from the consideration that for the intended use cases (in general projects with small scopes), HATEOAS would not be beneficial. In most cases, the API would not need to be explored as the only API user is the one who also determines how it is used.

## Implementation Challenges

### Multi-Tenancy REST Interfaces

With its ephemeral nature, a _200 OK_ API does not call for an isolated environment on a per-API basis. The overhead of provisioning a separate instance for each API, consisting of an application server and a data store would far outweigh its benefits.

Thus, the decision was made to create a multi-tenant application server whose design would allow for horizontal or vertical scalability that does not match the user count in a direct mapping. The choice for such an application server fell on Node.js with the Express framework that is well suited for such a multi-tenant system thanks to its flexibility and lightweight core.

This approach still poses two problems:

- Since each API receives a unique subdomain but all requests are served by the same application, so tenants need to be identified
- The standard route-based request handling model of Express does not work well for the dynamic nature of a _200 OK_ API

Both problems can be solved within the constraints of the Express framework. Identifying the API for which the request is made is done in a front-loaded middleware. Since the subdomain can be easily extracted from the request headers, 

### Storing Relational Data Without A Schema

As per the REST specification, data received for a _200 OK_ API is relational in nature, but only with regards to whole datasets, not granular data inside a dataset. In addition to that, each resource item (considered a _dataset_) does not have any predefined schema. In fact, since user-sent payloads are not known ahead of time, any predefined schema would have to be so loose as to be practically worthless.

Deducting a schema by analyzing incoming data (and subsequently enforcing adherence to it) would allow for better data integrity at the cost of user freedom. Without a set schema, there are almost no constraints placed on the structure and design of the user-sent payloads.  

Yet the bigger problem is that of maintaining the relationship between resources without knowing beforehand which resources an API is going to represent. Conceptually, this is similar to a tree data structure. Since neither the depth nor the breadth of the tree will be known quantities, a SQL database will not be a good choice. A dynamic relationship tree would mean that tables might need to be created at runtime, adding an expensive and potentially risky operation to each new API endpoint: if the table creation fails, the user request will fail as well. Since the user-sent payload would be stored in a JSONB column (or equivalent) anyway, SQL would only provide a way to manage relationships but at significant cost.

This has led to the decision to rely on a document database with MongoDB being the first choice thanks to its storage format being very close to JSON anyway. To manage relationships, _200 OK_ relies on a different method: _Materialized Paths_.

To explain the decision for _materialized paths_, we have to look at the requirements for storing _200 OK_ API data. Considering the uses cases described above, the difference between read and write updates for each API should be way more balanced than for a traditional data store (where read operations will likely outnumber write operations by several magnitudes). 

There are other ways of representing a tree structure in data stores (like nested sets of proprietary data structures tied to specific databases), but _materialized paths_ provide 

Thus, the _materialized path_ approach provides the following advantages:

- Inserting a node comes with low overhead since no other nodes need to be updated
- Deletion of a sub-tree is easy

The only truly costly operation, moving sub-trees inside the structure (which would require updating all nodes in that subtree), is not part of the _200 OK_ requirements.

The most common operations, in order, of a _200 OK_ API will be reads (query resources and their items), writes (insert new resources and their items) or deletes (deleting resources or items and subsequently all nested resources and their items). For all those operations and within the constraints put on each API (no nesting beyond four levels), materialized paths provide a performant solution to managing relationships.

## Architectural Choices

- Redis Pubsub + SSE for real-time inspection of requests/responses
  vs. WebSockets vs. document store
- implementing CORS support from scratch
- System Architecture (NGINX reverse proxy and SSL termination point, wildcard SSL cert)


[^1]: See: The GitHub API.
# Case Study for _200 OK_

## Abstract

_200 OK_ is a no-configuration, ephemeral backend service that provisions RESTful APIs. Following the REST architecture, each API adheres to a resource-based model of storing and delivering data. In addition to that, an API can be augmented to mock particular responses while also providing real-time inspection of the request/response cycle. With its no-setup approach _200 OK_ was developed as a zero-setup drop-in backend for learning projects, hackathons or to serve as a temporary mock API.

Obtaining a personal API is as simple as clicking a button and no registration or signup is required in order to use the RESTful operation mode of the API. Multiple levels of nested resources are supported along with the four traditional REST operations of data retrieval, creation, updating and deletion. Each API handles all valid JSON payloads, supports CORS and is therefore easy to integrate in all kinds of projects, from React frontends over exploratory code sandbox scripts to command-line applications.

The _200 OK_ deployment consists of two Node.js processes behind an NGINX reverse proxy. The two processes share a NoSQL data store (MongoDB) that stores all API data and metadata, as well as an in-memory store (Redis) for real-time request/response inspection.

### Top-Level Requirements

_200 OK_ was designed with a single-instance, multi-tenancy approach which required unique measures to handle dynamic routing as well as flexibly storing dynamically schemed, relational data. In spite of the single-instance approach, the instance itself should remain stateless to be able to scale to either Node.js' cluster mode or a containerized multi-instance design with relative ease.

With the need to properly handle nested relationships for user-provided data, a performant and flexible solution for the data persistence was needed. A _materialized path_ approach backed by a MongoDB document database constitutes a solution that is both performant for the intended use cases and robust enough to remain a valid approach even when extending both functionality and scale of the data layer.

In order to separate concerns and allow for independent scaling, the main backend handling all user-generated API requests was separated from the user-facing frontend configuration platform. Since both processes need a way to quickly exchange information about user-initiated requests, a Redis store used with its publish/subscribe mode together with the use of server-sent events provides easy interprocess communication without much additional overhead.

## _200 OK_ as a BaaS

Web applications typically consist of two parts: a frontend and a backend. The frontend portion is usually concerned with the presentation layer, how a user interacts with the the application and how it is displayed across a range of devices. The backend, in contrast, is responsible for managing all underlying data and how the business logic transforms that data. 

There is a huge variety of providers across different levels of abstraction when it comes to web application backends and those offerings demand different levels of effort to manage while providing varying degrees of abstraction and control over the backend itself.

Relying on bare-metal deployment is at the root of the abstraction level, as are offerings in the Infrastructure-as-a-Service (IaaS) space. Both put the responsibility of dealing with an applications operating system and code into the hands of a developer. A Platform-as-a-Service (PaaS) instead abstracts away another layer: it manages all tasks related to an applications' deployment, letting the developer control only the application code itself.

At the highest layer of abstraction stands the Backend-as-a-Service (BaaS) which also manages any backend functionality, exposing only a defined set of interactions with it. An application developer's responsibility is now limited to the frontend part only. An example of a popular BaaS offering is Google Firebase which provides a Software Development Kit (SDK) to facilitate access to its different backend features like a data store, authentication services or analytics.

_200 OK_ falls right between the PaaS and BaaS definitions by providing the framework to use a backend with a predefined architecture (_REST_, see the next section). In doing so, _200 OK_ provides a few unique advantages over a more complex BaaS like Google's Firebase or Amazon Amplify. Those services are closed-source platforms whose features are determined completely by the provider itself. Implementation details are mostly hidden behind the rspective SDK's interface. BaaS services also come with a certain learning curve: features require knowledge of the SDK and integration into the provider's ecosystem means that skills are rarely transferable between providers. Plus, the additional learning curve of how to use the BaaS is determined by the quality of its documentation and the complexity of its API.

In contrast, _200 OK_ provides a feature set focused on the pure data storage and management functionality. It also closely follows the popular REST (_Representational State Transfer_) model for providing a simple but powerful interface that is in wide use across the web development world. It retains the general benefits of abstraction that a BaaS offers but has greatly reduced setup times and requires almost no prerequisite user knowledge besides the ubiquitous REST standard.

## Providing a REST interface

The original REST architecture specification (Roy Fielding, 2000, https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) layed out guiding principles for an interface to provide interoperability between networked computers:

- a uniform interface for
- a client-server architecture that is
- stateless and
- cacheable inside of
- a layered system

Modern APIs often do not follow all of those principles closely and are thus often called _RESTful_, meaning that they follow most but not all of the REST style guidelines. Seldomly does an API provide the hypermedia functionality that Fielding described as an interface constraint: HATEOAS (_Hypermedia As The Engine Of Application State_) means that responses include contextual hyperlinks to related resources, allowing API usage without any prior knowledge of its design [1].Many APIs labelled as _RESTful_ do also not adhere strictly to mapping all possible actions to a resource, another key piece of Fieldings's original paper.

_200 OK_ follows most REST principles in that it:

- provides a uniform interface (following the resource model and HTTP methods to execute operations on those resources)
- is stateless (with no request being dependent on any knowledge from a former request)
- is cacheable (with metadata indicating changes of the requested representation and whether it actually needs to be transferred again)
- lives in a flexible layered system, with the response-serving process being decoupled from the data store itself

The basic item of a _200 OK_ API is the resource. It represents a collection of data items, each of which can be accessed individually as well. The representation of the collection always matches its original data format which is JSON (_JavaScript Object Notation_), one of the most popular data exchange formats of the web ecosystem. The state of a collection or a collection item can be manipulated through a defined set of interactions represented by the HTTP verbs `GET`, `POST`, `PUT` and `DELETE`.

| HTTP Method | Target | Operation |
|---|---|---|
| GET | a resource collection or individual item | target data retrieval |
| POST | a resource collection | creating a new collection item |
| PUT | an individual resource item | changing an existing collection item |
| DELETE | a resource collection or individual item | deleting the target collection or item |

The decision to not implement a HATEOAS system stems primarily from the consideration that for the intended use cases (in general projects with small scopes), HATEOAS would not be very beneficial. In most cases, the API would not need to be explored as the only API user is the one who also determines how it is used, resulting in the additional information being more of a hindrance because it requires extracting the actual data payload from the additional hypermedia information.

## Core Backend Challenges

### Multi-Tenancy REST Interfaces

With its ephemeral nature, a _200 OK_ API does not call for an isolated environment on a per-API basis. The overhead of provisioning a separate instance for each API, consisting of an application server and a data store, would far outweigh its benefits.

Thus, the decision was made to create a multi-tenant application server whose design would allow for horizontal or vertical scalability that does not match the user count in a related mapping. The choice for such an application server fell on Node.js with the Express framework that is well suited for such a multi-tenant system thanks to its flexibility and lightweight core.

This approach poses a fundamental problem in relation to multi-tenancy: Since each API receives a unique subdomain but all requests are served by the same application, the tenants need to be identified. However, this can be solved within the constraints of the Express framework.

Giving each API a unique identifier can be done in different ways, the most obvious one being a path-based, randomly created identifier. So an API with an identifier of `123456` would be available under `api.com/123456`. The biggest problem with that approach is how to then identify requests to an API compared to ones for the administrative web interface. The reverse proxy would need to apply pattern matching to identify API requests (like `api.com/123456`) and web requests (like `api.com/dashboard`). Depending on the complexity of the API identifier, this might require a dedicated whitelist for all web endpoints.

Another consideration is one of aesthetics and usability. The strict resource model of RESTful APIs uses URL paths to represent both resources and item identifiers. Adding a prefixed AI identifier obfuscates that pattern.

The approach chosen by _200 OK_ relies on subdomains instead. Each API is identified by a unique subdomain. The reverse proxy now only needs to check whether a request is made to a URL with a subdomain (an API request) or without one (a request to the web interface). The subdomain name can also easily be extracted from within Express by splitting the hostname, making API identification easy for the following business logic.

### Handling Request Routing

The Express framework provides methods to handle routes based on the requested endpoint and the HTTP request method. The flexibility of a RESTful API makes it difficult to leverage the benefits of that approach.

With the flexible nature of each API to treat any resource as valid as long as it conforms to the basic requirements (no nesting beyond four levels, numeric integers as resource identifiers), it is easy to see that there can be no fixed endpoint routes. Resources can be named however a user wants (again, within a few constraints).

Route handling inside Express is therefore only done by way of the distinct HTTP request method. A `DELETE` request is going to require a fundamentally different operation than a `GET` request. The exact route becomes what is essentially a parameter for that operation. The only difference between a `GET` request to `/users/3/comments` and `/lists/4` is whether the request aims for a whole resource collection or a specific item of it. Extracting this information from the request path is easy within the aforementioned naming constraints of a _200 OK_ API.

By splitting the request path into segments inside of an Express middleware relatively early in the middleware stack, the general request handler has all necessary information to query the data layer for what was requested.

### Storing Relational Data Without A Schema

As per the REST specification, data received for a _200 OK_ API is relational in nature, but only with regards to whole resource collections and items, not granular data inside of them. Data stored for `/users/3/comments` is related to a specific item in the `users` resource collection, but the server does not need to (an can not) concern itself with references stored inside the data itself since that responsibility is left to the user's code.

In addition to that relational coupling, each resource item does not have any predefined schema. In fact, since user-sent payloads are not known ahead of time, any predefined schema would have to be so loose as to not provide much benefit. Deducting a schema by analyzing incoming data (and subsequently enforcing adherence to it) would allow for better data integrity but at the cost of user freedom. Without a set schema, there are almost no constraints placed on the structure and design of the user-sent payloads which suits the use cases described above.  

Yet the bigger problem is that of maintaining the relationship between resources without knowing beforehand which resources an API is going to represent. Conceptually, this is similar to a tree data structure. Since neither the depth nor the breadth of the tree will be known quantities, a SQL database will not play to its strengths. A dynamic relationship tree would mean that tables might need to be created at runtime, adding an expensive and potentially risky operation to each new API endpoint: if the table creation fails, the user request will fail as well. Since the user-sent payload would be stored in a JSONB column (or equivalent) anyway, SQL would only provide a way to manage relationships but at significant cost.

This has led to the decision to rely on a document database with MongoDB being the first choice thanks to its storage format being very close to JSON anyway. To manage relationships, _200 OK_ relies on a different method: _Materialized Paths_.

To explain the decision for _materialized paths_, we have to look at the requirements for storing _200 OK_ API data. Considering the uses cases described above, the difference between read and write updates for each API should be way more balanced than for a traditional data store (where read operations will likely outnumber write operations by several orders of magnitudes). Since applications developed for use with a _200 OK_ API will mostly be proof-of-concept works, small learning projects, the number of users requesting read access will be limited.

There are multiple ways of representing a tree structure in data stores (like the nested set model[2] for relational databases), but _materialized paths_ provide the following advantages:

- The organizational overhead is restricted to an additional column or property.
- Inserting a node is a cheap operation since no existing nodes need to be updated.
- Deletion of a sub-tree is easy with pattern matching of the materialized path column/property.

The only truly costly operation, moving sub-trees inside the structure (which would require updating all nodes in that sub-tree), is not part of the _200 OK_ requirements.

One disadvantage of _materialized paths_ in a NoSQL data store is that there is no inherent way of keeping track of resource item identifiers. When inserting a new node there is no possibility to easily deduce the next available identifier without having to query all sibling nodes. _200 OK_ solves this issue with a dedicated identifier collection. 

The most common operations, in order, of a _200 OK_ API will be reads (query resources and their items), writes (insert new resources and their items) or deletes (deleting resources or items and subsequently all nested resources and their items). For all those operations and within the constraints put on each API (no nesting beyond four levels), materialized paths provide a performant solution to managing relationships.

## Implementation Challenges

With the core backend design set in stone, several pieces of functionality posed more specific challenges with regards to their implementation. Among those were:

- Allowing real-time request and response inspection that requires communication between the API backend and the web interface application.
- Supporting the full CORS functionality for allowing cross-origin requests to the APIs.
- Support for SSl-encrypted requests across all APIs and thus finding a system architecture that provides the means to do so.

### Real-Time Request and Response Inspection

The decision to implement core API functionality and web administration functionality in two separate applications also created a barrier of communication between both. This barrier stands in the way of easily sharing request and response data with the user-facing frontend. A request for the `/users` resource of a specific API is fully processed in the backend application up to the point where the response is sent to the user.

The only common denominator that both the web application as well as the backend application have is the data store. A naive idea would be to store requests and responses in that database so that the frontend can query for it. This solution would have a few drawbacks. First, it simply puts more load on the main database which decreases its overall capacity. But even more significantly, it introduces a maintainability demand. Most requests and responses will likely never be inspected on the frontend, so a lot of data is stored without a need and regular cleanup of old data is required.

A better solution can be achieved by using a dedicated message broker. _Redis_ is an in-memory data store with message brokering functionality in the form of its publish/subscribe mode. Leveraging that functionality, the API backend can publish each request/response cycle to Redis. When a subscriber in the frontend application listens for that data, it will receive it, otherwise it is immediately discarded.

This solves the described problems. The main data store is kept unaffected while a better suited tool handles the communication in a completely decoupled manner. With the ephemeral in-memory nature of Redis, there are no cleanups necessary as all data is either published and received immediately or discarded. In-memory storage also keeps the added latency of those operations to a minimum compared to the disk-based storage of the NoSQL store.

The web application that subscribes to request/response information on Redis will also require a real-time communication method with the interface running inside a user's browser. There are various fleshed-out solution to facilitate longer-living server-client communication outside the one-off nature of common HTTP requests.

The most commonly used technique are WebSockets that allow bidirectional communication between clients and a server. This kind of communication comes with its own cost, though, on both sides of the process. The server needs a separate WebSocket connection handler while the client will need to create a dedicated connection as well.

Since the flow of information for the request/response inspection is limited to a single direction (from the server to the client), another solution provides a better fit: _Server-Sent Events_ (SSE). Server-sent events have much lighter requirements. They are served through a normal endpoint in the existing server application, foregoing the need for a dedicated listener. Browser-side, SSE are realized through the browser's `EventSource` interface supported by all existing modern browsers.

Besides being unidirectional, SSE come with the disadvantage of being restricted by the maximum amount of open HTTP connections for a domain that is enforced in the browser (at least when not using HTTP/2). Since there is only the need for one SSE connection in the case of _200 OK_, this does not matter here. 

Since the browser fetches SSE from a normal API endpoint, code complexity could be kept low by being able to reuse all existing authentication and request handling functionality. That made Server-sent events a perfect fit for this particular use case.

### Full CORS support

External APIs are most useful when they can be accessed from any environment. However, browser application code suffers from one security-related restriction when it comes to external API access: the same-origin policy, a mechanism in all major browsers that restricts access to resources from different origins than the script or document originates from.

To allow valid cross-origin requests, there is a standard called CORS (Cross-Origin Resource Sharing) that needs server explicitly state whether a host is permitted to make a request to it. With the paradigm shift towards frontend-loaded web applications running in the browser, an API needs to support CORS to enable usage in those browser environments.

The simplest form of access control with regards to the request maker's origin is a simple response header (`Access-Control-Allow-Origin`) that states whether a response will be exposed to a browser script. A wildcard value (`*`) is a carte blanche but does not solve all CORS-related issues. Whenever a non-simple request is made (as defined by a set of criteria[3]), a special `OPTIONS` method request is made first (called a _preflight request_). Since a _200 OK_ API supports HTTP methods that always require such a preflight request, support for those needs to be built in as well.

Instead of relying on a third-party library, _200 OK_ implements its own CORS library. This allowed for making precise preflight responses. One of the preflight headers asks the server for its support for the actual request's HTTP method. Since those allowed methods can vary when a _200 OK_ user creates custom endpoint responses (thus controlling which methods should be allowed), the associated response headers needs to accurately reflect the circumstances under which a request should be allowed.

### System Architecture

Despite being a single-instance deployment, _200 OK_ consists of different parts that need to be put into a cohesive system architecture:

- the main API backend
- the administrative web interface application (including a backend and frontend scripts)
- the main data store (MongoDB)
- the publish/subscribe message broker (Redis)

Routing requests to the correct application is one requirement already described earlier. Supporting SSL-encrypted traffic is another one, creating the need for either an SSL termination point or SSL support for both applications, as well as certification for all API subdomains.

< TODO: add text here once decision about dockerized deployment is final >


[^1]: See: The GitHub API.
[^2]: https://en.wikipedia.org/wiki/Nested_set_model
[^3]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests

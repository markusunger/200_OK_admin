# Case Study for _200 OK_

## Introduction

When developing web applications, there are a number of options for handling the backend portion, ranging from creating a custom application to using a service like Google Firebase. For many small projects this means a significant amount of work to either write or setup such a backend. _200 OK_ was developed as a no setup, drop-in RESTful API backend for applications with that scope, e.g. learning prototypes or hackathon proof-of-concepts. With its functionality, _200 OK_ can also serve as a temporary mock API or as a debugging tool for header and payload inspection.

## Abstract

_200 OK_ is a no-configuration backend service that provisions ephemeral RESTful APIs. Following the REST architecture style, each API adheres to a resource-based model of storing and delivering data. In addition to that, each API can be augmented to mock responses, while also providing real-time inspection of the request/response cycle. 

The four traditional REST operations for data retrieval, creation, updating and deletion (`GET`, `POST`, `PUT`, `DELETE`) are supported together with up to four levels of nesting for resources. Each API handles all valid JSON payloads, supports CORS and is therefore easy to integrate in different kinds of projects. The RESTful mode works without a need for configuration or custom settings and all additional functionality is optional and can be configured in a modern web interface.

![short video/GIF of the administration interface of 200 OK in action]

## _200 OK_ as a low-level BaaS

Web applications typically consist of two parts: a frontend and a backend. The frontend portion is usually concerned with the presentation layer, how a user interacts with the the application and how it is displayed across a range of devices. The backend, in contrast, is responsible for managing all underlying data and contains the business logic for retrieving and transforming that data. 

There is a huge variety of providers across different levels of abstraction when it comes to web application backends and those offerings demand different levels of effort to manage while providing varying degrees of abstraction and control over the backend itself.

![diagram showing possible backend systems with varying levels of complexity and user control](/public/images/services_comparison_table.png)

Relying on bare-metal deployment is at the root of the abstraction level, as are offerings in the Infrastructure-as-a-Service (IaaS) space. Both put the responsibility of dealing with an applications operating system and code into the hands of a developer. A Platform-as-a-Service (PaaS) instead abstracts away another layer: it manages all tasks related to an applications' deployment, letting the developer control only the application code itself.

At the highest layer of abstraction stands the Backend-as-a-Service (BaaS) which also manages any backend functionality, exposing only a defined set of interactions with it. An application developer's responsibility is now limited to the frontend part only with its lower barrier for deployment. An example of a popular BaaS offering is Google Firebase which provides a Software Development Kit (SDK) to facilitate access to its different backend features like a data store, authentication services or analytics. The tradeoff made for this reduced responsibility is a significant vendor lock-in effect and non-transferrable knowledge to using such an offering.

_200 OK_ falls right between the PaaS and BaaS definitions. By providing a backend with a predefined yet long-established architecture (in the form of _REST_) _200 OK_ holds a few unique advantages over a more complex BaaS like Google's Firebase or Amazon Amplify. Those services are closed-source platforms whose features are determined completely by the provider itself. Implementation details are mostly hidden behind the respective SDK's interface. BaaS services also come with a certain learning curve: features require knowledge of the SDK and integration into the provider's ecosystem means that skills are rarely transferable between providers. Plus, the additional learning curve of how to use the BaaS is determined by the quality of its documentation and the complexity of its API.

In contrast, _200 OK_ provides a feature set focused on the pure data storage and management functionality. It also closely follows the popular REST (_Representational State Transfer_) architecture model for providing a simple but powerful interface that is in wide use across the web development world. It retains the general benefits of abstraction that a BaaS offers but has greatly reduced setup times and requires almost no prerequisite user knowledge. Plus, REST is fundamentally implementation-agnostic, meaning that there is no reliance on client libraries or SDKs. As long as there is support for making HTTP requests (which is almost universally possible in any language), any RESTful interface is fully useable.

## Providing a REST interface

The original REST architecture specification [1] layed out guiding principles for an interface to provide interoperability between networked computers:

- a uniform interface for
- a client-server architecture that is
- stateless and
- cacheable inside of
- a layered system

REST is only an architecture style and modern implementations don't necessarily have to follow all guidelines which is why most modern REST APIs are labelled as _RESTful_, meaning that they only incorporate an (albeit large) subset of the original REST specification. HATEOAS (_Hypermedia As The Engine Of Application State_) is something that is often missing from RESTful APIs. HEATEOAS means that API responses should include contextual hyperlinks to related resources, allowing API usage without any prior knowledge of its design. [2]

_200 OK_ follows most REST principles in that it:

- provides a uniform interface (following the resource model and HTTP methods to execute operations on those resources)
- is stateless (with no request being dependent on any knowledge from a former request)
- is cacheable (with metadata indicating changes of the requested representation and whether it actually needs to be transferred again)

The uniform interface that relies on the HTTP standard's different request methods and has resources as its key components is as simple as it is flexible. The widespread use of RESTful APIs in large parts of the web development world is a testament to the quality and ease of use that the REST model provides.

The stateless nature is inherent to the way HTTP works and both REST and _200 OK_ acknowledge the advantages that result from that. 

The _layerability of systems_ as the REST style describes it is not a big factor in how _200 OK_ operates. The general idea is to have a REST API whose resources can represent an underlying data source in many different ways, e.g. different formats (JSON, XML, CSV, ...) or different aggregations of the same data. A _200 OK_ API does only accept JSON payloads and stores them in almost the same format. But with access to that data being provided by the API, the underlying data store is effectively decoupled from its users, allowing flexibility in changing or improving it without interrupting a user workflow as long as the RESTful interface remains the same.

![The REST style for a web API](/public/images/rest-style.png)

The basic item of a _200 OK_ API is the resource. It represents a collection of data items, each of which can be accessed individually as well. The representation of the collection always matches its original data format which is JSON (_JavaScript Object Notation_), one of the most popular data exchange formats of the web ecosystem. The state of a collection or a collection item can be manipulated through a defined set of interactions represented by the HTTP request methods `GET`, `POST`, `PUT` and `DELETE`.

## Core Backend Challenges

_200 OK_ was designed with a single-instance, multi-tenancy approach in mind. This required unique measures to handle dynamic routing as well as flexibly storing dynamic relational data. Also, despite the single-instance approach, the goal was to allow for both horizontal and vertical scalability in the future without it impacting the core design.

With the need to properly handle nested relationships for user-provided data, a performant and flexible solution for the data persistence was needed as well. A _materialized path_ approach backed by a MongoDB document database constitutes a solution that is both performant for the intended use case and robust enough to remain a valid approach even when extending both functionality and scale of the data layer.

In order to separate concerns and allow for independent scaling, the main backend handling all user-generated API requests was separated from the user-facing frontend configuration platform. Since both processes need a way to quickly exchange information about user-initiated requests, a Redis store used with its publish/subscribe mode together with the use of server-sent events provides easy interprocess communication without much additional overhead.

### Multi-Tenancy REST Interfaces

A _200 OK_ API will typically not generate much need for processing power or memory space, so a dedicated single-tenant architecture would result in a significant resource overhead, e.g. when providing an isolated environment (like a containerized deployment) consisting of an application server and a data store for every tenant. A reprsentative use case for a _200 OK_ API might require some light read and write access over the course of two days, resulting in any pre-provisioned resources sitting idle for the rest of the API's lifetime, needlessly consuming resources.

Thus, the decision was made to create a multi-tenant application server whose design would still allow for horizontal or vertical scalability but would also acknowledge the light processor and memory loads that each API causes. Multi-tenancy in this context means that all API access is handled by the same application process. The choice for such an application server fell on Node.js with the Express framework, both of which are well suited for this task thanks to their flexibility and lightweight core.

This approach poses a fundamental problem in relation to multi-tenancy: Since each API receives a unique identifier but all requests are served by the same application, the tenants need to be recognized.

Giving each API a unique identifier can be done in different ways, the most obvious one being a path-based, randomly created identifier. So an API with an identifier of `123456` would be available under `api.com/123456`. The biggest problem with that approach is how to then identify requests to an API compared to ones for the administrative web interface. The reverse proxy would need to apply pattern matching to identify API requests (like `api.com/123456`) and web requests (like `api.com/dashboard`). Depending on the complexity of the API identifier, this could mean creating dedicated whitelist for all web endpoints.

Another consideration is one of aesthetics and usability. The strict resource model of RESTful APIs uses URL paths to represent both resources and item identifiers. Adding a prefixed identifier obfuscates that pattern.

The approach chosen by _200 OK_ relies on subdomains instead. Each API is identified by a unique subdomain. The reverse proxy now only needs to check whether a request is made to a URL with a subdomain (an API request) or without one (a request to the web interface).

![illustration of reverse proxy identify different requests and proxying them to the correct application](/public/images/reverse_proxy_concept.png)

### Handling Request Routing

The Express framework provides methods to handle requests based both on the endpoint they are intended for and the request method use. With the flexible nature of each API to treat any resource as valid as long as it conforms to the basic requirements (no nesting beyond four levels, numeric integers as resource identifiers), it is easy to see why there can be no fixed endpoint routes. Resources can be named however a user wants (again, within a few constraints) and still be usable on the first request to them. When the retrieval of a resource collection like `/users` is requested as the first operation on a _200 OK_ API, the result should be processed as if `/users` was already created but still void of data: the JSON response should simply contain an empty array.

Route handling inside the _200 OK_ application can therefore only be done by way of the distinct HTTP request method. A `DELETE` request is going to require a fundamentally different operation than a `GET` request. The exact route becomes what is essentially a parameter for that operation. The only difference between a `GET` request to `/users/3/comments` and `/lists/4` is whether the request aims for a whole resource collection or a specific item of it. Extracting this information from the request path is easy within the aforementioned naming constraints of a _200 OK_ API. This way of creating catch-all routes also works exceptionally well with the _materialized path_ approach for organizing the relationship between resources (see [the following chapter](#storing-relational-data-without-a-schema)).

![illustration for showing the 4 different method handlers with the exact endpoint essentially being a set of arguments for the handler]

When done early in the application's middleware stack, it is also easy to discern between valid resource requests and those that do not make sense within the loose limits. Rejecting a request can be done before many I/O-intensive operations. For example, a resource `/users/5/images` should only be valid if an item with the id of `5` in the `/users` collection already exists. If it doesn't, there should be no `images` resource for that user, making the request invalid.

### Storing Relational Data Without A Schema

Data received for a _200 OK_ API is relational in nature, represented by the possible nesting of resource collections.

In addition to that relational coupling, each resource item does not have any predefined schema. In fact, since user-sent payloads are not known ahead of time, any predefined schema would have to be so loose as to not provide much benefit at all. Deducting a schema by analyzing incoming data (and subsequently enforcing adherence to it) would allow for better data integrity but at the cost of user freedom. Without a set schema, there are almost no constraints placed on the structure and design of the user-sent payloads which suits all the _200 OK_ use cases described above.  

Yet the bigger problem is that of maintaining the relationship between resources without knowing beforehand which resources an API is going to represent. Conceptually, this is similar to a tree data structure where neither the depth nor the breadth of the tree will be known quantities. Consequently, an SQL database will not play to its (usually impactful) strengths. A dynamic relationship tree would mean that tables might need to be created at runtime, adding an expensive and potentially risky operation to each new API endpoint: if the table creation fails, the user request will fail as well. Since the user-sent payload would be stored in a JSONB column (or equivalent) anyway, SQL would only provide a way to manage those tree relationships but do so at a significant cost.

![relationships between resource collections and items](/public/images/resource_relationships.png)

This has led to the decision to use a document database, with MongoDB being the first choice thanks to its storage format being very close to JSON anyway. To manage relationships, _200 OK_ relies on a different method: _Materialized Paths_.

Materialized path means that the relationship of any resource item is represented by the full tree path to that item, encapsulated in a string. That means that there is no dedicated information stored about the parent collection itself, each collection just comprises a varying number of - in the case of MongoDB - documents with a `path` field that specifies the exact relationship of that item. That might look like the following JSON structure:

```json
{
  "id": 5,
  "path": "/users/6/images",
  "data": {
    "example": true
  }
}
```

Each item receives just two identifiers: the path reflects the exact relationship for the item, in the example it would belong to the `images` collection nested below the `users` item with the `id` of `6`. The item itself would also be associated an `id` of `5`. A whole resource collection can therefore be retrieved without additional complexity by simply matching the path to it for each item. With the `id` provisioning handled separately, all resource items can be stored within the same document collection of the database while still allowing all necessary operations on the underlying tree structure.

To further explain the decision for materialized paths, we have to take an even closer look at the nature of the relationship tree for _200 OK_. Only a subset of all the functionality that is possible to represent with a tree structure is required for a RESTful API. New tree nodes (representing resource collections) will only be created on the outer edges of the tree. When such a collection gets removed, all data nested below it can also be removed, so operations on parts of the tree are very limited and straightforward. Within those constraints, any complex operation like walking the tree by depth or breadth is also not relevant. 

While there are multiple ways of representing a tree structure in data stores (like the nested set model[2] for relational databases), materialized paths provide the following advantages:

- The organizational overhead is restricted to an additional column or property.
- Inserting a node is a cheap operation since no existing nodes need to be updated.
- Deletion of a sub-tree is easy with pattern matching of the materialized path column/property.

The only truly costly operation, moving sub-trees inside the structure (which would require updating all nodes in that sub-tree), is not part of the _200 OK_ requirements. The limited ways of manipulating the tree would make any more complex solution add mostly unnecessary optimization overhead.

However, one disadvantage of materialized paths in a NoSQL data store is that there is no inherent way of keeping track of resource item identifiers (like there would be with an auto-incrementing column in a relational database). When inserting a new item into a resource collection, there is no possibility to easily deduce the next available identifier without having to query all sibling nodes, an operation bearing potentially high costs. _200 OK_ solves this issue with a dedicated identifier collection that provisions the next highest integer identifier to any new resource item.

All in all, for all the necessary operations and within the constraints put on each API, materialized paths provide a performant solution to managing relationships.

## Implementation Challenges

With the core backend design in place, several pieces of functionality posed more specific challenges with regards to their implementation. Among those were:

- Allowing real-time request and response inspection that requires communication between the API backend and the web interface application.
- Supporting the full CORS functionality for allowing cross-origin requests to the APIs.
- Support for SSl-encrypted requests across all APIs and thus finding a system architecture that provides the means to do so.

### Real-Time Request and Response Inspection

![GIF of the inspector in action]

The decision to implement core API functionality and web administration functionality in two separate applications also created a barrier of communication between both. The only common denominator that both the web application as well as the backend application have is the data store. So to allow real-time request/response inspection in the web application, a simple approach would be to store that information in the database so that the frontend can retrieve it. However, that solution would have a few drawbacks. First, it puts more load on the main database which decreases its overall capacity. But even more significantly, it introduces a maintainability demand: Most requests and responses will likely never be inspected on the frontend, so a lot of data is stored without a need and regular cleanup of old data is required.

A better solution can be achieved by using a dedicated message broker. _Redis_ is an in-memory data store with message brokering functionality in the form of its publish/subscribe mode. Leveraging that functionality, the API backend can publish each request/response cycle to Redis. When a subscriber in the frontend application listens for that data, it will receive it, otherwise it is immediately discarded.

This solves all described issues. The main data store is kept unaffected while a better suited tool handles the communication in a completely decoupled manner. With the ephemeral in-memory nature of Redis, there are no cleanups necessary as all data is either published and received immediately or discarded. In-memory storage also keeps the added latency of those operations to a minimum compared to the disk-based storage of the NoSQL store.

The web application that subscribes to request/response information on Redis will also require a real-time communication method with the interface running inside a user's browser. There are various fleshed-out solution to facilitate longer-living server/client communication outside the one-off nature of basic HTTP requests.

The most commonly used technique are WebSockets that allow bidirectional communication between clients and a server. This kind of communication comes with its own cost, though, on both sides of the process. The server needs a separate WebSocket connection handler listening on a different port than the rest of the HTTP-based communication, while the client will need to create a dedicated connection as well.

Since the flow of information for the request/response inspection is limited to a single direction (from the server to the client), another solution provides a better fit: _Server-Sent Events_ (SSE). Server-sent events have much lighter requirements. They are served through a normal endpoint in the existing server application, foregoing the need for a dedicated listener. Browser-side, SSE are realized through the browser's `EventSource` interface supported by all existing modern browsers and adding only minimal overhead to the client-side code base.

Besides being unidirectional, SSE come with the disadvantage of being restricted by the maximum amount of open HTTP connections for a domain that is enforced in the browser (at least when not using HTTP/2). Since there is only the need for one SSE connection in the case of _200 OK_, this does not matter. 

Since the browser fetches SSE from a normal API endpoint, code complexity could be kept low by being able to reuse all existing authentication and request handling functionality. That made Server-sent events a perfect fit for this particular use case.

### Full CORS support

External APIs are most useful when they can be accessed from any environment. However, browser application code suffers from one security-related restriction when it comes to external API access: the same-origin policy, a security mechanism in all major browsers that restricts access to resources from different origins than the accessing script or document originates from.

To allow valid cross-origin requests, there is a standard called CORS (_Cross-Origin Resource Sharing_) that requires a server to explicitly state whether a host is permitted to make a request to it. With the paradigm shift towards web applications with lots of internal logic running in the browser, an API needs to support CORS to enable usage in those environments.

The simplest form of access control with regards to the request maker's origin is a simple response header (`Access-Control-Allow-Origin`) that states whether a response will be exposed to a browser script. A wildcard value (`*`) is a carte blanche but does not solve all CORS-related issues. Whenever a non-simple request is made (as defined by a set of criteria[3]), a special `OPTIONS` method request is made first (called a _preflight request_). Since a _200 OK_ API supports HTTP methods that always require such a preflight request, support for those needs to be built in as well.

Instead of relying on a third-party library, _200 OK_ implements its own CORS library. One of the preflight headers asks the server for its support for the actual request's HTTP method. Since those allowed methods can vary when a _200 OK_ user creates custom endpoint responses (thus controlling which methods should be allowed), the associated response headers needs to accurately reflect the circumstances under which a request should be allowed.

### System Architecture

Despite being a single-instance deployment, _200 OK_ consists of different parts that need to be put into a cohesive system architecture:

- the main API backend
- the administrative web interface application (including a backend and frontend scripts)
- the main data store (MongoDB)
- the publish/subscribe message broker (Redis)

![illustration of 200 OK's architecture](/public/images/system_architecture.png)

Separating the main API backend application from the web interface application was done for a number of reasons. First, it allowed a cleaner separation of concerns. The main application should be responsible for serving user API requests and not also for serving static web assets like HTML, CSS files or images. Secondly, both applications potentially have very different scaling needs. With both being separate, the whole web application could be further split up, for example to let a CDN serve all static assets and transform the application into a pure backend API.

Routing requests to the correct application is one requirement already described earlier. Supporting SSL-encrypted traffic is another one, creating the need for either an SSL termination point or SSL support for both applications, as well as certification for all API subdomains.

Splitting traffic by whether a request is targetted at an API or the web interface is done by an NGINX reverse proxy. It pattern matches for the existence of a subdomain in the hostname and forwards the request to either of the two applications. NGINX is also used as the termination point for all encrypted traffic since all traffic after that point is routed internally behind the same public IP address. TLS certification itself is acquired via a wildcard certificate from Let's Encrypt, covering all (sub-)domains and providing encryption for both the APIs and the web interface.

## Future Work

There are a number of additions and improvements that I would love to make to _200 OK_, among them:
- an export feature to download all API data as a JSON blob
- a tool to be able to quickly fill selected resources with mock data (generic users, lists, etc.)
- finer grained API authentication and authorization supporting multiple users and roles
- extended mocking capabilities, e.g. supporting customized headers and response status codes
- stronger testing coverage and higher degrees of deployment automation (CI/CD)

[^1]: Roy Fielding, 2000, https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
[^2]: The decision to not implement a HATEOAS system stems primarily from the consideration that for the intended use cases (in general projects with small scopes), HATEOAS would not be very beneficial. In most cases, the API would not need to be explored as the only API user is the one who also determines how it is used, resulting in the additional information being more of a hindrance because it requires extracting the actual data payload from the additional hypermedia information. For an example of HATEOAS in an API, the official GitHub API provides a good example.
[^3]: https://en.wikipedia.org/wiki/Nested_set_model
[^4]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests

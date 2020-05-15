# Documentation

## Quick Start Guide

_200 OK_ provides you with a RESTful, CORS-enabled API that only lives for 7 days after it has been created. It can be used for quick prototypes or learning projects where you want a drop-in, ready-to-use backend without any configuration.

If you are familiar with REST APIs, you already know how to use a _200 OK_ API.

Your API follows the resource-based REST design approach and assumes that each request to a resource is made with purpose. If you want to store data for a user resource, you simply send a `POST` request to `https://<your-API-name>.200ok.app/users`, include a `Content-Type: application/json` header and send some valid JSON in your request body.

Your API automatically assigns an incrementing `id` field to that data and makes it available both as part of the resource collection (`/users`) and an individual collection item (`/users/<id>`).

You can issue requests for all of the basic CRUD operations:

| Method | Target path | Response Status Code and Body on success |
|---|---|---|
| GET | a resource collection or individual item | 200, requested data in body |
| POST | a resource collection | 201, request body data plus added `id` field in response body |
| PUT | an individual resource item | 204, no body |
| DELETE | an individual resource item | 204, no body |

Resources can be nested up to four levels deep (e.g. `/topics/1/posts/2/comments/3/likes`), and each subresource is specific to an item of the parent resource (meaning that e.g. `/posts/1/comments/1` and `/posts/2/comments/1` refer to two different comments).

Upon creation, you receive an API key (a 24 digit, alphanumerical string). When you decide to create an account by logging in via GitHub, you can connect that API to your account. Once you have done that, you have access to two tools:

1. A live inspector of your requests/responses ([details](#Inspect-Requests-and-Responses))
2. A custom endpoint creator to specify JSON responses for certain API endpoints ([details](#Customizing-Endpoint-Behavior))

For any further clarification, you can refer to the detailed documentation below.

## Core Principles of _200 OK_

_200 OK_ is an **ephemeral, RESTful** API service:

- **Ephemeral** means that each API will have a short life span: after **seven days** it will automatically be deleted, together with all its associated data.
- **RESTful** means that the API follows the common REST (_Representational State Transfer_) design principles.

They key concept is that of **resources**: A _200 OK_ API can be used to store, retrieve, update and delete information in the form of resources. Resources are represented as a collection of items (each one consisting of **JSON-format data**), with each item having a unique resource identifier.

The whole collection of resources as well as single items of a collection can be accessed with the commonly used HTTP request methods: `GET` for retrieval, `POST` for creation, `PUT` for updating and `DELETE` for deletion. See the section on RESTful requests for more on how to properly structure your requests.

Every _200 OK_ API is CORS-enabled and publicly accessible, so there is no authorization token or other method of user identification, and requests can come from any source, be it an application, client-side JavaScript code or the command line.

In order to create an API with _200 OK_, you do not need to register or signup. It's totally free and you can get your own API in a matter of seconds by clicking the big, shiny button labeled _Create your API_ on the [frontpage](https://200ok.app). If you have no need for any of the helpful tools that _200 OK_ provides, you only need to grab your API URL (in the form of `https://<your-API-name>.200ok.app/` and you're ready to go.

However, there are a few useful helper tools that you can access by logging in with your GitHub account and connecting your API. For that, you will need to enter your API name and the API key that you receive during the API creation step.

See the [Tools section](#Tools) for more information. 

## Use cases

_200 OK_ is intended as a learning and prototyping tool. If you are learning frontend web development, you might appreciate having a no-configuration API backend that you can use to test your client-side code.

Alternatively, if you are writing frontend code that will rely on a backend API later, but the code does not yet exist, you can mock the API for your frontend calls with _200 OK_. 

You might also find yourself a participant in a hackathon, and you need a _fire-and-forget_-type of backend without any long-lived persistence. 200 OK is a good fit for that use case as well. 

## RESTful requests

### Resources and resource identifiers 

The basic building block of a _200 OK_ API is the **resource**. Resources are the _nouns_ that you can use to describe collections of information, be it users, documents or comments.

A simple resource can be accessed under the URI `/<resource-name>`. So a resource of users would have a fully qualified URL of `https://<your-API-name>.200ok.app/users`. This would represent a resource collection, comprising a varying number of individual users.

**Note**: For the purposes of readability, the documentation will use the shorter **URI** format for identifying resources and resource items, e.g. `/users/5/images`. To issue any valid request, you will of course have to provide your tool with the fully qualified **URL** to your API resource in the form of `https://<your-API-name>.200ok.app/users/5/images`.

Each item of a resource collection automatically receives an identifier in the form of an incrementing integer value (`1`, `2` etc.). The identifier is added automatically to each item when it is stored. That identifier can be used in the form of the URI `/<resource-name>/<resource-identifier>` to access an individual resource item.

`/users/23` would therefore represent an item in the `users` resource collection with the identifier `23`. 

Resources can also be nested. Going with example above, each user could have an associated image resource. Nested resources belong to a specific resource item in the form of `/<resource-name>/<resource-identifier>/<nested-resource-name>`.

`/users/42/images` would represent the _images_ resource collection for the user with the identifier `42`. Items from nested resource collections can otherwise be accessed the same way as any top-level resource.

In total, you can nest resources up to **4 levels deep** (e.g. `/users/1/galleries/2/images/3/comments/4`). 
 
### Using HTTP requests 

A _200 OK_ API assumes that each resource for which a request is received should exist. For that reason it is not necessary to explicitly create or delete a resource collection. Instead, any of the following operations will work on any resource, whether it has been explicitly accessed before or not.

There are four kinds of actions available on a resource collection or individual items, represented by an HTTP method: 
 
- [Retrieve collections or items](#retrieval) (`GET`) 
- [Create collection items](#creation) (`POST`) 
- [Update collection items](#updating) (`PUT`) 
- [Delete collection items](#deletion) (`DELETE`)

The data format for a _200 OK_ API is [JSON](https://en.wikipedia.org/wiki/JSON) (_JavaScript Object Notation_), so each resource item is represented by a valid JSON object, while resource collections will consist of an array of JSON objects.

Any data that you send to the API (e.g. in a `PUT` or `POST` request) needs to be valid JSON as well. In order for such a request body to be properly parsed by your API, you need to include a `Content-Type` header with the value `application/json`. Depending on the environment from which you make the request, this header might get automatically set.

A complete, valid HTTP POST request to a `users` resource might look as follows:

```http
POST /users HTTP/1.1
Host: <your-API-name>.200ok.app
User-Agent: exampleRequest-to-200ok
Content-Type: application/json
Accept: */*
Content-Length: 78

{
  "name": "Tom Bombadil",
  "altName": "Iarwain Ben-adar",
  "isEldest": true
}
```

#### Retrieval
 
A resource can either be retrieved as a whole (comprising all of its items) or by specifically requesting a certain resource item. This is done by making a `GET` request, which is the default request type for most browsers or HTTP utilities (like the `curl` command line tool or the in-browser `fetch()` method).

A `GET` request to `/users` would return the whole `users` resource collection as an array of JSON objects, while a `GET` request to `/users/1337` would only return a JSON object for the item from `users` with the `id` field of `1337`.

As was mentioned before, there is no need to explicitly create a resource collection itself. If, for example, you want to manage a resource for images, you can issue a `GET` request to `https://<your-API-name>.200ok.app/images` and receive an empty array as a response without having to create that collection first.

A successful response to a `GET` request will contain the requested data as well as a _200 OK_ status code.

#### Creation

To create a new resource item, a `POST` request needs to be issued to the collection itself. Keep in mind that there is no need to create the resource collection itself: If you want to send data for the first item in a `comments` resource collection, you can do so by directly sending JSON data to `/comments`.

In that case, the request body must contain valid JSON data which will be stored as is, with one notable exception: _200 OK_ automatically issues an `id` field for any newly created item. This operation will overwrite any `id` field values that you provide. This acts as a guarantee for consistent data and will prevent any accidental duplication of `id`s that might render parts of your resource collection inaccessible for `GET` requests.

The response to a `POST` request will contain the newly created item (comprising the data you sent as well as the newly created `id` field). This response will carry a _201 Created_ status code.
 
If, for example, you send the following JSON request body to `/users`:

```json
{
  "name": "Glorfindel",
  "PlaceOfBirth": "Valinor",
  "isEldest": false
}
```

The response to that request will contain the following JSON body: 
 
```json
{
  "id": 1,
  "name": "Glorfindel",
  "PlaceOfBirth": "Valinor",
  "isEldest": false
}
```

The value of `id` is an incrementing integer number that allows you easy access to any resource collection item without having to remember or store more complicated labelling schemes.

#### Updating

In order to change the data represented by a resource item, a `PUT` request can be made to that resource item together with a JSON request body. Those requests are always considered as **merge operations**, meaning that whatever data you send with the request body gets merged with the already existing data: New fields are added and existing fields get overwritten. Consequently, data will never be deleted by a `PUT` request.

If, for example, you want to update the dataset created above (because you don't subscribe to the [controversial theory](http://tolkiengateway.net/wiki/Glorfindel#Controversy) that _Glorfindel of Gondolin_ and _Glorfindel of Rivendell_ are the same person), you would send a `PUT` request to `/users/5`. If it contains the following request body:

```json
{
  "PlaceOfBirth": null
}
```

The resource item would look like this afterwards:

```json
{
  "id": 1,
  "name": "Glorfindel",
  "PlaceOfBirth": null,
  "isEldest": false
}
```

A `PUT` operation will return a _204 No Content_ response status code to indicate a successful update.
 
#### Deletion

Deleting resource items is a straightforward operation. By sending a `DELETE` request to a resource item, it will be removed and you will receive a _204 No Content_ response upon successful completion.

Keep in mind that you can only delete individual resource items, not resource collections themselves.
 
## Tools

### Prerequisites

While the automatic RESTful operation mode will likely be sufficient for a big set of users, the need for more fine-grained control over your API might arise. Thus _200 OK_ provides a set of tools that enable better debugging and configuration of an API.

Since those features require some form of user identification to prevent abuse, you will need to create an account. This can be done by [logging in](htps://200ok.app/login) via a [GitHub](https://www.github.com/) account. GitHub's OAuth system will submit only a handful of profile information to _200 OK_ that is necessary to uniquely identify you, and _200 OK_ will store only a small subset of that information:

- your GitHub profile name
- your GitHub user id
- a link to your GitHub avatar image

### Connecting and Managing your APIs

Once you have logged into _200 OK_ via GitHub, you have access to the [Dashboard](https://200ok.app/dashboard) in which you can manage all your APIs.

![/screenshot_of_dashboard.png]

If you have created your API before registering an account, you can retroactively claim it by using the _Connect another API_ button in the Dashboard. For this you will need to enter both the name of your API (like `noisy-darwin`) and the 24-digit API key that you received upon the API's creation.

If you do not remember the latter and did not save it somewhere, you are unfortunately not able to connect your existing API. However, since API creation is free, you can always just spawn a new one.

![/screenshot_of_connect_screen.png]

After entering both API name and API key, clicking _Connect_ will tie the API to your account and subsequently display it under _Your APIs_ in the Dashboard.

You can also directly create an API when you're logged in by clicking _Create a new API_ in the Dashboard or by clicking the button on [the starting page](https://200ok.app) and it will automatically be connected to your account without requiring the API key to do so.

You can have a **maximum number of seven APIs** connected to your account. If you have reached the maximum amount, you need to wait until one of your APIs expires. This happens **seven days after its creation**, at which point it will automatically be removed from your account and all associated data will be deleted.

In the Dashboard, you can select a specific API by clicking on it in the _Your APIs_ list. In the right panel you will now see details about that API (like the creation date and how much time is left before it expires). You can also select the _Inspect Requests/Responses_ tool as well as the _Customize Endpoint Behavior_ feature.

### Inspect Requests and Responses

When first starting the inspection tool, there will not be much to look at. But every request that you issue to your API while the window is open will be displayed in real time on the page.

You can easily try this out by executing the suggested shell command, which will use the `curl` tool (available in both Linux and MacOS command lines by default) to make a simple `GET` request.

After making your first request, the page will immediately display a two-panel view, with all requests displayed in a list on the left side and the request and response details displayed on the right side. The request list will contain a short identifier in the form of `<HTTP method> <requested path>` to allow for a quick distinction between multiple requests.

![/screenshot_of_inspection_tool_at_work.png]

When selecting a request by clicking on it, you can inspect both the request itself as well as the response received from your API in a tabbed view on the right side.

Being able to inspect requests and responses can provide you with valuable insight when you try to debug a non-working application or piece of code. Tools might hide their request implementation from you, e.g. setting headers that do not comply with how _200 OK_ works. 

### Customizing Endpoint Behavior

While the RESTful principles provide a lot of flexibility, your specific requirements might call for API behavior that does not translate well to the default resource-based approach. A good example would be a web frontend that at some point will have an API backend that allows for user login/logout at those respective endpoints: `/login` and `/logout`. Those are not resources (there should be no collection `login` with items like `/login/1`), so the standard behavior of the API will not match the intended use.

![/screenshot_of_customization_tool.png]

The Endpoint Customization tool allows you to overwrite this standard behavior of specific routes with your own responses.

Initially, your API will not have any custom endpoints, so you will see an empty selection list on the left side. Upon clicking _New Custom Route_, you will see a customization form on the right side which gives you full control over route behavior.

The _endpoint path_ field defines the URI of your custom endpoint and you can immediately see the full URL under which that endpoint will be available later. For the login example above, we would therefore enter `/login` into that field.

There are four checkboxes below that toggle which of the four HTTP methods that endpoint should respond to: `GET`, `POST`, `PUT` and `DELETE`. You can select any combination of those four. So if our login example would call only for a `POST` request to login, all other checkboxes besides _Allow POST requests_ could be disabled, making it the only valid operation for that endpoint.

If you enable a HTTP method, you can define a JSON response with which your API is going to respond. Please note that you are required to enter [valid JSON data](https://de.wikipedia.org/wiki/JavaScript_Object_Notation). If your input is malformed or contains characters or data types not supported by JSON, you will receive a warning message and will be unable to save your custom endpoint.

Once you are satisfied with your custom endpoint and have passed validation for your JSON response data, you can click _Save Changes_ and will now be able to make requests to that endpoint and receive the custom responses.

There is currently no limit to the amount of custom endpoints you can create, so feel free to customize your API to your own liking.

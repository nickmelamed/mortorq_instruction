# 05 - APIs and Networking (a Light Touch)

## Scope note

This topic is deliberately shallow. CAN bus and other hardware communication protocols are covered in real depth in `frc_resources/07_hardware_debugging` and `02_communication_serialization`. This module adds just enough IP-address/port/client-server vocabulary to make sense of HTTP and REST, but not sockets, raw TCP/IP mechanics, or network administration.

## Why Do We Cover This? 

Everything else in this primer has been about the robot talking to itself: subsystems, NetworkTables, a coprocessor. But for front-end work (a dashboard, a scouting app, a web tool) there has to be some way to talk to a backend. The most common way anything on the web talks to a backend is **HTTP** (HyperText Transfer Protocol), and the pattern built on top of it that you'll hear constantly is **REST** (Representational State Transfer, a set of conventions for organizing that communication around resources and standard verbs). This topic is just enough of both to make sense of what the frontend unit will build on top of.

## Request/Response, Verbs, and Status Codes

HTTP communication is built around a simple back-and-forth: a client sends a **request** to a server, and the server sends back a **response**. Every request has a **method** (informally, a "verb") describing what kind of action it's asking for:

- **GET** — "give me this data," without changing anything on the server.
- **POST** — "here's some data, do something with it" (create something, trigger an action).

There are others (`PUT`, `DELETE`, and more), but GET and POST alone cover the overwhelming majority of what a simple dashboard talking to a backend needs to do.

Every response comes back with a **status code**, which is a number telling the client, at a glance, roughly what happened:

- **200 OK** — the request succeeded, here's your data.
- **404 Not Found** — nothing exists at the address you asked for.
- **500 Internal Server Error** — the server itself hit an error trying to handle your request.

You've almost certainly seen `404` before, in a browser. That's this same system.

## Addresses, Ports, and Client/Server

Every device on a network needs an **IP address**. This is a number that identifies the device, the same way a street address identifies a building. You've already seen a real one: the driver station reaches the robot using the `10.TE.AM.2` static-IP scheme (or an mDNS hostname that resolves to it), from `02_driver_station`. That's an IP address doing exactly this job, just on a robot's radio network instead of the wider internet.

An address alone isn't enough, though, because one machine can have several programs listening on the network at the same time. For instance, a roboRIO might expose NetworkTables and SSH access simultaneously; a laptop running a backend might serve a dashboard and nothing else. A **port** is a number attached to the address that says which of those programs you mean. Port 80 for a typical web server, for instance. An address without a port gets you to the right building, not the right door.

That pair of ideas is what the **client/server** model actually is: a **server** is a program sitting at a known address and port, listening for connections; a **client** is whatever connects to it and starts the conversation. This topic's own notebook runs both ends on the same machine, so instead of a real network address they both use `localhost` (equivalently, `127.0.0.1`), which is a reserved address that always means "this same machine," which is why the request/response round trip below works without any actual network involved.

## Elastic as an Example

Imagine our Elastic dashboard that shows your robot's current status during a match: battery voltage, which autonomous routine is selected, whether a sensor is reporting healthy. That dashboard (the client) would send a `GET` request to some backend endpoint (say, `/status`) and get back a response whose body is the current status, formatted as JSON (the same serialization idea from `02_communication_serialization`, just carried over HTTP instead of NetworkTables or a raw socket). If the dashboard needed to change something on the robot (like selecting a different autonomous routine before a match) it might send a `POST` request instead, with the new selection in the request body.

This is exactly the shape you'll build on top of in the frontend unit: a frontend that renders whatever data a `GET` request returns, and triggers backend actions with a `POST`.

## What's Left Out (Intentionally)

Sockets, how a request actually travels across a physical network, DHCP/subnetting, and TCP/IP's own internals are still out of scope. This is just enough vocabulary to read an address, know what a port is for, and recognize the client/server shape, not to build either from scratch.

## Putting it together

`python/simple_server.ipynb` starts a minimal HTTP server with a `GET /status` endpoint (returning mock robot status as JSON) and a `POST /autonomous` endpoint (accepting a new autonomous routine selection), then makes real requests against it using the `requests` library, all within the same notebook, so you can watch the full round trip happen.

## Resources

- [MDN: What is an IP address?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview) - the client/server overview, with addresses and ports in context.
- [MDN: HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) - GET, POST, and the others, explained in more depth.
- [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) - the full list, beyond the three used here.
- [Flask Quickstart](https://flask.palletsprojects.com/en/stable/quickstart/) - the web framework the notebook builds on.
- [`requests` quickstart](https://requests.readthedocs.io/en/latest/user/quickstart/) - the client library used above.

# 05 - APIs and Networking (a Light Touch)

## Scope note

This topic is deliberately shallow. A separate, larger networking/hardware unit covers sockets, CAN, and hardware communication protocols in real depth — this topic exists only to give you enough of a mental model to bridge into the **frontend unit** that sits alongside this primer. If you want the deeper mechanics, that's where to find them; don't expect them here.

## Why this comes up at all

Everything else in this primer has been about the robot talking to itself: subsystems, NetworkTables, a coprocessor. But a frontend unit is coming up next, and a frontend — a dashboard, a scouting app, a web tool your team builds — needs some way to talk to a backend. The most common way anything on the web talks to a backend is **HTTP** (HyperText Transfer Protocol), and the pattern built on top of it that you'll hear constantly is **REST** (a set of conventions for organizing that communication around resources and standard verbs). This topic is just enough of both to make sense of what the frontend unit will build on top of.

## Request/response, verbs, and status codes

HTTP communication is built around a simple back-and-forth: a client sends a **request** to a server, and the server sends back a **response**. Every request has a **method** (informally, a "verb") describing what kind of action it's asking for:

- **GET** — "give me this data," without changing anything on the server.
- **POST** — "here's some data, do something with it" (create something, trigger an action).

There are others (`PUT`, `DELETE`, and more), but GET and POST alone cover the overwhelming majority of what a simple dashboard talking to a backend needs to do.

Every response comes back with a **status code** — a number telling the client, at a glance, roughly what happened:

- **200 OK** — the request succeeded, here's your data.
- **404 Not Found** — nothing exists at the address you asked for.
- **500 Internal Server Error** — the server itself hit an error trying to handle your request.

You've almost certainly seen `404` before, in a browser. That's this same system.

## A concrete picture

Imagine a dashboard that shows your robot's current status during a match: battery voltage, which autonomous routine is selected, whether a sensor is reporting healthy. That dashboard (the client) would send a `GET` request to some backend endpoint — say, `/status` — and get back a response whose body is the current status, formatted as JSON (the same serialization idea from `02_communication_serialization`, just carried over HTTP instead of NetworkTables or a raw socket). If the dashboard needed to change something on the robot — selecting a different autonomous routine before a match — it might send a `POST` request instead, with the new selection in the request body.

This is exactly the shape you'll build on top of in the frontend unit: a frontend that renders whatever data a `GET` request returns, and triggers backend actions with a `POST`.

## What's intentionally not here

Sockets, how a request actually travels over a network, TCP/IP, ports, and real hardware communication protocols are all covered in the dedicated networking/hardware unit, not here. This topic's notebook doesn't send anything over an actual network either — the server and the client both run in the same notebook process, talking over `localhost`, purely so you can see a complete request/response round trip without any of that deeper machinery getting in the way yet.

## Putting it together

`python/simple_server.ipynb` starts a minimal HTTP server with a `GET /status` endpoint (returning mock robot status as JSON) and a `POST /autonomous` endpoint (accepting a new autonomous routine selection), then makes real requests against it using the `requests` library, all within the same notebook, so you can watch the full round trip happen.

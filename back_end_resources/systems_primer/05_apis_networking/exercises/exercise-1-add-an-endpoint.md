# Exercise 1: Add an Endpoint

## Goal
Add a genuinely new HTTP endpoint to `simple_server.ipynb`, following the exact GET/POST shape the notebook already demonstrates — not just reading about REST, but building one more corner of it yourself.

## Setup
Open `05_apis_networking/python/simple_server.ipynb` in Jupyter, with `flask` and `requests` installed. Run the existing cells first so you have a working `/status` (GET) and `/autonomous` (POST) to use as a reference.

## Steps
1. Before writing anything, answer: should a new `/battery` endpoint that reports the robot's current battery voltage be a `GET` or a `POST`? Justify your answer using the definitions from `concept.md`.
2. Add a new Flask route implementing your answer to step 1 — `GET /battery` should return a small JSON object like `{"voltageVolts": 12.4}` (a mock value is fine; no real hardware involved, same as the rest of this notebook).
3. Using the `requests` library, exactly like the notebook's existing calls to `/status`, make a real request against your new endpoint from a cell below it and print the response's status code and JSON body.
4. Now add a second endpoint, `POST /battery/alert-threshold`, that accepts a JSON body like `{"thresholdVolts": 11.5}` and stores it (a plain Python variable at module scope is fine) so a later `GET /battery` call could compare against it. Make one `POST` call to set a threshold, then one `GET /battery` call, and print both responses.
5. What status code did each of your requests come back with? Would a request to a route you never defined (try it — hit `/nonexistent`) come back with the same code, or a different one? Which one, and why does that match what `concept.md` said about status codes?

## Self-Check
- [ ] I justified GET vs. POST for `/battery` using the request-method definitions from `concept.md`, not just a guess
- [ ] My `GET /battery` endpoint returns real JSON, and I made a real request against it and printed the response
- [ ] My `POST /battery/alert-threshold` endpoint accepts and stores a JSON body, and a later `GET /battery` call reflects it (even if only by having stored the value — you don't need to build real alert logic)
- [ ] I hit an undefined route on purpose and correctly identified and explained its status code

## Reflection
Everything you just built runs entirely inside one notebook process talking to itself over `localhost` — no real network, no real robot — which is exactly the point `concept.md`'s "what's intentionally not here" section made: this topic is about the *shape* of request/response, verbs, and status codes, not the deeper mechanics of how a request actually gets across a real network. That shape is identical whether the server is a notebook on your laptop or a real dashboard backend talking to a roboRIO; the frontend unit builds directly on top of exactly this GET-renders / POST-triggers pattern, against a real backend instead of a mock one.

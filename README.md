Microdots Portal
===============

This repository contains the source code for the microdots graph visualization. It loads information from Microdots API and displays it in a interactive mode for users.


# Installation

It is consists of a single HTML page. There is no need to install it. Every dependecy is already present in the repository.


# Running

This page should be served by an HTTP server.

If Python is already installed, use: `python -m SimpleHTTPServer <port>`

> Note: It is not possible to access it directly by the `file://` protocol

By default it tries to load the information from `http://localhost:8001/graph/`. This setting can be easily changed in the interface.


## Simulating requests

The `microfiller.py` can be used to send fake data to the API server. This data will be used to generate a real time graph inside the Portal.

    Usage: python microfiller.py [URL]

If the url is not present, the default is `http://localhost:8001`.

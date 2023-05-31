---
layout: doc

next:
    text: Installation
    link: /introduction/installation
---

# What is Jitar?

Jitar is a distributed runtime for JavaScript and TypeScript applications. It allows for distributing applications over multiple servers without having to build API's yourself. You can import and call server functions as a local function, Jitar takes care of the rest. What function runs at what end is a matter of configuration, and can be changed at any time. 

## Build highly scalable full-stack applications

Building scalable applications is hard. It requires breaking an application into independently deployable pieces, like microservices. The boundaries of these pieces are sensitive to change and aren't always clear. Developing endpoints and requests to arrange the communication between them brings a lot of overhead.

Jitar is designed to solve these problems. It makes the boundaries configurable so you can change them painlessly at any time and eliminates the overhead by automating the end-to-end communication.

## A runtime, not a framework

Jitar operates at runtime level. In contrast to any framework-like solution, there is no trace of Jitar in the application code. Jitar breaks up your application as configured on the go, so you can build your application as a monolith and deploy it as microservices.

## When to use

Jitar is a great tool for building applications that are expected to grow and change over time. It can be used for building small to large API driven (web) applications. We use Jitar for:

* Automating the communication between the frontend and backend and adding end-to-end type-safety.
* Deploying an application as (micro)services when it needs scaling,  load-balancing and/or failover.

For existing applications, Jitar can be of great assistance for load balancing (parts) of the application, or adding multi-version support.

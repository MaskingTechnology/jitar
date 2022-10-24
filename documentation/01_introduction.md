---
layout: default
title: Introduction
---

# Introduction

Jitar is a full-stack **distributed runtime** for JavaScript and TypeScript applications. It allows splitting monolithic applications into small(er) pieces and distributing them over a cluster of servers. Application components can be accessed regardless of their location in the cluster. Because Jitar takes care of the internal communication, there is no need for writing API's. This enables building applications with the simplicity of a monolith and the benefits of microservices.

Jitar enables front- and back-end components to live next to each other. This means that IntelliSense is available throughout the whole application. This makes developing and maintaining applications much easier and safer. It also provides the opportunity to use a single application code base for the browser and Node.js.

---

## Philosophy

Jitar is an abbreviation of **just-in-time architecture**, a flexible architecture style that is a part of Masking Technology's vision on building future-proof applications. Its intent is to close the gap between front- and back-end and provide a more cost efficient and flexible alternative to the microservice and serverless architecture (function as a service) types. With Jitar, applications can start as a monolith and be broken into smaller distributable pieces. It reduces the need for up-front architectural design and simplifies orchestration and deployment.

By implementing this architecture style as a runtime we've avoided creating another JavaScript framework. We think this is crucial for making it easy to adopt. This allows you to use the frameworks, tools and libraries you're already familiar with. It has a very small footprint (mostly configuration), making it easy to learn and use. For adding access protection and multi-version support to applications we've created a zero-impact solution, making the Jitar easy to plug in and out an application.

---

## When to use

Jitar is a great tool for building applications that are expected to grow and change over time. It can be used for building small to large API driven (web) applications, like:

* Full-stack applications
* Microservices

For existing applications, Jitar can be of great assistance for load balancing (parts) of the application, or adding multi-version support.

---

## How it works

In short, it comes down to this:

* **Applications** are broken down into components (procedures and objects).
* **Components** are grouped together in one or multiple segments and stored in a repository.
* **Segments** are deployed independently to one or multiple nodes (like a microservice, but dynamically composed).
* The **Repository** provides the actual or remote implementation of components to nodes (depending on their segment).
* **Nodes** load segments and runs their procedures when called by a client or gateway.
* The **gateway** keeps track of the available nodes and its components (locator).

The repository plays the biggest role when it comes to splitting applications. It holds the actual and a remote implementation for each segmented procedure. When starting a node, it loads the configured segments from the repository. If one of the segment components depends on (imports) a component from another segment, the repository will provide the remote implementation that calls the procedure using the gateway.

After a node starts successfully it will register itself to the gateway with all loaded procedures. If a procedure gets registered by multiple nodes, the gateway will automatically load balance the calls between them (round robin). When a node goes down it will automatically be unregistered. This means that it's possible to scale up and down nodes without any downtime.

---

{:.next-chapter}
[Getting started](02_getting_started)

---
layout: doc

prev:
    text: Concepts
    link: /examples/concepts

next:
    text: Get help
    link: /community/get-help

---

# Full stack example

To demonstrate the capabilities of Jitar, we have created a full stack example project called [Comify](https://github.com/MaskingTechnology/comify){target="_blank"}.

## Introduction

It is an open source social media platform that leverages comics for communication. The idea is simple: take or upload a picture, add speech bubbles and share with others. These others can be related or unrelated users, depending on the view you're looking at. Comics can be liked, and users can react with a comment or another comic.

## Capabilities

We have used the following capabilites:

* Authentication (client and server middleware)
* Data validation (application level)
* Data management (immutable objects and the saga pattern)
* Error handling (Jitar error binding)
* Segmentation (standalone, vertical and horizontal slicing)
* Separation of webui and domain (Vite plugin)
* Integration with external services (setup, teardown and health checks)
---
layout: doc

prev:
    text: Overview
    link: /fundamentals/overview

next:
    text: Application structure
    link: /develop/application-structure

---

# Runtime services
Jitar holds multiple types of services needed for orchestrating and executing distributed applications. Depending on your needs one or more Jitar instances can be used for running your application. 

In this section you'll learn the available service types, what they do, when to use them and how to configure them.

## Basic configuration
When bootstrapping a Jitar instance, the configuration file for a service is loaded. Every Jitar instance can only run one service type at the time.

At the start of Jitar, a configuration file is loaded  … Every Jitar instance can only run one service type at the time.

```json
{
    "url": "SERVICE_URL",
    "SERVICE_TYPE":
    {
        "PROPERTY_1": "…",
        "PROPERTY_2": "…"
    }
}
```

## Repository


## Node


## Gateway


## Proxy


## Standalone


## More information
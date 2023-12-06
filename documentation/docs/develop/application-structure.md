---
layout: doc

prev:
    text: Runtime services
    link: /fundamentals/runtime-services

next:
    text: Writing functions
    link: /develop/writing-functions

---

# Application structure

Jitar is not opinionated about how to structure your application. But we want to share the way we structure our Jitar applications that can be used as a guideline.

## Project

At the root level of a project we use at least the following subfolders.

```txt
.
├─ segments
├─ services
├─ src
└─ test
```

Although the names are quite self explanatory, this how we use them:

* segments - contains all segment configuration files;
* services - contains all service configuration files;
* src - contains all application code;
* test - contains all application tests.

Depending on the frameworks you're using you might need to add more folders. For example, our Vite based project templates include a public folder for non-code related assets.

## Source

The `src` folder contains all application code. Our typical (full-stack) structure looks like this.

```txt
src
├─ domain
│  ├─ concept1
│  ├─ concept2
│  ├─ ...
├─ webui
│  ├─ components
│  ├─ layouts
│  ├─ pages
├─ assets
│  ├─ downloads
│  ├─ images
│  ├─ ...
├─ integrations
│  ├─ database
│  ├─ notifications
│  ├─ ...
└─ jitar.ts
```

Each folder has it's own responsibility:

* domain - contains all business domain logic;
* webui - contains all web ui elements;
* assets - contains all assets used by the domain and webui;
* integrations - contains all integrations with external systems.

For maintainability reasons it's important to get the dependencies right. We use the following rules:

* domain - depends on assets and integrations;
* webui - depends on assets, domain and integrations.

For setting up the domain, we use the following rules:

* folder per concept - we prefer using business domain concepts like 'account' or 'company';
* [function](../fundamentals/building-blocks#functions) per file - we use corresponding filenames with the function name like 'searchAccounts' or 'createMonthReport';
* [data model](./data-sharing) per file - use corresponding filenames with the model names like 'Account' or 'MonthReport';
* [version](../deploy/segmentation#versioning) per file - both functions and models, we add the version number at the end of the filename.

A concept folder can be split into multiple subfolders. We do this for larger applications, but we always try to keep the structure as flat as possible to avoid complexity.

## Tests

The `test` folder contains all application tests. We always mimic the source folder structure here.

```txt
test
├─ domain
│  ├─ concept1
│  ├─ concept2
│  ├─ ...
├─ webui
│  ├─ components
│  ├─ layouts
│  ├─ pages
├─ assets
│  ├─ downloads
│  ├─ images
│  ├─ ...
├─ integrations
│  ├─ database
│  ├─ notifications
│  ├─ ...
└─ jitar.ts
```

By keeping a 1-on-1 relation with the source files makes it easy to find the associated tests.

## Segments

The `segments` folder contains all [segment configuration](../fundamentals/building-blocks#segments) files. Although Jitar doesn't care about their location, we find it more clear to group them here.

```txt
segments
├─ first.segment.json
└─ second.segment.json
```

Defining the right segments heavily depends on the application and how it is used. A single client / server application may suffice with a 'client' and 'server' segment. Other (larger) applications might benefit from segmentation by concept like 'account' or 'reporting'.

We recommend defining the segments as late as possible, and only add them for reasons like scalability, reliability and deployability. Remember that segments are configuration only, so adding, changing and removing them is very cheap. Hosting in most cases is not, so the less you need, the more you save.

## Services

The `services` folder contains all [service configuration](../fundamentals/runtime-services) files. Just like the segments, Jitar doesn't care about their location, but we do.

```txt
services
├─ gateway.json
├─ node-account.json
├─ node-reporting.json
├─ proxy.json
├─ repository.json
└─ standalone.json
```

The required services depend on the segmentation needs of the application. Applications that do not need any scaling or replication can suffice with a standalone service. Otherwise multiple services are needed to run the application. We always make sure the configuration name reflects its service type.

We always add a standalone configuration, even if the application is deployed with multiple services. We use this configuration for developing the application to simplify the development setup.

---
layout: doc

prev:
    text: Gateway
    link: /fundamentals/runtime-services/gateway

next:
    text: Writing functions
    link: /develop/writing-functions

---

# Application structure
Jitar is not opinionated about how to structure your application. But we want to share the way we structure our Jitar applications that can be used as a guideline.

## Project
At the root level of a project we use at least the following subfolders:

```
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
The src folder contains all application code. Our typical structure looks like this:

```
src
├─ concept 1
│  ├─ function1.ts
│  ├─ function2.ts
│  └─ model1.ts
├─ concept 2
│  ├─ function3_v1.ts
│  └─ function3_v2.ts
└─ jitar.ts
```

We use the following rules for this structure:

* folder per concept - we prefer using business concepts like 'account' or 'company';
* [function](../fundamentals/overview.md#functions) per file - we use corresponding filenames with the function name like 'searchAccounts'' or 'createMonthReport';
* [data model](#) per file - use corresponding filenames with the model names like 'Account' or 'MonthReport';
* [version](../fundamentals/overview.md#versioning) per file - both functions and models, we add the version number at the end of the filename.

A concept folder can be split into multiple subfolders. We do this for larger applications, but we always try to keep the structure as flat as possible to avoid complexity.

## Tests
The test folder contains all application tests. We always mimic the source folder structure here:

```
test
├─ concept 1
│  ├─ function1.spec.ts
│  ├─ function2.spec.ts
│  └─ model1.ts
└─ concept 2
   ├─ function3_v1.spec.ts
   └─ function3_v2.spec.ts
```

By keeping a 1-on-1 relation with the source files makes it easy to find the associated tests.

## Segments
The `segments` folder contains all [segment configuration](../fundamentals/overview.md#segments) files. Although Jitar doesn't care about their location, we find it more clear to group them here:

```
segments
├─ first.segment.json
└─ second.segment.json
```

Defining the right segments heavily depends on the application and how it is used. A single client / server application may suffice with a 'client' and 'server' segment. Other (larger) applications might benefit from segmentation by concept like 'account' or 'reporting'.

We recommend defining the segments as late as possible, and only add them for reasons like scalability, reliability and deployability. Remember that segments are configuration only, so adding, changing and removing them is very cheap. Hosting in most cases is not, so the less you need, the more you save.

## Services
The `services` folder contains all [service configuration](../fundamentals/runtime-services.md) files. Just like the segments, Jitar doesn't care about their location, but we do:

```
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

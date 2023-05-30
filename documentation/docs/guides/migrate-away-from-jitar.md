---
layout: doc

prev:
    text: Add Jitar to an existing project
    link: /guides/add-jitar-to-an-existing-project

next:
    text: Caching
    link: /internals/caching

---

# Migrate away from Jitar

We must admit that this isn't our most favorite subject, but we think it's an important one. No matter if you're considering Jitar or already using Jitar, this is an interesting read.

## Before you go

In our experience, switching technology is never easy. That's why we've designed Jitar to have a very small footprint. One of the perks of being a runtime solution is that it doesn't live in the code. This means that it doesn't lock you in as much as a framework does. So, saying goodbye to Jitar is fairly easy.

Don't get us wrong here, we don't want you to go! We believe that Jitar is of great value for many types of applications. You can always [reach out for us](../community/get-help) in case of any issues. But if Jitar isn't for you, that's fine.

## The migration process

Jitar automates all end-to-end communication for an application. Moving away from Jitar means that you need to add the communication yourself. All existing application code can be left untouched. Only additions have to be done. Jitar also provides all services required for the execution. You need to replace the services that are required by your application. Next we'll go through this process step-by-step.

### Step 1: Choose an architecture style

Depending on the applications deployment needs, you need to choose an architecture style. If your application has multiple backend segments that are deployed independently you need to set up a microservice or serverless architecture. Otherwise you might only need a monolithic API for the backend.

### Step 2: Arrange your runtime services

If the application has a frontend you need a web server as a replacement for the [repository service](../fundamentals/runtime-services#repository). Depending on the API framework this might be a built-in feature you can use.

When using microservices you might need to use a gateway and/or service registry to replace the [gateway service](../fundamentals/runtime-services#gateway). Also a load balancer needs to be added if you've used Jitar's load balancing function.

In case your application runs in a DMZ, don't forget to replace the [proxy service](../fundamentals/runtime-services#proxy) with an alternative solution.

### Step 3: Build the API(s)

An API endpoint has to be created for all segmented functions with public access. The end point can be hooked up to the function. If the function takes class instances as parameters, make sure to map the incoming data first.

### Step 4: Implement remote calls

API requests must be implemented for each endpoint in the client. All data needs to be serialized before making the call.

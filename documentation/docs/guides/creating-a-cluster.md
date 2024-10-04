---
layout: doc

prev:
    text: Health
    link: /monitor/health

next:
    text: Add Jitar to an existing project
    link: /guides/add-jitar-to-an-existing-project

---

# Creating a cluster

Jitar has a flexible model to create clusters using the available [runtime services](../fundamentals/runtime-services). We recommend using the [standalone service](../fundamentals/runtime-services#standalone) as long as possible, but there are a few good reasons to replace it with a cluster of other services. In this guide we'll take you along with our reasoning.

## Scalability

When your application has a lot of active users or has some heavy tasks to do, you might need to balance the load over multiple servers. This is one of the valid reasons to set up a cluster. In this situation we use the following roadmap.

### Step 1: Identify requirements

Before creating the cluster, you need to identify bottlenecks first. In this case you need to look for functions that are called with a high frequency or take a long time to perform their task. These are the functions (including their subfunctions) you want to apply load balancing to.

For the identification you can use any API monitoring tool with our [RPC API](../integrate/rpc-api). In future releases Jitar will ship a built-in metric system that helps identifying performance issues.

### Step 2: Define segmentation strategy

Next you need to split off these functions by putting them in a new segment. Depending on the situation you can combine them in a single segment, or divide over multiple segments. If you, for example, have multiple heavy functions, it's better to put them in a separate segment so they can be load balanced individually.

In-depth information on creating segments can be found in the [segmentation section](../deploy/segmentation).

### Step 3: Configure the cluster

Once the segmentation strategy is defined, the cluster needs to be configured. A cluster always requires the [repository](../fundamentals/runtime-services#repository), [gateway](../fundamentals/runtime-services#gateway) and [worker](../fundamentals/runtime-services#worker) services, so you need to configure them separately. A separate worker configuration is required for each (backend) segment.

In-depth information on configuring the services can be found in the [runtime services section](../fundamentals/runtime-services).

### Step 4: Deploy the cluster

The final step is to deploy the cluster. You can spin up as many workers per segment as you want, Jitar will [automatically balance the load](../deploy/load-balancing) between them. Keep in mind that using multiple services always leads to performance loss due to network latency. Therefore it's important to perform some tests before going into production. In some cases some tweaking of the segmentation strategy or the number of workers is required to get it right. You can only find out by measuring it.

## Reliability

Some parts of an application are more important than others. Parts that are crucial might need a guarantee of their availability. In this case it's a good idea to set up a cluster.

The [gateway service](../fundamentals/runtime-services#gateway) provides a failover system out-of-the box that uses the [health system](../monitor/health) for monitoring the availability of its workers. If a worker doesn't respond or returns an unhealthy state, the gateway will stop using the worker and resort to the remaining workers. This means that a cluster with multiple workers is required to be able to guarantee availability.

Setting up an availability cluster requires the same steps as [setting up a scalability cluster](#scalability), but with different reasoning. We do not recommend changing the segmentation strategy for adding reliability. Instead you can simply spin up multiple instances of the existing worker(s).

## Security

Limiting and protecting access to public services is always recommended. For the protection of a public [standalone service](../fundamentals/runtime-services#standalone) or a cluster of services, the proxy service could be placed in a [DMZ](https://en.wikipedia.org/wiki/DMZ_(computing)){target="_blank"}.

The proxy only forwards requests to other services. The RPC calls are forwarded to a [gateway](../fundamentals/runtime-services#gateway) or [worker](../fundamentals/runtime-services#worker) and the rest of the calls are forwarded to the [repository](../fundamentals/runtime-services#repository). When the application is deployed as a [standalone service](../fundamentals/runtime-services#standalone), both services run on the same server.

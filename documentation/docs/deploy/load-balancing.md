---
layout: doc

prev:
    text: Environments
    link: /deploy/environments

next:
    text: Health checks
    link: /deploy/health-checks

---

# Load balancing

Jitar has out-of-the-box load balancing support. It's provided by the [gateway service](../fundamentals/runtime-services#gateway), so that needs to be added to your environment in order to use it.

The load balancing system operates on function level. If a function is available on multiple workers, the gateway will automatically balance the requests round robin over the workers. The [function's fully qualified name (FQN)](../fundamentals/building-blocks#fully-qualified-name-fqn) is used to uniquely identify the functions.

When a worker registers itself at the gateway, the worker will provide the FQNs of the functions it contains. The gateway creates a balancer per FQN and uses the next worker per request. When a worker contains FQNs that are already registered by the gateway, it will add the worker to the balancer.


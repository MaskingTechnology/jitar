---
layout: doc

prev:
    text: Error handling
    link: /develop/error-handling

next:
    text: Data consistency
    link: /develop/data-consistency

---

# State management

Jitar does not require any specifics for state management. The same options apply as for any client-server or distributed application.

We do recommend keeping your application as stateless as possible. What this means depends on the type of application, but most applications need at least a bit of state. For example, if a user logs in an access token needs to be stored.

State can be stored on the client and server. In most cases, client side state is the simplest and cheapest option. A single client can execute multiple collaborating functions from different servers. If the state would be stored on the server,  some shared storage solution is required to share the state with the other servers. This brings additional complexity, latency and costs to your project. Storing the state on the client prevents the need for sharing state and is therefore preferred.

For full-stack applications it's recommended to keep as much state on the frontend as possible. If you're using a frontend framework like React, Vue, etc. you can check their documentation on how to approach this.

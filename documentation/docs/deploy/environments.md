---
layout: doc

prev:
    text: Segmentation
    link: /deploy/segmentation

next:
    text: Load balancing
    link: /deploy/load-balancing

---

# Environments

Jitar's configurable segmentation system allows for creating different deployment models for a single application. We utilize this for creating cost efficient deployment environments. In this section you'll learn how we set up these models.

## Development

We like to use a standalone service for development. This requires only one Jitar instance, getting you up-and-running quickly and saving resources on your machine. For the setup of this environment you need a standalone configuration.

```json
{
    "url": "http://localhost:3000",
    "standalone":
    {
        "assets": [...]
    }
}
```

And a standalone starter script that adds all middleware used by the application.

```ts
// src/standalone.ts
import { startServer } from 'jitar';

const moduleImporter = async (specifier: string) => import(specifier);

const server = await startServer(moduleImporter);
server.addMiddleware(/* first */);
server.addMiddleware(/* second */);
/* … */
```

Next you need to add a script in the `package.json` file.

```json
"standalone": "node --experimental-network-imports dist/standalone.js --config=services/standalone.json",
```

Now you can start the environment with NPM.

```bash
npm run standalone
```

If you wonder why we've used 'standalone' instead of 'development' for the naming, continue reading.

## Production

Distributed applications require more of the infrastructure that comes with a cost. Therefore we like to keep things simple and try to use the standalone setup in production as long as possible. We recommend only using multiple Jitar services for availability and scalability reasons.

Setting up a distributed environment requires the same steps as a standalone setup. The only difference is that you need to create a configuration per service like the repository, gateway, and node(s). For the naming we use the service type, like we do with the standalone. Don't forget to add scripts to the `package.json` file.

If your application uses middleware you need to create starter files per service and the middleware that belongs to that service. For example, the authentication middleware needs to be added to the gateway, and the authorization middleware to the node(s).

If your environment requires multiple nodes, you can append a node name to the configuration and starter script. For example "node-sales", "node-orders", etc..

## Other environments

The setup of other environments like test and acceptance depend on their goal. Although we recommend keeping them as simple as possible, it's advisable to keep the setup for the acceptance environment close to the production setup.

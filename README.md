
# Jitar | Distributed Runtime for Scalable Full-Stack JavaScript and TypeScript Applications

[Jitar](https://jitar.dev) boosts and simplifies developing full-stack applications by letting you build your application as a (modular) monolith and scale it just-in-time by configuration.

Under the hood, Jitar takes the application, splits it into smaller independent bundles as configured, and runs them across web browsers and servers.

**🎥 Watch the** [introduction video](https://www.youtube.com/watch?v=BMgJ4wZbCWg) (recommended).

**⭐ Give us a star** to show your support.

**👋 Have questions?** Join our [discord community](https://discord.gg/Bqwy8azp5R).

**IMPORTANT NOTE:** We’re still working hard toward version 1.0. We encourage you to try it out, but please avoid using it in production for now. Details can be found in the [roadmap](ROADMAP.md).

## Installation

Jitar requires Node version 20.0 or higher to be installed.

```bash
npm install -g jitar
```

A global installation is recommended to make Jitar available as CLI tool.

## Quick Start

Watch our Getting Started video series:

1. [Create a Full-Stack App with Jitar](https://www.youtube.com/watch?v=PLfcR7nb9ac)
1. [Scale a Full-Stack App with Jitar](https://www.youtube.com/watch?v=iM7XYSDIfFI)
1. [Secure a Full-Stack App Running on Jitar](https://www.youtube.com/watch?v=m6vxhw0S7LA)

Or read our [step-by-step tutorial](https://docs.jitar.dev/introduction/quick-start.html).

## Documentation

Full documentation is available at [docs.jitar.dev](https://docs.jitar.dev).

Please join our [Discord community](https://discord.gg/Bqwy8azp5R) for questions and discussions.

## Examples

To try and experience the concepts of Jitar, example applications are available in the [example folder](https://github.com/MaskingTechnology/jitar/tree/main/examples).

## Plugins

Jitar is extensible through two types of plugins:

1. **Middleware** — additional request logic (auth, logging, etc.).
1. **Health checks** — additional monitoring information (database, etc.).

For common concerns like authentication, CORS, etc. plugins are available in the [plugins repository](https://github.com/MaskingTechnology/jitar-plugins).

## Key benefits

Boosts and simplifies full-stack development:

* **API automation** - Automates all client-server communication.
* **E2E type-safety** - Reduces programming and refactoring errors.
* **Framework agnostic** - Works with modern frontend and backend frameworks.
* **Platform agnostic** - Runs in modern web browsers, servers and on the server.

## Key features

Provides everything needed to scale:

* **Routing** - Requests are automatically routed to the appropriate instance.
* **Balancing** - Requests are automatically balanced when multiple instances are available.
* **Monitoring** - Instance health is automatically monitored using pluggable health checks.
* **Security** - Access to files and procedures by configuration.

## More information

Detailed information on the motivation and technical mechanics can be found in the "The Anatomy of a Distributed JavaScript Runtime" articles series:

* [Part I - Motivation and goals](https://javascript.plainenglish.io/the-anatomy-of-a-distributed-javascript-runtime-part-i-4d550f1f5bbe)
* [Part II - Splitting applications](https://javascript.plainenglish.io/the-anatomy-of-a-distributed-javascript-runtime-part-ii-321762404778)
* [Part III - Running applications](https://javascript.plainenglish.io/the-anatomy-of-a-distributed-javascript-runtime-part-iii-3400d66c15cc)
* [Part IV - Distributing applications](https://javascript.plainenglish.io/the-anatomy-of-a-distributed-javascript-runtime-part-iv-distributing-applications-7e9e9b7df54f)
* [Part V - Consolidation and conclusions](https://javascript.plainenglish.io/the-anatomy-of-a-distributed-javascript-runtime-part-v-consolidation-and-conclusions-e84b04148f54)

More information on the use-cases can be found in the following articles:

* [How I Speed Up Full-stack Development by Not Building APIs](https://medium.com/better-programming/how-i-speed-up-full-stack-development-by-not-building-apis-7f768335bec6)
* [How I Split a Monolith Into Microservices Without Refactoring](https://medium.com/better-programming/how-i-split-a-monolith-into-microservices-without-refactoring-5d76924c34c2)

## Contributing

We welcome contributions to Jitar. Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

A special thanks to everyone who has contributed to Jitar so far!

- [Yusuf-YENICERI](https://github.com/Yusuf-YENICERI)
- [Tawakal](https://github.com/tawakal)

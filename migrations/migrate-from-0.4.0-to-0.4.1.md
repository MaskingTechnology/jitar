# Migrate from 0.4.0 to 0.4.1

## Breaking changes

The configuration of the server has been updated. In 0.4.1 the server needs to be build first, and then manually started using the server.start() function. This allows for more flexibility in the setup of the health checks.

Previously, the starter script needed to be unique for each instance if there where different health checks required. Now the starter script can be the same for all instances, and the health checks can be configured in the configuration file. More information can be found in the [health check](https://docs.jitar.dev/deploy/health-checks.html) documentation.

## Health check timeout

The health check interface is updated and now has a getter for a `timeout` value. Each health check must implement the timeout getter, even if the health check doesn't need a timeout. We want the absence of a timeout value to be a well considered choice.

To define a health check without a timeout value, make the getter return `undefined`. Otherwise set a value in milliseconds to consider the health check timed out and unhealthy. You can find an example in the [health check interface](https://docs.jitar.dev/deploy/health-checks.html) documentation.
# Migrate from 0.4.0 to 0.4.1

The health check interface is updated and now has a getter for a `timeout` value. Each health check must implement the timeout getter, even if the health check doesn't need a timeout. We want the absence of a timeout value to be a well considered choice.

To define a health check without a timeout value, make the getter return `undefined`. Otherwise set a value in milliseconds to consider the health check timed out and unhealthy.

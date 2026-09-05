
# Jitar Execution

This package provides the execution model (segmentation, procedure, etc.) for the [Jitar](https://jitar.dev) runtime.

For more information about Jitar:

* [Visit our website](https://jitar.dev)
* [Read the documentation](https://docs.jitar.dev).

## ERROR HANDLING

The execution manager distincts between execution and application errors.

* **Execution errors** are thrown and need to be caught by its caller.
* **Application errors** are not a part of the execution process and therefore are caught and wrapped in a response.  

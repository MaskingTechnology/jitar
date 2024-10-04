---
layout: doc

prev:
    text: Vite plugin
    link: /integrate/vite-plugin

next:
    text: Health
    link: /monitor/health

---

# Logging

Jitar logs all activity, errors and more. To control the amount of logging, you can set the level of interest. The log level is provided as a server option by using the flag `--log-level` during startup.

```bash
jitar start --service=services/standalone.json --log-level=debug
```

This flag is optional. When not set, the default log level `info` is used. Other options are `debug`, `warn`, `error` or `fatal`. All levels will be explained next.

::: info NOTE
It’s not possible to provide an output location, so all the messages are printed pretty in the console. Rerouting the log to a file from the console results in a hard to read log file.
:::

## Debug

The debug level is the most verbose level. It will output all messages. The debug level contains messages of running background processes. These are:

* Health requested
* Health status requested

It's advisable to not use the debug level in production because the health of a worker gets requested frequently. If you experience any issues with this, you can use this mode.

## Info

The info level will output all messages, except debug ones. The info level contains messages for all normal actions. These are:

* Assets provided
* Worker registration
* RPC registration / execution
* Server start / stop

You can use this level in production, but it is still quite verbose. If you don't need this information then the next level might be a better choice.

## Warn

The warn level will output all warn, error and fatal messages. The warn level contains messages for all unexpected results that are not errors. These are:

* Asset that could not be found

We advise to use this or the info level in production.

## Error

The error level will output all error and fatal messages. The error level contains messages for server and application errors. These are:

* Health check that failed
* Worker that could not get added
* Procedure that threw an error

## Fatal

The fatal level is the most severe level. This level contains messages of all actions that are not recoverable. These are:

* Server could not start
* CLI command that could not be executed

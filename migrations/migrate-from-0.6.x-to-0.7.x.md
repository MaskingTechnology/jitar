# Migrate from 0.6.x to 0.7.0

The 0.7 version of Jitar introduces breaking changes. All changes are described here, with instructions how to adopt them.

## Removed support for Node 18 and 19

The configuration now works with environment variables. This makes it easier and safer to configure the runtime services. But for reading the values in Node, the out-of-the-box .env capability of Node is used. Node 20 is the first version of Node that supports this. We've removed the support for the older versions of Node.

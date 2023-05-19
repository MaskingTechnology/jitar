---
layout: doc

prev:
    text: Security
    link: /develop/security

next:
    text: Debugging
    link: /develop/debugging

---

# Assets
Assets like images, documents, etc. can be placed in any location inside the source folder. By default all assets are protected. To make them accessible they must be whitelisted in the [repository configuration](../fundamentals/runtime-services.md#repository).

```json
{
    "url": "http://repository.example.com:3000",
    "repository":
    {
        "source": "./src",
        "cache": "./.jitar",
        "index": "index.html",
        "assets": ["*.html", "*.js", "*.css", "assets/**/*"]
    }
}
```

Assets can be whitelisted per file, or by using glob patterns. For example the pattern `assets/**/*` whitelists all files and subfolder files in the assets folder.


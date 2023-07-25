
# Changelog

## 0.4.1 (July 24, 2023)

The 0.4.1 release contains some improvements for the health checks and the serialization support. We have also addressed some bugs and improved the build pipeline. The starter script has been changed in this release. Please read the [migration guide](migrations/migrate-from-0.4.0-to-0.4.1.md) for more information.

New features:
- \[[`dd49361`](https://github.com/MaskingTechnology/jitar/commit/dd49361)] `serialization`: regexp serialization support [basmasking](https://github.com/MaskingTechnology/jitar/pull/319)
- \[[`2d54f39`](https://github.com/MaskingTechnology/jitar/commit/2d54f39)] `serialization`: added bigint support [basmasking](https://github.com/MaskingTechnology/jitar/pull/322)
- \[[`36901fa`](https://github.com/MaskingTechnology/jitar/commit/36901fa)] `runtime`: execute health checks in parallel [basmasking](#)
- \[[`3332a6d`](https://github.com/MaskingTechnology/jitar/commit/3332a6d)] `runtime`: handle exceptions from health checks [basmasking](https://github.com/MaskingTechnology/jitar/pull/312)
- \[[`b58bc84`](https://github.com/MaskingTechnology/jitar/commit/b58bc84)] `runtime`: added timeout option to health checks [basmasking](https://github.com/MaskingTechnology/jitar/pull/316)
- \[[`ace16a2`](https://github.com/MaskingTechnology/jitar/commit/ace16a2)] `runtime`: configure active health checks [basmasking](https://github.com/MaskingTechnology/jitar/pull/317)
- \[[`5b100c8`](https://github.com/MaskingTechnology/jitar/commit/5b100c8)] `server`: custom serializers support [basmasking](https://github.com/MaskingTechnology/jitar/pull/325)

Bugs:
- \[[`a9af34e`](https://github.com/MaskingTechnology/jitar/commit/a9af34e)] `runtime`: functions can be registered twice [basmasking](https://github.com/MaskingTechnology/jitar/pull/326)
- \[[`2f2f254`](https://github.com/MaskingTechnology/jitar/commit/2f2f254)] `runtime`: middleware not executed properly [petermasking](https://github.com/MaskingTechnology/jitar/pull/342)
- \[[`6e444a0`](https://github.com/MaskingTechnology/jitar/commit/6e444a0)] `server`: incorrect serialization control at the gateway [petermasking](https://github.com/MaskingTechnology/jitar/pull/324)

Chores:
- \[[`46bebfe`](https://github.com/MaskingTechnology/jitar/commit/46bebfe)] `build`: update linter to eliminate returns of await in async functions [basmasking](https://github.com/MaskingTechnology/jitar/pull/318)
- \[[`fe28dbe`](https://github.com/MaskingTechnology/jitar/commit/fe28dbe)] `build`: migrate to lerna 7 [basmasking](https://github.com/MaskingTechnology/jitar/pull/321)
- \[[`5c9754e`](https://github.com/MaskingTechnology/jitar/commit/5c9754e)] `build`: added sonarjs for linting [basmasking](https://github.com/MaskingTechnology/jitar/pull/339)
- \[[`3c829fc`](https://github.com/MaskingTechnology/jitar/commit/3c829fc)] `packaging`: moved @jitar dependencies to devDependencies for jitar  [basmasking](#)

## 0.4.0 (May 31, 2023)

The 0.4.0 release is a major release that focussed on improving the internal structure for improved maintainability, testability, etc.. We also added some new features and fixed some bugs.

The old packages are still available, but marked as deprecated. We recommend to migrate to the new package structure. See the [migration guide](migrations/migrate-from-0.3.x-to-0.4.0.md) for more information.

Restructures:
- \[[`b1dd13d`](https://github.com/MaskingTechnology/jitar/commit/b1dd13d)] `caching`: split from runtime and moved to the `@jitar/caching` package [petermasking](https://github.com/MaskingTechnology/jitar/pull/209)
- \[[`045debe`](https://github.com/MaskingTechnology/jitar/commit/045debe)] `reflection`: split from runtime, added static code analysis and moved to the `@jitar/reflection` package [petermasking](https://github.com/MaskingTechnology/jitar/pull/161)
- \[[`71f6bfb`](https://github.com/MaskingTechnology/jitar/commit/71f6bfb)] `serialization`: split from runtime, added extensibility and moved to the `@jitar/serialization` package [petermasking](https://github.com/MaskingTechnology/jitar/pull/193)
- \[[`d50885c`](https://github.com/MaskingTechnology/jitar/commit/d50885c)] `runtime`: pulled out the caching, serialization and reflection and renamed package to `@jitar/runtime` [petermasking](https://github.com/MaskingTechnology/jitar/pull/216)
- \[[`9cf7b85`](https://github.com/MaskingTechnology/jitar/commit/9cf7b85)] `server`: integrated the new packages and moved to the `@jitar/server-nodejs` package [petermasking](https://github.com/MaskingTechnology/jitar/pull/226)
- \[[`a583b2e`](https://github.com/MaskingTechnology/jitar/commit/a583b2e)] `jitar`: integrated all new packages [petermasking](https://github.com/MaskingTechnology/jitar/pull/229)
- \[[`88af5a7`](https://github.com/MaskingTechnology/jitar/commit/88af5a7)] `server`: removed experimental decorators  [basmasking](https://github.com/MaskingTechnology/jitar/pull/259)
- \[[`bb23970`](https://github.com/MaskingTechnology/jitar/commit/bb23970)] `server`: removed OvernightJS  [basmasking](https://github.com/MaskingTechnology/jitar/pull/252)

New features:
- \[[`5deb4cf`](https://github.com/MaskingTechnology/jitar/commit/5deb4cf)] `creator`: created package [basmasking](https://github.com/MaskingTechnology/jitar/pull/212)
- \[[`f399cca`](https://github.com/MaskingTechnology/jitar/commit/f399cca)] `reflection`: destructuring support [petermasking](https://github.com/MaskingTechnology/jitar/pull/211)
- \[[`b4d0bdb`](https://github.com/MaskingTechnology/jitar/commit/b4d0bdb)] `runtime`: reversed middleware execution order  [petermasking](https://github.com/MaskingTechnology/jitar/pull/294)
- \[[`e02c19a`](https://github.com/MaskingTechnology/jitar/commit/e02c19a)] `runtime`: added support for node clients  [petermasking](https://github.com/MaskingTechnology/jitar/pull/265)
- \[[`ec31062`](https://github.com/MaskingTechnology/jitar/commit/ec31062)] `runtime`: removed the need of import maps  [petermasking](https://github.com/MaskingTechnology/jitar/pull/263)
- \[[`48be7c9`](https://github.com/MaskingTechnology/jitar/commit/48be7c9)] `runtime`: added global runtime types  [petermasking](https://github.com/MaskingTechnology/jitar/pull/258)
- \[[`7777b6d`](https://github.com/MaskingTechnology/jitar/commit/7777b6d)] `runtime`: import file without extension  [petermasking](https://github.com/MaskingTechnology/jitar/pull/254)
- \[[`a1b6f1e`](https://github.com/MaskingTechnology/jitar/commit/a1b6f1e)] `serialization`: added url serializer  [basmasking](https://github.com/MaskingTechnology/jitar/pull/262)
- \[[`38accc9`](https://github.com/MaskingTechnology/jitar/commit/38accc9)] `server`: changed default source location [basmasking](https://github.com/MaskingTechnology/jitar/pull/297)
- \[[`dcca01d`](https://github.com/MaskingTechnology/jitar/commit/dcca01d)] `server`: the --config flag is now mandatory when staring a Jitar instance  [basmasking](https://github.com/MaskingTechnology/jitar/pull/288)
- \[[`050d1a0`](https://github.com/MaskingTechnology/jitar/commit/050d1a0)] `server`: default cache location to .jitar folder  [basmasking](https://github.com/MaskingTechnology/jitar/pull/281)

Bugs:
- \[[`3b171ba`](https://github.com/MaskingTechnology/jitar/commit/3b171ba)] `runtime`: updated the linter configuration [petermasking](https://github.com/MaskingTechnology/jitar/pull/251)
- \[[`7617167`](https://github.com/MaskingTechnology/jitar/commit/7617167)] `security`: secure module loading [petermasking](https://github.com/MaskingTechnology/jitar/pull/243)
- \[[`86731d9`](https://github.com/MaskingTechnology/jitar/commit/86731d9)] `server`: non-string primitive type response [petermasking](https://github.com/MaskingTechnology/jitar/pull/293)

Chores:
- \[[`d95c626`](https://github.com/MaskingTechnology/jitar/commit/d95c626)] `build`: added node 20 to ci pipeline [basmasking](https://github.com/MaskingTechnology/jitar/pull/268)
- \[[`bb4661c`](https://github.com/MaskingTechnology/jitar/commit/bb4661c)] `build`: updated the linter configuration [basmasking](https://github.com/MaskingTechnology/jitar/pull/248)
- \[[`cc99cd36`](https://github.com/MaskingTechnology/jitar/commit/cc99cd36)] `build`: updated ci configuration [basmasking](https://github.com/MaskingTechnology/jitar/pull/241)
- \[[`884ad85`](https://github.com/MaskingTechnology/jitar/commit/884ad85)] `creator`: updated starter templates to new conventions [basmasking](https://github.com/MaskingTechnology/jitar/pull/280)
- \[[`4fc2311`](https://github.com/MaskingTechnology/jitar/commit/4fc2311)] `creator`: removed --experimental-fetch flag [petermasking](https://github.com/MaskingTechnology/jitar/pull/215)
- \[[`b6a62f9`](https://github.com/MaskingTechnology/jitar/commit/b6a62f9)] `examples`: added new examples (concepts) [basmasking](https://github.com/MaskingTechnology/jitar/pull/277)
- \[[`bf4d7da`](https://github.com/MaskingTechnology/jitar/commit/bf4d7da)] `examples`: new full-stack example (contact list) [petermasking](https://github.com/MaskingTechnology/jitar/pull/255)
- \[[`328ffd1`](https://github.com/MaskingTechnology/jitar/commit/328ffd1)] `jitar`: updated the roadmap [petermasking](https://github.com/MaskingTechnology/jitar/pull/247)
- \[[`d5238cc`](https://github.com/MaskingTechnology/jitar/commit/019ec62)] `packaging`: configure rollup for jitar [basmasking](https://github.com/MaskingTechnology/jitar/pull/261)
- \[[`61dc57e`](https://github.com/MaskingTechnology/jitar/commit/61dc57e)] `templates`: use react hooks [petermasking](https://github.com/MaskingTechnology/jitar/pull/257)
- \[[`019ec62`](https://github.com/MaskingTechnology/jitar/commit/019ec62)] `website`: overhaul of the website [petermasking](https://github.com/MaskingTechnology/jitar/pull/260)

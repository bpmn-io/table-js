# Changelog

All notable changes to [table-js](https://github.com/bpmn-io/table-js) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 9.2.0

* `DEPS`: support `diagram-js@15.1.0`

## 9.1.0

* `DEPS`: support `diagram-js@14`

## 9.0.0

* `DEPS`: update to `didi@10`
* `DEPS`: update to `diagram-js@12`

## 8.0.2

* `DEPS`: support `diagram-js@12`

## 8.0.1

* `DEPS`: bump to `diagram-js@11.3.0` (peer dependency)

## 8.0.0

_Library target changed to ES2018, cf. [blog post](https://bpmn.io/blog/posts/2022-migration-to-es2018.html)._

* `DEPS`: bump to `diagram-js@9` (peer dependency)
* `DEPS`: bump to `didi@9`
* `DEPS`: bump `min-dom` and `min-dash`

## 7.3.0

* `DEPS`: bump to `didi@8`
* `DEPS`: bump to `diagram-js@8` (peer dependency)
* `DEPS`: bump `min-dom` and `min-dash`

## 7.2.0

* `FEAT`: fire event on container scroll ([#40](https://github.com/bpmn-io/table-js/pull/40))

## 7.1.0

* `CHORE`: bump to `diagram-js@7.2`
* `CHORE`: bump to `inferno@5.6`

## 7.0.0

* `CHORE`: bump to `diagram-js@7`

## 7.0.0-alpha.0

* `FEAT`: wrap table element in a container ([#36](https://github.com/bpmn-io/table-js/pull/36))
* `FIX`: fix context menu position ([#36](https://github.com/bpmn-io/table-js/pull/36))

### Breaking Change

* table element now wrapped in an additional container which might affect your styles

## 6.1.0

* `FEAT`: allow to align context menu via `position#align` ([#33](https://github.com/bpmn-io/table-js/pull/33))

## 6.0.3

_Republish of `v6.0.2`._

## 6.0.2

* `CHORE`: mark as compatible with `diagram-js@6`

## 6.0.1

* `FIX`: correctly position context menu on scrolled table ([ddd59e6](https://github.com/bpmn-io/table-js/commit/ddd59e6009a30422732eae56f0dee7466f99943a))
* `FIX`: auto-close context menu only when clicked outside of menu ([8f29911](https://github.com/bpmn-io/table-js/commit/8f29911d5ee7152552661f78aaa77a784ad38712))

## 6.0.0

* `CHORE`: bump dependencies
* `CHORE`: require `diagram-js@4`
* `CHORE`: update to `babel@7`

### Breaking Change

* `diagram-js@4` is required

## 5.1.0

* `CHORE`: mark as compatible with `diagram-js@3`

## 5.0.3

* `FIX`: allow `ChangeSupport` to react to element id changes ([#19](https://github.com/bpmn-io/table-js/issues/19))

## 5.0.2

* `FIX`: correct focus handling on `[type=number]` inputs

## 5.0.1

* `FIX`: correct focus handling on IE 11 ([`828b3e46`](https://github.com/bpmn-io/table-js/commit/828b3e4656d1ae2d749ed3ab2e447d6388bd634e))

## 5.0.0

_Republish of `5.0.0-x`._

## 5.0.0-0

* `FEAT`: transpile to ES5 + ES modules
* `CHORE`: make `inferno` a peer dependency

## 4.3.2

* `FIX`: bumb to `inferno@5.0.5`

## 4.3.1

* `FIX`: correct context menu positioning when scrolling table ([`ef1ec085`](https://github.com/bpmn-io/table-js/commit/ef1ec08579125f8b70988173fd27166970f243f9))

## ...

Check `git log` for earlier history.

filecoin-browse-asks
====================

## Status

This repository is in a **frozen** state. It is not being maintained or kept in sync with the libraries it depends on. This library was designed for an early version of _go-filecoin_, which is now known as [Venus](https://venus.filecoin.io/). An API client for Lotus can be found at https://github.com/filecoin-shipyard/js-lotus-client-rpc that may be used to build similar functionality. Even though work on this repository has been **shelved**, anyone interested in updating or maintaining this library should express their interest on one Filecoin community conversation mediums: <https://github.com/filecoin-project/community#join-the-community>.

---

A simple command line tool to view the available Filecoin asks
on the network.

![Demo GIF](filecoin-browse-asks.gif)

# Install

```
npm install -g filecoin-browse-asks
```

Or just try it out without installing:

```
npx filecoin-browse-asks
```

# Implementation

* Built with [React](https://reactjs.org/) and [Ink](https://github.com/vadimdemedes/ink)
* Uses [js-filecoin-api-client](https://github.com/filecoin-project/js-filecoin-api-client)

# License

MIT/Apache-2 ([Permissive License Stack](https://protocol.ai/blog/announcing-the-permissive-license-stack/))


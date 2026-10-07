# NOMAD for Hermes Desktop

Sidebar access to a [Project NOMAD](https://github.com/Crosstalk-Solutions/project-nomad) Command Center from the Hermes desktop app — one click from where you already work, with an embedded view and a browser escape hatch.

Desktop-only plugin (single `plugin.js`, no Python backend, no build step). It adds:

- a **NOMAD** row in the left sidebar (below Tasks / Artifacts)
- a `/nomad` page embedding the Command Center via the SDK's sandboxed frame
- an **Open in browser** button, always visible — NOMAD ships `X-Frame-Options: DENY`, so if the sandboxed embed is refused the page degrades to the link instead of a blank frame
- two ⌘K palette commands: *Abrir NOMAD* / *Abrir NOMAD en navegador*
- an online/offline status dot (favicon probe against the Command Center URL)
- Spanish UI strings with English fallback

## Install

From GitHub with the Hermes plugin installer:

```bash
hermes plugins install scolfbrain-source/hermes-nomad-plugin --enable
```

Or in the desktop app: ⌘K → **Capabilities → Plugins → Install from Git** → paste this repo's URL → check the **Desktop** target.

If the row doesn't appear right away, run **Reload desktop plugins** from ⌘K.

## Configure

The Command Center URL is a single constant at the top of [`plugin.js`](plugin.js):

```js
const BASE = 'http://192.168.1.142:8086'
```

Point it at your own NOMAD instance and reload. The plugin performs no configuration calls and stores nothing.

## What it needs

- A reachable Project NOMAD install on your LAN (any host/port; default here is sbrain `:8086`)
- NOMAD has **no authentication by design** — keep it on a trusted network, never exposed to the internet
- Works with any Hermes connection (local or remote gateway); the plugin only loads in the desktop app, per machine

## Quiet about your data

No telemetry, no analytics, no model calls. The plugin renders an iframe and probes one favicon URL for the status dot. Nothing else leaves the page.

## Development

Plain ESM, loaded uncompiled — `jsx()` calls, no JSX syntax. Only `@hermes/plugin-sdk`, `react` and `react/jsx-runtime` imports are allowed. Hot-reloads on save from the app's `desktop-plugins/` folder.

MIT.

# traxy docs

Public, user-facing Mintlify documentation for [docs.traxy.ai](https://docs.traxy.ai).

## Release status: upcoming app release

This branch prepares documentation for the local app's Agent, Campaigns, Inbox,
Tracking, saved views, integration routes, and pipeline-capacity experience.
**Do not publish it ahead of the corresponding application release.** It is a
local release-preparation commit, not an assertion that these features are live.
Mintlify can publish automatically when its connected branch is pushed.

Research snapshot (2026-10-25):

- Frontend: `3b2486e5`, `feat/agent-posts-feed-style`.
- Backend: `749a2e47`, `development`.
- Docs baseline: `9df5bc3`, incorporating the 15 upstream commits missing from
  the original local checkout, including API updates and the refund-policy fix.
- Latest successful production Deploy runs observed during preparation:
  [frontend 40020655973](https://github.com/Windmill-Growth/trace-frontend/actions/runs/40020655973)
  at `b037cdf7` and
  [backend 40016348833](https://github.com/Windmill-Growth/trace-backend/actions/runs/40016348833)
  at `b7d1caec`. Those revisions still contain the older product experience.
  These are workflow observations, not an application-health test.

## Before publishing

1. Verify the production frontend and backend release contains the documented
   experience and public contract. Confirm relevant workspace access gates.
2. Preview the docs with a matching app revision and verify: onboarding to Agent;
   targeting and discovery; saved views; campaign test and launch; sender setup;
   sequence and Inbox; routing; calendar attribution; plan and billing controls.
3. Re-run the checks below against that backend revision. Verify scope lists,
   tool count, protocol versions, pagination, and error envelopes as well as the
   OpenAPI copy and endpoint navigation.
4. Review the existing refund policy with its owner if checkout terms change.
   This documentation change preserves that policy's substantive terms.
5. Publish only after the app release and documentation review are complete.

The canonical conversion specification still labels the capacity changes staged.
The backend API prose also has stale statements: 46 tools instead of the 50
public catalog entries, older role names/restrictions, and default contact-scope
wording that differs from the key-creation defaults. The guide therefore tells
readers to inspect actual selected scopes and permission previews rather than
copying those claims. The OpenAPI copy follows the backend artifact and public
route schemas. `scripts/public-openapi.mjs` makes explicit public-documentation
corrections: lowercase branding, workspace terminology, production server only,
public origin/rate-limit descriptions, supported protocol versions, the runtime's
four engagement types (including `POST_AUTHOR`), nullable signal objects, and
unique alias summaries so generated endpoint URLs do not collide.
Wire field names and paths stay intact. Public tool coverage is checked against
the catalog with `agentOnly` entries excluded. No backend or frontend files are
changed here.

## Structure

- **Using traxy:** getting started, Agent, discovery, leads, campaigns,
  conversations, reporting, workspace management, playbooks, troubleshooting.
- **Integrations:** routing, provider setup, AI clients, calendars, audiences.
- **API & MCP:** authentication, pagination/errors, workspace selection, public
  tools, and OpenAPI endpoint groups.

Old guide URLs redirect directly to their replacement. Historical walkthroughs
and unavailable feature guides are retained under `drafts/previous-release/`,
excluded by `.mintignore`; their videos have not been represented as current.
Do not restore them to navigation without reviewing the recordings themselves.

## Preview and validation

Use Node.js 24. The npm scripts pin Mintlify so local checks use the same CLI.

```bash
npm run check
node scripts/check-docs.mjs /path/to/trace-backend
npm run validate
npm run check:links
npm run dev
```

The optional backend argument checks the OpenAPI public projection, MCP tool
catalog, scopes, and protocol versions. The base check verifies page metadata,
navigation, direct internal links,
redirect destinations, all public operations, and obvious internal/editor
references. Mintlify validates MDX and its own configuration and link behavior.

## Contribution rules

Follow `AGENTS.md`. Keep public pages free of internal release notes, architecture,
private data, and unfinished features. Use `traxy`, `workspace`, `member`, and
`admin`. Keep generated API names intact. Do not publish from a release-preparation
branch before the matching application release. The maintainer README and scripts
are excluded from Mintlify publication.

# traxy docs

Public, user-facing Mintlify documentation for [docs.traxy.ai](https://docs.traxy.ai).

## Publication snapshot

The owner requested publication of the refreshed docs to `main` on 2026-10-26.
This supersedes the earlier local-only release hold. Mintlify publishes from the
connected branch; verify the public site after pushing, not only Git status.

Sources reviewed:

- Frontend: `21787176`, `feat/new-navigation`, including the local working-tree
  updates to navigation, saved views, lead selection, and the ICP review dialog.
  Those working-tree changes were read only; they were not committed or shipped
  by this docs task.
- Backend: `5613df49`, `feat/product-walkthrough`.
- Previous docs snapshot: `3924e36`, based on upstream `9df5bc3`.

This is evidence of documentation/source alignment, not confirmation of a
production app rollout. The latest successful backend production Deploy observed
was still [40016348833](https://github.com/Windmill-Growth/trace-backend/actions/runs/40016348833)
at `b7d1caec` on October 23. The navigation guide includes earlier labels to help
members whose workspace still uses them.

## Release checks

1. Compare changed public workflows with the current app source, including local
   edits when the owner explicitly requests them. Keep unfinished and internal
   surfaces out of public pages.
2. Run the checks below against the matching backend checkout. Verify scope
   lists, tool count, protocol versions, pagination, errors, and endpoint routing.
3. Preview changed documentation and confirm old guide URLs still redirect.
4. After an authorized push, verify the exact remote commit and the public site.
   Report docs publication separately from application deployment.
5. Recheck screenshots or walkthrough recordings before restoring archived
   content. Review the refund policy with its owner if checkout terms change.

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

- **Using traxy:** getting started, trax, discovery, leads, campaigns,
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
`admin`. Keep generated API names intact. Publish only when authorized by the owner.
The maintainer README and scripts
are excluded from Mintlify publication.

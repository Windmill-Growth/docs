# traxy docs

Public, user-facing Mintlify documentation for [docs.traxy.ai](https://docs.traxy.ai).

## Documentation audit — November 11, 2026

The owner authorized pushing this refresh to `main` on November 11, 2026.
It updates the October 26 docs baseline (`031b667`) against the requested local app code,
the source used by successful production deployments, and the connected app.

### Evidence reviewed

| Source | Revision or evidence |
| --- | --- |
| Local frontend | `03a010aa22cae9d840d9dab6bb172a25803f1c96` in `/Users/benbuaron/dev/container/trace-frontend` |
| Local backend | `763b11499c0fc6d78bd01b787782b31e794e3b0a` in `/Users/benbuaron/dev/container/trace-backend` |
| Production frontend source | `062153723fde8dba1ebe19dfe12d2e484fed56e3`, successful [production deployment](https://github.com/Windmill-Growth/trace-frontend/actions/runs/43074320988) |
| Production backend source | `c29ad07fbb2b97edbe77c293239842d76ee1cba2`, successful [production deployment](https://github.com/Windmill-Growth/trace-backend/actions/runs/43072895680) |
| Connected production app | Lead navigation, targeting criteria, intent signals, LinkedIn activity controls, settings, blocklist, integration cards, and the ChatGPT/Codex connection page |
| Public API and MCP | Backend contract guide, OpenAPI artifact, route schemas, assembled workspace-tool catalog, MCP visibility rules, scopes, protocol versions, and error handling |

The local checkouts are behind the successful production releases. Production
source snapshots were read separately, without changing either app checkout.
Deployment evidence comes from successful release/traffic-promotion jobs; direct
Cloud Run inspection was unavailable because the local cloud session required
reauthentication. Browser observations confirm the inspected screens, not every
workflow. No outreach, campaign launch, purchase, or production data mutation was
performed for this audit.

### Gaps corrected

| Area | Documentation update |
| --- | --- |
| Navigation and targeting | Current Intent signals, Single posts, Sender accounts, Discovery runs, account-menu settings/tour, and trax activity locations; strictness presets and advanced Required/Preferred criteria |
| Discovery | LinkedIn profile views, followers, connections, and company-page collection; separate guide for LinkedIn activity |
| Companies | New company-view guide covering matching people, company panels, Meta ads/traffic checks, filters, and saved-view checks |
| Leads | Dynamic filter views versus fixed audiences saved by trax; manual contacts; prospective automatic enrichment and separate historical email lookup; explicit export selection and status behavior |
| Campaigns and conversations | Public campaign builder, audience fallback, sequence/sender setup, saved-draft and launch checks, approval behavior, sender collection versus sending, inbox controls, and Slack replies |
| Workspace controls | People and company blocklists, hiding versus deletion, and the CSV-export exception |
| Integrations | Current AI-client cards, ChatGPT/Codex setup, supported external-client campaign actions, direct Ordinal setup path, and audience requalification |
| API and MCP | 234 public MCP tools instead of 50, exact per-tool scope combinations, watchlist filters/totals, profile analytics totals, account identifiers, and the optional audience requalification request |
| Maintenance checks | Runtime catalog comparison includes imported/helper-created tools and excludes feature-gated entries; scope combinations are checked per tool; existing generated account-reference URLs remain stable |

The review covered all existing navigation groups. Durable guidance for unchanged
workflows was retained. The site now has 68 MDX pages, 42 redirects, 42 REST
operations, 20 scopes, and two supported MCP protocol versions. The 234-tool count
is the public catalog before connection-specific scope and role filtering;
`tools/list` remains authoritative for an individual connection.

### Remaining follow-ups

- **Product naming:** the production integration card says **ChatGPT**, while its
  destination heading and setup steps say **Codex**. The guide explains the current
  path; the app still needs consistent labels.
- **Upstream contract prose:** reconcile the backend guide's 230-tool count and
  default-contact-scope statements with the actual public source. The
  docs follow the assembled catalog, permission checks, and key-creation defaults.
  Update the canonical conversion specification's staged-status wording too.
- **Recordings:** review or replace historical walkthrough videos before restoring
  them. They remain archived and excluded from publication.
- **Release verification:** verify the remote commit, deployed docs, and generated
  reference URLs after the authorized push. Documentation publication is separate
  from application deployment; this refresh does not change production app code.

Feature-gated/internal surfaces were not promoted into public workflow guides.
The public MCP reference follows the server's actual exposure rules even when a
related app surface has different availability. Role, scope, and capability
checks still apply to individual calls.

## Release checks

1. Compare changed public workflows with the current production source and app.
   Keep unfinished and internal surfaces out of public pages.
2. Run the checks below against the matching backend checkout. Verify scope
   lists, tool count, protocol versions, pagination, errors, and endpoint routing.
3. Preview changed documentation and confirm old guide URLs still redirect.
4. After an authorized push, verify the exact remote commit and the public site.
   Report docs publication separately from application deployment.
5. Review the refund policy with its owner if checkout terms change.

`scripts/public-openapi.mjs` projects the backend artifact into public docs:
lowercase branding, workspace terminology, production server only, public
origin/rate-limit descriptions, protocol versions, supported engagement types,
nullable signals, and stable unique summaries for generated endpoint routes.
Wire field names and paths stay intact.

## Structure

- **Using traxy:** getting started, trax, discovery, leads, campaigns,
  conversations, reporting, workspace management, playbooks, troubleshooting.
- **Integrations:** routing, provider setup, AI clients, calendars, audiences.
- **API & MCP:** authentication, pagination/errors, workspace selection, public
  tools, and OpenAPI endpoint groups.

Old guide URLs redirect directly to their replacement. Historical walkthroughs
and unavailable feature guides are retained under `drafts/previous-release/`,
excluded by `.mintignore`; their videos are not represented as current.

## Preview and validation

Use Node.js 24. The npm scripts pin Mintlify so local checks use the same CLI.

```bash
npm run check
node scripts/check-docs.mjs /path/to/trace-backend
npm run validate
npm run check:links
npm run dev
```

The optional backend comparison requires that checkout's dependencies, including
`tsx`, and its normal environment configuration. Supply required environment
values through your local shell or Node's `--env-file`; never commit them here.
The check imports the assembled catalog definitions without constructing services
or executing tools. It compares OpenAPI, public tool names and scope combinations,
all scopes, and protocol versions.

The base check verifies page metadata, navigation, direct internal links,
redirect destinations, all public operations, and obvious internal/editor
references. Mintlify validates MDX and its own configuration and link behavior.

November 11 validation: `npm run check`, exact production-backend parity,
`npm run validate`, and `npm run check:links` passed. The parity check covered
234 tools, 20 scopes, two protocols, and all 42 REST operations. These are
source/build checks, not transactional end-to-end production tests. Local preview
checks also confirmed the new company guide, all 234 rendered MCP tool rows, and
the existing generated account-reference route.

## Contribution rules

Follow `AGENTS.md`. Keep public pages free of internal release notes, architecture,
private data, and unfinished features. Use `traxy`, `workspace`, `member`, and
`admin`. Keep generated API names intact. Publish only when authorized by the owner.
The maintainer README and scripts are excluded from Mintlify publication.

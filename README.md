# traxy docs

Public, user-facing Mintlify documentation for [docs.traxy.ai](https://docs.traxy.ai).

## Documentation audit — November 17, 2026

This refresh compares the November 11 published baseline (`e9e09f0`) with the
source used by the latest successful production deployments below. The owner
authorized committing and pushing this refresh to `main` on November 17, 2026.
Documentation publication does not change application code.

### Evidence reviewed

| Source | Revision or evidence |
| --- | --- |
| Production frontend | `40e233e6aa0834c73872a5a5bbe5f64550ced9a9`; [successful release and live-traffic validation](https://github.com/Windmill-Growth/trace-frontend/actions/runs/44096632680) |
| Production backend | `941b75a638e85b7e1952b0937916e13c5ecb8b9a`; [successful rollout and promotion](https://github.com/Windmill-Growth/trace-backend/actions/runs/44090675010) |
| Previous production baseline | Frontend `062153723fde8dba1ebe19dfe12d2e484fed56e3`; backend `c29ad07fbb2b97edbe77c293239842d76ee1cba2` |
| Live app | Read-only observation of the production Insights screen, its navigation, filters, metrics, and individual-card error state |
| Live public catalog | `GET https://api.traxy.ai/api/v1/pricing/catalog`; existing plan features and flat phone add-on were still served at audit time |
| Public API and MCP | Canonical guide, OpenAPI, route schemas, serializers, assembled catalog, visibility/permission checks, protocols, pagination, and error mapping |

Source archives were inspected separately from the developer's app checkouts.
The frontend delta was compared across complete source archives rather than the
GitHub compare endpoint's limited file list. The frontend and backend commercial
specifications are byte-identical. A later backend redeploy of the same source SHA
was in progress when release history was read; the baseline above already had a
successful production promotion.

Deployment evidence comes from completed release and traffic-promotion jobs,
not a direct Cloud Run traffic inspection. Browser evidence is limited to Insights;
other workflows were checked against deployed source, not exercised end to end.
No outreach, campaign launch, purchase, or production data mutation was performed.

### Gaps corrected

| Area | Documentation update | Owning source reviewed |
| --- | --- | --- |
| Onboarding | Conversation with trax, website/description paths, strictness, targeting, tracking selection, posts, optional campaign template, checkout confirmation | Commercial specification: Onboarding with trax; frontend `components/onboarding/trax/` |
| Lead audiences | Match all/any, one level of groups, field selection, fixed selections, saved versus URL rules | Backend business logic: Saved lead views; frontend `LeadRulesFilterBar.tsx` |
| Campaigns | One campaign per list, status exclusions, occupied-stage filters, per-channel sender readiness, editing every step, changing a paused campaign's sequence | Campaign business rules; frontend campaign builder and sequence panels |
| Sequences | Public templates and campaign sequence choices | Frontend sequence pages and removal of manual-Outbound gates; backend route gates |
| Slack | Campaign approval channels, each-message/batched review, rewriting, conflict handling, and new-approval notification boundary | Backend business logic: Slack campaign approvals; campaign settings UI |
| Insights | Period/teammate scope, usage versus visible counts, acted-on leads, LinkedIn campaign results, source rankings, and partial failures | Live screen; frontend `components/insights/`; backend Insights aggregates |
| Sender accounts | Post-connection sending setup, Google Workspace domain setup, removal impact and paused leads | Frontend sender setup and removal dialogs; sender business rules |
| Tracking and capacity | Post scan progress, new versus existing leads, current-period bonus display | Frontend `TrackingPostPanel.tsx`, capacity split, and billing usage |
| trax settings | Removed daily brief; documented archived-chat restoration and progress steps | Agent settings UI, retired brief routes, step-progress behavior |
| API and MCP | 233 public tools; lead-field discovery; post-engager preview; polling quotes; saved comment text; temporary post-data errors | Public Customer API/MCP source and canonical artifacts |
| Maintenance | Public catalog checker excludes paused tools as well as feature-gated tools | `canUseWorkspaceTool` and MCP discovery tests |

All existing navigation groups were considered. Unchanged guidance was retained.
No routes were added or removed: 68 MDX pages, 42 redirects, and 42 REST operations
remain in navigation. The current contract has 20 scopes and two MCP protocol
versions. The 233-tool count is before connection-specific role and scope
filtering; `tools/list` remains authoritative for each connection.

### Remaining follow-ups and boundaries

- **Product naming:** the integration card still says **ChatGPT**, while its
  destination says **Codex**. Current guides retain the verified navigation path.
- **Canonical prose:** the backend commercial specification still describes
  Pricing v2 as not deployed and retains older onboarding wording elsewhere.
  Its specific Onboarding with trax section and current production implementation
  establish the new setup flow. The API guide's catalog count and default contact
  permission prose also need reconciliation with the assembled public source.
- **Restricted or disabled work:** HubSpot, purchased mailboxes, Instagram
  senders, and lead automation remain gated; social agentic search is paused.
  Do not promote those surfaces into public guides. New plan-limit, sender-add-on,
  and metered-phone code is not evidence of launch: the live pricing catalog still
  returns the existing offer. Recheck runtime availability before documenting it.
- **Recordings:** historical walkthroughs remain archived and excluded from
  publication until reviewed or replaced.
- **Publication:** after an authorized push, verify the exact remote commit,
  Mintlify deployment, changed guides, and generated reference URLs.

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

November 17 validation: production-backend parity passed for 233 public tools,
20 scopes, two protocols, and 42 REST operations. Mintlify build validation and
broken-link checks passed. These are source/build checks, not transactional
end-to-end production tests. Catalog imports use inert local test configuration
and do not construct services or execute tools.

Local preview checks confirmed the Insights layout, the renamed settings guide,
onboarding, audience rules, campaigns, Slack, sender setup, post tracking, and
Ordinal polling guidance. The MCP reference renders the current count and added
tools without the retired daily-brief tools. Existing generated account-reference
URLs remain unchanged.

## Contribution rules

Follow `AGENTS.md`. Keep public pages free of internal release notes, architecture,
private data, and unfinished features. Use `traxy`, `workspace`, `member`, and
`admin`. Keep generated API names intact. Publish only when authorized by the owner.
The maintainer README and scripts are excluded from Mintlify publication.

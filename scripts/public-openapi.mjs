import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// The backend artifact is authoritative alongside its public route schemas.
// Keep these explicit corrections reviewable; never copy private runtime text.
export function publicOpenApi(backend) {
  let spec = readFileSync(join(backend, 'docs/api/customer-api-mcp-v1.openapi.yaml'), 'utf8');
  const schemas = readFileSync(join(backend, 'src/modules/customer-api/customer-api.schemas.ts'), 'utf8');
  const constants = readFileSync(join(backend, 'src/modules/customer-api/customer-api.constants.ts'), 'utf8');
  const engagementBlock = schemas.match(/const leadEngagementTypeSchema = z.enum\(\[([\s\S]*?)\]\)/);
  if (!engagementBlock) throw new Error('Cannot find public engagement types');
  const engagementTypes = [...engagementBlock[1].matchAll(/'([^']+)'/g)].map(match => match[1]);
  const limits = [...schemas.matchAll(/z.array\(leadEngagementTypeSchema\).max\((\d+)\)/g)].map(match => Number(match[1]));
  if (!limits.length || new Set(limits).size !== 1) throw new Error('Review public engagement filter limits');
  const protocols = [...constants.matchAll(/export const CUSTOMER_MCP_PROTOCOL_VERSION_\d{4}_\d{2}_\d{2} = '([^']+)'/g)].map(match => match[1]).sort().reverse();
  if (!protocols.length) throw new Error('Cannot find public MCP protocols');

  spec = spec
    .replace(/(?<![\w-])Traxy(?![\w-])/g, 'traxy')
    .replace(/\bcredential organization\b/g, 'credential workspace')
    .replace(/\bkey organization\b/g, 'key workspace')
    .replace(/\bcross-organization\b/g, 'cross-workspace')
    .replace('  - url: http://localhost:4000/api/v1\n    description: Local development\n', '')
    .replace('Browser origins must match CUSTOMER_API_MCP_ALLOWED_ORIGINS.', 'Requests from a browser origin must come from an origin allowed by traxy. Non-browser clients can omit this header.')
    .replace('Customer API rate limit exceeded. Production-like runtimes fail closed with this response if the distributed limiter is unavailable.', 'Customer API rate limit exceeded or rate-limit enforcement is temporarily unavailable. Retry after the delay in Retry-After.')
    .replace('Opaque refresh token. Store securely; traxy stores only a hash.', 'Opaque refresh token. Store securely.')
    .replace('Use 2025-11-25. The header may be omitted until protocol negotiation completes during initialize.', `Use the version negotiated during initialize (${protocols.join(' or ')}). The header may be omitted until negotiation completes.`)
    .replace(/enum: \[LIKE, COMMENT, REPOST(?:, POST_AUTHOR)?\]/g, `enum: [${engagementTypes.join(', ')}]`)
    .replace(/Comma-separated engagement types\. Accepts up to (?:three|four|\d+) values\./, `Comma-separated engagement types. Accepts up to ${limits[0]} values.`)
    // OpenAPI 3.0 nullable needs an explicit type on these allOf wrappers.
    .replace(/(        signal:\n)(          nullable: true\n)/g, '$1          type: object\n$2');
  // Mintlify derives page URLs from summaries. Alias operations need unique
  // summaries or two sidebar entries silently open the same endpoint page.
  const aliasSummaries = new Map([
    ['/customer/icp/active', 'Get active ICP configuration through the active alias.'],
    ['/customer/content/feed', 'List content feed posts through the nested alias.'],
    ['/customer/integrations/status', 'Get integration status through the status alias.'],
    ['/customer/integrations/lead-delivery-state', 'Get lead delivery state by query.'],
  ]);
  spec = spec.replace(/^  (\/[^:]+):\n[\s\S]*?(?=^  \/|^components:)/gm, (block, route) => {
    const summary = aliasSummaries.get(route);
    return summary ? block.replace(/^      summary: .+$/m, `      summary: ${summary}`) : block;
  });
  return spec;
}

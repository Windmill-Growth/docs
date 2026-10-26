import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { publicOpenApi } from './public-openapi.mjs';

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(readFileSync(join(root, 'docs.json'), 'utf8'));
const errors = [];
const pages = new Set();
const navigatedPages = new Set();
const operations = [];
const ignored = new Set(['.git', '.agents', '.claude', '.github', 'node_modules', 'drafts', 'scripts']);
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (ignored.has(entry.name) || entry.name.startsWith('.')) return [];
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : path.endsWith('.mdx') ? [path] : [];
  });
}
const mdxFiles = files(root);
for (const file of mdxFiles) pages.add(relative(root, file).replace(/\.mdx$/, ''));
function visit(value) {
  if (Array.isArray(value)) return value.forEach(visit);
  if (!value || typeof value !== 'object') return;
  for (const [key, entry] of Object.entries(value)) {
    if (key === 'pages') for (const page of entry) {
      if (typeof page !== 'string') continue;
      if (/^(GET|POST|PUT|PATCH|DELETE) /.test(page)) operations.push(page);
      else {
        navigatedPages.add(page);
        if (!pages.has(page)) errors.push(`Navigation page missing: ${page}`);
      }
    }
    visit(entry);
  }
}
visit(config.navigation);
for (const page of pages) if (!navigatedPages.has(page)) errors.push(`Public page missing from navigation: ${page}`);
const redirects = new Map((config.redirects ?? []).map(item => [item.source, item.destination]));
for (const [source, destination] of redirects) {
  if (redirects.has(destination)) errors.push(`Redirect chain: ${source} -> ${destination}`);
  if (pages.has(source.slice(1))) errors.push(`Redirect shadows a page: ${source}`);
  if (!pages.has(destination.slice(1))) errors.push(`Redirect target missing: ${destination}`);
}
function checkLink(link, from) {
  if (/^(https?:|mailto:|tel:|#)/.test(link)) {
    if (link.startsWith('https://app.mintlify.com/')) errors.push(`${from}: editor link ${link}`);
    return;
  }
  if (!link.startsWith('/')) { errors.push(`${from}: use a root-relative link: ${link}`); return; }
  const path = decodeURI(link.split(/[?#]/)[0]);
  if (redirects.has(path)) { errors.push(`${from}: link directly to ${redirects.get(path)}, not ${path}`); return; }
  if (!pages.has(path.slice(1)) && !existsSync(join(root, path))) errors.push(`${from}: missing target ${link}`);
}
for (const file of mdxFiles) {
  const from = relative(root, file);
  const text = readFileSync(file, 'utf8');
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter || !/^title: .+/m.test(frontmatter[1]) || !/^description: .+/m.test(frontmatter[1])) errors.push(`${from}: title and description are required`);
  const prose = text.replace(/```[^\n]*\n[\s\S]*?```/g, '');
  for (const match of prose.matchAll(/(?:href|src)="([^"]+)"|\]\(([^\s)]+)\)/g)) checkLink(match[1] ?? match[2], from);
  if (/\b(?:trace-frontend|trace-backend)\b|TODO|FIXME/.test(prose)) errors.push(`${from}: internal reference or unfinished content`);
}
const specPath = join(root, 'api-reference/customer-api-mcp-v1.openapi.yaml');
const spec = readFileSync(specPath, 'utf8');
const summaries = [...spec.matchAll(/^      summary: (.+)$/gm)].map(match => match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'));
if (new Set(summaries).size !== summaries.length) errors.push('Duplicate OpenAPI summaries may collide in generated page URLs');
let path;
const specOperations = new Set();
for (const line of spec.split('\n')) {
  const route = line.match(/^  (\/[^:]+):/);
  if (route) path = route[1];
  const method = line.match(/^    (get|post|put|patch|delete):/);
  if (method && path) specOperations.add(`${method[1].toUpperCase()} ${path}`);
}
for (const operation of specOperations) if (!operations.includes(operation)) errors.push(`Operation missing from navigation: ${operation}`);
for (const operation of operations) if (!specOperations.has(operation)) errors.push(`Unknown operation in navigation: ${operation}`);
if (new Set(operations).size !== operations.length) errors.push('Duplicate API operations in navigation');

// Optional parity check against the exact backend checkout being released.
const backend = process.argv[2];
if (backend) {
  const canonical = publicOpenApi(backend);
  if (canonical !== spec) errors.push('OpenAPI differs from the public projection of the supplied backend checkout');
  const catalog = readFileSync(join(backend, 'src/modules/workspace-tools/workspace-tool.catalog.ts'), 'utf8').split('export const WORKSPACE_TOOLS = [')[1];
  const entries = [...catalog.matchAll(/^    name: '(traxy_[^']+)'/gm)];
  const publicTools = entries.filter((entry, index) => !catalog.slice(entry.index, entries[index + 1]?.index).includes('agentOnly: true')).map(entry => entry[1]);
  const toolPage = readFileSync(join(root, 'api-reference/mcp/tools.mdx'), 'utf8');
  const documentedTools = [...toolPage.matchAll(/^\| `(traxy_[^`]+)` \|/gm)].map(match => match[1]);
  for (const tool of publicTools) if (!documentedTools.includes(tool)) errors.push(`Public MCP tool missing: ${tool}`);
  for (const tool of documentedTools) if (!publicTools.includes(tool)) errors.push(`Non-public or removed MCP tool documented: ${tool}`);
  if (new Set(documentedTools).size !== documentedTools.length) errors.push('Duplicate MCP tool rows');
  const statedCount = toolPage.match(/catalog contains (\d+) tools/);
  if (!statedCount || Number(statedCount[1]) !== publicTools.length) errors.push('MCP catalog count is out of date');
  const constants = readFileSync(join(backend, 'src/modules/customer-api/customer-api.constants.ts'), 'utf8');
  const scopeBlock = constants.match(/export const CUSTOMER_API_SCOPE = \{([\s\S]*?)\} as const/);
  if (!scopeBlock) throw new Error('Cannot find canonical public scope catalog');
  const scopes = [...scopeBlock[1].matchAll(/: '([^']+)'/g)].map(match => match[1]);
  const authPage = readFileSync(join(root, 'api-reference/authentication.mdx'), 'utf8');
  const documentedScopes = [...authPage.matchAll(/^\| `([^`]+:[^`]+)` \|/gm)].map(match => match[1]);
  for (const scope of scopes) if (!documentedScopes.includes(scope)) errors.push(`Public scope missing: ${scope}`);
  for (const scope of documentedScopes) if (!scopes.includes(scope)) errors.push(`Unknown public scope: ${scope}`);
  if (new Set(documentedScopes).size !== documentedScopes.length) errors.push('Duplicate scope rows');
  const protocols = [...constants.matchAll(/export const CUSTOMER_MCP_PROTOCOL_VERSION_\d{4}_\d{2}_\d{2} = '([^']+)'/g)].map(match => match[1]);
  const protocolPage = readFileSync(join(root, 'api-reference/mcp/workspaces.mdx'), 'utf8');
  if (!protocols.length) throw new Error('Cannot find supported MCP protocol versions');
  for (const protocol of protocols) if (!protocolPage.includes(`\`${protocol}\``)) errors.push(`MCP protocol missing: ${protocol}`);
  const documentedProtocols = [...protocolPage.matchAll(/`(\d{4}-\d{2}-\d{2})`/g)].map(match => match[1]);
  for (const protocol of documentedProtocols) if (!protocols.includes(protocol)) errors.push(`Unsupported MCP protocol documented: ${protocol}`);
  console.log(`Compared OpenAPI and ${publicTools.length} public MCP tools with ${resolve(backend)}`);
  console.log(`Compared ${scopes.length} scopes and ${protocols.length} protocol versions`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Checked ${pages.size} pages, ${redirects.size} redirects and ${specOperations.size} API operations.`);

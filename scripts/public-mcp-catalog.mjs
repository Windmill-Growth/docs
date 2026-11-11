import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

// Import the assembled catalog, including settings spreads and helper-created
// entries. Source-text matching misses both and cannot evaluate visibility.
// This loads definitions only; it does not construct or call application services.
export function publicMcpCatalog(backend) {
  const cwd = realpathSync(backend);
  const require = createRequire(join(cwd, 'package.json'));
  const marker = 'DOCS_MCP_CATALOG=';
  const source = `
    const module = await import('./src/modules/workspace-tools/workspace-tool.catalog.ts');
    const catalog = module.WORKSPACE_TOOLS ?? module.default?.WORKSPACE_TOOLS;
    if (!Array.isArray(catalog) || !catalog.length) throw new Error('Missing tool catalog');
    console.log('${marker}' + JSON.stringify(catalog.filter(tool => !tool.feature).map(tool => ({
      name: tool.name,
      scopes: [tool.requiredScope, ...(tool.additionalRequiredScopes ?? [])],
    }))));
  `;
  const output = execFileSync(process.execPath, [
    '--import', require.resolve('tsx'), '--input-type=module', '-e', source,
  ], { cwd, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 60_000 });
  const line = output.split('\n').find(line => line.startsWith(marker));
  if (!line) throw new Error('Backend did not return the assembled public MCP catalog');
  const tools = JSON.parse(line.slice(marker.length));
  if (new Set(tools.map(tool => tool.name)).size !== tools.length) {
    throw new Error('Duplicate names in the public MCP catalog');
  }
  return tools;
}

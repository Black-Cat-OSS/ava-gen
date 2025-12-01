const TYPE_MAP = {
  feat: 'Added',
  fix: 'Fixed',
  perf: 'Performance',
  refactor: 'Changed',
  docs: 'Documentation',
  style: 'Style',
  test: 'Testing',
  build: 'Build',
  ci: 'CI',
  chore: 'Chore',
  revert: 'Reverted',
  deprecate: 'Deprecated',
};

const TYPE_ORDER = [
  'Added',
  'Fixed',
  'Changed',
  'Performance',
  'Deprecated',
  'Removed',
  'Security',
  'Documentation',
  'CI',
  'Build',
  'Testing',
  'Style',
  'Chore',
  'Reverted',
];

const SCOPE_ORDER = [
  'api',
  'ui',
  'backend',
  'frontend',
  'db',
  'auth',
  'config',
  'deps',
  'docs',
  'test',
  'build',
  'ci',
  'chore',
  'perf',
  'refactor',
  'style',
  'types',
  'utils',
  'hooks',
  'context',
  'router',
  'i18n',
  'theme',
  'layout',
  'components',
  'pages',
  'widgets',
  'features',
  'entities',
  'shared',
  'changelog',
  'scripts',
];

function getTypeOrder(type) {
  const index = TYPE_ORDER.indexOf(type);
  return index === -1 ? TYPE_ORDER.length : index;
}

function getScopeOrder(scope) {
  if (!scope) return SCOPE_ORDER.length;
  const index = SCOPE_ORDER.indexOf(scope.toLowerCase());
  return index === -1 ? SCOPE_ORDER.length : index;
}

module.exports = {
  preset: 'conventionalcommits',
  releaseCount: 0,
  skipUnstable: false,
  transform: (commit, context) => {
    if (!TYPE_MAP[commit.type]) {
      return null;
    }

    commit.type = TYPE_MAP[commit.type];

    if (commit.scope === '*') {
      commit.scope = '';
    }

    if (typeof commit.hash === 'string') {
      commit.hash = commit.hash.substring(0, 7);
    }

    return commit;
  },
  groupBy: 'type',
  commitGroupsSort: (a, b) => {
    return getTypeOrder(a.title) - getTypeOrder(b.title);
  },
  commitsSort: (a, b) => {
    const scopeOrderA = getScopeOrder(a.scope);
    const scopeOrderB = getScopeOrder(b.scope);

    if (scopeOrderA !== scopeOrderB) {
      return scopeOrderA - scopeOrderB;
    }

    return (a.subject || '').localeCompare(b.subject || '');
  },
  noteGroupsSort: 'title',
  writerOpts: {
    transform: (commit, context) => {
      if (!TYPE_MAP[commit.type]) {
        return null;
      }

      commit.type = TYPE_MAP[commit.type];

      if (commit.scope === '*') {
        commit.scope = '';
      }

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7);
      }

      return commit;
    },
    groupBy: 'type',
    commitGroupsSort: (a, b) => {
      return getTypeOrder(a.title) - getTypeOrder(b.title);
    },
    commitsSort: (a, b) => {
      const scopeOrderA = getScopeOrder(a.scope);
      const scopeOrderB = getScopeOrder(b.scope);

      if (scopeOrderA !== scopeOrderB) {
        return scopeOrderA - scopeOrderB;
      }

      return (a.subject || '').localeCompare(b.subject || '');
    },
    mainTemplate: `# Changelog

{{#each releases}}
  {{#if @first}}
## [{{title}}]{{#if tag.date}} - {{isoDate tag.date}}{{/if}}

{{#each commits}}
{{#if scope}}
- **{{scope}}:** {{subject}}
{{else}}
- {{subject}}
{{/if}}
{{/each}}

{{#each fixes}}
- **{{scope}}:** {{subject}}
{{/each}}

{{#each merges}}
- **{{scope}}:** {{subject}}
{{/each}}

  {{else}}
## [{{title}}]{{#if tag.date}} - {{isoDate tag.date}}{{/if}}

{{#each commitGroups}}
### {{title}}

{{#each commits}}
{{#if scope}}
- **{{scope}}:** {{subject}}
{{else}}
- {{subject}}
{{/if}}
{{/each}}

{{/each}}

{{#each fixes}}
- **{{scope}}:** {{subject}}
{{/each}}

{{#each merges}}
- **{{scope}}:** {{subject}}
{{/each}}

  {{/if}}
{{/each}}
`,
    commitPartial: `{{#if scope}}**{{scope}}:** {{/if}}{{subject}}`,
  },
};

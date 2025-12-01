#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHANGELOG_PATH = path.join(__dirname, '..', 'CHANGELOG.md');
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');

function getRepositoryUrl() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    if (packageJson.repository && packageJson.repository.url) {
      let url = packageJson.repository.url;
      url = url.replace(/\.git$/, '');
      url = url.replace(/^git\+/, '');
      url = url.replace(/^git:/, 'https:');
      return url;
    }
  } catch (error) {
    console.warn('Не удалось получить URL репозитория из package.json');
  }

  try {
    const remoteUrl = execSync('git config --get remote.origin.url', {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
    }).trim();

    if (remoteUrl) {
      let url = remoteUrl.replace(/\.git$/, '');
      url = url.replace(/^git@github\.com:/, 'https://github.com/');
      url = url.replace(/^git@gitlab\.com:/, 'https://gitlab.com/');
      url = url.replace(/^git@bitbucket\.org:/, 'https://bitbucket.org/');
      return url;
    }
  } catch (error) {
    console.warn('Не удалось получить URL репозитория из git config');
  }

  return null;
}

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
  'See Also',
];

const TYPE_EMOJI = {
  Added: '✨',
  Fixed: '🐛',
  Changed: '♻️',
  Performance: '⚡',
  Deprecated: '⚠️',
  Removed: '🗑️',
  Security: '🔒',
  Documentation: '📝',
  CI: '👷',
  Build: '🏗️',
  Testing: '🧪',
  Style: '💄',
  Chore: '🔧',
  Reverted: '⏪',
  'See Also': '📌',
};

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

function getGitTags() {
  try {
    const tags = execSync('git tag --sort=-version:refname', {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
    })
      .trim()
      .split('\n')
      .filter((tag) => tag.trim());

    return tags;
  } catch (error) {
    return [];
  }
}

function getCommitsBetweenTags(fromTag, toTag) {
  try {
    let range;
    if (fromTag && toTag) {
      range = `${fromTag}..${toTag}`;
    } else if (fromTag && !toTag) {
      range = `${fromTag}..HEAD`;
    } else if (!fromTag && toTag) {
      range = toTag;
    } else {
      range = 'HEAD';
    }

    const format = '%H|%s|%an|%ad';

    const output = execSync(`git log ${range} --pretty=format:"${format}" --date=short --no-merges`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
    });

    const commits = [];
    const lines = output.trim().split('\n').filter((line) => line.trim());

    lines.forEach((line) => {
      const parts = line.split('|');
      if (parts.length >= 4) {
        const hash = parts[0];
        const subject = parts[1];
        const author = parts[2];
        const date = parts[3];

        const commitMatch = subject.match(/^(\w+)(?:\(([^)]+)\))?: (.+)$/);
        if (commitMatch) {
          const type = commitMatch[1];
          const scope = commitMatch[2] || null;
          const message = commitMatch[3];

          if (TYPE_MAP[type]) {
            commits.push({
              hash: hash.substring(0, 7),
              fullHash: hash,
              type: TYPE_MAP[type],
              scope,
              subject: message,
              author,
              date,
            });
          }
        } else {
          commits.push({
            hash: hash.substring(0, 7),
            fullHash: hash,
            type: 'See Also',
            scope: null,
            subject: subject,
            author,
            date,
          });
        }
      }
    });

    return commits;
  } catch (error) {
    return [];
  }
}

function getTagDate(tag) {
  try {
    const date = execSync(`git log -1 --format=%ai ${tag}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
    })
      .trim()
      .split(' ')[0];

    return date;
  } catch (error) {
    return null;
  }
}

function groupCommits(commits) {
  const grouped = {};

  commits.forEach((commit) => {
    const type = commit.type || 'Chore';
    const scope = commit.scope || 'others';

    if (!grouped[type]) {
      grouped[type] = {};
    }

    if (type === 'See Also') {
      const seeAlsoScope = 'all';
      if (!grouped[type][seeAlsoScope]) {
        grouped[type][seeAlsoScope] = [];
      }
      grouped[type][seeAlsoScope].push(commit);
    } else {
      if (!grouped[type][scope]) {
        grouped[type][scope] = [];
      }

      grouped[type][scope].push(commit);
    }
  });

  return grouped;
}

function formatCommit(commit, repositoryUrl) {
  const isSeeAlso = commit.type === 'See Also';
  const scope = !isSeeAlso && commit.scope && commit.scope !== 'others' ? `**${commit.scope}:** ` : '';
  const subject = commit.subject || '';
  const hash = commit.hash || '';
  const fullHash = commit.fullHash || '';

  let commitLink = '';
  if (repositoryUrl && fullHash) {
    commitLink = ` ([${hash}](${repositoryUrl}/commit/${fullHash}))`;
  } else if (hash) {
    commitLink = ` (${hash})`;
  }

  return `- ${scope}${subject}${commitLink}`;
}

function generateChangelogContent(releases) {
  const repositoryUrl = getRepositoryUrl();
  let content = '# Changelog\n\n';

  releases.forEach((release) => {
    const version = release.version || 'Unreleased';
    const date = release.date ? ` - ${release.date}` : '';

    content += `## [${version}]${date}\n\n`;

    if (!release.commits || release.commits.length === 0) {
      content += '- Нет изменений\n\n';
      return;
    }

    const grouped = groupCommits(release.commits);

    const sortedTypes = Object.keys(grouped).sort((a, b) => {
      return getTypeOrder(a) - getTypeOrder(b);
    });

    sortedTypes.forEach((type) => {
      const scopes = grouped[type];
      const sortedScopes = Object.keys(scopes).sort((a, b) => {
        return getScopeOrder(a) - getScopeOrder(b);
      });

      const emoji = TYPE_EMOJI[type] || '';
      content += `### ${emoji} ${type}\n\n`;

      if (type === 'See Also') {
        sortedScopes.forEach((scope) => {
          const commits = scopes[scope];
          commits.forEach((commit) => {
            content += formatCommit(commit, repositoryUrl) + '\n';
          });
        });
        content += '\n';
      } else {
        sortedScopes.forEach((scope) => {
          const commits = scopes[scope];

          if (scope === 'others' && commits.length > 0) {
            content += `#### others\n\n`;
          } else if (scope !== 'others') {
            content += `#### ${scope}\n\n`;
          }

          commits.forEach((commit) => {
            content += formatCommit(commit, repositoryUrl) + '\n';
          });

          content += '\n';
        });
      }
    });

    content += '\n';
  });

  return content;
}

function generateReleases(releaseCount = 0) {
  const tags = getGitTags();
  const releases = [];

  const unreleasedCommits = getCommitsBetweenTags(tags[0] || null, null);
  if (unreleasedCommits.length > 0) {
    releases.push({
      version: 'Unreleased',
      date: null,
      commits: unreleasedCommits,
    });
  }

  if (releaseCount === 0) {
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      const previousTag = tags[i + 1] || null;
      const commits = getCommitsBetweenTags(previousTag, tag);
      const date = getTagDate(tag);

      releases.push({
        version: tag.replace(/^v/, ''),
        date,
        commits,
      });
    }
  } else if (releaseCount === 1) {
    if (tags.length > 0) {
      const tag = tags[0];
      const previousTag = tags[1] || null;
      const commits = getCommitsBetweenTags(previousTag, tag);
      const date = getTagDate(tag);

      releases.push({
        version: tag.replace(/^v/, ''),
        date,
        commits,
      });
    }
  } else {
    for (let i = 0; i < Math.min(releaseCount, tags.length); i++) {
      const tag = tags[i];
      const previousTag = tags[i + 1] || null;
      const commits = getCommitsBetweenTags(previousTag, tag);
      const date = getTagDate(tag);

      releases.push({
        version: tag.replace(/^v/, ''),
        date,
        commits,
      });
    }
  }

  return releases;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  let releaseCount = 0;

  if (command === 'version') {
    releaseCount = 1;
  } else if (command === 'all') {
    releaseCount = 0;
  } else {
    const parsed = parseInt(command, 10);
    if (!isNaN(parsed)) {
      releaseCount = parsed;
    } else {
      console.error('Неизвестная команда:', command);
      console.error('Использование: node generate-changelog.js [all|version|N]');
      process.exit(1);
    }
  }

  try {
    console.log('🔄 Генерация changelog...');

    const releases = generateReleases(releaseCount);
    const content = generateChangelogContent(releases);
    fs.writeFileSync(CHANGELOG_PATH, content, 'utf8');
    console.log('✅ CHANGELOG.md обновлен (включая секцию [Unreleased])');
  } catch (error) {
    console.error('❌ Ошибка при генерации changelog:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateChangelog: generateReleases };


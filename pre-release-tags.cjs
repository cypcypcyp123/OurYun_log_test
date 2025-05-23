#!/usr/bin/env node
const { execSync } = require('child_process');

// Configuration constants
const TAG_PREFIX = 'v';
const PRE_RELEASE_PATTERN = '*-pre.*';
const INITIAL_VERSION = 'v1.0.0-pre.0';

// Helper functions
function executeCommand(command, options = {}) {
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    throw error;
  }
}

function getSortedPreTags() {
  const tags = executeCommand(
    `git tag --list "${PRE_RELEASE_PATTERN}" --sort=-version:refname`,
    { encoding: 'utf-8' }
  );
  return tags.split('\n').map(t => t.trim()).filter(Boolean);
}

function createFallbackTag(currentTag) {
  console.log('⚠️  Creating fallback tag for comparison');
  const versionRegex = /v?(\d+)\.(\d+)\.(\d+)-pre\.(\d+)/;
  const match = currentTag.match(versionRegex);
  
  if (!match) return 'v0.0.0-pre.0';
  
  const major = Math.max(0, parseInt(match[1]));
  const minor = Math.max(0, parseInt(match[2]));
  
  if (minor > 0) {
    return `${TAG_PREFIX}${major}.${minor - 1}.0-pre.0`;
  }
  if (major > 0) {
    return `${TAG_PREFIX}${major - 1}.0.0-pre.0`;
  }
  return 'v0.0.0-pre.0';
}

function initializeFirstTag() {
  console.log(`⚠️  No pre-release tags found, initializing with ${INITIAL_VERSION}`);
  executeCommand(`git tag ${INITIAL_VERSION}`);
  executeCommand(`git push origin ${INITIAL_VERSION}`);
  return [INITIAL_VERSION];
}

async function main() {
  try {
    console.log('🔄 Synchronizing remote tags...');
    executeCommand('git fetch --tags');

    let preTags = getSortedPreTags();
    
    if (preTags.length === 0) {
      preTags = initializeFirstTag();
    }

    if (preTags.length < 2) {
      const fallbackTag = createFallbackTag(preTags[0]);
      console.log(`ℹ️  Using temporary comparison tag: ${fallbackTag}`);
      preTags.unshift(fallbackTag);
    }

    const [previousTag, latestTag] = preTags.slice(0, 2);
    console.log(`🕐 Previous pre-release tag: ${previousTag}`);
    console.log(`🔖 Current pre-release tag: ${latestTag}`);

    console.log('🚀 Generating new pre-release version...');
    executeCommand('npx release-it --preRelease=pre --increment=prerelease --no-changelog --no-npm.publish --ci');

    const updatedPreTags = getSortedPreTags();
    if (updatedPreTags.length < 2) {
      throw new Error('Failed to generate new pre-release tag');
    }

    const [newPreviousTag, newLatestTag] = updatedPreTags.slice(0, 2);
    console.log(`🆕 New pre-release tag: ${newLatestTag}`);

    const tagRange = `${newPreviousTag}..${newLatestTag}`;
    console.log(`🔍 Generating changelog for range: ${tagRange}`);

    console.log('📝 Generating and updating changelog...');
    executeCommand(
      `npx release-it --no-git.tag --no-git.commit --no-git.push ` +
      `--no-github.release --plugin.@release-it/conventional-changelog.tagArgument=${tagRange} ` +
      `--no-npm.publish --ci`
    );

    console.log('✅ Pre-release process completed successfully');

  } catch (error) {
    console.error('❌ Script execution failed:', error.message);
    process.exit(1);
  }
}

main();
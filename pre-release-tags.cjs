#!/usr/bin/env node
const { execSync } = require('child_process');

function getPreTags() {
  execSync('git fetch --tags', { stdio: 'inherit' });

  return execSync('git tag --list "v*-pre.*" --sort=-version:refname', { encoding: 'utf-8' })
    .split('\n')
    .map(t => t.trim())
    .filter(t => t.length > 0);
}

try {
  const preTagsBefore = getPreTags();
  if (preTagsBefore.length < 1) {
    console.error('❌ 需要至少一个符合预发布格式的远程 tag 作为基准');
    process.exit(1);
  }
  const baseTag = preTagsBefore[0];
  console.log(`🕐 基准预发布 tag: ${baseTag}`);

  // 这里不要写 --git.tagName 包含 ${preReleaseId}
  execSync('npx release-it --preRelease=pre --increment=prerelease --no-changelog --no-npm.publish --ci', { stdio: 'inherit' });

  const preTagsAfter = getPreTags();
  if (preTagsAfter.length < 2) {
    console.error('❌ 生成新的预发布 tag 失败');
    process.exit(1);
  }

  const latestTag = preTagsAfter[0];
  if (latestTag === baseTag) {
    console.error('❌ 预发布 tag 没有变化，release-it 没有正确生成新版本');
    process.exit(1);
  }
  console.log(`🆕 最新预发布 tag: ${latestTag}`);

  const tagArg = `${baseTag}..${latestTag}`;
  console.log(`🔍 生成 changelog 对比区间: ${tagArg}`);

  process.env['RELEASE_IT_CONVENTIONAL_CHANGELOG_TAG_ARGUMENT'] = tagArg;

  execSync('npx release-it --no-git.tag --no-git.commit --no-git.push --no-github.release --no-npm.publish --ci', {
    stdio: 'inherit',
    env: process.env
  });

  console.log('✅ 预发布流程完成');

} catch (error) {
  console.error('❌ 脚本执行出错:', error.message);
  process.exit(1);
}

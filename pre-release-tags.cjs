#!/usr/bin/env node
const { execSync } = require('child_process');

function getPreTags() {
  // 拉取远程标签，确保本地同步最新tag
  execSync('git fetch --tags', { stdio: 'inherit' });

  // 获取所有符合预发布格式的 tags，用语义版本排序，从新到旧
  return execSync('git tag --list "v*-pre.*" --sort=-version:refname', { encoding: 'utf-8' })
    .split('\n')
    .map(t => t.trim())
    .filter(t => t.length > 0);
}

try {
  // Step 1: 获取远程最新的预发布tag，作为基准
  const preTagsBefore = getPreTags();
  if (preTagsBefore.length < 1) {
    console.error('❌ 需要至少一个符合预发布格式的远程 tag 作为基准');
    process.exit(1);
  }
  const baseTag = preTagsBefore[0];
  console.log(`🕐 基准预发布 tag: ${baseTag}`);

  // Step 2: 用 release-it 生成新的预发布版本，基于远程基准 tag
  console.log('🚀 执行 release-it 生成新的预发布版本...');
  execSync(`npx release-it --preRelease=pre --increment=prerelease --no-changelog --no-npm.publish --ci --git.tagName="v\${version}-pre.\${preReleaseId}" --git.tag=${baseTag}`, { stdio: 'inherit' });

  // Step 3: 获取生成后的最新预发布tag
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

  // Step 4: 生成 changelog 对比区间（只对比 pre-release tag）
  const tagArg = `${baseTag}..${latestTag}`;
  console.log(`🔍 生成 changelog 对比区间: ${tagArg}`);

  // Step 5: 只生成 changelog，跳过 git 操作和 npm 发布
  console.log('📝 生成并更新 changelog...');
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

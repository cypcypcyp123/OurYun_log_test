#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  // 用语义版本排序，获取符合预发布格式的 tags，从新到旧排序
  const preTags = execSync('git tag --list "v*-pre.*" --sort=-version:refname', { encoding: 'utf-8' })
    .split('\n')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (preTags.length < 2) {
    console.error('❌ 需要至少两个符合预发布格式的 tag');
    process.exit(1);
  }

  const latestTag = preTags[0];
  const previousTag = preTags[1];
  console.log(`🕐 上一个预发布 tag: ${previousTag}`);

  // Step 1: 生成新的预发布版本
  console.log('🚀 执行 release-it 生成新的预发布版本...');
  execSync('npx release-it --preRelease=pre --increment=prerelease --no-changelog --no-npm.publish --ci', { stdio: 'inherit' });

  // Step 2: 重新获取最新的两个预发布 tags
  const updatedPreTags = execSync('git tag --list "v*-pre.*" --sort=-version:refname', { encoding: 'utf-8' })
    .split('\n')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const updatedLatestTag = updatedPreTags[0];
  const updatedPreviousTag = updatedPreTags[1];
  console.log(`🆕 新的预发布 tag: ${updatedLatestTag}`);

  // Step 3: 生成 changelog 对比区间（用..代替...，避免潜在语法歧义）
  const tagArg = `${updatedPreviousTag}..${updatedLatestTag}`;
  console.log(`🔍 生成 changelog 对比区间: ${tagArg}`);

  // Step 4: 只生成 changelog，跳过 git/tag/push/github
  console.log('📝 生成并更新 changelog...');
  execSync(`npx release-it --no-git.tag --no-git.commit --no-git.push --no-github.release --plugin.@release-it/conventional-changelog.tagArgument=${tagArg} --no-npm.publish --ci`, {
    stdio: 'inherit'
  });

  console.log('✅ 预发布流程完成');

} catch (error) {
  console.error('❌ 脚本执行出错:', error.message);
  process.exit(1);
}

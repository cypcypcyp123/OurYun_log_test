#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  // Step 1: 先执行 release-it 创建最新的预发布版本（生成新的 pre tag）
  console.log('🚀 执行 release-it 生成新的预发布版本...');
  execSync('npx release-it --preRelease=pre --increment=prerelease --no-changelog --no-npm.publish --ci', { stdio: 'inherit' });

  // Step 2: 获取所有符合预发布格式的 tags，用语义版本排序，从新到旧
  const preTags = execSync('git tag --list "v*-pre.*" --sort=-version:refname', { encoding: 'utf-8' })
    .split('\n')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (preTags.length < 2) {
    console.error('❌ 需要至少两个符合预发布格式的 tag');
    process.exit(1);
  }

  // Step 3: 取最新的两个预发布 tag，用于 changelog 生成
  const latestTag = preTags[0];
  const previousTag = preTags[1];
  console.log(`🕐 上一个预发布 tag: ${previousTag}`);
  console.log(`🆕 最新的预发布 tag: ${latestTag}`);

  // Step 4: 生成 changelog 对比区间（用..连接，避免语法歧义）
  const tagArg = `${previousTag}..${latestTag}`;
  console.log(`🔍 生成 changelog 对比区间: ${tagArg}`);

  // Step 5: 生成 changelog，跳过 git 操作和 npm 发布，避免触发正式版本
  console.log('📝 生成并更新 changelog...');
  // 用环境变量强制传递 tagArgument，确保生效
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

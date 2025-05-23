#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  // 获取所有 tags，按时间升序排列
  const tags = execSync('git tag --sort=creatordate', { encoding: 'utf-8' })
    .split('\n')
    .map(t => t.trim())
    .filter(Boolean);

  // 过滤符合预发布格式的 tag (示例匹配 1.0.0-pre.1 或 v1.0.0-pre.1)
  const preTags = tags.filter(tag => /^v?\d+\.\d+\.\d+-pre\.\d+$/.test(tag));

  if (preTags.length < 2) {
    console.error('❌ 需要至少两个符合预发布格式的 tag');
    process.exit(1);
  }

  const previousTag = preTags[preTags.length - 2];
  console.log(`🕐 上一个预发布 tag: ${previousTag}`);

  // Step 1: 先执行 release-it 生成新的 pre-release 版本，不更新 changelog
  console.log('🚀 执行 release-it 生成新的预发布版本...');
  execSync('npx release-it --preRelease=pre --increment=prerelease --no-changelog --no-npm.publish --ci', { stdio: 'inherit' });

  // Step 2: 获取最新 tag（新的预发布版本）
  const updatedTags = execSync('git tag --sort=creatordate', { encoding: 'utf-8' })
    .split('\n')
    .map(t => t.trim())
    .filter(Boolean)
    .filter(tag => /^v?\d+\.\d+\.\d+-pre\.\d+$/.test(tag));

  const latestTag = updatedTags[updatedTags.length - 1];
  console.log(`🆕 新的预发布 tag: ${latestTag}`);

  // Step 3: 拼接 tag 对比范围
  const tagArg = `${previousTag}...${latestTag}`;
  console.log(`🔍 生成 changelog 对比区间: ${tagArg}`);

  // Step 4: 执行 release-it 只更新 changelog，不推送 tag/commit/github release
  console.log('📝 生成并更新 changelog...');
  execSync(`npx release-it --no-git.tag --no-git.commit --no-git.push --no-github.release --plugin.@release-it/conventional-changelog.tagArgument=${tagArg} --no-npm.publish --ci`, {
    stdio: 'inherit'
  });

  console.log('✅ 预发布流程完成');

} catch (error) {
  console.error('❌ 脚本执行出错:', error.message);
  process.exit(1);
}

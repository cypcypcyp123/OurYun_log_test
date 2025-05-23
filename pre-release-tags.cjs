#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  // 先 fetch 远程 tag，确保本地最新
  console.log('🔄 同步远程 tags...');
  execSync('git fetch --tags', { stdio: 'inherit' });

  // 用语义版本排序，获取符合预发布格式的 tags，从新到旧排序
  let preTags = execSync('git tag --list "v*-pre.*" --sort=-version:refname', { encoding: 'utf-8' })
    .split('\n')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (preTags.length === 0) {
    console.log('⚠️ 没有预发布 tag，初始化打一个 v1.0.0-pre.0');
    execSync('git tag v1.0.0-pre.0');
    execSync('git push origin v1.0.0-pre.0');
    // 重新获取一次 tags
    preTags = ['v1.0.0-pre.0'];
  }

  if (preTags.length < 2) {
    // 如果只有一个 tag，手动制造第二个伪“之前”的 tag，防止后续失败
    console.log('⚠️ 只有一个预发布 tag，临时制造一个比它更早的 tag 用作对比');
    const onlyTag = preTags[0];
    // 解析数字，降级一个版本号，比如 v1.0.0-pre.0 -> v0.9.9-pre.0
    // 简单示范，只降minor版本1
    const match = onlyTag.match(/v?(\d+)\.(\d+)\.(\d+)-pre\.(\d+)/);
    let prevTag = 'v0.0.0-pre.0';
    if (match) {
      const major = parseInt(match[1]);
      const minor = parseInt(match[2]);
      const patch = parseInt(match[3]);
      if (minor > 0) {
        prevTag = `v${major}.${minor - 1}.${patch}-pre.0`;
      } else if (major > 0) {
        prevTag = `v${major - 1}.0.0-pre.0`;
      }
    }
    console.log(`使用临时对比 tag: ${prevTag}`);
    preTags.unshift(prevTag);
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

const { execSync } = require('child_process');

// 获取所有预发布tag，倒序（最新在前）
const tags = execSync('git tag --sort=-creatordate', { encoding: 'utf-8' })
  .split('\n')
  .filter(tag => /^v?\d+\.\d+\.\d+-pre\.\d+$/.test(tag));

if (tags.length < 2) {
  console.error('❌ 至少需要两个预发布 tag 用于比较');
  process.exit(1);
}

// 取第二新的和最新的tag作对比区间
const previous = tags[1];
const latest = tags[0];
console.log(`🕐 上一个预发布 tag: ${previous}`);
console.log(`🆕 最新的预发布 tag: ${latest}`);

// 发布新的预发布版本，版本号会递增
execSync('npx release-it --preRelease=pre --increment=prerelease --no-changelog --no-npm.publish --ci', {
  stdio: 'inherit',
});

// 生成 changelog 对比区间
const tagArg = `${previous}..${latest}`;
console.log(`🔍 生成 changelog 对比区间: ${tagArg}`);

// 只生成 changelog 并写入文件，不推送，不提交，不打tag
execSync(`npx release-it --no-git.tag --no-git.commit --no-git.push --no-github.release --plugin.@release-it/conventional-changelog.tagArgument=${tagArg} --no-npm.publish --ci`, {
  stdio: 'inherit',
});

const { execSync } = require('child_process');

// Step 1: 获取旧的最后一个预发布 tag
const tags = execSync('git tag --sort=-creatordate', { encoding: 'utf-8' })
  .split('\n')
  .filter(tag => /^v?\d+\.\d+\.\d+-pre\.\d+$/.test(tag));

const previous = tags[0];
console.log(`🕐 上一个预发布 tag: ${previous}`);

// Step 2: 执行 release-it 发布新的 pre-release（不带 changelog）
execSync('npx release-it --preRelease=pre --no-changelog --no-npm.publish --ci', {
  stdio: 'inherit',
});

// Step 3: 获取刚打的新的 tag（最上面的）
const updatedTags = execSync('git tag --sort=-creatordate', { encoding: 'utf-8' })
  .split('\n')
  .filter(tag => /^v?\d+\.\d+\.\d+-pre\.\d+$/.test(tag));

const latest = updatedTags[0];
const tagArg = `${previous}..${latest}`;
console.log(`🔍 生成 changelog 对比区间: ${tagArg}`);

// Step 4: 再运行 release-it，只执行 changelog 生成并更新文件
execSync(`npx release-it --no-git.tag --no-git.commit --no-git.push --no-github.release --plugin.@release-it/conventional-changelog.tagArgument=${tagArg} --no-npm.publish --ci`, {
  stdio: 'inherit',
});

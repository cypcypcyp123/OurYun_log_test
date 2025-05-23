const { execSync } = require('child_process');

// 获取所有的 tags，按时间顺序排序（最近的在后面）
const tags = execSync('git tag --sort=creatordate')
  .toString()
  .split('\n')
  .map(tag => tag.trim())
  .filter(Boolean);

// 过滤出符合 "pre" 的 tag（你可以根据自己的规则调整）
const preTags = tags.filter(tag => /pre/i.test(tag));

// 保证至少有两个 tag
if (preTags.length < 2) {
  console.error('❌ 没有足够的 pre-release tags');
  process.exit(1);
}

// 取最后两个
const tag1 = preTags[preTags.length - 2];
const tag2 = preTags[preTags.length - 1];

console.log(`${tag1}...${tag2}`);

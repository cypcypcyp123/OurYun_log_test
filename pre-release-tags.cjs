#!/usr/bin/env node
const { execSync } = require('child_process');

// 配置常量
const TAG_PREFIX = 'v';
const PRE_RELEASE_PATTERN = 'v*-pre.*';  // 修改为明确匹配v前缀
const INITIAL_VERSION = 'v1.0.0-pre.0';

// 辅助函数 - 执行命令并处理错误
function executeCommand(command, options = {}) {
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`❌ 命令执行失败: ${command}`);
    throw error;
  }
}

// 获取排序后的预发布标签，确保总是返回数组
function getSortedPreTags() {
  try {
    const tags = execSync(
      `git tag --list "${PRE_RELEASE_PATTERN}" --sort=-version:refname`,
      { encoding: 'utf-8' }
    );
    return tags.split('\n').filter(tag => tag.trim().length > 0);
  } catch (error) {
    // 如果命令失败或没有标签，返回空数组
    return [];
  }
}

// 创建用于比较的回退标签
function createFallbackTag(currentTag) {
  console.log('⚠️  创建用于比较的回退标签');
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

// 初始化第一个标签
function initializeFirstTag() {
  console.log(`⚠️  没有找到预发布标签，将初始化 ${INITIAL_VERSION}`);
  executeCommand(`git tag ${INITIAL_VERSION}`);
  executeCommand(`git push origin ${INITIAL_VERSION}`);
  return [INITIAL_VERSION];
}

async function main() {
  try {
    console.log('🔄 同步远程标签...');
    executeCommand('git fetch --tags');

    let preTags = getSortedPreTags();
    
    // 如果没有预发布标签，初始化一个
    if (preTags.length === 0) {
      preTags = initializeFirstTag();
    }

    // 确保至少有两个标签用于比较
    if (preTags.length < 2) {
      const fallbackTag = createFallbackTag(preTags[0]);
      console.log(`ℹ️  使用临时对比标签: ${fallbackTag}`);
      preTags.unshift(fallbackTag);
    }

    const [previousTag, latestTag] = preTags.slice(0, 2);
    console.log(`🕐 上一个预发布标签: ${previousTag}`);
    console.log(`🔖 当前预发布标签: ${latestTag}`);

    console.log('🚀 生成新的预发布版本...');
    executeCommand('npx release-it --preRelease=pre --increment=prerelease --no-changelog --no-npm.publish --ci');

    // 获取更新后的标签列表
    const updatedPreTags = getSortedPreTags();
    if (updatedPreTags.length === 0) {
      throw new Error('生成新标签失败，没有找到预发布标签');
    }

    // 获取最新的两个标签
    const newLatestTag = updatedPreTags[0];
    const newPreviousTag = updatedPreTags[1] || previousTag; // 如果没有新的前一个标签，使用之前的
    
    console.log(`🆕 新的预发布标签: ${newLatestTag}`);

    const tagRange = `${newPreviousTag}..${newLatestTag}`;
    console.log(`🔍 生成变更日志对比区间: ${tagRange}`);

    console.log('📝 生成并更新变更日志...');
    executeCommand(
      `npx release-it --no-git.tag --no-git.commit --no-git.push ` +
      `--no-github.release --plugin.@release-it/conventional-changelog.tagArgument=${tagRange} ` +
      `--no-npm.publish --ci`
    );

    console.log('✅ 预发布流程完成');

  } catch (error) {
    console.error('❌ 脚本执行失败:', error.message);
    process.exit(1);
  }
}

main();
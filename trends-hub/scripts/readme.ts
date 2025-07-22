import { promises as fs } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { RsbuildPlugin } from '@rsbuild/core';
import { logger } from '@rslib/core';
import { version } from '../package.json';

interface Options {
  readmePath: string;
}

const getToolsContent = async () => {
  try {
    // Read tools directory directly instead of connecting to server
    const toolsDir = join(process.cwd(), 'src', 'tools');
    const files = await readdir(toolsDir);
    
    // Filter for TypeScript files and exclude the custom RSS file
    const toolFiles = files.filter(file => 
      file.endsWith('.ts') && 
      file !== '$custom-rss.ts' && 
      file !== 'index.ts'
    );

    // Define tool descriptions manually since we can't run the tools
    const toolDescriptions: Record<string, string> = {
      '36kr.ts': 'Get 36Kr trending topics, providing startup, business, and tech industry hot topics, including investment dynamics, emerging industry analysis, and business model innovation information',
      '9to5mac.ts': 'Get 9to5Mac Apple-related news, including Apple product launches, iOS updates, Mac hardware, app recommendations, and Apple company updates',
      'bbc.ts': 'Get BBC news, providing global news, UK news, business, politics, health, education, technology, entertainment, and more',
      'bilibili.ts': 'Get Bilibili video rankings, including popular videos from various sections like animation, music, gaming, reflecting current youth content consumption trends',
      'douban.ts': 'Get Douban real-time hot lists, providing current popular books, movies, TV shows, variety shows, and other works with ratings and popularity data',
      'ifanr.ts': 'Get iFanr tech news, including latest tech products, digital devices, internet trends, and cutting-edge tech information',
      'netease-news.ts': 'Get NetEase news hot topics, including political news, social events, financial information, tech trends, and entertainment sports comprehensive Chinese news',
      'nytimes.ts': 'Get New York Times news, providing authoritative English news in global politics, economy, technology, culture, and other fields',
      'sspai.ts': 'Get SSPAI hot rankings, including digital product reviews, software recommendations, lifestyle guides, and efficiency work tips quality Chinese tech lifestyle content',
      'smzdm.ts': 'Get SMZDM hot topics, including product recommendations, discount information, shopping guides, product reviews, and consumer experience sharing practical Chinese consumer information',
      'thepaper.ts': 'Get ThePaper news hot topics, including political news, financial trends, social events, cultural education, and in-depth reporting high-quality Chinese news',
      'theverge.ts': 'Get The Verge news, including tech innovation, digital product reviews, internet trends, and tech company dynamics English tech information',
      'toutiao.ts': 'Get Toutiao hot topics, including political news, social events, international news, tech development, and entertainment gossip multi-domain hot Chinese information',
      'weibo.ts': 'Get Weibo hot search rankings, including current events, social phenomena, entertainment news, celebrity updates, and trending topics real-time hot Chinese information',
      'weread.ts': 'Get WeChat Reading rankings, including popular books, new book recommendations, novel lists, and other reading content, reflecting current reading trends',
      'zhihu.ts': 'Get Zhihu hot topics, including current events, social topics, tech trends, entertainment gossip, and other multi-domain hot Q&A and discussion Chinese information'
    };

    let result = '| Tool Name | Description |\n| --- | --- |\n';
    
    for (const file of toolFiles) {
      const toolName = file.replace('.ts', '');
      const description = toolDescriptions[file] || 'Get related information';
      
      // Convert filename to tool name format (e.g., '36kr.ts' -> 'get-36kr-trending')
      const formattedName = `get-${toolName.replace(/([A-Z])/g, '-$1').toLowerCase()}-trending`;
      
      result += `| ${formattedName} | ${description} |\n`;
    }

    return result;
  } catch (error) {
    logger.warn('Failed to read tools directory, using fallback content');
    // Return fallback content if reading fails
    return '| Tool Name | Description |\n| --- | --- |\n| get-36kr-trending | Get 36Kr trending topics, providing startup, business, and tech industry hot topics |\n| get-bbc-news | Get BBC news, providing global news, UK news, business, politics, health, education, technology, entertainment, and more |\n| get-bilibili-rank | Get Bilibili video rankings, including popular videos from various sections like animation, music, gaming |\n| get-douban-rank | Get Douban real-time hot lists, providing current popular books, movies, TV shows, variety shows, and other works |\n| get-ifanr-news | Get iFanr tech news, including latest tech products, digital devices, internet trends, and cutting-edge tech information |\n| get-netease-news-trending | Get NetEase news hot topics, including political news, social events, financial information, tech trends, and entertainment sports |\n| get-nytimes-news | Get New York Times news, providing authoritative English news in global politics, economy, technology, culture, and other fields |\n| get-sspai-rank | Get SSPAI hot rankings, including digital product reviews, software recommendations, lifestyle guides, and efficiency work tips |\n| get-smzdm-rank | Get SMZDM hot topics, including product recommendations, discount information, shopping guides, product reviews, and consumer experience sharing |\n| get-thepaper-trending | Get ThePaper news hot topics, including political news, financial trends, social events, cultural education, and in-depth reporting |\n| get-theverge-news | Get The Verge news, including tech innovation, digital product reviews, internet trends, and tech company dynamics |\n| get-toutiao-trending | Get Toutiao hot topics, including political news, social events, international news, tech development, and entertainment gossip |\n| get-weibo-trending | Get Weibo hot search rankings, including current events, social phenomena, entertainment news, celebrity updates, and trending topics |\n| get-weread-rank | Get WeChat Reading rankings, including popular books, new book recommendations, novel lists, and other reading content |\n| get-zhihu-trending | Get Zhihu hot topics, including current events, social topics, tech trends, entertainment gossip, and other multi-domain hot Q&A and discussion |\n';
  }
};

const getUsageJSONContent = () => {
  const mcpServerConfig = {
    mcpServers: {
      'trends-hub': {
        command: 'npx',
        args: ['-y', `mcp-trends-hub@${version ?? 'latest'}`],
      },
    },
  };
  let result = '```json\n';
  result += JSON.stringify(mcpServerConfig, null, 2);
  result += '\n```';
  return result;
};

const getUsageBashContent = () => {
  let result = '```bash\n';
  result += `npx -y mcp-trends-hub@${version ?? 'latest'}`;
  result += '\n```';
  return result;
};

const createContentUpdater = (initialContent: string) => {
  let content = initialContent;

  return {
    update: async (markName: string, contentGenerator: () => string | Promise<string>): Promise<void> => {
      const markStart = `<!-- ${markName}-start -->`;
      const markEnd = `<!-- ${markName}-end -->`;
      const newContent = await contentGenerator();
      const regex = new RegExp(`(${markStart}\\n)([\\s\\S]*?)(\\n${markEnd})`, 'g');
      content = content.replace(regex, `$1${newContent}\n$3`);
    },
    getContent: () => content,
  };
};

export const readmePlugin = ({ readmePath }: Options): RsbuildPlugin => {
  return {
    name: 'readme-plugin',

    setup: (api) => {
      api.onAfterBuild(async ({ isWatch }) => {
        if (isWatch) {
          return;
        }

        try {
          logger.ready('更新 README.md 文件...');

          const readmeContent = await fs.readFile(readmePath, 'utf-8');

          const contentUpdater = createContentUpdater(readmeContent);

          await contentUpdater.update('tools', getToolsContent);
          await contentUpdater.update('usage-json', getUsageJSONContent);
          await contentUpdater.update('usage-bash', getUsageBashContent);
          await fs.writeFile(readmePath, contentUpdater.getContent());

          logger.success('README.md 更新成功');
        } catch (error) {
          logger.error('更新 README.md 失败:', error);
        }
      });
    },
  };
};

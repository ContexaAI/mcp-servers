#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Command } from 'commander';
import { fetchRecipes, getAllCategories } from "./data/recipes.js";
import { registerGetAllRecipesTool } from "./tools/getAllRecipes.js";
import { registerGetRecipeByIdTool } from "./tools/getRecipeById.js";
import { registerGetRecipesByCategoryTool } from "./tools/getRecipesByCategory.js";
import { registerRecommendMealsTool } from "./tools/recommendMeals.js";
import { registerWhatToEatTool } from "./tools/whatToEat.js";
import { Recipe } from './types/index.js';
import { contexaStart } from './contexa-server.js';

// 全局变量存储数据
let recipes: Recipe[] = [];
let categories: string[] = [];

// 命令行参数处理
const program = new Command()
  .option("--transport <contexa>", "transport type", "contexa")
  .parse(process.argv);

const cliOptions = program.opts<{
  transport: string;
}>();

const allowedTransports = ["contexa"];
if (!allowedTransports.includes(cliOptions.transport)) {
  console.error(
    `Invalid --transport value: '${cliOptions.transport}'. Must be: contexa.`
  );
  process.exit(1);
}

const TRANSPORT_TYPE = (cliOptions.transport || "contexa") as "contexa";

// 创建MCP服务器实例
function createServerInstance(): McpServer {
  const server = new McpServer({
    name: 'howtocook-mcp',
    version: '0.1.1',
  }, {
    capabilities: {
      logging: {},
    },
  });

  // 注册所有工具
  registerGetAllRecipesTool(server, recipes);
  registerGetRecipesByCategoryTool(server, recipes, categories);
  registerRecommendMealsTool(server, recipes);
  registerWhatToEatTool(server, recipes);
  registerGetRecipeByIdTool(server, recipes);

  return server;
}

// 加载菜谱数据
async function loadRecipeData() {
  try {
    recipes = await fetchRecipes();
    categories = getAllCategories(recipes);
    console.log(`📚 已加载 ${recipes.length} 个菜谱`);
  } catch (error) {
    console.error('加载菜谱数据失败:', error);
    recipes = [];
    categories = [];
    throw error;
  }
}

// 启动服务的主函数
async function main() {
  // 加载菜谱数据
  await loadRecipeData();

  // 创建服务器实例
  const server = createServerInstance();

  // 使用 Contexa 传输
  try {
    await contexaStart(server);
    console.log('🚀 HowToCook MCP Contexa 服务器启动成功');
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n正在关闭服务器...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n收到终止信号，正在关闭服务器...');
  process.exit(0);
});

// 启动服务器
main().catch((error) => {
  console.error('启动服务器失败:', error);
  process.exit(1);
});


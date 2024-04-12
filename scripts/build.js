import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url"; // 使用 url 模块中的 fileURLToPath 函数
import { defineConfig, build } from "vite";
import createPackageJson from "./packageJson.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, "../packages");
const outputDir = path.resolve(__dirname, "../build");

const baseConfig = defineConfig({
  publicDir: false,
});

const rollupOptions = {
  external: ["vue"],
  globals: {
    vue: "Vue",
  },
};

/** 构建单个组件 */
const buildSingle = async (componentDir) => {
  const componentName = path.basename(componentDir);
  console.log(`========Building ${componentName}...`);
  const entryFile = path.resolve(componentDir, "index.ts"); // 组件的入口文件路径
  const outputComponentDir = path.resolve(outputDir, componentName);

  try {
    await build(
      defineConfig({
        ...baseConfig,
        build: {
          lib: {
            entry: entryFile,
            name: "index",
            fileName: "index",
            formats: ["es", "umd", "cjs"],
          },
          rollupOptions,
          outDir: outputComponentDir,
        },
      })
    );
    createPackageJson(componentName, outputComponentDir);
    console.log(`${componentName} built successfully.`);
  } catch (error) {
    console.error(`Error building ${componentName}:`, error);
  }
};

/** 构建组件库 */
const buildLib = async () => {
  try {
    const componentDirs = fs.readdirSync(inputDir).map((name) => path.resolve(inputDir, name));
    for (const componentDir of componentDirs) {
      await buildSingle(componentDir);
    }
  } catch (error) {
    console.error("Error building library:", error);
  }
  createPackageJson('vue3-plugins', outputDir);
};

buildLib();

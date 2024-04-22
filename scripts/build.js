import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
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

const buildSingle = async (componentDir) => {
  const componentName = path.basename(componentDir);
  const entryFile = path.resolve(componentDir, "index.ts");
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
  } catch (error) {
    console.error(`Error building ${componentName}:`, error);
  }
};

const buildLib = async () => {
  try {
    // 构建 packages 目录下的 index.ts 文件
    const packagesEntryFile = path.resolve(inputDir, "index.ts");
    const packagesOutputDir = path.resolve(outputDir, "");
    await build(
      defineConfig({
        ...baseConfig,
        build: {
          lib: {
            entry: packagesEntryFile,
            name: "vue3-plugins",
            fileName: "vue3-plugins",
            formats: ["es", "umd", "cjs"],
          },
          rollupOptions,
          outDir: packagesOutputDir,
        },
      })
    );
    createPackageJson("vue3-plugins", outputDir);
    const componentDirs = fs
      .readdirSync(inputDir)
      .map((name) => path.resolve(inputDir, name));
    for (const componentDir of componentDirs) {
      await buildSingle(componentDir);
    }
  } catch (error) {
    console.error("Error building library:", error);
  }
  
};

buildLib();

import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { defineConfig, build } from "vite";
import createPackageJson from "./packageJson.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, "../packages");
const outputDir = path.resolve(__dirname, "../build");
const buildLib = async () => {
  try {
    await build(
      defineConfig({
        build: {
          rollupOptions: {
            external: ["vue"],
            globals: {
              vue: "Vue",
            },
            input: inputDir,
            output: [
              {
                format: "es",
                //不用打包成.es.js,这里我们想把它打包成.js
                entryFileNames: "[name].js",
                //让打包目录和我们目录对应
                preserveModules: true,
                //配置打包根目录
                dir: outputDir,
                preserveModulesRoot: "packages",
                exports: "named",
                globals: {
                  vue: "Vue",
                },
              },
              {
                format: "cjs",
                //不用打包成.mjs
                entryFileNames: "[name].js",
                //让打包目录和我们目录对应
                preserveModules: true,
                //配置打包根目录
                dir: outputDir,
                preserveModulesRoot: "packages",
                exports: "named",
                globals: {
                  vue: "Vue",
                },
              },
            ],
          },
          lib: {
            entry: inputDir,
            name: "vue3-plugins",
            fileName: "vue3-plugins",
            // formats: ["es", "umd", "cjs"],
          },
        },
      })
    );
    createPackageJson("vue3-plugins", outputDir);
  } catch (error) {
    console.error("Error building library:", error);
  }
};

buildLib();

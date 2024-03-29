import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from "node:url";
import { defineConfig, build} from 'vite'
import vue from '@vitejs/plugin-vue'

// 基础配置
const baseConfig = defineConfig({
  publicDir: false,
  plugins: [vue()]
})
const rollupOptions = defineConfig({
  // that shouldn't be bundled
  external: ["vue"],
  globals: {
    vue: "Vue"
  }
})
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
// 组件库全局入口
const compontsDir = path.resolve(__dirname, "../packages/components")
// 输出目录
const outputDir = path.resolve(__dirname, "../build")
// 生成 package.json
const createPackageJson = name => {
  const fileStr = `{
    "name": "${name ? name : "pc-vue3-wk-ui"}",
    "version": "1.0.0",
    "description": "Vue3组件库",
    "main": "${name ? "index.umd.js" : "pc-vue3-wk-ui.umd.js"}",
    "module":"${name ? "index.mjs" : "pc-vue3-wk-ui.mjs"}",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/GGXXMM/vue3-ui.git"
    },
    "keywords": ["vue3", "组件库", "UI"],
    "author": "guoxinming",
    "license": "ISC"
  }
  `
  // 单个组件 or 全量
  const filePath = path.resolve(
    outputDir,
    name ? `${name}/package.json` : `package.json`
  )

  fs.outputFile(filePath, fileStr, "utf-8")
}

/** 单组件按需构建 */
const buildSingle = async name => {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        lib: {
          entry: path.resolve(compontsDir, name),
          name: "index",
          fileName: "index",
          formats: ["es", "umd"]
        },
        rollupOptions,
        outDir: path.resolve(outputDir, name)
      }
    })
  )

  createPackageJson(name)
}

/** 全量构建 */
const buildAll = async () => {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        lib: {
          entry: compontsDir,
          name: "pc-vue3-wk-ui",
          fileName: "pc-vue3-wk-ui",
          formats: ["es", "umd"]
        },
        rollupOptions,
        outDir: outputDir
      }
    })
  )

  createPackageJson()
}

const buildLib = async () => {
  await buildAll()

  // 按需打包
  fs.readdirSync(compontsDir)
    .filter(name => {
      // 获取组件的目录
      const componentDir = path.resolve(compontsDir, name)
      const isDir = fs.lstatSync(componentDir).isDirectory()
      return isDir && fs.readdirSync(componentDir).includes("index.ts")
    })
    .forEach(async name => {
      await buildSingle(name)
    })
}

buildLib()

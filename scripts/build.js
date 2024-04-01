import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from "node:url";
import { defineConfig, build} from 'vite'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.resolve(__dirname, "../packages/component")
const utilsDir = path.resolve(__dirname, "../packages/utils")
const outputDir = path.resolve(__dirname, "../build")

const baseConfig = defineConfig({
  publicDir: false,
})

const rollupOptions = defineConfig({
  external: ["vue"],
  globals: {
    vue: "Vue"
  }
})

const createPackageJson = (name = "vue3-plugins") => {
  const fileStr = `{
    "name": "${name}",
    "version": "1.0.0",
    "description": "Vue3组件库",
    "main": "${name}.umd.js",
    "module":"${name}.mjs",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/webcuiwenke/wk_vue_components.git"
    },
    "keywords": ["vue3", "组件库", "UI","表单校验","公共函数"],
    "author": "cwk",
    "license": "ISC"
  }
  `
  const filePath = path.resolve(outputDir, `${name}/package.json`)
  fs.outputFile(filePath, fileStr, "utf-8")
}

const buildSingle = async (name, entry, outputName) => {
  try {
    await build(
      defineConfig({
        ...baseConfig,
        build: {
          lib: {
            entry,
            name: "index",
            fileName: outputName,
            formats: ["es", "umd"]
          },
          rollupOptions,
          outDir: path.resolve(outputDir, name)
        }
      })
    )

    createPackageJson(name)
  } catch (error) {
    console.error(`Error building ${name}:`, error)
  }
}

const buildAll = async (entry, outputName) => {
  try {
    await build(
      defineConfig({
        ...baseConfig,
        build: {
          lib: {
            entry,
            name: outputName,
            fileName: outputName,
            formats: ["es"]
          },
          rollupOptions,
          outDir: outputDir
        }
      })
    )

    createPackageJson(outputName)
  } catch (error) {
    console.error('Error building all components:', error)
  }
}

const buildLib = async () => {
  try {
    await fs.emptyDir(outputDir)

    await buildAll(componentsDir, "vue3-plugins")

    fs.readdirSync(componentsDir)
      .filter(name => {
        const componentDir = path.resolve(componentsDir, name)
        const isDir = fs.lstatSync(componentDir).isDirectory()
        return isDir && fs.readdirSync(componentDir).includes("index.ts")
      })
      .forEach(async name => {
        const entry = path.resolve(componentsDir, name)
        await buildSingle(name, entry, name)
      })

    fs.readdirSync(utilsDir)
      .filter(name => {
        const utilDir = path.resolve(utilsDir, name)
        const isDir = fs.lstatSync(utilDir).isDirectory()
        return isDir && fs.readdirSync(utilDir).includes("index.ts")
      })
      .forEach(async name => {
        const entry = path.resolve(utilsDir, name)
        await buildSingle(name, entry, `utils-${name}`)
      })
  } catch (error) {
    console.error('Error building library:', error)
  }
}

buildLib()

import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from "node:url";
import { defineConfig, build} from 'vite'
import createPackageJson from './packageJson.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, "../packages")
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
            formats: ["es", "umd", "cjs"]
          },
          rollupOptions,
          outDir: path.resolve(outputDir, name)
        }
      })
    )

    createPackageJson(name,outputDir)
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
            formats: ["es", "umd", "cjs"]
          },
          rollupOptions,
          outDir: outputDir
        }
      })
    )

    createPackageJson(outputName,outputDir)
  } catch (error) {
    console.error('Error building all components:', error)
  }
}

const buildLib = async () => {
  try {
    await fs.emptyDir(outputDir)

    await buildAll(inputDir, "vue3-plugins")

    fs.readdirSync(inputDir)
      .filter(name => {
        const componentDir = path.resolve(inputDir, name)
        const isDir = fs.lstatSync(inputDir).isDirectory()
        return isDir && fs.readdirSync(inputDir).includes("index.ts")
      })
      .forEach(async name => {
        const entry = path.resolve(inputDir, name)
        await buildSingle(name, entry, name)
      })
  } catch (error) {
    console.error('Error building library:', error)
  }
}

buildLib()
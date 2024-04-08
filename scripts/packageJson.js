import path from 'path'
import fs from 'fs-extra'
const createPackageJson = (name = "vue3-plugins",outputDir) => {
    const fileStr = `{
      "name": "${name}",
      "version": "1.0.2",
      "description": "Vue3组件库",
      "main": "${name}.umd.js",
      "module":"${name}.mjs",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/webcuiwenke/wk_vue_components.git"
      },
      "keywords": ["vue3", "组件库", "UI","hooks"],
      "author": "cwk",
      "license": "ISC"
    }
    `
    const filePath = path.resolve(outputDir, `package.json`)
    fs.outputFile(filePath, fileStr, "utf-8")
  }
  export default createPackageJson
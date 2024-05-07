import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'modules',
    //打包文件目录
    outDir: "es",
    //压缩
    minify: false,
    //css分离
    //cssCodeSplit: true,
    rollupOptions: {
      external: ["vue"],
      input: ['packages/index.ts'],
      output: [
        {
          format: 'es',
          //不用打包成.es.js,这里我们想把它打包成.js
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          //配置打包根目录
          dir: './dist-lib/es',
          preserveModulesRoot: 'packages',
          exports: 'named',
          globals: {
            vue: 'Vue',
            Recorder: 'Recorder'
          }
        },
        {
          format: 'cjs',
          //不用打包成.mjs
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          //配置打包根目录
          dir: './dist-lib/lib',
          preserveModulesRoot: 'packages',
          exports: 'named',
          globals: {
            vue: 'Vue',
            Recorder: 'Recorder'
          }
        }
      ]
    },
    lib: {
      name: 'umd',
      entry: './packages/index.ts',
    }
  },
})

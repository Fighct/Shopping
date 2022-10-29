const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // transpileDependencies: true,
  // 关闭eslient校验功能 - 在main.js入口文件中，我们声明了一个变量但未进行使用时，eslient会提示错误，导致项目无法运行，因此我们需要关闭该功能
  lintOnSave: false,
  // 代理服务器
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
        changeOrigin: true
      }
    }
  },
  // 打包时不生成Map文件
  productionSourceMap: false
})
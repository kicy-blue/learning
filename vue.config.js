const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const path = require('path');
const webpack = require("webpack");
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: 'docs',
  publicPath: '/',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*']
          })
        ]
      }
    }
  },
  configureWebpack: {
    //支持jquery
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery",
      })
    ]
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('Assets', resolve('src/assets'))
      .set('Components', resolve('src/components'))
      .set('Services', resolve('src/services'))

  },
  devServer: {
	   disableHostCheck: true,
    proxy: {
      '/api': {     //这里最好有一个 /
        target: 'http://mm.yangche51.com',  // 后台接口域名
        ws: false,        //如果要代理 websockets，配置这个参数
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};

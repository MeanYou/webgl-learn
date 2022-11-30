const paths = require('./paths');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConf = require('./webpack.base.js');

const devConf = {
  /**
   * Set the mode to development or production.
   */
  mode: 'development',
  target: 'web',
  /**
   * Devtool
   *
   * Control how source maps are generated.
   */
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'cheap-source-map',

  /**
   * DevServer
   *
   * 开发服务器配置
   * 
   */
  devServer: {
    client: {
      logging: 'none',
      overlay: false,
      progress: true,
    },
    compress: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    open: ['http://127.0.0.1:3006/'],
    port: 3006,
    proxy: {
      '/biology/*': {
        // target: 'http://192.168.3.37:8090',
        target: 'https://www.mingtukeji.com',
        changeOrigin: true
      },
      '/browse/taxa_tree_children': {
        target: 'http://sp2000.org.cn',
        changeOrigin: true
      }
      // '/flv/*': {
      //   target: 'http://8.143.198.43:80',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/flv": ""
      //   },
      // }
    },
    server: 'http',
    static: {
      directory: paths.static
    }
  },

  plugins: [
    /**
     * HotModuleReplacementPlugin
     *
     * Only update what has changed.
     */
    new webpack.HotModuleReplacementPlugin(),
    /**
     * 持久化缓存
     */
    // new HardSourceWebpackPlugin()
  ]
};

module.exports = merge(devConf, baseConf);

const paths = require('./paths')
const { merge } = require('webpack-merge')
const baseConf = require('./webpack.base.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const TerserPlugin = require('terser-webpack-plugin')

const useSourceMap = true;
const useCompress = true;

const plugins = [
  /**
   * Removes/cleans build folders and unused assets when rebuilding.
   */
  new CleanWebpackPlugin(),
  /**
   * Copies files from target to destination folder.
   * 不复制模板文件
   */
  new CopyWebpackPlugin({
    patterns: [
      {
        from: paths.static,
        to: paths.build,
        globOptions: {
          ignore: ['index.html', '*.DS_Store'],
        }
      }
    ]
  }),
  /**
   * Extracts CSS into separate files.
   *
   * Note: style-loader is for development, MiniCssExtractPlugin is for production.
   * They cannot be used together in the same config.
   */
  new MiniCssExtractPlugin({
    filename: 'static/css/[name].[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  }),
];
if (useCompress) {
  /**
   * 压缩插件，大于10kb的js和css文件进行压缩
   */
  plugins.push(new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.(js|css)$/,
    threshold: 10240,
    minRatio: 0.8
  }));
}

const proConf = {
  mode: 'production',
  devtool: useSourceMap ? 'source-map' : false,
  // devtool: false,
  plugins: plugins,

  /**
   * Production minimizing of JavaSvript and CSS assets.
   */
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false
          },
          compress: {
            drop_console: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: useSourceMap
            ? {
              inline: false,
              annotation: true
            } : false
        }
      })],
    // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
    // instead of having their own. This also helps with long-term caching, since the chunks will only
    // change when actual code changes, not the webpack runtime.
    runtimeChunk: true
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

module.exports = merge(proConf, baseConf);

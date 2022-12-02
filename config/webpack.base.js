const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const postcssNormalize = require('postcss-normalize');

/**
   * sourcemap表示是否生成sourcemap文件，生成sourcemap方便调试，但会增大打包体积
   */
const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';
const useSourcemap = false;

/**
   * 静态资源路径表示服务器根目录
   * 开发环境为devServer的contentBase，默认/
   * 生产环境下可以自定义，比如CDN下的静态资源就设置为https://www.cdn.com/
   * 生产环境默认为./，使用相对路径可以直接打开index.html访问页面
   */
const publicPath = isEnvProduction ? './' : isEnvDevelopment && '/';
const shouldUseRelativeAssetPaths = publicPath === './';

/**
 * publicUrl和publicPath类似
 * 在html中以%PUBLIC_URL%的形式访问
 * 在Javascript中以process.env.PUBLIC_URL的形式访问
 * 使用slice删除/，%PUBLIC_URL%/abc相比%PUBLIC_URL%abc，写法更好些
 */
const publicUrl = isEnvProduction
    ? publicPath.slice(0, -1)
    : isEnvDevelopment && '';

module.exports = {
    /**
     * 配置打包入口文件
     */
    entry: [paths.src + '/index.tsx'],
    /**
     * 配置打包输出目录
     */
    output: {
        path: isEnvProduction ? paths.build : undefined,
        pathinfo: isEnvDevelopment,
        filename: isEnvProduction
            ? 'static/js/[name].[contenthash:8].js'
            : isEnvDevelopment && 'static/js/[name].bundle.js',
        chunkFilename: isEnvProduction
            ? 'static/js/[name].[contenthash:8].chunk.js'
            : isEnvDevelopment && 'static/js/[name].chunk.js',
        publicPath: publicPath,
        // 将sourcemap路径映射为磁盘地址
        devtoolModuleFilenameTemplate: isEnvProduction
            ? (info => path.relative(paths.src, info.absoluteResourcePath).replace(/\\/g, '/'))
            : isEnvDevelopment &&
            (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    },
    /**
   * Determine how modules within the project are treated.
   */
    module: {
        rules: [
            {
                oneOf: [
                    /**
             * 使用url-loader加载各类型图片
             */
                    {
                        test: /\.(?:ico|bmp|gif|png|jpg|jpeg)$/i,
                        type: 'asset',
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10000
                            }
                        },
                        generator: {
                            filename: 'static/media/[name].[hash:8][ext]'
                        }
                    },
                    /**
                     * JavaScript
                     * Use Babel to transpile JavaScript files.
                     */
                    {
                        test: /\.(js|jsx|ts|tsx)$/,
                        include: paths.src,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            cacheCompression: isEnvProduction,
                            compact: isEnvProduction
                        }
                    },
                    /**
                     * Styles
                     *
                     * Inject CSS into the head with source maps.
                     * Inject less files
                     */
                    {
                        test: /\.css$/,
                        use: [
                            isEnvDevelopment ? 'style-loader'
                                : isEnvProduction && {
                                    loader: MiniCssExtractPlugin.loader,
                                    options: shouldUseRelativeAssetPaths ? { publicPath: '../../' } : {},
                                },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: useSourcemap,
                                    importLoaders: 1
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    postcssOptions: {
                                        plugins: () => [
                                            require('postcss-flexbugs-fixes'),
                                            require('postcss-preset-env')({
                                                autoprefixer: {
                                                    flexbox: 'no-2009',
                                                },
                                                stage: 3,
                                            }),
                                            postcssNormalize(),
                                        ]
                                    }
                                }
                            }
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            isEnvDevelopment ? 'style-loader'
                                : isEnvProduction && {
                                    loader: MiniCssExtractPlugin.loader,
                                    options: shouldUseRelativeAssetPaths ? { publicPath: '../../' } : {},
                                },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: useSourcemap,
                                    importLoaders: 1
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    postcssOptions: {
                                        plugins: () => [
                                            require('postcss-flexbugs-fixes'),
                                            require('postcss-preset-env')({
                                                autoprefixer: {
                                                    flexbox: 'no-2009',
                                                },
                                                stage: 3,
                                            }),
                                            postcssNormalize(),
                                        ]
                                    }
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: useSourcemap,
                                    lessOptions: {
                                        javascriptEnabled: true
                                    }
                                }
                            }
                        ],
                    },

                    /**
                     * 其他类型的文件使用file-loader
                     * 排除html和json，webpack会使用内部loader处理它们
                     */
                    {
                        type: 'asset/resource',
                        generator: {
                            filename: 'static/media/[name].[hash:8][ext]'
                        },
                        // exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.json$/]
                        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/]
                    }
                ]
            }
        ],
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
            lintDirtyModulesOnly: true
        }),
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    inject: true,
                    template: `${paths.static}/index.html`
                },
                isEnvProduction
                    ? {
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true,
                        },
                    }
                    : undefined
            )
        ),
        /**
         * 给JS环境造两个变量
         * NODE_ENV表示环境
         * PUBLIC_URL表示/public目录，需要引入外部js库的时候比较方便
         */
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                PUBLIC_URL: JSON.stringify(publicUrl)
            }
        })
    ],
    resolve: {
        alias: {
            '@': paths.src
        },
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    optimization: {
        // This breaks apart commonly shared deps (react, semantic ui, etc) into one shared bundle. React, etc
        // won't change as often as the app code, so this chunk can be cached separately from app code.
        splitChunks: {
            chunks: 'all',
            name: false,
        }
    },
    externals: {
        webglLessonsUI: 'webglLessonsUI',
        echarts: 'echarts'
    }
};
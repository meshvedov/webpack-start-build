const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin= require('copy-webpack-plugin');

module.exports = (env, argv) => {

    const isProductionBuild = argv.mode === "production";

    const scss = {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: { sourceMap: true }
            },
            {
                loader: 'postcss-loader',
                options: { sourceMap: true }
            },
            {
                loader: 'sass-loader',
                options: { sourceMap: true }
            },
        ]
    };

    const js = {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
            presets: ['@babel/preset-env'],
            plugins: ["@babel/plugin-syntax-dynamic-import"]
        }
    };

    const files = {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file-loader',
        options: {
            name: "[name].[ext]",
            outputPath: 'img'
        }
    };

    const html = {
        test: /\.html$/,
        use: ['file-loader?name=[name].[ext]', 'extract-loader', 'html-loader'],
    };

    const config = {
        entry: {
            index: './src/js/index.js'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            // publicPath: "/"
        },
        module: {
            rules: [
                js,
                scss,
                files,
                // html
            ]
        },

        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            new CopyWebpackPlugin([
                {
                    from: './src/fonts',
                    to: './fonts'
                },
                {
                    from: './src/img',
                    to: './img'
                }
            ]),
            new webpack.SourceMapDevToolPlugin({
                filename: '[name].map'
            })
        ],

        resolve: {
            alias: {
                img: path.resolve(__dirname, 'src/img')
            }
        },

        devServer: {
            port: 8081,
            overlay: {
                warnings: false,
                errors: true
            }
        },

        devtool: 'cheap-module-eval-source-map'
    };

    if (isProductionBuild) {
        config.devtool = "none";

        config.optimization = {};

        config.optimization.minimizer = [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ];
    }

    return config;
};
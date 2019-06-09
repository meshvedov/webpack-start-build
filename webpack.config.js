const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {

    const isProductionBuild = argv.mode === "production";

    const scss = {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader']
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
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
            // publicPath: "/"
        },
        module: {
            rules: [
                js,
                scss,
                files,
                html
            ]
        },

        plugins: [
            new CleanWebpackPlugin(),
            // new HtmlWebpackPlugin({
            //     template: './src/main.html'
            // }),
            new MiniCssExtractPlugin({
                filename: 'style.css'
            })
        ],

        resolve: {
            alias: {
                img: path.resolve(__dirname, 'src/img')
            }
        },

        devtool: "source-map",
        watchOptions: {
            poll: true
        }
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
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const fs = require('fs')
function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: false,
        })
    })
}
const htmlPlugins = generateHtmlPlugins('./src/html/views')
module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "img/[name].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                include: path.resolve(__dirname, 'src/html/includes'),
                use: ['raw-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.sass$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  "css-loader",
                  "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({filename: 'main.css'})
    ].concat(htmlPlugins)
}
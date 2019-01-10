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

// const env = process.env.WEBPACK_MODE 

// console.log(env)


module.exports = (env, argv) => {
    console.log(argv.mode)
    return {
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
                                name: "img/[name].[ext]?[hash]",
                                publicPath: '../',
                                publicPath: argv.mode === 'production' ? '../../' : './',
                                useRelativePaths: true
                            },
                            
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
                    "css-loader?url=false",
                    "sass-loader"
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({filename: 'main.css'})
        ].concat(htmlPlugins)
    }
};


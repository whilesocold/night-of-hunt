const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

function getPlugins() {
    const plugins = [
        new HtmlWebpackPlugin({
            template: './static/index.html',
            filename: 'index.html',
            publicPath: '/',
            inject: true,
            WEBSOCKET: process.env.WEBSOCKET,
            inlineSource: '.(js|css)$',
        }),
    ]

    plugins.push(
        new CleanWebpackPlugin(['dist']),
        new ScriptExtHtmlWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: './res',
            to: './res',
        }]),
    )

    return plugins
}

module.exports = {
    entry: {
        bundle: './src/index',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[hash].js',
    },
    optimization: {
        minimize: false,
        /*
        minimizer: [
          new UglifyJsPlugin({
            cache: false,
            parallel: true,
            sourceMap: true,
            uglifyOptions: {
              warnings: false,
              keep_fnames: true,
              keep_classnames: true,
            },
          }),
        ],
         */
    },
    plugins: getPlugins(),
    resolve: {
        symlinks: false,
        extensions: [
            '.wasm', '.ts', '.js', '.json', '.png',
        ],
    },
    devServer: {
        disableHostCheck: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        },
    },
    module: {
        rules: [{
            loader: require.resolve('file-loader'),
            exclude: [/\.(wasm|js|mjs|ts)$/, /\.html$/, /\.json$/, /assets/],
        },
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }, {
                test: /\.hbs/,
                loader: 'handlebars-loader',
                exclude: /(node_modules|bower_components)/,
            }],
    },
}

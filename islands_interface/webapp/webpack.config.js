const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack')
const env = require('./env');

const isProduction = (env.NODE_ENV === 'prod')

module.exports = {
    entry: {
        'app': ['./src/index.js']
    },
    output: {
        path: path.resolve(__dirname, '../priv/static/'),
        filename: 'js/[name].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        config: 'postcss.config.js'
                    }
                },
            ]
        },
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: 1,
                        importLoaders: 1,
                        localIdentName: '[name]__[local]___[hash:base64:5]',
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        config: 'postcss.config.js'
                    }
                },
                'sass-loader'
            ]
        },
        {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?(#[a-zA-Z0-9]+)?$/,
            use: 'url-loader?limit=10000&mimetype=application/font-woff'
        },
        {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])(#[a-zA-Z0-9]+)??$/,
            use: 'file-loader'
        },
        {
            test: /\.(ttf|eot|svg)(\?\#iefix&v=[0-9]\.[0-9]\.[0-9])?(#[a-zA-Z0-9]+)?$/,
            use: 'file-loader'
        },
        {
            test: /\.json$/,
            use: 'json-loader'
        },{
            test: /\.(js|jsx)$/,
            include: /js/,
            exclude: path.join(__dirname, 'node_modules'),
            use: [
                { loader: 'babel-loader' }
            ]
        }]
    },
    plugins: [
        //new CopyWebpackPlugin([{ from: './static' }]),
        new webpack.DefinePlugin({
            __MOCK__: env.MOCK,
            __ENV__: `'${env.NODE_ENV}'`,
            __VERSION__: JSON.stringify(require('./package.json').version),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'Islands',
            inject: false,
            template: path.join(__dirname, 'index.html'),
            commitHash: "",//GitRevisionPlugin.commithash(),
            commitBranch: "",//GitRevisionPlugin.branch(),
        }),
    ]
}

var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var webpack = require('webpack')
const env = require('./env');

const getNodeEnvForReact = ((e) => {
    if (e === 'staging') {
        return 'production';
    } else if (e === 'prod') {
        return 'production';
    } else if (e === 'dev') {
        return 'development';
    } else { // local_dev
        return 'development';
    }
});

module.exports = {
    entry: {
        'app': ['./js/index.js', './css/app.scss']
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
        new webpack.DefinePlugin({
            __MOCK__: env.MOCK,
            __ENV__: `'${env.NODE_ENV}'`,
            'process.env.NODE_ENV': JSON.stringify(getNodeEnvForReact(process.env.NODE_ENV)),
            __VERSION__: JSON.stringify(require('./package.json').version)
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                output: {
                    comments: false,
                    beautify: false,
                },
                warnings: false
            }
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
}

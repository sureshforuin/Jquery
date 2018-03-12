// https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
// http://www.pro-react.com/materials/appendixA/

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const defaultCssLoaderOptions = {
    sourceMap: true
}

const defaultFileLoaderOptions = {
    limit: 65000,
    name: '[name].[ext]'
}

module.exports = {
    devServer: {
        inline: true,
        host: 'localhost.ms.com',
        port: 3000
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',
    entry: {
        fonts: ['./main/styles/fonts.scss'],
        main: [
            './main/tsx/index.tsx',
            './main/styles/styles.scss'
        ],
        vendor: [
            'es6-promise',
            'isomorphic-fetch',
            'jquery',
            'datatables.net',
            'jqueryui/jquery-ui.min.css',
            'jqueryui/jquery-ui.min.js',
            'bootstrap/dist/css/bootstrap.min.css',
            'bootstrap/dist/js/bootstrap.min.js',
            'font-awesome/css/font-awesome.min.css',
            'toastr/build/toastr.min.css',
            'toastr/build/toastr.min.js',
            'react',
            'react-dom',
            'react-router-dom',
            'redux',
            'react-redux',
            'redux-thunk'
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    //
    // externals: {
    //     'jquery': 'jQuery',
    //     'react': 'React',
    //     'react-dom': 'ReactDOM'
    // },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader'
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            // {
            //     test: /\.jsx?$/,
            //     exclude: /node_modules/,
            //     loader: 'babel-loader',
            // },
            {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: defaultCssLoaderOptions
                        },
                        {
                            loader: 'sass-loader',
                            options: Object.assign({}, defaultCssLoaderOptions, {
                                includePaths: ["./main/styles"]
                            })
                        }
                    ]
                })
            },
            {
                test: /\.svg$/,
                loader: 'url-loader',
                options: Object.assign({}, defaultFileLoaderOptions, {
                    mimetype: 'image/svg+xml'
                })
            },
            {
                test: /\.woff$/,
                loader: 'url-loader',
                options: Object.assign({}, defaultFileLoaderOptions, {
                    mimetype: 'application/font-woff'
                })
            },
            {
                test: /\.woff2$/,
                loader: 'url-loader',
                options: Object.assign({}, defaultFileLoaderOptions, {
                    mimetype: 'application/font-woff2'
                })
            },
            {
                test: /\.[ot]tf$/,
                loader: 'url-loader',
                options: Object.assign({}, defaultFileLoaderOptions, {
                    mimetype: 'application/octet-stream'
                })
            },
            {
                test: /\.eot$/,
                loader: 'url-loader',
                options: Object.assign({}, defaultFileLoaderOptions, {
                    mimetype: 'application/vnd.ms-fontobject'
                })
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                options: Object.assign({}, defaultFileLoaderOptions, {
                    mimetype: 'image/png'
                })
            }
        ]
    },

    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, '../install/common/docs')
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: module =>
                // this assumes the vendor imports exist in the node_modules directory
                module.context && module.context.indexOf('node_modules') !== -1
        }),

        new ExtractTextPlugin('[name]-[hash].css'),
        new HtmlWebpackPlugin({
            chunksSortMode: packageSort(['vendor', 'fonts', 'main']),
            favicon: './main/favicon.ico',
            template: path.resolve(__dirname, './main/index.html')
        }),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        //     React: 'react',
        //     ReactDOM: 'react-dom',
        //     ReactRouterDOM: 'react-router-dom',
        //     ReactRedux: 'react-redux',
        //     Redux: 'redux',
        //     ReduxThunk: 'redux-thunk'
        })
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss']
    }
}

function packageSort(packages) {
    return function sort(left, right) {
        var leftIndex = packages.indexOf(left.names[0]);
        var rightindex = packages.indexOf(right.names[0]);

        if (leftIndex < 0 || rightindex < 0) {
            throw "unknown package";
        }

        if (leftIndex > rightindex) {
            return 1;
        }

        return -1;
    }
}

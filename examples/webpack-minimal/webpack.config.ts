// Generated using webpack-cli https://github.com/webpack/webpack-cli
import 'webpack-dev-server'
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import { Configuration } from 'webpack';
import * as tsx from 'tsx/cjs/api'

const {default: UnpluginTypia}  = tsx.require('../../packages/unplugin-typia/src/webpack.ts', __filename)

const isProduction = process.env.NODE_ENV == 'production';


module.exports = () => {
    return {
        mode: isProduction ? 'production' : 'development',
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
        },
        devServer: {
            open: true,
            host: 'localhost',
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'index.html',
            }),
            UnpluginTypia(),
            isProduction && new WorkboxWebpackPlugin.GenerateSW(),
            // Add your plugins here
            // Learn more about plugins from https://webpack.js.org/configuration/plugins/
        ],
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/i,
                    loader: 'ts-loader',
                    exclude: ['/node_modules/'],
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                    type: 'asset',
                },

                // Add your rules for custom modules here
                // Learn more about loaders from https://webpack.js.org/loaders/
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
        },
    } as const satisfies Configuration;
};


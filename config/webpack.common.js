var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var helpers = require('./helpers');
var path = require('path');

module.exports = {
	entry: {
		//https://www.npmjs.com/package/date-input-polyfill
		'polyfills': [
			'core-js/client/shim.js',
			'core-js/es7/reflect.js',
			'zone.js/dist/zone.js',
			'web-animations-js/web-animations.min',
			'./src/polyfills.ts',
			'date-input-polyfill'
		],
		'app': './src/main.ts',
	},

	resolve: {
		alias: {
			lib: path.resolve('./src/lib/'),
			service: path.resolve('./src/service/')
		},
		extensions: ['.ts', '.js']
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: process.env.ENV === 'production' ? [
					'@ngtools/webpack'
				] : [
					'angular2-template-loader',
					'awesome-typescript-loader',
				]
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot)$/,
				loader: 'file-loader?name=assets/[name].[ext]'
			},
			{
				test: /\.css$/,
				exclude: [
					helpers.root('src', 'app')
				],
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: 'css-loader'
				})
			},
			{
				test: /\.css$/,
				include: helpers.root('src', 'app'),
				loader: 'raw-loader'
			}
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: ['app','polyfills']
		}),
		new webpack.ContextReplacementPlugin(
			// The (\\|\/) piece accounts for path separators in *nix and Windows
			// /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
			/angular(\\|\/)core(\\|\/)@angular/,
			helpers.root('./src'), // location of your src
			{} // a map of your routes
		),
		new CopyWebpackPlugin([
			{
				from: 'src/img',
				to: 'assets'
			},
			{
				from: 'src/js',
				to: 'js'
			},
			{
				from: 'src/file',
				to: 'file'
			}
		]),
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		})
	]
};
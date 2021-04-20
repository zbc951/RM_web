var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var ngtools = require('@ngtools/webpack');

module.exports = webpackMerge(commonConfig, {

	output: {
		path: helpers.root('dist'),
		publicPath: './',
		filename: '[name].js',
		chunkFilename: '[id].chunk.js'
	},

	plugins: [
		new ngtools.AotPlugin({
			skipCodeGeneration: false,
			tsConfigPath: './tsconfig.json',
			entryModule: helpers.root('src', 'app', 'app.module') + '#AppModule'
		}),
		new webpack.LoaderOptionsPlugin({
			test: /\.css$/, // optionally pass test, include and exclude, default affects all loaders
			minimize: true,
			debug: false
		}, {
			test: /\.html$/,
			minimize: true,
			removeAttributeQuotes: false,
			caseSensitive: true,
			customAttrSurround: [
				[/#/, /(?:)/],
				[/\*/, /(?:)/],
				[/\[?\(?/, /(?:)/]
			],
			customAttrAssign: [/\)?\]?=/]
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
			beautify: false,
			mangle: {
				screw_ie8: true,
				keep_fnames: true
			},
			compress: {
				warnings: false,
				screw_ie8: true
			},
			comments: false
		}),
		new ExtractTextPlugin('[name].css'),
		new webpack.DefinePlugin({
			'process.env': {
				'ENV': JSON.stringify(ENV)
			}
		}),

	]
});
var path = require('path');
var config = require('./webpack.config');
var glob = require('glob');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var testConfig = Object.assign({}, config, {
	entry: {
		specs: [].concat(glob.sync('./specs/*.js'))
             .concat(glob.sync('./specs/*.ts'))
					   .concat(glob.sync('./specs/*.tsx'))
             .map(function(file) {
               console.log('Loading ' + file);
               return path.resolve(file);
             })
	},
	
	output: {
		path: path.resolve('test'),
		filename: '[name].bundle.js'
	}
});

testConfig.module.loaders.push({
	test: /\.spec\.js$/,
	exclude: /node_modules/,
	loader: 'mocha!babel-loader?presets[]=react&presets[]=es2015'
});

testConfig.module.loaders.push({
	test: /\.spec\.tsx?$/,
	exclude: /node_modules/,
	loader: 'mocha!ts-loader'
});

testConfig.plugins.push(
	new BrowserSyncPlugin({
		host: 'localhost',
		port: 3000,
		server: {
			baseDir: ['test']
		},
		injectChanges: true
	})
);

module.exports = testConfig;
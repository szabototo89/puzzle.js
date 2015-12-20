var path = require('path');

module.exports = {
	entry: path.resolve('src/index.js'),
	output: {
		path: path.resolve('app'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ 
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader?presets[]=react&presets[]=es2015'
			}
		]
	}
};
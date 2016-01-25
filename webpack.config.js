var path = require('path');

module.exports = {
	entry: {
		src: path.resolve('./app/index.js')
	},
	
	context: path.resolve('./app'),

  devtool: 'source-map',

	resolve: {
		root: [ path.resolve('./app'), path.resolve('./node_modules') ],
		extensions: ['', '.ts', '.tsx', '.js']
	},
	
	output: {
		path: path.resolve('build'),
		filename: 'bundle.js'
	},
	
	module: {
		loaders: [
			{ 
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader?presets[]=react&presets[]=es2015'
			},
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
		]
	},

	ts: {
		compilerOptions: {
			jsx: 'react'
		}
	},

	plugins: []
};
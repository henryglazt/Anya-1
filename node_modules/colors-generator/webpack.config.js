const path = require('path')
const webpack = require('webpack')

const config = {
  base: {
    entry: './index.js',
    output: {
      path: path.join(__dirname, './build'),
      filename: 'colors-generator.js',
      library: "colorsGenerator",
      libraryTarget: "umd"
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }]
    },
    plugins: []
  },
  dev: {
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  },
  prod: {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        output: {
          ascii_only: true
        },
        compress: {
          warnings: false,
          drop_console: false
        }
      })
    ]
  }
}

module.exports = function(env) {
  return Object.assign(config.base, config[env])
}

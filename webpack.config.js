const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'web'
, entry: {
    'sandbox': './src/sandbox.js'
  , 'sandbox.min': './src/sandbox.js'
  }
, devtool: 'source-map'
, output: {
    path: path.resolve(__dirname, 'dist')
  , filename: '[name].js'
  , library: 'createGloriaSandbox'
  , libraryTarget: 'umd'
  }
, module: {
    rules: [
      {
        test: /\.js$/
      , exclude: /node_modules/
      , use: 'babel-loader'
      }
    ]
  }
, plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/
    , compress: {
        warnings: false
      }
    , comments: false
    })
  , new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
}

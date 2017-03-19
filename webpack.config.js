const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'web'
, entry: {
    'sandbox': './src/sandbox.js'
  , 'sandbox.min': './src/sandbox.js'
  }
, output: {
    path: path.resolve(__dirname, 'dist')
  , filename: '[name].js'
  , library: 'GloriaSandbox'
  , libraryTarget: 'umd'
  }
, module: {
    rules: [
      {
        test: /\.js$/
      , use: 'babel-loader'
      , include: [
          path.resolve(__dirname, 'node_modules/worker-sandbox')
        , path.resolve(__dirname, 'src')
        ]
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

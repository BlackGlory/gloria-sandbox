module.exports = function(config) {
  config.set({
    frameworks: ['mocha']
  , files: [
      'test/**/*.test.js'
    ]
  , preprocessors: {
      'test/**/*.test.js': ['webpack', 'sourcemap']
    }
  , webpack: require('./webpack.dev')
  , reporters: ['mocha']
  , colors: true
  , logLevel: config.LOG_INFO
  , autoWatch: true
  , browsers: ['Chrome_without_security'/*, 'Chrome', 'Firefox'*/]
  , customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome'
      , flags: ['--allow-file-access-from-files']
      }
    }
  , singleRun: false
  , concurrency: Infinity
  , coverageReporter: {
      type: 'lcov'
    }
  })
}

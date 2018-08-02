
const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isDev = process.env.WEBPACK_SERVE || process.env.NODE_ENV !== 'production'

let entry, output

if (!isDev) {
  entry = './src/index.ts'
  output = {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  }
} else {
  entry = './src/entry.develop.ts'
  output = {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  }
}

module.exports = {
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
  entry,
  output,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: 'vue-style-loader!css-loader!'
          }
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [
            '\\.vue$'
          ],
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.EnvironmentPlugin([
      'IMGUR_KEY'
    ])
  ],
  devtool: '#eval-source-map',
  serve: {
    content: path.join(__dirname, '../dist'),
    open: true,
    port: 1234
  }
}

if (!isDev) {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = [
    new VueLoaderPlugin(),
    new webpack.EnvironmentPlugin([
      'IMGUR_KEY'
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
} else {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ])
}

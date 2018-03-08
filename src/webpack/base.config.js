"use strict";
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HappyPack = require('happypack');


//改成func是因为要指定happypack的缓存路径到项目目录
function config(cwd, project,env){
  var less
  var css
  var scss
  if(env === 'production'){
    less = {test: /\.less$/, loader:ExtractTextPlugin.extract({fallback:"style-loader",use:['css-loader', 'less-loader']})}
    css = {test: /\.css$/, loader: ExtractTextPlugin.extract({fallback:"style-loader",use:['css-loader']})}
    scss = {test: /\.scss|sass$/, loader: ExtractTextPlugin.extract({fallback:"style-loader",use:['css-loader', 'sass-loader']})}
  }else{
    less = {test: /\.less$/, use:[ 'style-loader','css-loader','less-loader']};
    css = {test: /\.css$/, use:[ 'style-loader','css-loader']};
    scss = {test: /\.scss|sass$/, use:[ 'style-loader','css-loader','sass-loader']};
  }

  var externals = project.externals || {}

  return {

    context: cwd,
    entry: {
    },
    output: {
      // path: relative to cwd(current working directory), not work with path.resolve(__dirname, xxxx)
      path: '/static',
      publicPath: "/",
      filename: '[name].js'
    },
    module: {
      rules: [
        // 使用原生babel-loader
        // {
        //   test: /\.js[x]?$/,
        //   loader: 'babel-loader',
        //   exclude: /(node_modules|bower_components)/,
        //   options: {
        //     "id": "jsx",
        //     "cacheDirectory":true,
        //     "presets": [
        //       [
        //         "es2015", {"modules":false }
        //       ],
        //       "stage-1",
        //       "react"
        //     ],
        //     "plugins": [
        //       "transform-decorators-legacy",
        //       "transform-class-properties",
        //       "transform-object-rest-spread",
        //       "transform-decorators",
        //       "transform-runtime",
        //       "syntax-async-functions",
        //       "transform-regenerator",
        //       "transform-object-assign"
        //     ],
        //     "env": {
        //       "development": {
        //         "presets": ["react-hmre"]
        //       }
        //     }
        //   }
        // },

        //替换happypack loader
        {
          test: /\.js[x]?$/,
          loader: 'happypack/loader',
          exclude: /(node_modules|bower_components)/,
          options:{
            "id":"js"
          }
        },

        less,
        css,
        scss,

        { 
          test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/, 
          loader: 'url-loader?limit=10000' 
        },
      ],
    },
    resolve: {
      modules: ['node_modules', 'bower_components'],
      extensions: [".js", '.jsx',".json"],
      alias: {
        "@":path.resolve(cwd,'./src')
      }
    },
    externals: externals,
    plugins: [
      // new ExtractTextPlugin("[name].[hash].css"),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify( env || 'development' )
        }
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new HappyPack({
        id:"js",
        loaders:[
          {
            path:'babel-loader',
            query:{
              "presets": [
                [
                  "es2015", {"modules":false }
                ],
                "stage-1",
                "react"
              ],
              "plugins": [
                "transform-decorators-legacy",
                "transform-class-properties",
                "transform-object-rest-spread",
                "transform-decorators",
                "transform-runtime",
                "syntax-async-functions",
                "transform-regenerator",
                "transform-object-assign",
              ],
              "cacheDirectory":true
            },
            "env": {
              "development": {
                "presets": ["react-hmre"]
              }
            }
          }
        ],
        threads:10
      })
    ]
  };
}

// merge webpack config options
function merge(target, source) {
  // base props
  target = Object.assign( {}, target, _.pick(source, ['devtool', 'mode', 'target']) )

  target.entry = Object.assign({}, target.entry, source.entry)
  target.output = Object.assign({}, target.output, source.output)
  target.plugins = target.plugins.concat( source.plugins )


  return target
}

module.exports.makeConfig = function(newConfig,cwd, project, env) {
  return merge(_.cloneDeep(config(cwd, project, env)), newConfig);
}

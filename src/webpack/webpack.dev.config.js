var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var makeConfig = require("./base.config.js").makeConfig;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

// var final = 'webpack-hot-middleware/client' + (project.staticUrl ? `?${project.staticUrl}` : '')
// console.log(`final: ${final}`)


module.exports = function (cwd, project) {

  var entries = _.mapValues(project.entries, function (v, k) {
    var path = project.staticUrl && project.staticUrl !== '' ? '?path=' + project.staticUrl + '/__webpack_hmr' : "";
    //这个v必须放最后,不然热部署会有问题
    return ['webpack-hot-middleware/client' + path, 'webpack/hot/dev-server',  v]; //['webpack-dev-server/client?http://localhost:3000/']
  });

  var keys = _.keys(project.entries);
  keys.push('vendors');

  return makeConfig({
    // context: cwd,
    devtool: "cheap-module-eval-source-map",
    //为每个entry增加hot load
    entry: entries,
    target: 'web',
    mode:'development',
    output: {
      // 如果webpack-server的端口与app-server的端口不一样，hmr会使用这个路径作为前缀，加载热补丁
      publicPath: project.staticUrl + '/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      // new webpack.optimization.splitChunks({
      //   chunks:'all'
      // }),
      new HtmlWebpackPlugin({
        chunks:keys,
        hash:true,
        // filename:cwd+'/.temp/index.html',//分模块文件夹
        template: cwd+'/template.html'
      }),
    ]
  }, cwd, project);
};

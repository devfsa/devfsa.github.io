const path = require('path');

module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'js/index.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ["@babel/preset-env"] }
                },
                test: /\.css$/,
                use: { loader: 'css-loader' }
            }
        ]
    },
    devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, '/'),
        publicPath: path.resolve(__dirname, 'build'),
        compress: false,
        port: 8080,
        hot: true
      }
}
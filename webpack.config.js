const path = require("path");

module.exports = {
  entry: path.join(__dirname, "frontend", "instagraph.jsx"),
  output: {
    path: path.join(__dirname, "app", "assets", "javascripts"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".js", ".jsx", "*"]
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env', '@babel/react'],
            plugins: ["emotion"]
          }
        },
        exclude: /node_modules/
      }
    ]
  }
};

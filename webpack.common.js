const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    index: path.join(__dirname, "src/main.tsx"),
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader", // Creates style nodes from JS strings
          },
          {
            loader: "css-loader", // Translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // Compiles Sass to CSS
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/uikit/dist/css/uikit.min.css",
          to: path.join(__dirname, "dist/css"),
        },
        {
          from: "./node_modules/uikit/dist/js/uikit.min.js",
          to: path.join(__dirname, "dist/js"),
        },
        {
          from: "./node_modules/uikit/dist/js/uikit-icons.min.js",
          to: path.join(__dirname, "dist/js"),
        }
      ],
    }),
  ],
};

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
   mode: "production",
   entry: {
      background: ["./src/background/background.ts"],
      popup: ["./src/popup/popup.ts"],
      content: ["./src/content/content.ts"]
   },
   output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name].js"
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            loader: "ts-loader",
            exclude: /node_modules/
         }
      ]
   },
   plugins: [
      new CopyPlugin({
         patterns: [{from: ".", to: ".", context: "public"}]
      })
   ]
};
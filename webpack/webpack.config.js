const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
   mode: "production",
   entry: {
      "background": ["./src/domain/background/background.ts"],
      "popup": ["./src/domain/popup/popup.ts"],
      "html-page-content": ["./src/domain/content/html-page-content.ts"],
      "preview-page-content": ["./src/domain/content/preview-page-content.ts"]
   },
   output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name].js"
   },
   resolve: {
      extensions: [".ts", ".js"]
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
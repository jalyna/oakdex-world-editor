var path = require('path');

module.exports = {
  entry: "./src/demo/index.tsx",

  output: {
    filename: "bundle.js",
    path: __dirname + "/public"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      'components': path.resolve(__dirname, 'src/components/'),
      'shared': path.resolve(__dirname, 'src/shared/'),
    }
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    publicPath: '/',
    historyApiFallback: true
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      {
        test: /\.(png|jp(e*)g|svg)$/,  
        use: [{
          loader: 'url-loader',
          options: { 
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[hash]-[name].[ext]'
          } 
        }]
      }
    ]
  }
};

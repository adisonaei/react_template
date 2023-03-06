const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');
const devMode = process.env.NODE_ENV !== "production";


/*We are basically telling webpack to take index.js from entry. Then check for all file extensions in resolve. 
After that apply all the rules in module.rules and produce the output and place it in main.js in the public folder.*/
const pages = ["page1", "page2"];
//var myentries = [];
//console.log('entries=',entries);
//pages.forEach( (page)=>{ myentries[page] = `./src/pages/${page}/${page}.js`});
const entries=  {};
pages.forEach( (page)=>{
  entries[''+page] = [`./src/pages/${page}/index.js`];
});

console.log(entries);
module.exports={
    /** "mode"
     * the environment - development, production, none. tells webpack 
     * to use its built-in optimizations accordingly. default is production 
     */
    mode: "development", 
    /** "entry"
     * the entry point 
     */
  
    entry: entries, 
    output: {
        /** "path"
         * the folder path of the output file 
         */
        path: path.resolve(__dirname, "build"),
        /** "filename"
         * the name of the output file 
         */
        filename: 'js/[name]_[contenthash].js'
    },
    /** "target"
     * setting "node" as target app (server side), and setting it as "web" is 
     * for browser (client side). Default is "web"
     */
    target: "web",
    devServer: {
        /** "port" 
         * port of dev server
        */
        port: "3000",
        /** "static" 
         * This property tells Webpack what static file it should serve
        */
        static: ["./public"],
        /** "open" 
         * opens the browser after server is successfully started
        */
        open: true,
        /** "hot"
         * enabling and disabling HMR. takes "true", "false" and "only". 
         * "only" is used if enable Hot Module Replacement without page 
         * refresh as a fallback in case of build failures
         */
        hot: true ,
        /** "liveReload"
         * disable live reload on the browser. "hot" must be set to false for this to work
        */
        liveReload: true,
        proxy: {
          '/dataservices': {
               target: 'http://localhost:3000',
               router: () => 'http://localhost:8081',
               logLevel: 'debug' /*optional*/
          }
       }
    },
    resolve: {
        /** "extensions" 
         * If multiple files share the same name but have different extensions, webpack will 
         * resolve the one with the extension listed first in the array and skip the rest. 
         * This is what enables users to leave off the extension when importing
         */
        extensions: ['.js','.jsx','.json'] 
    },
    module:{
        /** "rules"
         * This says - "Hey webpack compiler, when you come across a path that resolves to a '.js or .jsx' 
         * file inside of a require()/import statement, use the babel-loader to transform it before you 
         * add it to the bundle. And in this process, kindly make sure to exclude node_modules folder from 
         * being searched"
         */
        rules: [
            {
                test: /\.(js|jsx)$/,    //kind of file extension this rule should look for and apply in test
                exclude: /node_modules/, //folder to be excluded
                use:  'babel-loader' //loader which we are going to use
            } ,
            {
              test: /\.(sa|sc|c)ss$/i,
              use: [
                devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                "css-loader",
                "postcss-loader",
                "sass-loader",
              ],
            }
        ]
    },
    optimization: {
        splitChunks: {
          chunks: "all",
        },
      },

      
      
    plugins: [

      new RemovePlugin({
        before: {
            // parameters for "before normal compilation" stage.
            include: [
              './build'
          ]
        },
        watch: {
            // parameters for "before watch compilation" stage.
        },
        after: {
            // parameters for "after normal and watch compilation" stage.
        }
    })

    ].concat(
        pages.map(
          (page) =>
            new HtmlWebpackPlugin({
              inject: true,
              template: `./public/index.html`,
              filename: `/${page}/${page}.html`,
              publicPath : '../',
              chunks: [page+''],
            })
        )
      ),
}
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

dotenv.config();

module.exports = function (env) {
    return {
        mode: env.production ? "production" : "development",
        entry: path.join(__dirname, "src", "index.jsx"),
        output: {
            path: path.resolve(__dirname, "dist"),
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react",
                                "@babel/preset-typescript",
                            ],
                        },
                    },
                },
            ],
        },
        devServer: {
            historyApiFallback: true,
        },
        plugins: [
            new htmlWebpackPlugin({
                template: path.join(__dirname, "src", "index.html"),
            }),
            new webpack.ProgressPlugin(),
            new webpack.DefinePlugin({
                "process.env.SERVER_URL": JSON.stringify(
                    process.env.SERVER_URL
                ),
            }),
        ],
    };
};

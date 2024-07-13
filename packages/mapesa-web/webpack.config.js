const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = function (env) {
    return {
        mode: env.production ? "production" : "development",
        entry: path.join(__dirname, "src", "index.jsx"),
        output: {
            path: path.resolve(__dirname, "dist"),
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
                                ...(env.production
                                    ? []
                                    : [
                                          "@babel/plugin-transform-react-jsx-development",
                                      ]),
                            ],
                        },
                    },
                },
            ],
        },
        plugins: [
            new htmlWebpackPlugin({
                template: path.join(__dirname, "src", "index.html"),
            }),
            new webpack.ProgressPlugin(),
        ],
    };
};

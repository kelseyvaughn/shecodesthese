var webpack = require('webpack');
var path = require('path');

var PUBLIC_DIR = path.resolve(__dirname, 'src/public');
var BUILD_DIR = path.resolve(__dirname, 'src/build'); 

var config = {
    entry: [
        BUILD_DIR + '/main.jsx'
    ],
    output: {
        path: PUBLIC_DIR,
        publicPath: '/assets/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: BUILD_DIR,
                loader: 'babel' 
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.$": "jquery",
            "window.jQuery": "jquery",
            TweenLite: "gsap",
            "window.TweenLite": "gsap",
            paper: "paper",
            "window.paper": "paper"
        })
    ],
    watch: true
};

module.exports = config;
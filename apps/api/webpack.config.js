const { composePlugins, withNx } = require('@nx/webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    config.plugins.push(new CleanWebpackPlugin());
    config.plugins.push(new webpack.IgnorePlugin(WebPackIgnorePlugin));
    return config;
});

const WebPackIgnorePlugin = {
    checkResource: function (resource) {
        const lazyImports = [
            '@nestjs/microservices',
            '@nestjs/microservices/microservices-module',
            'cache-manager',
            'class-transformer',
            'class-validator',
            'fastify-static',
            'utf-8-validate',
            'bufferutil',
        ];

        if (!lazyImports.includes(resource)) return false;

        try {
            require.resolve(resource);
        } catch (err) {
            return true;
        }

        return false;
    },
};

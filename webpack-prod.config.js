const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * Webpack configuration for production builds
 * Optimized for performance, size, and security
 */
module.exports = function (options) {
  return {
    ...options,
    mode: 'production',
    devtool: 'hidden-source-map',
    externals: [nodeExternals({ allowlist: [] })],
    plugins: [
      ...options.plugins,
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: false, drop_debugger: true },
            mangle: true,
            output: { comments: false },
          },
        }),
      ],
      removeAvailableModules: true,
      removeEmptyChunks: true,
      usedExports: true,
      concatenateModules: true,
      moduleIds: 'deterministic',
    },
    performance: { hints: 'warning', maxEntrypointSize: 512000 },
    output: { ...options.output, clean: true, pathinfo: false },
  };
};

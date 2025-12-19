const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

/**
 * Webpack configuration for NestJS development with Hot Module Replacement (HMR)
 * This configuration enables fast development cycles with automatic reloading
 *
 * Features:
 * - Hot Module Replacement for instant updates
 * - File watching with optimized polling
 * - Automatic server restart on changes
 * - Source maps for debugging
 */
module.exports = function (options, webpack) {
  return {
    ...options,
    // Entry point with HMR polling - checks for changes every 100ms
    entry: ['webpack/hot/poll?100', options.entry],

    // Watch configuration for optimal file watching
    watchOptions: {
      // Aggregate changes over 300ms to avoid excessive rebuilds
      aggregateTimeout: 300,
      // Use polling for better compatibility across file systems
      poll: 1000,
      // Ignore node_modules, dist, and test files for performance
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/test/**',
        '**/coverage/**',
        '**/.git/**',
      ],
    },

    // Externals configuration - don't bundle node_modules
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],

    // Plugins for HMR and development
    plugins: [
      ...options.plugins,
      // Enable Hot Module Replacement
      new webpack.HotModuleReplacementPlugin(),
      // Ignore compiled files and type definitions
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      // Run the server after compilation
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        // Don't auto-restart - let HMR handle updates
        autoRestart: false,
        // Show clear signals when restarting
        signal: true,
        // Keyboard shortcut to manually restart
        keyboard: true,
      }),
    ],

    // Performance hints - disable in development
    performance: {
      hints: false,
    },

    // Optimization settings for development
    optimization: {
      // Remove modules even if they are used elsewhere
      removeAvailableModules: false,
      // Don't remove empty chunks
      removeEmptyChunks: false,
      // Don't split chunks in development
      splitChunks: false,
    },

    // Output configuration
    output: {
      ...options.output,
      // Keep output path clean
      clean: true,
    },
  };
};

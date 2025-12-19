const nodeExternals = require('webpack-node-externals');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * Webpack configuration for bundle analysis
 * Run with: npm run build:analyze
 */
module.exports = function (options) {
  return {
    ...options,
    mode: 'production',
    externals: [nodeExternals({ allowlist: [] })],
    plugins: [
      ...options.plugins,
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../bundle-report.html',
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: '../bundle-stats.json',
      }),
    ],
    optimization: {
      minimize: true,
      usedExports: true,
      concatenateModules: true,
      moduleIds: 'deterministic',
    },
  };
};

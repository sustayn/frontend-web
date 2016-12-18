const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');

module.exports = function(config) {
  return {
    // Capture Timing information
    profile: true,
    // Always use the progress bar plugin
    plugins: config.NO_PROGRESS ? [] : [
      new ProgressBarPlugin({
        width:  100,
        clear:  false,
        format: `  ${(process.env.npm_lifecycle_event)} ` +
                `[${chalk.green.bold(':bar')}] ${chalk.cyan.bold(':percent')} ` +
                `|| ${chalk.green.bold(':elapsed s')} `,
      }),
    ],
    node: {
      fs: 'empty',
    }
  };
};
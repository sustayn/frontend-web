const chalk = require('chalk');
const exec = require('child_process').exec;

const puts = (error, stdout, stderr) => {
    console.log(stdout);
};

function WebpackShellPlugin(options) {
    const defaultOptions = {
        onBuildEnd:  [],
        mainProcess: '',
    };

    this.startTime = Date.now();
    this.prevTimestamps = null;
    this.options = Object.assign(defaultOptions, options);
}

WebpackShellPlugin.prototype.apply = function(compiler) {
    const options = this.options;

    compiler.plugin('after-emit', (compilation, callback) => {

        if(options.onBuildEnd.length){

            if (!this.prevTimestamps) {
                executeScript();
            } else {
                Object.keys(compilation.fileTimestamps).forEach((watchFile) => {
                    let status = (this.prevTimestamps[watchFile] || this.startTime) < (compilation.fileTimestamps[watchFile] || Infinity);
                    if (status && watchFile.includes(options.mainProcess)) {
                        executeScript();
                    }
                });
            }

            this.prevTimestamps = compilation.fileTimestamps;
            this.startTime = Date.now();

        }
        callback();

    });

    const executeScript = () => {
        console.log(chalk.cyan.bold('\nExecuting post-build script'));
        options.onBuildEnd.forEach((script) => exec(script, puts));
    }
};

module.exports = WebpackShellPlugin;
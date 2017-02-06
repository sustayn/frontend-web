const Mocha = require('mocha');
const path = require('path');
const deasync = require('deasync');
const recursiveSync = deasync(require('recursive-readdir'));
const chokidar = require('chokidar');

// Get the passed in flags
const flags = process.argv.slice(2);

// For now, always run with ELECTRON flag
process.env.ELECTRON = 'true';

// Set up jsdom and test helpers
require('jsdom-global/register');
require('./testHelper.js');
require('./assetsNullCompiler.js');

// Set up babel compiling
require('babel-core/register');

const mocha = new Mocha({
  reporter: 'dot',
});

const integrationDir = 'test/integration';
const unitDir = 'test/unit';
// If flags has --only, test only the name of the suite passed in
const tests = flags.includes('--only') ?
  [`test/${flags[flags.indexOf('--only') + 1]}`] :
  [integrationDir, unitDir];

// Add the files
tests.forEach((dirName) => {
  recursiveSync(dirName)
  .filter((file) => file.substr(-3) === '.js')
  .forEach((file) => {
    mocha.addFile(file);
  });
});

// Start Mirage
require('../mirage').default;

// Run the tests. If there are any failure exit with a non 0 code to indicate failure
mocha.run((failures) => {
  // If not watching, exit with errors
  if(!flags.includes('--watch')) {
    process.exit(failures);
  }
});

// If watching use chokidar to watch app, mirage, and test and rerun the tests on a file change
const appDir = path.join(__dirname, '../app');
const mirageDir = path.join(__dirname, '../mirage');
const testDir = path.join(__dirname, '../test');

if(flags.includes('--watch')) {
  const watcher = chokidar.watch([
    appDir,
    mirageDir,
    testDir,
  ], { persistent: true });

  watcher.on('change', () => {
    invalidate();
    mocha.run();
  });
}

// Lifted from https://github.com/mochajs/mocha/issues/2061
function invalidate() {
  mocha.suite.suites = [];
  [appDir, testDir].forEach((dirName) => {
    recursiveSync(dirName).forEach((file) => {
      file = path.resolve(file);
      delete require.cache[require.resolve(file)];
    });
  });
}
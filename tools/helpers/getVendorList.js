const fs = require('fs');
const deasync = require('deasync');
const recursiveSync = deasync(require('recursive-readdir'));
const uniq = require('lodash/uniq');
const difference = require('lodash/difference');

const appFolders = [
    'app',
    'mirage',
    'actions',
    'channels',
    'containers',
    'libs',
    'reducers',
    'services',
    'styles',
    'utils',
    'views',
];
/*
  Regex explanation:
  FIRST it checks for either `import` followed by any number of any characters OR `require(`
  THEN it matches the character ' literally
  THEN it makes a capturing group where it takes everything up to the literal character '
  IGNORING anything that starts with a . OR from the list of appFolders
*/
const importRegex = new RegExp(`(?:(?:import.*|require\\()')((?!\\.|${appFolders.join('|')}).*)'`, 'g');

module.exports = function getVendorList(exclude, include) {
    const files = recursiveSync('./app');
    let arr = [];

    files.forEach(function(file) {
        const data = fs.readFileSync(file, 'utf8');
        while(match = importRegex.exec(data)) {
            arr.push(match[1]);
        }
    });

    arr = uniq(arr);
    if(exclude && Array.isArray(exclude)) arr = difference(arr, exclude);
    if(include && Array.isArray(include)) arr = arr.concat(include);
    return arr;
};
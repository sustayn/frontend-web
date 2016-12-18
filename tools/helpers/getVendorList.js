const fs = require('fs');
const deasync = require('deasync');
const recursiveSync = deasync(require('recursive-readdir'));
const uniq = require('lodash/uniq');
const difference = require('lodash/difference');

const importRegex = /(?:import.*')((?!\.).*)'/g;

module.exports = function getVendorList(exclude, include) {
  const files = recursiveSync('./app')
  let arr = [];

  files.forEach(function(file) {
    let data = fs.readFileSync(file, 'utf8');
    while(match = importRegex.exec(data)) {
      arr.push(match[1]);
    }
  });

  arr = uniq(arr);
  if(exclude && Array.isArray(exclude)) arr = difference(arr, exclude);
  if(include && Array.isArray(include)) arr = arr.concat(include);

  return arr;
};
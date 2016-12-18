const BROWSER_LIST = [
  'last 2 versions', '>1%', 'last 1 and_ff version', 'not ie <= 11',
  'not ie_mob <= 11', 'not edge <= 13', 'not op_mini all', 'not opera <= 39',
  'not safari < 10', 'not and_uc <= 10', 'not ios_saf < 19', 'not samsung < 5',
  'not android < 5',
]

module.exports = {
  plugins: [
    require('autoprefixer')({ browsers: [BROWSER_LIST] }),
  ]
};
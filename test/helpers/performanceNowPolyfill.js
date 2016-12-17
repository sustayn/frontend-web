// @license http://opensource.org/licenses/MIT
// copyright Paul Irish 2015


// Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
//   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values

// if you want values similar to what you'd get with real perf.now, place this towards the head of the page
// but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed


module.exports = function() {

    const root = typeof window === 'undefined' ? {} : window;

    if('performance' in root === false) {
        root.performance = {};
    }

    Date.now = (Date.now || function() {  // thanks IE8
        return new Date().getTime();
    });

    if('now' in root.performance === false) {

        let nowOffset = Date.now();

        if(root.performance.timing && root.performance.timing.navigationStart) {
            nowOffset = root.performance.timing.navigationStart;
        }

        root.performance.now = () => {
            return Date.now() - nowOffset;
        };
    }

    return root.performance;

};
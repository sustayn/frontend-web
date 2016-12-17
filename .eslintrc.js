module.exports = {
  "plugins": ["react"],
  // https://github.com/babel/babel-eslint
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  // http://eslint.org/docs/user-guide/configuring.html#specifying-environments
  "env": {
    // browser global variables
    "browser": true,
    // enable all ECMAScript 6 features except for modules
    "es6": true,
    // Node.js global variables and Node.js-specific rules
    "node": true,
  },
  "ecmaFeatures": {
    // enable ES6 modules and global strict mode
    "modules": true,
    "jsx": true,
  },
  "rules": {
    /** BABEL */
    // Require parens in arrow function arguments
    // http://eslint.org/docs/rules/arrow-parens
    "arrow-parens": [2, "always"],
    // Require space before/after arrow function's arrow
    // http://eslint.org/docs/rules/arrow-spacing
    "arrow-spacing": [2, {
        "before": true,
        "after": true,
    }],
    // Verify calls of super() in constructors
    // http://eslint.org/docs/rules/constructor-super
    "constructor-super": 2,
    // Enforce spacing around the * in generator functions
    // http://eslint.org/docs/rules/generator-star-spacing
    "generator-star-spacing": [2, {
        "before": false,
        "after": true,
    }],
    // Disallow duplicate name in class members
    // http://eslint.org/docs/rules/no-dupe-class-members
    "no-dupe-class-members": 2,
    // Disallow use of this/super before calling super() in constructors
    // http://eslint.org/docs/rules/no-this-before-super
    "no-this-before-super": 2,
    // Require let or const instead of var
    // http://eslint.org/docs/rules/no-var
    "no-var": 2,
    // Suggest using arrow functions as callbacks
    // http://eslint.org/docs/rules/prefer-arrow-callback
    "prefer-arrow-callback": 2,
    // Suggest using const, if a variable is never modified
    // http://eslint.org/docs/rules/prefer-const
    "prefer-const": 2,
    // Suggest using the spread operator instead of .apply()
    // http://eslint.org/docs/rules/prefer-spread
    "prefer-spread": 2,
    // Suggest using template literals instead of string concatenation
    // http://eslint.org/docs/rules/prefer-template
    "prefer-template": 2,

    /** ERRORS */
    // Enforce Dangling Commas
    // http://eslint.org/docs/rules/comma-dangle
    "comma-dangle": [2, "always-multiline"],
    // Disallow Assignment in Conditional Statements
    // http://eslint.org/docs/rules/no-cond-assign
    "no-cond-assign": [2, "always"],
    // Disallow Use of console
    // http://eslint.org/docs/rules/no-console
    "no-console": 0,
    // Disallow use of constant expressions in conditions
    // http://eslint.org/docs/rules/no-control-regex
    "no-constant-condition": 2,
    // Disallow Controls Characters in Regular Expressions
    // http://eslint.org/docs/rules/no-control-regex
    "no-control-regex": 2,
    // Disallow debugger
    // http://eslint.org/docs/rules/no-debugger
    "no-debugger": 1,
    // No duplicate arguments
    // http://eslint.org/docs/rules/no-dupe-args
    "no-dupe-args": 2,
    // Disallow Duplicate Keys
    // http://eslint.org/docs/rules/no-dupe-keys
    "no-dupe-keys": 2,
    // Disallow a duplicate case label
    // http://eslint.org/docs/rules/no-duplicate-case
    "no-duplicate-case": 2,
    // Disallow Empty Character Classes
    // http://eslint.org/docs/rules/no-empty-character-class
    "no-empty-character-class": 2,
    // Disallow Empty Block Statements
    // http://eslint.org/docs/rules/no-empty
    "no-empty": 2,
    // Disallow Assignment of the Exception Parameter
    // http://eslint.org/docs/rules/no-ex-assign
    "no-ex-assign": 2,
    // Disallow Extra Boolean Casts
    // http://eslint.org/docs/rules/no-extra-boolean-cast
    "no-extra-boolean-cast": 2,
    // Disallow Extra Semicolons
    // http://eslint.org/docs/rules/no-extra-semi
    "no-extra-semi": 2,
    // Disallow Function Assignment
    // http://eslint.org/docs/rules/no-func-assign
    "no-func-assign": 2,
    // Disallow Declarations in Program or Function Body
    // http://eslint.org/docs/rules/no-inner-declarations
    "no-inner-declarations": 2,
    // Disallow Invalid Regular Expressions
    // http://eslint.org/docs/rules/no-invalid-regexp
    "no-invalid-regexp": 2,
    // Disallow irregular whitespace
    // http://eslint.org/docs/rules/no-irregular-whitespace
    "no-irregular-whitespace": 2,
    // Disallow negated left operand of in operator
    // http://eslint.org/docs/rules/no-negated-in-lhs
    "no-negated-in-lhs": 2,
    // Disallow Global Object Function Calls
    // http://eslint.org/docs/rules/no-obj-calls
    "no-obj-calls": 2,
    // Disallow Multiple Spaces in Regular Expressions
    // http://eslint.org/docs/rules/no-regex-spaces
    "no-regex-spaces": 2,
    // Disallow Sparse Arrays
    // http://eslint.org/docs/rules/no-sparse-arrays
    "no-sparse-arrays": 2,
    // Disallow Unreachable Code
    // http://eslint.org/docs/rules/no-unreachable
    "no-unreachable": 2,
    // Require isNaN()
    // http://eslint.org/docs/rules/use-isnan
    "use-isnan": 2,
    // Ensures that the results of typeof are compared against a valid string
    // http://eslint.org/docs/rules/valid-typeof
    "valid-typeof": 2,
    // Avoid unexpected multiline expressions
    // http://eslint.org/docs/rules/block-scoped-var
    "no-unexpected-multiline": 2,

    /** REACT */
    // Enforce JSX Quote Style
    // http://eslint.org/docs/rules/jsx-quotes
    "jsx-quotes": [2, "prefer-single"],
    // Enforce boolean attributes notation in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
    "react/jsx-boolean-value": [2, "never"],
    // Validate closing bracket location in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
    "react/jsx-closing-bracket-location": [2],
    // Disallow spaces inside of curly braces in JSX attributes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
    "react/jsx-curly-spacing": [2, "never"],
    // Validate props indentation in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
    "react/jsx-indent-props": [2, 4],
    // Prevent duplicate properties in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
    "react/jsx-no-duplicate-props": 2,
    // Disallow undeclared variables in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
    "react/jsx-no-undef": 2,
    // Prevent React to be incorrectly marked as unused
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
    "react/jsx-uses-react": 2,
    // Prevent variables used in JSX to be incorrectly marked as unused
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
    "react/jsx-uses-vars": 2,
    // Prevent usage of dangerous JSX properties
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
    "react/no-danger": 2,
    // Prevent usage of setState in componentDidMount
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-mount-set-state.md
    "react/no-did-mount-set-state": 2,
    // Prevent usage of setState in componentDidUpdate
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
    "react/no-did-update-set-state": 2,
    // Prevent direct mutation of this.state
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
    "react/no-direct-mutation-state": 2,
    // Prevent multiple component definition per file
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
    "react/no-multi-comp": 0,
    // Prevent usage of unknown DOM property
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
    "react/no-unknown-property": 2,
    // Prefer ES6 classes over React.createClass
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md
    "react/prefer-es6-class": 2,
    // Prevent missing React when using JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
    "react/react-in-jsx-scope": 2,
    // Prevent extra closing tags for components without children
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
    "react/self-closing-comp": 2,
    // Enforce component methods order
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
    "react/sort-comp": [2, {
        "order": [
            "displayName",
            "propTypes",
            "contextTypes",
            "childContextTypes",
            "mixins",
            "statics",
            "defaultProps",
            "constructor",
            "getDefaultProps",
            "getInitialState",
            "getChildContext",
            "componentWillMount",
            "componentDidMount",
            "componentWillReceiveProps",
            "shouldComponentUpdate",
            "componentWillUpdate",
            "componentDidUpdate",
            "componentWillUnmount",
            "everything-else",
            "/^on.+$/",
            "/^get.+$/",
            "/^render.+$/",
            "render",
        ],
    }],
    // Prevent missing parentheses around multilines JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/wrap-multilines.md
    "react/jsx-wrap-multilines": 2,

    /** STYLE */
    // Disallow spaces inside of brackets
    // http://eslint.org/docs/rules/array-bracket-spacing
    "array-bracket-spacing": [2, "never", {
        "singleValue": false,
        "objectsInArrays": false,
        "arraysInArrays": false
    }],
    // Enforce spaces inside of single line blocks
    // http://eslint.org/docs/rules/block-spacing
    "block-spacing": [2, "always"],
    // Enforce Brace Style
    // http://eslint.org/docs/rules/brace-style
    "brace-style": [2, "1tbs", {
        "allowSingleLine": true,
    }],
    // Enforce spacing around commas
    // http://eslint.org/docs/rules/comma-spacing
    "comma-spacing": [2, {
        "before": false,
        "after": true,
    }],
    // Enforce Comma Style
    // http://eslint.org/docs/rules/comma-style
    "comma-style": [2, "last"],
    // Require files to end with single newline
    // http://eslint.org/docs/rules/eol-last
    "eol-last": 0,
    // Enforce Indentation
    // http://eslint.org/docs/rules/indent
    "indent": [2, 4, {
        "SwitchCase": 1,
    }],
    // Enforce Property Spacing
    // http://eslint.org/docs/rules/key-spacing
    "key-spacing": [2, {
        "beforeColon": false,
        "afterColon": true,
        "align": "value"
    }],
    // Enforce consistent spacing before and after keywords
    // http://eslint.org/docs/rules/keyword-spacing
    "keyword-spacing": [2, { "overrides": {
        "if": { "after": false },
        "for": { "after": false },
        "while": { "after": false },
        "switch": { "after": false },
        "catch": { "after": false }
    } }],
    // Require Constructors to Use Initial Caps
    // http://eslint.org/docs/rules/new-cap
    "new-cap": [2, {
        "newIsCap": true,
        "capIsNew": false,
    }],
    // Require Parens for Constructors
    // http://eslint.org/docs/rules/new-parens
    "new-parens": 2,
    // Disallow mixed spaces and tabs for indentation
    // http://eslint.org/docs/rules/no-mixed-spaces-and-tabs
    "no-mixed-spaces-and-tabs": 2,
    // Disallow Spaces in Function Calls
    // http://eslint.org/docs/rules/no-spaced-func
    "no-spaced-func": 2,
    // Enforce Quote Style
    // http://eslint.org/docs/rules/quotes
    "quotes": [2, "single", {"avoidEscape": true, "allowTemplateLiterals": true}],
    // Enforce Semicolons
    // http://eslint.org/docs/rules/semi
    "semi": [2, "always"],
    // Require Space Before Blocks
    // http://eslint.org/docs/rules/space-before-blocks
    "space-before-blocks": [2, "always"],
    // Disallow a space before function parenthesis
    // http://eslint.org/docs/rules/space-before-function-paren
    "space-before-function-paren": [2, "never"],
    // Disallow spaces inside of parentheses
    // http://eslint.org/docs/rules/space-in-parens
    "space-in-parens": [2, "never"],
    // Require Spaces Around Infix Operators
    // http://eslint.org/docs/rules/space-infix-ops
    "space-infix-ops": 2,
    // Require or disallow spaces before/after unary operators
    // http://eslint.org/docs/rules/space-unary-ops
    "space-unary-ops": [1, {
        "words": true,
        "nonwords": false,
    }],
  }
}
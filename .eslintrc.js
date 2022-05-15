'use strict'

module.exports = {
  extends: 'eslint-config-egg',
  rules: {
    'comma-dangle': [ 'error', 'never' ],
    semi: [ 'error', 'never' ],
    'no-unused-vars': 'warn',
    'jsdoc/check-tag-names': [
      'warn',
      {
        definedTags: [ 'router', 'request', 'response', 'controller' ]
      }
    ]
  }
}

/*
 * @Author: yolo
 * @Date: 2022-08-03 20:15:48
 * @Email: 2458097476@qq.com
 * @LastEditors: yolo
 * @LastEditTime: 2022-08-04 00:05:41
 * @Description: file information
 */
// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 回车换行符兼容window
    'linebreak-style':[0,'error','window'],
    // 禁止log语句
    'no-console': 'off',
    // 禁止绝对引入必须要在相对引入之前
    'import/first': [ 'error', 'DISABLE-absolute-first' ],
    // 禁止未使用的表达式
    'no-unused-expressions': 'off',
    // 禁止下划线开头的变量声明
    "no-underscore-dangle": 'off',
    // 禁止未声明的调用
    "no-use-before-define": 'off',
    // 严格等于
    "eqeqeq": 'off',
    // 禁止无return的函数
    "no-return-assign": 'off',
    // 禁止对形参重赋值
    "no-param-reassign": 'off',
    // 禁止匿名函数
    "func-names": 'off'
  }
}

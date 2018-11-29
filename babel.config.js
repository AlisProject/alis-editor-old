module.exports = {
  presets: [
    '@vue/app'
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { modules: 'cjs' }]
      ]
    }
  }
}

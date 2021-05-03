const marked = require('marked')
const renderer = new marked.Renderer()

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/coastviewer-static/' : '/',
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader'
            },
            {
              loader: 'markdown-loader',
              options: {
                pedantic: true,
                renderer
              }
            }
          ]

        }
      ]
    }
  }
}

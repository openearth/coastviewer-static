const marked = require('marked')
const renderer = new marked.Renderer()

renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/coastviewer-static/' : '/',

  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            {
              loader: 'vue-html-loader'
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

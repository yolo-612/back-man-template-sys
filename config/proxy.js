const proxy = {}

const apisProxy = ['portal-exp-order', 'portal-exp-query', 'online-signing']
apisProxy.forEach(api => {
  // 一旦devServer服务器接收到 /api/xxx 的请求，就会把请求转发到另一个服务器
  // 浏览器和服务器之间有跨域，但是服务器和服务器之间没有跨域
  proxy[`/${api}`] = {
    target: 'http://v.sit.sf-express.com/',
    changeOrigin: true,
    pathRewrite: {},
    secure: false
  }
  // 发送请求时，请求路径重写：将 /api/xxx --> /xxx （去掉/api）{'^/api': ''}
  proxy[`/${api}`].pathRewrite[`^/${api}`] = `/${api}`
})

module.exports = {
  ...proxy
}
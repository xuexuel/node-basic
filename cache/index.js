
function updateTime() {
  this.timmer = this.timmer || setInterval(() => {
    this.time = new Date().toUTCString()
  }, 5000);
  return this.time;
}
const http = require('http');

http.createServer((req, res) => {
  const { url } = req
  if ('/' === url) {
    res.end(`
      <html>
        Html Update Time ${updateTime()}
        <script src='main.js'></script>
      </html>
    `)
  } else if (url === '/main.js') {
    const content = `document.writeln('<br>JD  Update Time:${updateTime()}')`
    /**
     * 强缓存策略都会访问本地缓存直接验证看是否过期
     * 强缓存策略1.0  Expires
     * 浏览器时间有规定，可能存在问题
     * 强缓存策略1.1  Cache-control  优先级更高
     */
    // res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toUTCString())
    // res.setHeader('Cache-control', 'max-age=20')
    // 协商缓存 浏览器和服务器协商一下是否过期
    // res.setHeader('Cache-Control', 'no-cache')
    // res.setHeader('last-modified', new Date().toUTCString())
    // if (new Date(req.headers['if-modified-since']).getTime() + 3 * 1000 > Date.now()) {
    //   console.log('协商缓存命中');
    //   res.statusCode = 304
    //   res.end()
    //   return
    // }

    const crypto = require('crypto')
    const hash = crypto.createHash('sha1').update(content).digest('hex')
    res.setHeader('Etag', hash)
    if (req.headers['if-none-match'] === hash) {
      console.log('Etag缓存命中');
      res.statusCode = 304
      res.end()
      return
    }

    res.statusCode = 200
    res.end(content)
  } else if (url === '/favicon.ico') {
    res.end('')
  }
})
  .listen(3000, () => {
    console.log('Http Cache Test Run at ' + 3000);
  })
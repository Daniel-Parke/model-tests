const http = require('node:http');
const {fs,path,root,safePath} = require('./common.cjs');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.woff2':'font/woff2','.md':'text/plain; charset=utf-8','.pdf':'application/pdf'};
function serve(base = root, port = 0) {
  const server = http.createServer((req,res) => {
    try {
      const relative = decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '');
      if (relative.split('/').some(part => part.startsWith('.') || part === 'node_modules')) throw Error('Private path');
      let file = safePath(base, relative);
      if (fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
      const data = fs.readFileSync(file);
      res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-cache'});res.end(data);
    } catch {res.writeHead(404);res.end('Not found');}
  });
  return new Promise(resolve => server.listen(port,'127.0.0.1',() => resolve({server,url:'http://127.0.0.1:'+server.address().port})));
}
if (require.main === module) {
  const index=process.argv.indexOf('--directory');
  const directory=index<0?root:safePath(root,process.argv[index+1]);
  serve(directory, Number(process.env.PORT || 4173)).then(({url}) => console.log(url));
}
module.exports = {serve};

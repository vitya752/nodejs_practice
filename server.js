const http = require('http');
const ip = '127.0.0.1';
const port = '3000';
const server = http.createServer((req, res) => {
    const html = `<h1>Сервер ответил!!!</h1>`;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
});

server.listen(port, ip, () => {
    console.log('Сервер запущен!!!');
});

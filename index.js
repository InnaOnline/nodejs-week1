const express = require("express");
const app = express();

//const PORT = process.env.PORT || 3000
//const DELAY = process.env.DELAY || 1000
//const TIMESTOP = process.env.TIMESTOP || 10000

//app.get('/data', (req, res) => {
//    res.setHeader("Content-Type", "text/html; charset=utf-8")
//    res.setHeader("Transfer-Encoding", "chunked")
//    setInterval(() => {
//        const date = new Date().toISOString()
//        console.log(`Time: ${date}`)
//    }, DELAY)
//    setTimeout(() => {
//        const date = new Date().toISOString()
//        res.write(`Time: ${date}, END`)
//        res.end()
//    }, TIMESTOP)
//})

//app.listen(PORT, () => console.log(`Server start in PORT ${PORT}`))


const http = require('http');
const { PORT, INTERVAL, TIMESTOP } = process.env;

const PORT = process.env.PORT || 3000
const INTERVAL = process.env.INTERVAL || 3000
const TIMESTOP = process.env.TIMESTOP || 10000

const requestHandler = (request, response) => {
  let time;
  const interval = setInterval(() => {
    time = new Date().toUTCString();
    console.log(time);
  }, INTERVAL);

  setTimeout(() => {
    console.log('done');
    clearInterval(interval);
    response.end(time);
  }, TIMESTOP);
};

const server = http.createServer(requestHandler);

app.listen(PORT, () => console.log(`Server start in PORT ${PORT}`))
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000
const INTERVAL = process.env.INTERVAL || 1000;
const TIMESTOP = process.env.TIMESTOP || 10000;

let date;

app.get('/', function(req, res){
        
        let time = setInterval(() => {
            date = new Date();
            console.log(date);
        }, INTERVAL);
        
        let settime = setTimeout(() => {
            clearInterval(time);
            console.log('Дата и время на момент консольного вывода (UTC): ', date);
            clearTimeout(settime);
            res.send('Дата и время на момент консольного вывода (UTC):' + date);
        }, TIMESTOP)
      });

app.listen(PORT, () => console.log(`Server start in PORT ${PORT}`));
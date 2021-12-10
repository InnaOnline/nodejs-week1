const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000
const DELAY = process.env.DELAY || 1000
const TIMESTOP = process.env.TIMESTOP || 10000

app.get('/data', (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Transfer-Encoding", "chunked")
    setInterval(() => {
        const date = new Date().toISOString()
        console.log(`Time: ${date}`)
    }, DELAY)
    setTimeout(() => {
        const date = new Date().toISOString()
        res.write(`Time: ${date}, END`)
        res.end()
    }, TIMESTOP)
})

app.listen(PORT, () => console.log(`Server start in PORT ${PORT}`))

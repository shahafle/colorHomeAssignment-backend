const path = require('path')
const express = require('express')
const cors = require('cors')

const colorService = require('./services/color.service')
const app = express()
const http = require('http').createServer(app)

// Config the Express App
app.use(express.static('public'))
app.use(express.json())

const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true
}
app.use(cors(corsOptions))

const { setupSocketAPI, broadcastVote } = require('./services/socket.service')
setupSocketAPI(http)

// Colors REST API
app.get('/api/color', async (req, res) => {
    try {
        const colors = await colorService.query()
        res.send(colors)
    } catch (err) {

    }
})

app.post('/api/color/:colorId', async (req, res) => {

    const { colorId } = req.params
    try {
        const savedColor = await colorService.addVote(colorId)
        broadcastVote(savedColor)
        res.send(savedColor)
    } catch (err) { }
})

// Last fallback
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


const port = process.env.PORT || 3030

http.listen(port, () => {
    console.log(`Server is ready at ${port}`)
})
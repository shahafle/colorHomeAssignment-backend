const path = require('path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const colorService = require('./services/color.service')
const app = express()

// Config the Express App
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true
}
app.use(cors(corsOptions))

// Colors REST API
app.get('/api/color', async (req, res) => {
    const filterBy = { txt: req.query.txt || '' }
    if (req.query.pageIdx) filterBy.pageIdx = req.query.pageIdx
    try {
        const colors = await colorService.query(filterBy)
        res.send(colors)
    } catch (err) {

    }
})

app.post('/api/color/:colorId', async (req, res) => {

    const { colorId } = req.params
    try {
        const savedColor = await colorService.addVote(colorId)
        res.send(savedColor)
    } catch (err) { }
})

app.post('/api/color', async (req, res) => {

    const color = req.body
    try {
        const savedColor = await colorService.save(color)
        res.send(savedColor)
    } catch (err) { }
})

app.put('/api/color/:colorId', async (req, res) => {

    const color = req.body
    try {
        const savedColor = await colorService.save(color)
        res.send(savedColor)
    } catch (err) { }
})

app.get('/api/color/:colorId', async (req, res) => {
    const { colorId } = req.params

    try {
        const color = await colorService.getById(colorId)
        res.send(color)
    } catch (err) { }
})

app.delete('/api/color/:colorId', async (req, res) => {

    const { colorId } = req.params
    try {
        await colorService.remove(colorId)
        res.send('Removed Succesfully')
    } catch (err) { }
})


// Last fallback
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


const port = process.env.PORT || 3030

app.listen(port, () => {
    console.log(`Server is ready at ${port}`)
})
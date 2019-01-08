const data = require('./data.json')
const express = require('express')
const app = express()

let dict = new Map()

data.forEach(d => {
    const keywords = d.keywords.split(', ')
    keywords.forEach(keyword => {
        keys = keyword.split(' ')
        keys.forEach(key => {
            // qu kuo hao
            let value = dict.get(key) ? dict.get(key) : new Set()
            value.add(d)
            // console.log(value)
            dict.set(key, value)
        })
    })
})


app.use(express.static('public'))
app.get('/api', (req, res) => {
    const {search} = req.query
    // console.log(!!dict.get(search), search)
    let response = dict.get(search) ? dict.get(search) : []
    let ret = []
    response.forEach(item => {
        ret.push(item)
    })
    res.send({
        ret
    })
})

app.listen(8000)
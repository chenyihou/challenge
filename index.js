const data = require('./data.json')
const express = require('express')
const app = express()

let dict = new Map() // this hashmap is to quickly find requested objects based on certain keyword
let hashmap=new Map() // this hashmap is to quickly located the item when the user wants to mark the article


data.forEach(d => {
    d.marked=false
    const keywords = d.keywords.split(', ') 
    const {title}=d
    hashmap.set(title,d) // the key value pair would look like {title: {result}}
    keywords.forEach(keyword => {
        keys = keyword.split(' ')
        keys.forEach(key => {
            key=key.replace('(','').replace(')','') // the key value pair would look like {key: { {result1}, {result2}, ..., {resultN} }}
            let value = dict.get(key) ? dict.get(key) : new Set()
            value.add(d)
            dict.set(key, value)
        })
    })
})


app.use(express.static('public'))

app.get('/api', (req, res) => {
    const {search, mark} = req.query
    if(search){ // if this is a request for searching keyword related articles
        let response = dict.get(search) ? dict.get(search) : []
        let ret = []
        response.forEach(item => {
            ret.push(item)
        })
        res.send({
            ret
        })
    }
    else{ // if this is a request for marking certain articles
        let markObj=hashmap.get(mark)
        if(markObj){
            markObj.marked=!markObj.marked
            res.send({ok:true})
        }
        else{
            res.send({ok:false})
        }
    }
    
})

app.listen(8000)

const data = require('./data.json')
const express = require('express')
const app = express()

let dict = new Map() // this is for the response of certain keyword, key is keyword, value is object
let hashmap=new Map() // this is for all objects in data, key is title, value is object


data.forEach(d => {
    d.marked=false
    const keywords = d.keywords.split(', ')
    const {title}=d
    hashmap.set(title,d)
    keywords.forEach(keyword => {
        keys = keyword.split(' ')
        keys.forEach(key => {
            key=key.replace('(','').replace(')','')
            let value = dict.get(key) ? dict.get(key) : new Set()
            value.add(d)
            // console.log(value)
            dict.set(key, value)
        })
    })
})


app.use(express.static('public'))
app.get('/api', (req, res) => {
    const {search ,mark} = req.query
    // console.log(!!dict.get(search), search)
    if(search){
        let response = dict.get(search) ? dict.get(search) : []
        let ret = []
        response.forEach(item => {
            ret.push(item)
        })
        res.send({
            ret
        })
    }
    else{
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

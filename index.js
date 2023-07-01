const express = require('express')
const bodyParser = require('body-parser')


const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.listen(5000, () => {
    console.log("App is running. Listening on Port 5000")
})
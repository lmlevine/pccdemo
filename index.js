const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer')
const path = require('path')

const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// File storage and management 
let storage = multer.diskStorage({
    // Setting target directory
    destination:(req,file,callback) => {
        callback(null,"./uploads/")
    },
    // Setting logic for dynamic/unique filename generation for uploaded file content
    filename:(req,file,callback) => {
        callback(null,file.fieldname + "-" +  Date.now() + path.extname(file.originalname))
    }

})

// Take storage properties and pass them to the multer method
let upload =  multer({
    storage:storage
})

//Establish connection with MySQL Database
const pool = mysql.createConnection({
    host: "127.0.0.1:3306",
    user: "root",
    password: "password",
    database: "PCC Demo"
})

app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html")
}
)

app.post('/import-csv',upload.single('import-csv'),(req,res) => {
    console.log(req.file.path)
})

app.listen(5000, () => {
    console.log("App is running. Listening on Port 5000")
})
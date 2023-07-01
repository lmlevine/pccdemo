const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer')
const path = require('path')
const csv = require('fast-csv')
const fs = require('fs')

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
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "PCC_Schema"
})

function uploadCsv(path){
    let stream = fs.createReadStream(path)
    let csvData = []
    let fileStream = csv
    .parse()
    .on('data', function(data){
        csvData.push(data)
    })
    .on('end', function(){
        csvData.shift()
        pool.getConnection((error,connection)=>{
            if(error){
                console.log(error)
            } else {
                let query = "INSERT INTO students (LAST_NAME,FIRST_NAME,EMAIL_ADDRESS,PHONE_NUMBER,COURSE_NUMBER,ASSIGNMENT_NUMBER,SUBMISSION_DATE,GRADE) VALUES ?"
                connection(query,[csvData],(error,res)=>{
                    console.log(error || res);

                });
            }
        } )
    })
    stream.pipe(fileStream)
}

app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html")
}
)

app.post('/import-csv',upload.single('import-csv'),(req,res) => {
    console.log(req.file.path)
    uploadCsv(__dirname + "/uploads/" + req.file.filename)
})

app.listen(5000, () => {
    console.log("App is running. Listening on Port 5000")
})
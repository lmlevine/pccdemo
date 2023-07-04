// Getting all our ducks in a row in terms of required packages!
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer')
const path = require('path')
const csv = require('fast-csv')
const fs = require('fs')

// Will be running a Node express webapp for this demo
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
    database: "PCC_Demo"
})


// Worker function to upload the CSV file, parse it, then connect to the server and submit a custom 
// INSERT query to add the new data
function uploadCsv(path){
    let stream = fs.createReadStream(path)
    let csvData = []
    let fileStream = csv
    .parse()
    .on('data', function(data){
        csvData.push(data);
    })
    .on('end', function(){
        csvData.shift();

        pool.getConnection(error =>{
            if(error){
                console.log(error)
            } else {
                let query = "INSERT INTO import (STUDENT_ID, LAST_NAME,FIRST_NAME,EMAIL_ADDRESS,PHONE_NUMBER,COURSE_NUMBER,ASSIGNMENT_NUMBER,SUBMISSION_DATE,GRADE) VALUES ?"
                pool.query(query,[csvData],(error,res)=>{
                   console.log(error || res);

               });
            }
        } )
        fs.unlinkSync(path)
    })
    stream.pipe(fileStream)
}

// Function to query the database table of interest, and return results
// currently outputs to consle
// TO DO: return results of query and pass through to display on website UI
function displayData(){
    pool.getConnection(error =>{
        if(error){
            console.log(error)
        } else {
            let queryDisplay = "SELECT * FROM PCC_Demo.import ORDER BY STUDENT_ID desc;"
            pool.query(queryDisplay,(error,res)=>{
                console.log(error || res);
            });
            }
        } )
    }

    
    function show_global_var_value()
    {
        console.log(global_var); // "abc"
    }

// Method to bind our html file and send it in response to users querying our URL
app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html")
}
)


// Method to react upon data being sent to our server (in this case the CSV file). 
// Upon the user clicking upload it triggers the post command which results in the following
// 1. File is stored into local directory
// 2. File is parsed and fed into a custom query to insert into database
// 3. Table is then queried and results displayed
app.post('/import-csv',upload.single('import-csv'),(req,res) => {
    console.log(req.file.path)
    uploadCsv(__dirname + "/uploads/" + req.file.filename)
    displayData()
    res.send("File uploaded successfully!")
})


// Listener method for our Node Express webapp server to listen on a particular port
app.listen(5000, () => {
    console.log("App is running. Listening on Port 5000")
})
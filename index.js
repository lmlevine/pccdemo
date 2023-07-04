// PCC FACULTY DEMONSTRATION
// Sample code!

// Getting all our ducks in a row in terms of required packages! Make sure all are installed on your device
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer')
const path = require('path')
const csv = require('fast-csv')
const fs = require('fs')

// Will be running a Node express webapp for this demo
const app = express()


// File storage elements Leveraging Multer //

// Create Storage Object and pass class inherited methods from the multer class 
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

// Pass the storage object to the multer constructor. This middleware function can now be passed directly to the post method
let upload =  multer({
    storage:storage
})


// Middleware essential to application when accessing form data. Parsing CSV document into JSON format. Root JS library Does not need to be installed.
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Database Elements 

//Defining mysql object with credentials for connection with MySQL Database
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "PCC_Demo"
})


// External Worker function to upload the CSV file, parse it, then connect to the server and submit a custom 
// INSERT query to add the new data
function uploadCsv(path){
    // Filesystem to access file and read it
    let stream = fs.createReadStream(path)
    // empty array initialized to read into
    let csvData = []
    // Concatenating different fast-csv methods
    let fileStream = csv
    .parse()
    // on event 'data' true or present run callback function to read data and push it onto the array
    .on('data', function(data){
        csvData.push(data);
    })
    // Once csv parsing is complete (unique event trigger 'end'), run callback function to generate sql query and pass query through to database 
    .on('end', function(){
        // Since first row of array is column headers we call the shift method to begin from the second indexed row
        csvData.shift();
        // mySQL method inhertied to object for establishing connection to mySQL server
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
        // nice file system method to clear working files from webserver directory once parsing is complete
        // kind of negates the need for unique naming conventions but oh well! That was a cool chunk of code.
        fs.unlinkSync(path)
    })
    // Calling the pipe method to pass the fast-csv set of objects. Must be called outside of code blocks defining filestream elements
    stream.pipe(fileStream)
}

// Function to query the database table of interest, and return results
// currently outputs to consle
// TO DO: return results of query and pass through to display on website UI
function displayData(){
    // mySQL method inhertied to object for establishing connection to mySQL server
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
    // Basic send method to display results on the screen to the user 
    // TO DO: display the darn records instead!
    res.send("File uploaded successfully!")
})


// Listener method for our Node Express webapp server to listen on a particular port
app.listen(5000, () => {
    console.log("App is running. Listening on Port 5000")
})
# pccdemo
 ## Demo app for PCC Faculty Demonstration interview

### Node Requirements and Configurations 
Prior to running the application
 You'll need to install the following node.js libraries in order for this to run:
  - Multer
  - Fast-CSV
There are a few other dependencies (e.g., Express, MySQL, FS) that are likely already installed in your working node install, but in case it's missing install those too!

### MySQL Configuration
You'll also have to spin up a MySQL Server instance and run the accompanying pcc_demo.sql to build the associated schema and populate it with an initial set of sample data. I used a simple localhost connection with default login settings below (the database will be defined in the CREATE schema query in the SQL script):
    host: "localhost",
    user: "root",
    password: "password",
    database: "PCC_Demo"

You will need to replicate these settings or adjust the configuation in the index.js file prior to running. 

## Running the demo
A sample CSV file 'students.csv' is available in this repo for demo purposes. 

To launch the app, simply navigate to the directory and run the `node index.js` prompt to initialize the app. 

The application interface can then be viewed at `localhost:5000` on your browser.

From there following the GUI to upload the file. Results will be logged in your console. 



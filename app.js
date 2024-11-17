// The main file

const express = require('express');
const bodyParser = require('body-parser');
const Logger = require('./middlewares/Logger')

// Using the fs module to read contents of directories where the photos will be stored
// Will need the following two for getting the contents of the uploads directory
// and to work for that
const fs = require("fs");

const path = require("path");

// Handling CORS issues
var cors = require('cors');

// I want to use the .dotenv file to retireve variables
require('dotenv').config()

// Importing middlewares
// Importing this for file upload
const multerFileUploadModule = require('./middlewares/testmulterFileUpload');


const app = express();
const PORT = process.env.PORT;

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Parse JSON data
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use ( Logger );

// Serve static files from the 'uploads' directory
// Without the following, the /gallery endpoint won't work
// Serve static files from the 'public' directory
app.use(express.static('public'));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); //old endpoint

// Handling CORS issues
app.use(cors());


// ************************************ //
//  Here starts the code for PostgreSQL //
// *********************************************************  //
// Here starts the code for working with the endpoints using multer
app.get("/upload", (req, res) => {
    res.render("upload");
})


app.post("/uploaded", function (req, res, next) {
	// Error MiddleWare for multer file upload, so if any
	// error occurs, the image would not be uploaded!
    multerFileUploadModule.upload(req, res, function (err) {
            if (err) {
                // ERROR occurred (here it can be occurred due
                // to uploading image of size greater than
                // 250MB or uploading different file type)
                console.log(err);
                res.send(err);
                //return res.status(500).json({ error: err.message });
            } else {
                // SUCCESS, image successfully uploaded
                res.render("message", {message: "Succes! File uploaded successfully"});
            }
        });
});

// *********************************************************  //
// Here ends the code for working with the endpoints using multer



//
// Here ends the endpoints for comments

app.get("/", (req, res) => {
    res.render("index");
    console.log("Index test page rendered");
})


// I want to shuffle the order of how the files are rendered
// Every time I visit the 'gallery' page
// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Route to render the newgallery page
app.get('/gallery', (req, res) => {
    const uploadsDir = path.join(__dirname, 'public/uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        // Shuffle the array of files
        const shuffledFiles = shuffleArray(files);
        // Render the EJS template and pass the shuffled files array
        res.render('gallery', { files: shuffledFiles });
    });
});

// Route to render the video gallery page 
app.get('/videos', (req, res) => {
    const uploadsDir = path.join(__dirname, 'public/uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        // Shuffle the array of files
        const shuffledFiles = shuffleArray(files);
        // Render the EJS template and pass the shuffled files array
        res.render('videos', { files: shuffledFiles });
    });
});

// Route to render the page
app.get('/photos', (req, res) => {
    const uploadsDir = path.join(__dirname, 'public/uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        // Shuffle the array of files
        const shuffledFiles = shuffleArray(files);
        // Render the EJS template and pass the shuffled files array
        res.render('photos', { files: shuffledFiles });
    });
});

// Here is
// End of the test for shuffling the array of files
// It ends here


app.get("/gallery", (req, res) => {
    // Read the contents of the upload directory
    fs.readdir("./uploads", (err, files) => {
        if (err) {
            console.error('Error reading directory: ', err);
            return res.status(500).send('Internal Server Error');
        }
        // Render the EJS template and pass the list of files
        res.render("gallery", { files });
    })
})


app.listen(PORT, (req, res) => {
    console.log(`App alive on port ${PORT}`);
})
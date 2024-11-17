// Using the fs module to read contents of directories where the photos will be stored
const fs = require('fs');
const path = require('path');

// Using multer for file upload
const multer = require('multer');


// Variables
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 250 * 1000 * 1000; // The first number is the size in MB, 250MB to test video upload

// *********************************************************  //
// Following code is for multer

// Define the directory path containing the photos
//const directoryPath = path.join("../uploads");

// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Uploads is the Upload_folder_name
            cb(null, "./public/uploads");
        },
        filename: function (req, file, cb) {
            // cb(null, file.fieldname + "-" + Date.now() + ".jpg"); //the original code
            cb(null, file.originalname)
        },
    })


    var upload = multer({
        storage: storage,
        limits: { fileSize: maxSize },
        fileFilter: function (req, file, cb) {
            // Set the filetypes, it is optional
            var filetypes = /jpeg|jpg|png|mp4/;  // Added mp4 to try to upload video files
            var mimetype = filetypes.test(file.mimetype);

            var extname = filetypes.test(
                path.extname(file.originalname).toLowerCase()
            );

            if (mimetype && extname) {
                return cb(null, true);
            }

            cb(
                "Error: File upload only supports the " +
                    "following filetypes - " +
                    filetypes
            );
        },

        // mypic is the name of file attribute
    }).single("mypic")

// The code for the multer middleware ends here
// *********************************************************  //


//exports.storage = storage;
//exports.upload = upload;

module.exports = {
    storage,
    upload
}
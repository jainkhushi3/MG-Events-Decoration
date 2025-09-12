const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const {connectDB} = require('./db/connectDB.js')
const web = require('./routes/web.js');
const port = 3010;

const app = express();
const path = require('path');

// Initialize environment variables
dotenv.config({ path: ".env" });

// Middleware setup
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.json()); // For JSON data

// Session and Flash Messages Setup
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// File upload setup
app.use(fileUpload({ useTempFiles: true }));

// Static file serving
app.use(express.static('public'));

// Database connection
// (async () => {
//     global.db = await connectDB();
// })();



// View engine setup
app.set('view engine', "ejs");

// Routes setup
app.use('/', web);

// Start the server
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });

(async () => {
    try {
        global.db = await connectDB();
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
    }
})();
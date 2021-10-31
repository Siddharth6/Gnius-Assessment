const PORT = process.env.PORT || 5000;
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require("mongoose");
const expressValidator = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
require('dotenv').config();

// Imports
const passport = require("./services/passportconf");
const tool = require("./services/tool");

const app = express();

// middlewares
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin"
    );
    next();
});
app.use(expressValidator()); // express Validator
app.use(mongoSanitize()); // Sanitize data
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent http param pollution

// db
mongoose
.connect(process.env.DATABASE, {
    autoIndex: false, 
    reconnectTries: 100,
    reconnectInterval: 500, 
    poolSize: 10, 
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useFindAndModify :  false,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to mongoDB");
    //tool.createadmin();
})
.catch((err) => {
    console.log("Error connecting to database", err);
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000
});
app.use(limiter);

//configs
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

//passport
app.use(passport.initialize());
app.use(passport.session());

// Import Routes Files
const admin = require("./routes/admin");
const login = require("./routes/login");
const user = require("./routes/user");
const subject = require("./routes/subject");
const question = require("./routes/questions");
const testpaper = require("./routes/testpaper");
const trainee = require("./routes/trainee");
const stopRegistration = require("./routes/stopRegistration");
const results = require("./routes/results");
const dummy = require("./routes/dummy");
const codingRoutes = require('./routes/coding');
const upload = require("./routes/fileUpload");
const download = require('./routes/downloadRoutes');
const stats = require('./routes/stats');
const refer= require('./routes/refer');

// Routes
app.use('/api/v1', dummy);
app.use("/api/v1/admin", passport.authenticate('user-token', { session: false }), admin);
app.use("/api/v1/user", passport.authenticate('user-token', { session: false }), user);
app.use('/api/v1/subject', passport.authenticate('user-token', { session: false }), subject);
app.use('/api/v1/questions', passport.authenticate('user-token', { session: false }), question);
app.use('/api/v1/test', passport.authenticate('user-token', { session: false }), testpaper);

app.use('/api/v1/download', passport.authenticate('user-token', { session: false }), download);
app.use('/api/v1/trainer', passport.authenticate('user-token', { session: false }), stopRegistration);
app.use('/api/v1/coding', passport.authenticate('user-token', { session : false }), codingRoutes);
app.use('/api/v1/stats', passport.authenticate('user-token', { session : false }), stats);
app.use('/api/v1/refer', passport.authenticate('user-token', { session : false }), refer);

app.use('/api/v1/trainee', trainee);
app.use('/api/v1/final', results);
app.use('/api/v1/login', login);
app.use('/api/v1/upload', upload);

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

// error handlings
app.use(function(req, res, next) {
    next(createError(404,"Invalid API."));
});

app.use((err, req, res, next) => {
    const status = err.status || 500;

    console.log(err);

    res.status(status).json({
        success: false,
        message: 'error'
    });
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server Started. Server listening to port ${PORT}`);
});
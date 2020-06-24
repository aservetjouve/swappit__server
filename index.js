const express = require('express');
const app = express();
require("dotenv").config();

/*Ensure that the database is connected
=====================================*/
const path = require('path');
require('./config/database.config')

/*Create session data and store it 
================================*/
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const cors = require("cors");
app.use(
	cors({
		credentials: true,
		origin: ["http://localhost:3000"],
	})
);


let MONGODB_URI = process.env.MONGODB_URI
app.use(
	session({
		secret: "my-secret-weapon",
		saveUninitialized: true,
		resave: true,
		cookie: {
      /*1 Day*/
      maxAge: 60 * 60 * 24 * 1000
		},
		store: new MongoStore({
			url: MONGODB_URI,
			ttl: 60 * 60 * 24,
			autoRemove: "disabled",
		}),
	})
);

/* Middleware to handle HTTP Post request
=======================================*/
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Parse cookie and store them in req
===================================*/
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

/* Routes
=======*/
const authRoutes = require('./routes/auth.routes')
app.use('/auth', authRoutes);

/* No route match
===============*/
app.use((req, res, next) => {
  res.sendFile(__dirname+'/public/404.html')
})

/*App Listenning
==============*/
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running [http://localhost:${port}/]`);
});

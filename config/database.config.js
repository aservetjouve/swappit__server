const mongoose = require("mongoose");

const configOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, configOptions)
  .then(()=>{console.log('Successfully connected to the database')})
  .catch(() => {console.log('Something went wrong while connecting to the database')})
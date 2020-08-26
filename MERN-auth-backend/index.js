const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//express

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("The server it´s on port: ${PORT}"));

//mongoose

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connection active");

  });

  //routes

  app.use("/users", require("./routes/userRouter"));

  
//   importing
import express from "express";
//app config
const app = express();
//middleware

//DB config
app.get("/", (req, res) => res.status(200).send("hello world"));
//????

//   importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
//app config
const app = express();
const port = process.env.PORT || 9000;
//middleware
app.use(express.json());
//DB config

const connection_url =
  "mongodb+srv://mobolaji2309:%40omolara1@cluster0.7iplld4.mongodb.net/whatsappDB?retryWrites=true&w=majority";
mongoose.connect(connection_url);
app.get("/", (req, res) => res.status(200).send("hello world"));

app.post("/api/v1/messages/syncs", (req, res) => {
  Messages.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
//????
app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage)
    .then((data) => {
      res.status(201).send(`new messages created : \n ${data}`);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(port, () => console.log(`Listen on localhost : ${port}`));

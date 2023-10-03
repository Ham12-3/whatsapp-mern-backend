//   importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";
//app config
const app = express();
const port = process.env.PORT || 9000;
//middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

//DB config

const connection_url =
  "mongodb+srv://mobolaji2309:%40omolara1@cluster0.7iplld4.mongodb.net/whatsappDB?retryWrites=true&w=majority";
mongoose.connect(connection_url);
const pusher = new Pusher({
  appId: "1680772",
  key: "63511d52b71ee1d0b466",
  secret: "64469a13dd7bcaa4792b",
  cluster: "eu",
  useTLS: true,
});
const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected");
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error trigerring Pusher");
    }
  });
});

app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/syncs", (req, res) => {
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

const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use("/files", express.static("files"));

// MongoDB connection ----------------------------------------------
mongoose.set('strictQuery', true);

const mongoUrl = "mongodb+srv://Arman:LkRbiOLj5hpUJEQl@formdb.1wmub.mongodb.net/mydatabase?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => console.log("MongoDB Connection Error:", error));

// Multer ------------------------------------------------------------
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./PdfDetail");
const PdfSchema = mongoose.model("PdfDetail");
const upload = multer({ storage: storage });

// Update the Schema to include Name and Age
const pdfSchema = new mongoose.Schema({
  name: { type: String, required: true }, //  Name
  age: { type: Number, required: true }, //  Age
  pdf: { type: String, required: true }, // File name
});

mongoose.model("PdfDetail", pdfSchema);

// Handle file upload and save Name and Age
app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const name = req.body.name; //  name
  const age = req.body.age; // Added age
  const fileName = req.file.filename;

  try {
    await PdfSchema.create({ name: name, age: age, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.json({ status: error });
  }
});

// Endpoint to fetch uploaded files
app.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.json({ status: error });
  }
});

// Base endpoint
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

app.listen(5000, () => {
  console.log("Server Started");
});

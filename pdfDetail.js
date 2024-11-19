const mongoose = require("mongoose");

const PdfDetailsSchema = new mongoose.Schema(
  {
    name: String, //  name
    age: Number ,  // Added age 
    pdf: String  // PDF file name
  },
  { collection: "PdfDetail" }
);

mongoose.model("PdfDetail", PdfDetailsSchema);

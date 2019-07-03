var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  id: String,
  isbn: String,
  title: String,
  name: String,
  author: String,
  description: String,
  published_year: { type: Number, min: 1945, max: 2019 },
  publisher: String,
  updated_date: { type: Date, default: Date.now },
  qty:Number,
  bookcopy:[{_id:{ type: mongoose.Schema.Types.ObjectId, auto: true },status:String}],
});

module.exports = mongoose.model('Book', BookSchema);
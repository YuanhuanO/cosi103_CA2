'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const rumorSchema = new mongoose.Schema({
  inputRumor: String,
  outputRumor: String,
  userId: {type:ObjectId, ref:'user' }
});

module.exports = mongoose.model('rumor', rumorSchema);
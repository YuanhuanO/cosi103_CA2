require('dotenv').config(); 
const axios = require('axios');
const express = require('express');
const Rumor = require('../models/rumor');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

const getIndex = async (req, res) => {
  const rumors = await Rumor.find();
  res.render('gpt', { rumors });
};


const createReply = async (req, res) => {
  const inputName = req.body.rumor;
  const answer =  await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `generate recent dating rumors ${inputName}`,
      max_tokens:2048,
      n:1,
      temperature:0.8,
  });
  const outputRumor = answer.data.choices[0].text;
  const rumor = new Rumor({ inputRumor: inputName, outputRumor });
  await rumor.save();
  res.redirect('/gpt');
};

const getRumorReply = async (req, res) => {
  const rumors = await Rumor.find();
  res.render('gpt', { rumors });
};

const deleteRumor = async (req, res) => {
  const rumorId = req.params.id;
  await Rumor.findByIdAndDelete(rumorId);
  res.redirect('/gpt');
};

router.get('/gpt', isLoggedIn, getIndex);
router.post('/reply', isLoggedIn, createReply);
router.get('/gpt', isLoggedIn, getRumorReply);
router.delete('/gpt/:id', isLoggedIn, deleteRumor);

module.exports = router;
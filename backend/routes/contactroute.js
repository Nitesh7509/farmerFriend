const express = require("express");
const { sendContactMessage } = require("../controllers/contactcontroller");

const contactRouter = express.Router();

// Public route - anyone can send contact message
contactRouter.post("/send", sendContactMessage);

module.exports = contactRouter;

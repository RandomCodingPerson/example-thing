require('dotenv').config();

const sender = process.env.GMAIL_SENDER;
const recipient = process.env.EMAIL_RECIPIENT;

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const nodemailer = require("nodemailer");

let client = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: sender,
        pass: process.env.GOOGLE_PASSWORD,
    },
});

const app = express();
app.use(bodyParser.json())
app.use(cors());

app.get("/", (req, res) => {
    res.send("Ready to mail!");
});

app.post("/mail", async (req, res) => {
    console.log(req.body);

    var text = req.body.text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');;
    var contacterName = req.body.name;
    var contacterEmail = req.body.email;

    console.log(text, contacterName, contacterEmail);
    
    const message = {
        text: `New Inquiry\nFrom: ${contacterName}\nMessage: ${text}`,
        from: sender,
        to: recipient,
        subject: `Inquiry from ${contacterName} (${contacterEmail})`,
        html: `<div style="font-family: Georgia, serif;">
                <h3>New Inquiry</h3>
                <p>From: ${contacterName} (${contacterEmail})</p>
                <p>Message: ${text}</p>
            </div>
        `.split('\n').map(x=>x.trim()).join('')
    }
    
    try {
        let response = await client.sendMail(message);
        res.send(response);
        console.log(response);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

app.listen(3000, () => {
    console.log("Server is up!")
});
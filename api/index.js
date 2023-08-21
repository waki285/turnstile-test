require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/index.html"))
});

app.post("/", async (req, res) => {
  const secret = req.body.type ? process.env[`${req.body.type.toUpperCase()}_SECRET`]:process.env.MANAGED_SECRET;
  const response = await axios.post(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    `secret=${secret}&response=${req.body["cf-turnstile-response"]}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  res.json(response.data);
});

app.listen(process.env.PORT || 8080);

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const PORT = process.env.PORT || 8080;
const POSTS_JSON_ABSOLUTE_PATH = path.join(__dirname, "/cms/posts.json");

if (process.env.NODE_ENV == "development") {
  app.use(cors());
}

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

app.get("/", (req, res) => {
  res.send("HELLO, WORLD!");
});

const readJsonAsync = (absolutePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(absolutePath, { encoding: "utf8" }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

app.get("/posts", async (req, res) => {
  let jsonData, jsonPosts;

  try {
    jsonPosts = await readJsonAsync(POSTS_JSON_ABSOLUTE_PATH);
    jsonData = JSON.parse(jsonPosts);
  } catch (error) {
    res.status(400).json({
      error: "Error loading posts",
      message: error
    });
  }

  res.status(200).json(jsonData.posts);
});

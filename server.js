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

app.use(express.json());

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

app.get("/", (req, res) => {
  res.send("HELLO, WORLD!");
});

const lookForJsonPostFileExists = () => new Promise((resolve, reject) => {
  fs.readFile(POSTS_JSON_ABSOLUTE_PATH, (err) => {
    if (err?.code == "ENOENT")
      fs.writeFile(POSTS_JSON_ABSOLUTE_PATH, '{"posts":[]}', { encoding: "utf8" }, (err) => {
        if (err) reject("Error creating the file cms/posts.json");
        resolve("OK") // The file now exists
      });
    else resolve("OK") // The file already exists
  });
})

const readJsonAsync = async (absolutePath) => {
  await lookForJsonPostFileExists()
  return new Promise((resolve, reject) => {
    fs.readFile(absolutePath, { encoding: "utf8" }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

const saveJsonAsync = async (absolutePath, data) => {
  await lookForJsonPostFileExists()
   return new Promise((resolve, reject) => {
    fs.writeFile(absolutePath, data, { encoding: "utf8" }, (err) => {
      if (err) reject(err);
      resolve("OK");
    });
  });
}

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

app.post("/posts", async (req, res) => {
  const { uid, title, path, body, tags, date } = req.body;
  const data = { uid, title, path, body, tags, date };

  // Looking for missing data
  // I should probably add a database, for a better data validation process
  if (Object.values(data).includes(undefined))
    res.status(400).json({
      error: "The request is missing data",
      message: "The required fields are {uid, title, path, date, tags, body}",
    });

  // Read file
  let jsonData, jsonPosts;

  try {
    jsonPosts = await readJsonAsync(POSTS_JSON_ABSOLUTE_PATH);
    jsonData = JSON.parse(jsonPosts);
  } catch (error) {
    res.status(400).json({
      error: "Error loading posts",
      message: error,
    });
  }

  // Looking for editing post
  let edited = false;

  for (let i = 0; i < jsonData.posts.length; i++) {
    if (jsonData.posts[i].uid == data.uid) {
      jsonData.posts[i] = data;
      i = jsonData.posts.length;
      edited = true;
    }
  }

  // If not edited, add new post
  if (!edited) jsonData.posts.push(data);

  // Save file
  try {
    saveJsonAsync(POSTS_JSON_ABSOLUTE_PATH, JSON.stringify(jsonData)).then(() => {
      res.status(200).json({ data: jsonData.posts });
    });
  } catch (err) {
    console.error("Error saving data to file...", err);
    res.status(400).json({ error: "Error saving data to file", message: err });
  }
});

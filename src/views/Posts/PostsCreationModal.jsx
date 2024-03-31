import React, { useState } from "react";

import { getFormattedDateNow, importMarkdownFile } from "./utils.js";

export default function PostsCreationModal({ closeModalHandler, addNewPost }) {
  const [postTitle, setPostTitle] = useState("");
  const [postFilename, setPostFilename] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postDate, setPostDate] = useState(getFormattedDateNow());
  const [postTags, setPostTags] = useState([]);
  const [UID, setUID] = useState(new Date().getTime()) // For now, the ms time is enough for create a basic UID

  const setPostFilenameHandler = (value) => {
    const regex = /^[0-9a-zA-Z\-]+$/;
    if (regex.test(value) || value == "") setPostFilename(value.toLowerCase());
  };

  const setPostTitleHandler = (value) => {
    setPostTitle(value);
    let formattedTitle = value.replace(/[^\w\-\s]/g, "");
    let finalTitle = formattedTitle.replace(/\s/g, "-");
    setPostFilenameHandler(finalTitle);
  };

  const setPostTagsHandler = (value) => {
    if (value == "") {
      setPostTags([]);
      return;
    }

    let formattedValue = value.replace(/[^\w\-\,]/g, "");
    let tagsArray = formattedValue.split(",");
    setPostTags(tagsArray);
  };

  const refreshDateHandler = () => setPostDate(getFormattedDateNow());

  const importMarkdownHandler = () => {
    importMarkdownFile().then((result) => setPostBody(result));
  };

  const checkForDisabledSave = () => postTitle == "" || postFilename == "" || postBody == "";

  const addNewPostHandler = () => {
    // Add post
    addNewPost({ UID: UID, title: postTitle, date: new Date(postDate).getTime(), tagsArray: postTags, body: postBody });

    // Clear data
    setPostTitle("");
    setPostBody("");
    setPostFilename("");
    setPostTags([]);
    setPostDate("");

    // Close
    closeModalHandler();
  };

  return (
    <>
      <div id="background-opacity-layer" onClick={closeModalHandler}></div>
      <article id="post-creation-modal">
        <div id="post-creation-modal-header">
          <h1>Create new post</h1>
          <button onClick={importMarkdownHandler}>Import Markdown file</button>
        </div>
        <hr />
        <div id="post-creation-title-container">
          <input
            type="text"
            name=""
            value={postTitle}
            onChange={(event) => setPostTitleHandler(event.target.value)}
            placeholder="Insert post title..."
          />
          <input
            type="text"
            name=""
            value={postFilename}
            onChange={(event) => setPostFilenameHandler(event.target.value)}
            placeholder="Insert file-name..."
          />
        </div>
        <textarea
          placeholder="Add post content in Markdown format..."
          value={postBody}
          onChange={(event) => setPostBody(event.target.value)}
        ></textarea>
        <br />
        <div id="tags-input-container">
          <input
            type="text"
            name=""
            id=""
            placeholder="Tags separated by comma"
            onChange={(event) => setPostTagsHandler(event.target.value)}
          />
          {postTags.length >= 1 ? <span>{postTags.toString()}</span> : <span>Insert tags...</span>}
          <a href="">(View tags list)</a>
        </div>
        <br />
        <div id="date-input-container">
          <input type="datetime-local" name="" id="" value={postDate} onChange={(event) => setPostDate(event.target.value)} />
          <span>Publication date</span>
          <button onClick={refreshDateHandler}>Refresh</button>
        </div>
        <br />
        <div className="buttons-container">
          <button disabled={checkForDisabledSave()} onClick={addNewPostHandler}>
            Save
          </button>
          <button onClick={closeModalHandler}>Cancel</button>
        </div>
      </article>
    </>
  );
}

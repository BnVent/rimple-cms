import React, { useState } from "react";

const getFormattedDateNow = () => {
  const dateNow = new Date();

  const year = dateNow.getFullYear();
  const month = dateNow.getMonth();
  const day = dateNow.getDate();
  const hours = dateNow.getHours();
  const minutes = dateNow.getMinutes();

  const formatWithZero = (value) => (value >= 10 ? value : "0" + value);

  const formattedDate = `${year}-${formatWithZero(month + 1)}-${formatWithZero(day)}T${formatWithZero(hours)}:${formatWithZero(
    minutes
  )}`;
  return formattedDate;
};

const importMarkdownFile = () =>
  new Promise((resolve) => {
    const filePicker = document.createElement("input");
    const fileReader = new FileReader();

    filePicker.type = "file";
    filePicker.style.visibility = "hidden";
    document.body.appendChild(filePicker);
    filePicker.click();

    filePicker.onchange = (event) => {
      const file = event.target.files[0];
      fileReader.readAsText(file);
    };

    fileReader.addEventListener("load", (event) => {
      resolve(event.target.result);
    });
  });

export default function PostsCreationModal({ closeModalHandler }) {
  const [postTitle, setPostTitle] = useState("");
  const [postFilename, setPostFilename] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postDate, setPostDate] = useState(getFormattedDateNow());
  const [postTags, setPostTags] = useState([]);

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
    importMarkdownFile().then(result => setPostBody(result))
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
        <details>
          <summary>Metadata (2)</summary>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input name="title" type="text" />
                </td>
                <td>
                  <input type="text" name="filename" />
                </td>
              </tr>
              <tr>
                <td>
                  <input type="text" name="" id="" />
                </td>
                <td>
                  <input type="text" name="" id="" />
                </td>
              </tr>
            </tbody>
          </table>
          <a href="">(View complete list of metadata)</a>
        </details>
        <br />
        <div className="buttons-container">
          <button>Save</button>
          <button onClick={closeModalHandler}>Cancel</button>
        </div>
      </article>
    </>
  );
}

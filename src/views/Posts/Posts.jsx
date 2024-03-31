import React, { useState } from "react";
import PostsCreationModal from "./PostsCreationModal";

import "./Posts.css";

const mapPosts = (postsArray) => {
  if (postsArray.length == 0)
    return (
      <tr>
        <td>NO POSTS</td>
        <td>-/-</td>
        <td>-/-</td>
      </tr>
    );

  return postsArray.map((data, index) => {
    const getLocaleDate = () => new Date(data.date).toLocaleDateString();
    const getTags = () => (data.tagsArray.length == 0 ? "Sin etiquetas" : data.tagsArray.join(", "));

    return (
      <tr key={index}>
        <td>{data.title}</td>
        <td>{getLocaleDate()}</td>
        <td>{getTags()}</td>
      </tr>
    );
  });
};

export default function Posts() {
  const [createNewPost, setCreateNewPost] = useState(false);
  const [postsArray, setPostsArray] = useState([]);

  const addPostHandler = (postData = { UID: "", title: "", date: "", tagsArray: "", body: "" }) => {
    setPostsArray((prevState) => [...prevState, postData]);
  };

  return (
    <div>
      <h1>Posts</h1>
      <hr />
      <button onClick={() => setCreateNewPost(true)}>Create new post +</button>
      <table id="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>{mapPosts(postsArray)}</tbody>
      </table>
      {createNewPost && <PostsCreationModal closeModalHandler={() => setCreateNewPost(false)} addNewPost={addPostHandler} />}
    </div>
  );
}

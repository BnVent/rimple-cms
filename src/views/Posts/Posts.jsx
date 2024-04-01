import React, { useEffect, useState } from "react";
import PostsCreationModal from "./PostsCreationModal";

import "./Posts.css";

const mapPosts = (postsArray, launchPostCreationModalWith) => {
  if (postsArray.length == 0)
    return (
      <tr>
        <td>NO POSTS</td>
        <td>-/-</td>
        <td>-/-</td>
      </tr>
    );

  return postsArray.map((data, index) => {
    const getLocaleDate = () =>
      new Date(data.date).toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour:"2-digit",
        minute:"2-digit"
      }).toUpperCase()
    const getTags = () => (data.tags.length == 0 ? "Sin etiquetas" : data.tags.join(", "));

    return (
      <tr key={index} onClick={() => launchPostCreationModalWith(data)} className="post">
        <td>{data.title}</td>
        <td>
          {getLocaleDate()}
        </td>
        <td>{getTags()}</td>
      </tr>
    );
  });
};

const updatePosts = () =>
  fetch("http://localhost:8080/posts")
    .then((res) => {
      if (!res.ok) throw new Error("Error requesting the posts data...");
      return res.json();
    })
    .then((data) => data);

export default function Posts() {
  const [createNewPost, setCreateNewPost] = useState(false);
  const [postsArray, setPostsArray] = useState([]);
  const [editPostData, setEditPostData] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    updatePostsHandler()
  }, []);

  function updatePostsHandler(){
    setFetchingData(true);
    updatePosts()
      .then((data) => setPostsArray(data))
      .catch((error) => console.error(error))
      .finally(() => setFetchingData(false));
  }

  const addPostHandler = postData => {
    const options = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(postData)}
    fetch("http://localhost:8080/posts", options).then(res => {
      if(!res.ok) throw("Error submitting the post to server...")
      return res.json()
    })
    .then(result => setPostsArray(result.data))
    .catch(error => console.error(error))
    .finally(() => {
      setEditPostData(null) // Clearing in case of post edition
    })
  };

  const launchPostCreationModalWith = data => {
    setEditPostData(data)
    setCreateNewPost(true)
  }

  const closeModalHandler = () => {
    setCreateNewPost(false)
    setEditPostData(null)
  }

  return (
    <div>
      <h1>Posts</h1>
      <hr />
      <button onClick={() => setCreateNewPost(true)}>Create new post +</button>
      {fetchingData ? (
        <p>Loading...</p>
      ) : (
      <table id="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>{mapPosts(postsArray, launchPostCreationModalWith)}</tbody>
      </table>)}
      {createNewPost && <PostsCreationModal postData={editPostData} closeModalHandler={closeModalHandler} addNewPost={addPostHandler} />}
    </div>
  );
}

import React from "react";

const posts = [];

const mapPosts = () => {
  if (posts.length == 0)
    return (
      <tr>
        <td>NO POSTS</td>
        <td>-/-</td>
        <td>-/-</td>
        <td>-/-</td>
      </tr>
    );

  return posts.map((data, index) => {
    const getLocaleDate = () => new Date(data.date).toLocaleDateString();
    const getTags = () => (data.tags.length == 0 ? "Sin etiquetas" : data.tags.join(", "));

    return (
      <tr key={index}>
        <td>{data.title}</td>
        <td>{getLocaleDate()}</td>
        <td>{getTags()}</td>
        <td>{data.meta}</td>
      </tr>
    );
  });
};

export default function Posts() {
  return (
    <div>
      <h1>Posts</h1>
      <hr />
      <table id="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Tags</th>
            <th>Meta</th>
          </tr>
        </thead>
        <tbody>{mapPosts()}</tbody>
      </table>
    </div>
  );
}

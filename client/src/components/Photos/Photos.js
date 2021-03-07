import React, { Component } from "react";

import Photo from "../Photo/Photo";

class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('jwtToken');
    const requestBody = {
      query: `
      {
        photos(userId: "${this.props.match.params.id}"){
          url
          description
          dateAdded
          isMain
          user {
            _id
            userName
          }
        }
      }
      `,
    };

    fetch("/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.data.photos) {
          this.setState({ photos: data.data.photos });
        }
      });
  }

  render() {
    return (
      <div>
        {this.state.photos.length === 0 && (
          <div>There are no photos for this user</div>
        )}
        {this.state.photos.map((photo, i) => (
          <Photo photo={photo} key={i} />
        ))}
      </div>
    );
  }
}



export default Photos;

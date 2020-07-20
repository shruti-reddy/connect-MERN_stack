import React, { Component } from "react";
import "./Profile.css";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }
  getUser = () => {
    const userId = this.props.match.params.id;
    const requestBody = {
      query: `
      {
        users(userId: "${userId}"){
          userName
          city
          country
          gender
          lookingFor
          knownAs
          introduction
          interests
          created
          lastActive
          dateOfBirth
          liked {
            count
          }
          likedby {
            count
          }
          photos(isMain: true) {
            url
          }
        }
      }
      `,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        this.setState({ user: data.data.users[0] });
      });
  };

  likeUser = () => {
    console.log(`liked the user ${this.state.user.userName}`);
  };

  sendMessage = () => {
    console.log(`sending message to ${this.state.user.userName}`);
  };

  componentDidMount() {
    this.getUser();
  }
  render() {
    console.log(this.state.user);
    return (
      <div>
        {this.state.user.userName ? (
          <div className="profile-page">
            <div className="profile--left">
              <div className="profile--name">
                <span>KnownAs : {this.state.user.knownAs}</span>
              </div>
              <div className="profile--img-section">
                <img
                  className="profile--img__img"
                  src={
                    this.state.user.photos.length > 0
                      ? this.state.user.photos[0].url
                      : require("../assets/unknown-user.png")
                  }
                  alt={this.state.user.userName}
                />
                <div className="profile--grid">
                  <div>
                    <h4>Followers</h4>
                    <span>{this.state.user.likedby.count}</span>
                  </div>
                  <div className="profile--followers__following">
                    <h4>Following</h4>
                    <span>{this.state.user.liked.count}</span>
                  </div>
                  <div>
                    <h4>City</h4>
                    <span>{this.state.user.city}</span>
                  </div>
                  <div className="profile--location__country">
                    <h4>Country</h4>
                    <span>{this.state.user.country}</span>
                  </div>
                  <div className="profile--location__last-active">
                    <h4>Last Active</h4>
                    <span>
                      {this.state.user.lastActive
                        ? this.state.user.lastActive
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="profile--location__created-at">
                    <h4>Created At</h4>
                    <span>
                      {this.state.user.createdAt
                        ? this.state.user.createdAt
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="profile--details">
                <div className="profile--introduction">
                  <h4>Introduction</h4>
                  <textarea
                    type="text"
                    readOnly
                    value={this.state.user.introduction}
                  />
                </div>
                <div className="profile--looking-for">
                  <h4>Looking For </h4>
                  <input
                    type="text"
                    readOnly
                    value={this.state.user.lookingFor}
                  />
                </div>
                <div className="profile--interests">
                  <h4>Interests</h4>
                  <input
                    type="text"
                    readOnly
                    value={this.state.user.interests}
                  />
                </div>
                <div className="profile--buttons">
                  <button
                    onClick={this.likeUser}
                    className="btn profile--button"
                  >
                    Like
                  </button>
                  <button
                    onClick={this.sendMessage}
                    className="btn profile--button"
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
            <div className="profile--right"></div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}

export default ProfilePage;

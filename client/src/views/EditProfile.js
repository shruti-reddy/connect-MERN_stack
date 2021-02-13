import React, { Component } from "react";
import { NavLink } from "react-router-dom";
class EditProfilePage extends Component {
  _isMounted = false;
  state = {
    user: {},
  };

  componentDidMount() {
    this._isMounted = true;
    this.getUser();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getUser = () => {
    const requestBody = {
      query: `
      {
        users(userId: "context"){
          _id
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

    fetch("/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer context user`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (this._isMounted) {
          this.setState({ user: data.data.users[0] });
        }
      });
  };
  render() {
    return (
      <div>
        {this.state.user._id ? (
          <div className="div">
            <div className="profile-page">
              <div className="profile--left">
                <div>
                  <div className="profile--name">
                    <span>
                      {this.state.user.knownAs
                        ? this.state.user.knownAs
                        : this.state.user.userName}
                      's Profile
                    </span>
                  </div>
                  <div className="profile--img-section">
                    <img
                      className="profile--img__img"
                      src={
                        this.state.user.photos &&
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
                  </div>
                </div>
              </div>
              <div className="profile--right">
                <ul className="profile--right__header">
                  <li>
                    <NavLink to="myprofile/photos">Photos</NavLink>
                  </li>
                  <li>
                    <NavLink to="myprofile/followers">Followers</NavLink>
                  </li>
                  <li>
                    <NavLink to="myprofile/following">Following</NavLink>
                  </li>
                  <li>
                    <NavLink to="myprofile/messages">Messages</NavLink>
                  </li>
                </ul>
                <div className="profile--right__main">
                  {this.props.children}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}

export default EditProfilePage;

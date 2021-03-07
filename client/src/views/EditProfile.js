import React, { Component } from "react";
import { connect } from "react-redux";

import { NavLink } from "react-router-dom";
import updateUser from "../graphql/update-user";

class EditProfilePage extends Component {
  _isMounted = false;
  state = {
    user: {},
  };
  userToUpdate = {};
  userDetails = {};
  componentDidMount() {
    this._isMounted = true;
    if (this.props.user.userId) this.getUser();
  }

  componentDidUpdate() {
    if (this.props.user.userId && (Object.keys(this.state.user).length === 0)) this.getUser();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  introductionInputChangeHandler = (event) => {
    this.userToUpdate.introduction = event.target.value;
    let user = this.state.user;
    user.introduction = event.target.value
    this.setState({ user });
  }

  lookingforInputChangeHandler = (event) => {
    this.userToUpdate.lookingFor = event.target.value;
    let user = this.state.user;
    user.lookingFor = event.target.value
    this.setState({ user });
  }

  interestsInputChangeHandler = (event) => {
    this.userToUpdate.interests = event.target.value
    let user = this.state.user;
    user.interests = event.target.value
    this.setState({ user });
  }

  updateUserDetails = async () => {
    if (this.props.user.token) {
      const updatedUser = await updateUser(this.props.user.token, this.userToUpdate);
      this.setState({ user: updatedUser });
      this.userDetails = { ...updatedUser };
    }
  }

  cancelUpdate = () => {
    const user = { ...this.userDetails }
    this.setState({ user })
  }

  getUser = () => {
    const requestBody = {
      query: `
      {
        users(userId: "${this.props.user.userId}"){
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
        Authorization: `Bearer ${this.props.user.token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (this._isMounted) {
          this.setState({ user: data.data.users[0] });
          this.userDetails = { ...data.data.users[0] }
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
                      <input
                        type="text"
                        value={this.state.user.introduction || ''}
                        onChange={this.introductionInputChangeHandler}
                      />
                    </div>
                    <div className="profile--looking-for">
                      <h4>Looking For </h4>
                      <input
                        type="text"
                        value={this.state.user.lookingFor || ''}
                        onChange={this.lookingforInputChangeHandler}
                      />
                    </div>
                    <div className="profile--interests">
                      <h4>Interests</h4>
                      <input
                        type="text"
                        value={this.state.user.interests || ''}
                        onChange={this.interestsInputChangeHandler}
                      />
                    </div>
                  </div>
                  <div className="profile--buttons">
                    <button className="btn profile--button" onClick={this.updateUserDetails}>Save</button>
                    <button className="btn profile--button" onClick={this.cancelUpdate}>Cancel</button>
                  </div>
                </div>
              </div>
              <div className="profile--right">
                <ul className="profile--right__header">
                  <li>
                    <NavLink to="/myprofile/photos">Photos</NavLink>
                  </li>
                  <li>
                    <NavLink to="/myprofile/followers">Followers</NavLink>
                  </li>
                  <li>
                    <NavLink to="/myprofile/following">Following</NavLink>
                  </li>
                  <li>
                    <NavLink to="/myprofile/messages">Messages</NavLink>
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

const mapStateToProps = state => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps)(EditProfilePage);

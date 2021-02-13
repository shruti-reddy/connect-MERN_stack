import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import ProfileCard from "../components/ProfileCard/ProfileCard";

import "./Profile.css";

class ProfilePage extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
    if (this.props.path === "/profile/:id") {
      // this.props.history.push(`${this.props.url}/photos`);
    }
  }

  getUser = () => {
    const requestBody = {
      query: `
      {
        users(userId: "${this.state.userId}"){
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

  likeUser = () => {
    console.log(`liked the user ${this.state.user.userName}`);
  };

  sendMessage = () => {
    console.log(`sending message to ${this.state.user.userName}`);
  };

  static getDerivedStateFromProps(nextProps) {
    return {
      userId: nextProps.computedMatch.params.id,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUser();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.userId !== this.state.userId) {
      this.getUser();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div>
        {this.state.user.userName ? (
          <div className="profile-page">
            <div className="profile--left">
              <ProfileCard
                user={this.state.user}
                likeUser={this.likeUser}
                sendMessage={this.sendMessage}
              />
            </div>
            <div className="profile--right">
              <ul className="profile--right__header">
                <li>
                  <NavLink to={`${this.props.computedMatch.url}/photos`}>
                    Photos
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`${this.props.computedMatch.url}/followers`}>
                    Followers
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`${this.props.computedMatch.url}/following`}>
                    Following
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`${this.props.computedMatch.url}/messages`}>
                    Messages
                  </NavLink>
                </li>
              </ul>
              <div className="profile--right__main">{this.props.children}</div>
            </div>
          </div>
        ) : (
            <div>Loading...</div>
          )}
      </div>
    );
  }
}

export default ProfilePage;

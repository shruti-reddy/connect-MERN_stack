import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Card.css";

class Card extends Component {
  sendMessage = () => {
    console.log(`sending message to ${this.props.user.userName}`);
  };
  likeUser = () => {
    console.log(`liked the user ${this.props.user.userName}`);
  };
  goToProfile = () => {
    this.props.history.push(`/profile/${this.props.user._id}`);
  };
  render() {
    return (
      <div onClick={this.goToProfile} className="user-card">
        <div className="card--img">
          <img
            className="card--img__img"
            src={
              this.props.user.photos.length > 0
                ? this.props.user.photos[0].url
                : require("../../assets/unknown-user.png")
            }
            alt={this.props.user.userName}
          />
        </div>
        <div className="card--details">
          <ul className="card--details__info">
            <li className="card--details__section">
              <h4>{this.props.user.userName}</h4>
            </li>
            <li className="card--details__section">
              <h4>
                {this.props.user.city}, {this.props.user.country}
              </h4>
            </li>
            <li className="card--details__section">
              <h4>Following: {this.props.user.liked.count}</h4>
            </li>
            <li className="card--details__section">
              <h4>Followers: {this.props.user.likedby.count}</h4>
            </li>
          </ul>
        </div>
        <div className="card--message">
          <button className="btn" onClick={this.sendMessage}>
            Message
          </button>
        </div>
        <div className="card--like">
          <button className="btn" onClick={this.likeUser}>
            Like
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Card);

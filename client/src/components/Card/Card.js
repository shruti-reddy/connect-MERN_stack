import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Card.css";

class Card extends Component {
  sendMessage = (e) => {
    e.stopPropagation();
    this.props.history.push(`/profile/${this.props.user._id}/messages`);
  };
  likeUser = (e) => {
    e.stopPropagation();
    console.log(`liked the user ${this.props.user.userName}`);
  };
  goToProfile = () => {
    this.props.history.push(`/profile/${this.props.user._id}/photos`);
  };
  render() {
    return (
      <div onClick={this.goToProfile} className="user-card">
        <div className="card--img">
          <img
            className="card--img__img"
            src={
              this.props.user.photos && this.props.user.photos.length > 0
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
              <h4>{this.props.user.city ? this.props.user.city : "Unknown"}</h4>
            </li>
            <li className="card--details__section">
              <div>
                <h4>Followers</h4>
                <span>{this.props.user.likedby.count}</span>
              </div>
            </li>
            <li className="card--details__section">
              <div>
                <h4>Following</h4>
                <span>{this.props.user.liked.count}</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="card--message">
          <button className="card--message__btn" onClick={this.sendMessage}>
            Message
          </button>
        </div>
        <div className="card--like">
          <button className="user-heart" onClick={this.likeUser}>
            <svg height="25" width="25">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Card);

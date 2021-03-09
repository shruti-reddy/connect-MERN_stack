import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import likeUser from "../../graphql/like-user";
import unLikeUser from "../../graphql/unlike-user";
import "./Card.css";

class Card extends Component {
  sendMessage = (e) => {
    e.stopPropagation();
    this.props.history.push(`/profile/${this.props.user._id}/messages`);
  };
  likeUser = async (e) => {
    e.stopPropagation();
    console.log('liked the user', this.props.user);
    await likeUser(this.props.user._id, this.props.token);
  };
  unLikeUser = async (e) => {
    e.stopPropagation();
    console.log('unliked the user', this.props.user);
    await unLikeUser(this.props.user._id, this.props.token);
  }
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
        <div className="card--buttons">
          <div className="card--message">
            <button className="card--message__btn" onClick={this.sendMessage}>Message</button>
          </div>
          <div className="card--message">
            <button className="card--message__btn" onClick={this.likeUser}>Follow</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.user.token
  }
}

export default connect(mapStateToProps)(withRouter(Card));

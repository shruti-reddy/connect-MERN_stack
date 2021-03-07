import React, { Component } from "react";
import moment from "moment";
import "./Photo.css";

class Photo extends Component {
  render() {
    return (
      <div className="photo__container">
        <div className="photo__img">
          <img
            src={this.props.photo.url ? this.props.photo.url : require("../../assets/unknown-user.png")}
            alt={this.props.photo.user.userName}
          />
        </div>
        <div className="photo__details">
          {this.props.photo.description && (
            <p className="photo__description">
              <strong>{this.props.photo.user.userName}: </strong>
              {this.props.photo.description}
            </p>
          )}
          <p>
            <strong>Created: </strong> {moment(this.props.photo.dateAdded).fromNow()}
          </p>
        </div>
        <div className="photo-buttons">
          <button
            type="button"
            className="btn btn-sm mr-2"
            onClick={this.props.setMain}>Main</button>
          <button
            type="button"
            className="btn btn-sm btn-danger ml-1"
            onClick={this.props.deletePhoto}>Delete</button>
        </div>
      </div>
    );
  }
}
export default Photo;

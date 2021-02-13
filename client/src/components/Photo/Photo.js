import React from "react";
import moment from "moment";
import "./Photo.css";

function Photo({ photo }) {
  return (
    <div className="photo__container">
      <div className="photo__img">
        <img
          src={photo.url ? photo.url : require("../../assets/unknown-user.png")}
          alt={photo.user.userName}
        />
      </div>
      <div className="photo__details">
        {photo.description && (
          <p className="photo__description">
            <strong>{photo.user.userName}: </strong>
            {photo.description}
          </p>
        )}
        <p>
          <strong>Created: </strong> {moment(photo.dateAdded).fromNow()}
        </p>
      </div>
    </div>
  );
}
export default Photo;

import React from "react";

const ProfileCard = ({ likeUser, sendMessage, user }) => (
  <div>
    <div className="profile--name">
      <span>
        {user.knownAs ? user.knownAs : user.userName}
        's Profile
      </span>
    </div>
    <div className="profile--img-section">
      <img
        className="profile--img__img"
        src={
          user.photos.length > 0
            ? user.photos[0].url
            : require("../../assets/unknown-user.png")
        }
        alt={user.userName}
      />
      <div className="profile--grid">
        <div>
          <h4>Followers</h4>
          <span>{user.likedby.count}</span>
        </div>
        <div className="profile--followers__following">
          <h4>Following</h4>
          <span>{user.liked.count}</span>
        </div>
        <div>
          <h4>City</h4>
          <span>{user.city}</span>
        </div>
        <div className="profile--location__country">
          <h4>Country</h4>
          <span>{user.country}</span>
        </div>
        <div className="profile--location__last-active">
          <h4>Last Active</h4>
          <span>{user.lastActive ? user.lastActive : "Unknown"}</span>
        </div>
        <div className="profile--location__created-at">
          <h4>Created At</h4>
          <span>{user.createdAt ? user.createdAt : "Unknown"}</span>
        </div>
      </div>
    </div>
    <div className="profile--details">
      <div className="profile--introduction">
        <h4>Introduction</h4>
        <textarea type="text" readOnly value={user.introduction} />
      </div>
      <div className="profile--looking-for">
        <h4>Looking For </h4>
        <input type="text" readOnly value={user.lookingFor} />
      </div>
      <div className="profile--interests">
        <h4>Interests</h4>
        <input type="text" readOnly value={user.interests} />
      </div>
      <div className="profile--buttons">
        <button onClick={likeUser} className="btn profile--button">
          Like
        </button>
        <button onClick={sendMessage} className="btn profile--button">
          Message
        </button>
      </div>
    </div>
  </div>
);

export default ProfileCard;

import React, { Component } from "react";
import { connect } from 'react-redux';
import Card from "../Card/Card";

class Following extends Component {
  constructor(props) {
    super(props);
    this.state = {
      following: [],
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.id || this.props.userId;
    const requestBody = {
      query: `
      {
        users(userId: "${userId}"){
          liked {
            count
            likes {
              _id
              userName
              city
              country
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
        }
      }
      `,
    };

    fetch("/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.data.users[0].liked.count) {
          this.setState({ following: data.data.users[0].liked.likes });
        }
      });
  }

  render() {
    return (
      <div>
        {this.state.following.map((user, index) => (
          <Card key={index} user={user} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.auth.user.userId
  }
}

export default connect(mapStateToProps)(Following);

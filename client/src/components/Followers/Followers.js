import React, { Component } from "react";
import Card from "../Card/Card";

class Followers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: [],
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.id;
    const requestBody = {
      query: `
      {
        users(userId: "${userId}"){
          likedby {
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
        if (data.data.users[0].likedby.count) {
          this.setState({ followers: data.data.users[0].likedby.likes });
        }
      });
  }

  render() {
    return (
      <div>
        {this.state.followers.map((user, index) => (
          <Card key={index} user={user} />
        ))}
      </div>
    );
  }
}

export default Followers;

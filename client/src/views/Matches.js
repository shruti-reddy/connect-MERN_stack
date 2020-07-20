import React, { Component } from "react";
import Card from "../components/Card/Card";

class MatchesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    const requestBody = {
      query: `
      {
        users{
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
      `,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        this.setState({ users: data.data.users });
      });
  }
  render() {
    return (
      <div>
        {this.state.users.map((user, index) => (
          <Card key={index} user={user} />
        ))}
      </div>
    );
  }
}

export default MatchesPage;

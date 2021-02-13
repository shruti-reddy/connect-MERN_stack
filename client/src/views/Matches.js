import React, { Component } from "react";
import Card from "../components/Card/Card";
import getAllUsers from '../graphql/get-all-users';

class MatchesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  // const requestBody = {
  //   query: `
  //   {
  //     users{
  //       _id
  //       userName
  //       city
  //       country
  //       liked {
  //         count
  //       }
  //       likedby {
  //         count
  //       }
  //       photos(isMain: true) {
  //         url
  //       }
  //     }
  //   }
  //   `,
  // };

  // fetch("/graphql", {
  //   method: "POST",
  //   body: JSON.stringify(requestBody),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((r) => r.json())
  //   .then((data) => {
  //     console.log(data.data.users);
  //     this.setState({ users: data.data.users });
  //   });
  componentDidMount() {
    getAllUsers().then(res => {
      this.setState({ users: res.data.data.users });
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

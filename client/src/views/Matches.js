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

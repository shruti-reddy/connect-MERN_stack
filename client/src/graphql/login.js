import axios from "axios";

const login = async (user, password) => {
  const requestBody = {
    query: `
        {
          login(userName:"${user}", password:"${password}"){
            token
            tokenExpiration
            userId
            userName
          }
        }
        `,
  };
  const loginData = await axios.post("http://localhost:4000/graphql", requestBody);
  return loginData.data;
};

export default login;

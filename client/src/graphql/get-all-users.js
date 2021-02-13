import axios from "axios";

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

const getAllUsers = async () => {
  const users = await axios.post('/graphql', requestBody);
  console.log(users)
  return users;
}

export default getAllUsers;


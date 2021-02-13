import axios from "axios";

export default getUserFollowers = async (userId) => {

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

  const followers = await axios.post('/graphql', requestBody);
  return followers.json();
}
import axios from "axios";

export default getUserFollowing = async (userId) => {
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

  const userFollowing = await axios.post("/graphql", requestBody);
  return userFollowing.json();
};

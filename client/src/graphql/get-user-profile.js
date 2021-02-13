import axios from "axios";

export default getUserProfile = async (userId) => {
  const requestBody = {
    query: `
    {
      users(userId: "${userId}"){
        _id
        userName
        city
        country
        gender
        lookingFor
        knownAs
        introduction
        interests
        created
        lastActive
        dateOfBirth
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

  const userProfile = await axios.post('/graphql', requestBody);
  return userProfile.json();
}
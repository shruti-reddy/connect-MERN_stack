import axios from "axios";

export default getUserPhotos = async (userId) => {
  const requestBody = {
    query: `
        {
          photos(userId: "${userId}"){
            url
            description
            dateAdded
            isMain
            user {
              _id
              userName
            }
          }
        }
        `,
  };
  const userPhotos = await axios.post("/graphql", requestBody);
  return userPhotos.json();
};

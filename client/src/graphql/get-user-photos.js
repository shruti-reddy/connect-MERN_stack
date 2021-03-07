const getUserPhotos = async (userId, token) => {
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
  const userPhotos = await fetch("/graphql", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return userPhotos.json();
};

export default getUserPhotos;
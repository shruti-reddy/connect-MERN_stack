const updateUser = async (token, user) => {
    const requestBody = {
        query: `
            mutation updateUsermutation($user: UserUpdateType) {
                updateUser(userUpdateType: $user) {
                    _id
                    userName
                    gender
                    dateOfBirth   
                    knownAs 
                    created
                    lastActive
                    introduction
                    lookingFor
                    interests
                    city
                    country
                    liked {
                        count
                      }
                      likedby {
                        count
                      }
                    photos {
                        url
                    }
                }
            }`,
        variables: {
            "user": user
        }
    };
    const res = await fetch("/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    const data = await res.json();
    return data.data.updateUser;
}

export default updateUser;
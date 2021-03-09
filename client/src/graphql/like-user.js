const likeUser = async (recipientId, token) => {
    const requestBody = {
        query: `
            mutation {
                likeUser(recipientId: "${recipientId}") {
                    liked{
                        userName
                    }
                    likedby{
                        userName
                    }
                }
            }
        `
    }

    const res = await fetch('/graphql', {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    const data = await res.json();
    return data;
}

export default likeUser;
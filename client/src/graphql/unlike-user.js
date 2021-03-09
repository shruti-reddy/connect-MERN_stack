const unLikeUser = async (recipientId, token) => {
    const requestBody = {
        query: `
            mutation {
                unLikeUser(recipientId: "${recipientId}")
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

export default unLikeUser;
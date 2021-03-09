const setMainPhoto = async (token, photoId) => {
    const requestBody = {
        query: `
            mutation {
                setMainPhoto(_id: "${photoId}") {
                    _id
                    url
                    description
                    dateAdded
                    isMain
                    user{
                        userName
                        _id
                    }
                }
            }`
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
    return data;
}

export default setMainPhoto;
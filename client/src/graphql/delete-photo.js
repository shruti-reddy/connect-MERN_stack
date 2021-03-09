const deletePhoto = async (token, photoId) => {
    const requestBody = {
        query: `
            mutation {
                deletePhoto(_id: "${photoId}") 
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

export default deletePhoto;
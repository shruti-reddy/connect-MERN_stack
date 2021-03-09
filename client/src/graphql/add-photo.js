const addPhoto = async (token, photoData) => {
    const requestBody = {
        query: `
            mutation addPhotomutation($photo: PhotoSaveType) {
                addPhoto(photoSaveType: $photo) {
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
            }`,
        variables: {
            "photo": photoData
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
    return data;
}

export default addPhoto;
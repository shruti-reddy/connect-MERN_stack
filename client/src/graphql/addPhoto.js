import axios from "axios";

const requestBody = {
    query: `{
        mutation addPhotomutation($photo: PhotoSaveType) {
            addPhoto(photoSaveType: $photo) {
                _id
                url
                description
                dateAdded
                isMain
            }
        }
    }`,
    variables: {
        photo: `{
            "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_CLzjT17aiO7TJpwjqmG04E9XpgCUfhC2NA&usqp=CAU",
                "description": "monica"
        }`,
    }
};


const updateUser = async () => {
    const updatedUser = await axios.post('/graphql', requestBody);
    return updatedUser;
}

export default updateUser;

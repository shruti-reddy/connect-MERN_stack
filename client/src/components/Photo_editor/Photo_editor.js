import React, { Component } from "react";
import { connect } from 'react-redux';

import addPhoto from "../../graphql/add-photo";
import setMainPhoto from "../../graphql/set-main-photo"
import deletePhoto from "../../graphql/delete-photo";
import getUserPhotos from "../../graphql/get-user-photos";
import Photo from "../../components/Photo/Photo"
import "./Photo_editor.css"
import * as actions from "../../store/actions/index";

class PhotoEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: null,
            selectedFile: null,
            fileInputState: '',
            previewSource: '',
            successMsg: ''
        }
    }

    componentDidMount() {
        if (this.props.user.userId) this.getPhotos();
    }

    componentDidUpdate() {
        if (this.props.user.userId && this.state.photos === null) this.getPhotos();
    }

    getPhotos = async () => {
        const photos = await getUserPhotos(this.props.user.userId, this.props.user.token);
        this.setState({ photos: photos.data.photos });
    }

    handleFileInputChange = (e) => {
        const file = e.target.files[0];
        this.previewFile(file);
        this.setState({ selectedFile: file });
        this.setState({ fileInputState: e.target.value })
    };

    previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.setState({ previewSource: reader.result })
        };
    };

    handleSubmitFile = (e) => {
        e.preventDefault();
        if (!this.state.selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(this.state.selectedFile);
        reader.onloadend = () => {
            this.uploadImage(reader.result);
        };
        reader.onerror = () => {
            console.error('AHHHHHHHH!!');
            // setErrMsg('something went wrong!');
        };
    };

    uploadImage = async (base64EncodedImage) => {
        try {
            const addPhotoResponse = await fetch('/getCloudinaryUrl', {
                method: 'POST',
                body: JSON.stringify({ data: base64EncodedImage }),
                headers: { 'Content-Type': 'application/json' },
            });
            const photo = await addPhotoResponse.json();
            this.setState({ fileInputState: '' });
            this.setState({ previewSource: '' })
            this.setState({ successMsg: 'Image uploaded successfully' });
            const photoData = {
                url: photo.photoUrl,
                description: `${this.props.username}'s photo`
            }
            const res = await addPhoto(this.props.token, photoData);
            if (this.state.photos.length === 0) {
                this.props.onsetCurrentUserMainPhoto(photo.photoUrl);
            }
            const photos = [...this.state.photos];
            photos.push(res.data.addPhoto);
            this.setState({ photos })
        } catch (err) {
            console.error(err);
            // setErrMsg('Something went wrong!');
        }
    };

    setMain = async (photo) => {
        const result = await setMainPhoto(this.props.user.token, photo._id);
        this.props.onsetCurrentUserMainPhoto(result.data.setMainPhoto.url);
    }

    deletePhoto = async (photo) => {
        await deletePhoto(this.props.user.token, photo._id);
        let photos = [...this.state.photos];
        photos = photos.filter(pto => pto !== photo)
        this.setState({ photos })
    }

    render() {
        return (
            <div>
                <div className="add_photos">
                    <h3 className="title">Upload an Image</h3>
                    <form onSubmit={this.handleSubmitFile} className="form">
                        <input
                            id="fileInput"
                            type="file"
                            name="image"
                            onChange={this.handleFileInputChange}
                            value={this.state.fileInputState}
                            className="form-input btn btn-sm"
                        />
                        <button className="btn" type="submit">Upload</button>
                    </form>
                    <div>
                        {this.state.previewSource && (
                            <img
                                src={this.state.previewSource}
                                alt="chosen"
                                style={{ height: '300px' }}
                            />
                        )}
                    </div>
                </div>
                <div className="display_photos">
                    <h3 className="title">Gallery</h3>
                    <div className="gallery">
                        {this.state.photos &&
                            this.state.photos.map((photo, index) => (
                                <Photo
                                    photo={photo}
                                    key={index}
                                    setMain={() => this.setMain(photo)}
                                    deletePhoto={() => this.deletePhoto(photo)}
                                />
                            ))}
                    </div>
                </div >
            </div >
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.auth.user,
        token: state.auth.user.token,
        username: state.auth.user.userName
    }
}

const mapStateToDispatch = dispatch => {
    return {
        onsetCurrentUserMainPhoto: (photoUrl) => dispatch(actions.setUserPhoto(photoUrl))
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(PhotoEditor);

import React from 'react';
import { Keyboard } from 'react-native';
import NewsfeedContent from './subcomponents/NewsfeedContent';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { inject } from 'mobx-react/native';
import { promisify } from '../../utils';
import PropTypes from 'prop-types';

@inject('userStore')
@inject('authStore')
class ArtNewsfeed extends React.Component {
    static navigationOptions = {
        title: 'Art',
    };

    static propTypes = {
        authStore: PropTypes.any,
        userStore: PropTypes.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loadingData: true,
            isPosting: false,
            userId: null,
            pickedImageUri: '',
            postText: '',
            mediaUrl: null,
            authStore: null,
            userStore: null,
            reportingPostId: '',
            reportingUserId: '',
        };
    }

    componentDidMount() {
        const { authStore, userStore } = this.props;
        const userId = authStore.userInfo.id;
        this.setState({ userId, authStore, userStore }, this.getPosts);
    }

    handleImagePicker = async () => {
        this, this.getPermissionAsync();
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: true,
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!result.cancelled) {
            const mediaUrl = result.base64;
            this.setState({ pickedImageUri: result.uri, mediaUrl });
        }
    };

    handlePostTextChange = text => {
        this.setState({ postText: text });
    };

    handleRemoveImage = () => {
        this.setState({ pickedImageUri: '', mediaUrl: '' });
    };

    handleCancelPost = () => {
        this.setState({ pickedImageUri: '', mediaUrl: '', postText: '' });
    };

    handleAddPost = async () => {
        Keyboard.dismiss();
        this.setState({ isPosting: true });
        const { postText, mediaUrl, userId, userStore } = this.state;
        const data = {
            postType: mediaUrl ? 'Image' : 'Text',
            postAuthor: userId,
            postTitle: '',
            postText,
            mediaUrl,
        };
        if (
            this.state.userStore &&
            this.state.userStore.createNewPost instanceof Function
        ) {
            const [post, postErr] = await promisify(
                userStore.createNewPost(data),
            );
            if (postErr) {
                this.setState({ isPosting: false });
                throw new Error(postErr);
            }

            if (post) {
                this.setState(
                    {
                        isPosting: false,
                        mediaUrl: '',
                        postText: '',
                        pickedImageUri: '',
                    },
                    this.getPosts,
                );
            }
        }
    };

    handleReportPost = postId => async () => {
        this.setState({ reportingPostId: postId });
        if (
            this.state.userStore &&
            this.state.userStore.getPosts instanceof Function
        ) {
            const [report, reportError] = await promisify(
                this.state.userStore.reportPost(postId),
            );
            if (reportError) {
                this.setState({ reportingPostId: '' });
                throw new Error(reportError);
            }
            if (report.success) {
                this.setState({ reportingPostId: '' }, this.getPosts);
            }
        }
    };

    blockUser = (postId, userId) => async () => {
        this.setState({ reportingPostId: postId, reportingUserId: userId });
        if (
            this.state.userStore &&
            this.state.userStore.getPosts instanceof Function
        ) {
            const [report, reportError] = await promisify(
                this.state.userStore.blockUser(userId),
            );
            if (reportError) {
                this.setState({ reportingPostId: '', reportingUserId: '' });
                throw new Error(reportError);
            }
            if (report.response.success) {
                this.setState(
                    { reportingPostId: '', reportingUserId: '' },
                    this.getPosts,
                );
            }
        }
    };

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(
                Permissions.CAMERA_ROLL,
            );
            if (status !== 'granted') {
                alert(
                    'Sorry, we need camera roll permissions to make this work!',
                );
            }
        }
    };

    getPosts = async () => {
        if (
            this.state.userStore &&
            this.state.userStore.getPosts instanceof Function
        ) {
            const [postList, postsErr] = await promisify(
                this.state.userStore.getPosts(this.state.userId),
            );
            if (postsErr) {
                this.setState({ loadingData: false });
                throw new Error(postsErr);
            }
            let posts = [];
            if (postList && postList.length > 0) {
                posts = postList.map(post => {
                    post.mediaUrl = !post.mediaUrl
                        ? null
                        : post.mediaUrl.includes('http')
                        ? post.mediaUrl
                        : `data:image/gif;base64,${post.mediaUrl}`;
                    const profilePhoto = post.postAuthor.profilePhoto
                        ? post.postAuthor.profilePhoto
                        : 'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png';
                    post.postAuthor.profilePhoto = profilePhoto;

                    return post;
                });
            }

            this.setState({ posts, loadingData: false });
        }
    };

    render() {
        const isShowAddButton =
            this.state.postText || this.state.pickedImageUri ? true : false;
        return (
            <NewsfeedContent
                loadingData={this.state.loadingData}
                inputTextValue={this.state.postText}
                posts={this.state.posts}
                openCameraCallback={this.handleImagePicker}
                pickedImageUri={this.state.pickedImageUri}
                onTextChangeCallback={this.handlePostTextChange}
                isShowAddButton={isShowAddButton}
                handleRemoveImage={this.handleRemoveImage}
                handleCancelPost={this.handleCancelPost}
                handleAddPost={this.handleAddPost}
                isPosting={this.state.isPosting}
                reportPost={this.handleReportPost}
                reportingPostId={this.state.reportingPostId}
                reportingUserId={this.state.reportingUserId}
                blockUser={this.blockUser}
                r></NewsfeedContent>
        );
    }
}

export default ArtNewsfeed;

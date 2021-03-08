import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { SimpleLineIcons } from '@expo/vector-icons';

class NewsfeedPost extends React.PureComponent {
    static propTypes = {
        post: PropTypes.object,
        reportingPostId: PropTypes.string,
        reportingUserId: PropTypes.string,
        reportPost: PropTypes.func,
        blockUser: PropTypes.func,
    };
    state = {
        openOptions: false,
    };

    openOptions = () => {
        this.setState(({ openOptions }) => ({ openOptions: !openOptions }));
    };

    componentDidUpdate(prevProp) {
        if (
            prevProp.reportingPostId &&
            prevProp.reportingUserId &&
            !this.props.reportingPostId &&
            !this.props.reportingUserId
        ) {
            this.setState({ openOptions: false });
        }
    }

    render() {
        const {
            post,
            reportPost,
            reportingPostId,
            blockUser,
            reportingUserId,
        } = this.props;
        return (
            <TouchableOpacity activeOpacity={1}>
                <View style={styles.container}>
                    <TouchableOpacity>
                        <Image
                            source={{ uri: post.postAuthor.profilePhoto }}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                            }}></Image>
                    </TouchableOpacity>
                    <View style={styles.content}>
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'flex-end',
                                position: 'relative',
                                zIndex: 6,
                            }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={this.openOptions}
                                style={{
                                    width: 30,
                                    height: 30,
                                    alignItems: 'flex-end',
                                }}>
                                <SimpleLineIcons
                                    name="options"
                                    size={20}
                                    color="#424242"
                                />
                            </TouchableOpacity>
                            {this.state.openOptions ? (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 25,
                                        backgroundColor: '#ffffff',
                                        padding: 10,
                                        borderRadius: 10,
                                    }}>
                                    {/* <TouchableOpacity activeOpacity={0.5} style={{ marginBottom: 5 }}>
                                        <Text style={{ color: '#53C7FC' }}>
                                            Follow
                                    </Text>
                                    </TouchableOpacity> */}
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={blockUser(
                                            post.id,
                                            post.postAuthor.id,
                                        )}>
                                        {reportingPostId == post.id &&
                                        reportingUserId ==
                                            post.postAuthor.id ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="#53C7FC"></ActivityIndicator>
                                        ) : (
                                            <Text style={{ color: '#53C7FC' }}>
                                                Block
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                        </View>
                        {post.postAuthor.userName ? (
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#545454',
                                    fontWeight: '500',
                                }}>
                                {post.userName}
                            </Text>
                        ) : null}
                        {post.postText ? (
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: '#000000',
                                    fontWeight: '500',
                                }}>
                                {post.postText}
                            </Text>
                        ) : null}
                        {post.mediaUrl ? (
                            <View style={styles.postImage}>
                                <Image
                                    source={{ uri: post.mediaUrl }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 10,
                                    }}></Image>
                            </View>
                        ) : null}
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'flex-end',
                                paddingTop: 5,
                            }}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={reportPost(post.id)}>
                                {reportingPostId == post.id &&
                                !reportingUserId ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#53C7FC"></ActivityIndicator>
                                ) : (
                                    <Text style={{ color: '#53C7FC' }}>
                                        Report
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default NewsfeedPost;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        marginVertical: 5,
        backgroundColor: '#ffffff',
        padding: 10,
    },
    content: {
        width: '80%',
        shadowColor: '#cccccc',
        shadowOpacity: 0.7,
        shadowRadius: 10,
        marginRight: 10,
    },
    postImage: {
        width: '100%',
        aspectRatio: 2,
        borderRadius: 10,
        zIndex: 5,
    },
});

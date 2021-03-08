import React from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    Text,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import NewsfeedPost from './NewsfeedPost';
import PropTypes from 'prop-types';

const NewsfeedContent = ({
    loadingData,
    inputTextValue,
    posts,
    isPosting,
    openCameraCallback,
    pickedImageUri,
    isShowAddButton,
    onTextChangeCallback,
    handleRemoveImage,
    handleCancelPost,
    handleAddPost,
    reportPost,
    reportingPostId,
    blockUser,
    reportingUserId,
    ...props
}) => {
    const renderItem = ({ item }) => (
        <NewsfeedPost
            blockUser={blockUser}
            reportPost={reportPost}
            reportingPostId={reportingPostId}
            reportingUserId={reportingUserId}
            post={item}></NewsfeedPost>
    );
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={() => Keyboard.dismiss()}>
            <View style={styles.addingPostSection}>
                <View
                    style={{
                        height: '100%',
                        justifyContent: 'flex-start',
                        marginTop: 20,
                    }}>
                    <TouchableOpacity onPress={openCameraCallback}>
                        <Feather
                            name="camera"
                            size={30}
                            color="#333333"></Feather>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '75%' }}>
                    <TextInput
                        value={inputTextValue}
                        style={{ marginVertical: 10 }}
                        placeholder="Add something"
                        multiline
                        onChangeText={onTextChangeCallback}></TextInput>
                    {pickedImageUri ? (
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{ uri: pickedImageUri }}
                                style={{
                                    width: '100%',
                                    aspectRatio: 2,
                                    marginVertical: 5,
                                    borderRadius: 10,
                                }}></Image>
                            <TouchableOpacity
                                style={{ marginLeft: -10, marginTop: -8 }}
                                onPress={handleRemoveImage}>
                                <Text
                                    style={{ fontSize: 20, color: '#424242' }}>
                                    X
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                    {isShowAddButton ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-around',
                                marginVertical: 10,
                            }}>
                            <TouchableOpacity onPress={handleCancelPost}>
                                <Text style={{ color: '#53C7FC' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={isPosting ? null : handleAddPost}>
                                {isPosting ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#53C7FC"></ActivityIndicator>
                                ) : (
                                    <Text style={{ color: '#53C7FC' }}>
                                        Post
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
            </View>
            {loadingData ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator
                        size="small"
                        color="#53C7FC"></ActivityIndicator>
                </View>
            ) : posts && posts.length > 0 ? (
                <View style={styles.postList}>
                    <FlatList
                        data={posts}
                        extraData={props}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => {
                            return index + '';
                        }}
                    />
                </View>
            ) : (
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 16, color: '#424242' }}>
                        There is no post
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

NewsfeedContent.propTypes = {
    inputTextValue: PropTypes.string,
    posts: PropTypes.array,
    openCameraCallback: PropTypes.func,
    pickedImageUri: PropTypes.string,
    isShowAddButton: PropTypes.bool,
    onTextChangeCallback: PropTypes.func,
    handleCancelPost: PropTypes.func,
    handleRemoveImage: PropTypes.func,
    item: PropTypes.object,
    loadingData: PropTypes.bool,
    isPosting: PropTypes.bool,
    handleAddPost: PropTypes.func,
    reportPost: PropTypes.func,
    reportingPostId: PropTypes.string,
    blockUser: PropTypes.func,
    reportingUserId: PropTypes.string,
};

export default NewsfeedContent;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    addingPostSection: {
        minHeight: '10%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        shadowColor: '#424242',
        shadowOpacity: 0.7,
        shadowRadius: 10,
        backgroundColor: '#ffffff',
    },
    postList: {
        height: '90%',
    },
});

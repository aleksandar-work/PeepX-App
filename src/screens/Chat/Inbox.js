import React from 'react';
import {
    Text,
    FlatList,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { inject } from 'mobx-react/native';
import { theme } from '../../constants';
import { NavigationService } from '../../services/NavigationService';
import { promisify } from '../../utils';
import moment from 'moment';
import PropTypes from 'prop-types';

@inject('userStore')
@inject('authStore')
class Inbox extends React.Component {
    static navigationOptions = {
        title: 'Inbox',
    };

    static propTypes = {
        authStore: PropTypes.any,
        userStore: PropTypes.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            inboxs: [],
        };
    }

    componentDidMount() {
        this.getUserChats();
    }

    getUserChats = async () => {
        const { userStore, authStore } = this.props;
        const userId = authStore.userInfo.id;
        let user = {};
        let inboxer = {};
        let lastMessage = {};

        const [inboxList, inboxsErr] = await promisify(userStore.getAllChats());
        if (inboxsErr) {
            throw new Error(inboxsErr);
        }
        let inboxs = [];
        if (inboxList && inboxList.length > 0) {
            inboxs = inboxList.map(ib => {
                if (ib.members && ib.members.length > 0) {
                    ib.members.map(member => {
                        member.profilePhoto = member.profilePhoto
                            ? member.profilePhoto
                            : 'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png';
                        if (member.id == userId) {
                            user = member;
                        } else {
                            inboxer = member;
                        }
                    });
                }

                lastMessage =
                    ib.messages && ib.messages.length > 0
                        ? ib.messages.slice(-1)[0]
                        : null;

                return {
                    id: ib.id,
                    user,
                    inboxer,
                    lastMessage,
                };
            });

            inboxs = inboxs.filter(inbox => inbox.lastMessage);
        }
        this.setState({ inboxs });
    };

    handleInboxClick = (
        inboxerName,
        imageUri,
        chatID,
        destinationUserId,
    ) => () => {
        NavigationService.navigate('Chat', {
            inboxerName: inboxerName + '',
            imageUri,
            chatID,
            destinationUserId,
        });
    };

    renderInboxItem = ({ item }) => (
        <TouchableOpacity
            style={styles.inboxContainer}
            activeOpacity={0.5}
            onPress={this.handleInboxClick(
                item.inboxer.userName,
                item.inboxer.profilePhoto,
                item.id,
                item.inboxer.id,
            )}>
            <View style={styles.imageContainer}>
                {item.status == 'online' ? (
                    <View style={styles.onlineDot}></View>
                ) : null}
                <Image
                    source={{ uri: item.inboxer.profilePhoto }}
                    style={styles.profileImage}></Image>
            </View>
            <View style={styles.messageContainer}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        width: '100%',
                        marginBottom: 5,
                    }}>
                    <Text
                        style={{
                            fontSize: 10,
                            paddingRight: 20,
                            color: '#A1A8B1',
                        }}>
                        {item.lastMessage
                            ? moment(item.lastMessage.updatedAt).format(
                                  'HH:mm DD/MM/YY',
                              )
                            : ''}
                    </Text>
                </View>
                <Text
                    style={
                        item.status == 'online'
                            ? { fontSize: 16 }
                            : { fontSize: 16, color: '#A1A8B1' }
                    }>
                    {item.lastMessage ? item.lastMessage.content : ''}
                </Text>
            </View>
        </TouchableOpacity>
    );

    render() {
        const { inboxs } = this.state;
        return (
            <View>
                {inboxs.length > 0 ? (
                    <View style={{ width: '100%', height: '100%' }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: '#A1A8B1',
                                marginVertical: 10,
                                marginLeft: '8%',
                            }}>
                            MESSAGES
                        </Text>
                        <FlatList
                            data={inboxs}
                            renderItem={this.renderInboxItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                ) : (
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '70%',
                        }}>
                        <Text>There is no inbox for you</Text>
                    </View>
                )}
            </View>
        );
    }
}

export default Inbox;

const styles = StyleSheet.create({
    inboxContainer: {
        width: '95%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingBottom: 10,
        marginLeft: '5%',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    messageContainer: {
        width: '75%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    imageContainer: {
        width: 70,
        height: 70,
        position: 'relative',
    },
    profileImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        borderRadius: 35,
        zIndex: 1,
        backgroundColor: '#cccccc',
    },
    onlineDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.color.peepBlue,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
    },
});

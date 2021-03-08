import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    TextInput,
    Animated,
    Keyboard,
    Platform,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tabBarIcons } from '../../constants/icons';
import { theme, TAB_BAR_HEIGHT } from '../../constants';
import { navigationPropTypes } from '../../types';
import styles from './styles';
import { inject } from 'mobx-react/native';
import { promisify } from '../../utils';
import createSocket from '../../services/SocketIO';

import Message from './Message';

@inject('userStore')
@inject('authStore')
class Chat extends Component {
    static propTypes = {
        ...navigationPropTypes,
    };

    socket = null;
    chat = this;
    static navigationOptions = ({ navigation }) => {
        return {
            title:
                navigation.state.params && navigation.state.params.userName
                    ? navigation.state.params.userName
                    : '',
        };
    };
    /*--- Lifecycle Methods region ---*/
    constructor(props) {
        super(props);

        this.keyboardHeight = new Animated.Value(0);

        this.state = {
            userStore: this.props.userStore,
            authStore: this.props.authStore,
            currentMessage: '',
            inbox: null,
            messages: [],
            userId: '',
            chatId: '',
            partnerID: '',
            coupleID: '',
            token: '',
            increasedInputHeight: 0,
            encodedProfileImage: null,
            keyboardHeight: 0,
        };
    }

    componentDidMount() {
        this.getUserInfo();
        this.getChat();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.token && prevState.token != this.state.token) {
            this.connectSocket(this.state.token);
        }
        if (prevState.chatId != this.state.chatId) {
            this.connectSocket(this.state.token);
        }
    }

    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener(
            'keyboardWillShow',
            this.handleKeyboardWillShow,
        );
        this.keyboardWillHideSub = Keyboard.addListener(
            'keyboardWillHide',
            this.handleKeyboardWillHide,
        );
        if (Platform.OS == 'android') {
            this.keyboardDidShowSub = Keyboard.addListener(
                'keyboardDidShow',
                this.handleKeyboardDidShow,
            );
            this.keyboardDidHideSub = Keyboard.addListener(
                'keyboardDidHide',
                this.handleKeyboardDidHide,
            );
        }
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
        if (Platform.OS == 'android') {
            this.keyboardDidHideSub.remove();
            this.keyboardDidShowSub.remove();
        }
    }

    /*--- End Lifecycle Methods region ---*/

    /*--- Event Action Methods region ---*/
    getUserInfo = async () => {
        if (!this.state.userStore || !this.state.authStore) return;
        const token = await this.state.userStore.getUserAuthToken();
        const chatId = this.props.navigation.state.params.chatId
            ? this.props.navigation.state.params.chatId
            : '';
        const userId = this.state.authStore.userInfo.id;
        this.setState({ token, userId, chatId });
    };

    handleKeyboardWillShow = event => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: event.endCoordinates.height - TAB_BAR_HEIGHT,
            }),
        ]).start();
    };

    handleKeyboardWillHide = event => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: 0,
            }),
        ]).start();
    };

    handleKeyboardDidShow = event => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: 0,
                toValue: event.endCoordinates.height - TAB_BAR_HEIGHT,
            }),
        ]).start();
    };

    handleKeyboardDidHide = () => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: 0,
                toValue: 0,
            }),
        ]).start();
    };

    /*--- End Event Action Methods region ---*/

    /*--- SocketIO Methods region ---*/
    connectSocket = token => {
        const { chatId } = this.state;
        if (this.socket && this.socket.connected) {
            this.socket.close();
        }
        this.socket = createSocket(token, chatId);
        this.socket.on('connect', () => {
            if (this.socket.connected) {
                this.socket.on('sendSucceed', this.handleResponseFromEmitMsg);
                this.socket.on('newMessage', this.handleResponseFromEmitMsg);
            } else {
                this.socket = createSocket(token, chatId);
            }
        });
        this.socket.on('disconnect', reason => {
            console.log('disconnected', this.socket.disconnected, reason);
            if (reason == 'transport close') {
                this.socket = createSocket(token, chatId);
            }
        });
    };

    handleResponseFromEmitMsg = data => {
        if (!data) return;
        const chatId = this.state.chatId ? this.state.chatId : chatId;
        this.setState(({ inbox }) => ({
            inbox: { ...inbox, messages: [...inbox.messages, data] },
            currentMessage: '',
            chatId,
        }));
    };

    sentMessage = () => {
        const { destinationUserId } = this.props.navigation.state.params;
        const { chatId } = this.state;
        if (!this.socket || !this.state.currentMessage || !destinationUserId)
            return;
        const content = this.state.currentMessage;
        const data = { content, destinationUserId, chatId };
        this.socket.emit('sendMessage', data);
    };

    /*--- Util methos region ---*/

    getChat = async () => {
        if (!this.state.userStore) return;
        const { userStore } = this.state;
        if (this.props.navigation.state.params.chatId) {
            const [inbox, inboxErr] = await promisify(
                userStore.getChat(this.props.navigation.state.params.chatId),
            );
            if (inboxErr) {
                throw new Error(inboxErr);
            }

            this.setState({ inbox });
        } else {
            const [inbox, inboxErr] = await promisify(
                userStore.getChatWithUser(
                    this.props.navigation.state.params.destinationUserId,
                ),
            );
            if (inboxErr) {
                throw new Error(inboxErr);
            }
            const chatId = inbox ? inbox.id : '';
            this.setState({ inbox, chatId });
        }
    };

    handleTextChange = text => {
        this.setState({ currentMessage: text });
    };

    renderMessageItem = ({ item, index }) => {
        const messages = [...this.state.inbox.messages];
        messages.reverse();
        const isShowImage =
            item.user != this.state.userId &&
            (!messages[index + 1] || item.user != messages[index + 1].user);
        const isMe = item.user === this.state.userId;
        const isContinueMess =
            messages[index + 1] && item.user == messages[index + 1].user;
        return (
            <Message
                message={item}
                index={index}
                isShowImage={isShowImage}
                isMe={isMe}
                isContinueMess={isContinueMess}
                styles={styles}
                imageUri={
                    this.props.navigation.state.params.imageUri
                }></Message>
        );
    };

    /*--- End Util methos region ---*/

    render() {
        let messages =
            this.state.inbox && this.state.inbox.messages
                ? [...this.state.inbox.messages]
                : [];
        messages = messages.reverse();
        return (
            <Animated.View
                style={[
                    styles.screenContainer,
                    { paddingBottom: this.keyboardHeight },
                ]}>
                <View style={{ height: '100%', position: 'relative' }}>
                    <TouchableOpacity
                        style={{
                            maxHeight: '88%',
                            marginTop: 5,
                            marginBottom: this.state.increasedInputHeight,
                        }}
                        onPress={() => Keyboard.dismiss()}
                        activeOpacity={1}>
                        {messages && messages.length > 0 ? (
                            <FlatList
                                data={messages}
                                extraData={this.state.inbox}
                                renderItem={this.renderMessageItem}
                                inverted
                                keyExtractor={(item, index) =>
                                    item.createAt + '' + index
                                }
                            />
                        ) : null}
                    </TouchableOpacity>
                    <View style={styles.chatMessageBottom}>
                        <TouchableOpacity>
                            <MaterialCommunityIcons
                                name="arrow-right-bold-box"
                                size={30}
                                color="#868E99"
                            />
                        </TouchableOpacity>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.messageInput}
                                placeholder="Type here"
                                multiline={true}
                                autoCapitalize="sentences"
                                onChangeText={this.handleTextChange}
                                value={this.state.currentMessage}
                            />
                            <TouchableOpacity
                                onPress={this.sentMessage}
                                activeOpacity={0.5}>
                                <MaterialCommunityIcons
                                    name={tabBarIcons.Send}
                                    size={35}
                                    color={theme.color.peepBlue}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    }
}

export default Chat;

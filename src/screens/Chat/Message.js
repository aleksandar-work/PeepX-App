import React from 'react';
import TextWithBackground from '../../components/common/TextWithBackground';
import { View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

class Message extends React.PureComponent {
    static propTypes = {
        message: PropTypes.object,
        isMe: PropTypes.bool,
        isShowImage: PropTypes.bool,
        isContinueMess: PropTypes.bool,
        styles: PropTypes.object,
        imageUri: PropTypes.string,
    };
    render() {
        const {
            message,
            isMe,
            isShowImage,
            isContinueMess,
            styles,
            imageUri,
        } = this.props;
        return (
            <TouchableOpacity activeOpacity={1}>
                <View style={{ flexDirection: 'row' }}>
                    {isShowImage ? (
                        <View style={styles.thumbnailContainer}>
                            <Image
                                style={styles.thumbnail}
                                source={{
                                    uri: imageUri,
                                }}
                            />
                        </View>
                    ) : null}
                    <View
                        style={
                            isMe
                                ? styles.userMessageContainer
                                : isContinueMess
                                ? {
                                      ...styles.partnerMessageContainer,
                                      marginLeft: 55,
                                  }
                                : styles.partnerMessageContainer
                        }>
                        <TextWithBackground
                            style={
                                isMe
                                    ? styles.userMessage
                                    : styles.partnerMessage
                            }
                            bgStyle={
                                isMe
                                    ? styles.userMessageBg
                                    : styles.partnerMessageBg
                            }
                            content={message.content}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default Message;

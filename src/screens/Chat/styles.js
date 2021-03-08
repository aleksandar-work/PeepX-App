import { StyleSheet } from 'react-native';
import { theme } from '../../constants';
export default StyleSheet.create({
    screenContainer: {
        width: '100%',
        height: '100%',
    },
    userMessageContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 5,
    },
    partnerMessageContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        margin: 5,
    },
    userMessageBg: {
        borderRadius: 10,
        backgroundColor: theme.color.peepBlue,
        marginRight: '10%',
        maxWidth: '70%',
        paddingHorizontal: 8,
        paddingVertical: 6,
        minHeight: 36,
    },
    partnerMessageBg: {
        borderRadius: 10,
        backgroundColor: '#f4f4f4',
        maxWidth: '70%',
        marginLeft: 5,
        paddingHorizontal: 8,
        paddingVertical: 5,
        minHeight: 36,
    },
    userMessage: {
        color: '#fff',
        fontSize: 17,
    },
    partnerMessage: {
        color: theme.color.peepBlue,
        fontSize: 17,
    },
    chatMessageBottom: {
        position: 'absolute',
        bottom: 2,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    inputContainer: {
        backgroundColor: '#fff',
        paddingRight: 5,
        borderColor: '#cccccc',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 20,
        borderRadius: 25,
        paddingVertical: 0,
        width: '85%',
    },
    messageInput: {
        width: '90%',
        paddingBottom: 5,
        marginBottom: 5,
    },
    thumbnail: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    thumbnailContainer: {
        height: 50,
        width: 50,
        marginLeft: 5,
    },
});

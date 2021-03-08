import React from 'react';
import { Image, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import InboxButton from '../../components/common/InboxButton';
import { images } from '../../constants';
import { NavigationService } from '../../services/NavigationService';

class NewsFeed extends React.Component {
    static navigationOptions = {
        title: 'NewsFeed',
        headerRight: (
            <InboxButton
                style={{ marginRight: 20, marginBottom: 5 }}
                onPress={() => NavigationService.navigate('Inbox')}
            />
        ),
    };

    handleShowMore = () => {
        const temp = false;
        if (temp) Alert.alert('Show more pressed.');
    };

    hancleArtClick = () => {
        NavigationService.navigate('ArtNewsfeed');
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <TouchableOpacity
                        style={styles.squareImageContainer}
                        activeOpacity={0.5}
                        onPress={this.hancleArtClick}>
                        <Image
                            source={images.bgArtNewsfeed}
                            style={styles.image}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.squareImageContainer}
                        activeOpacity={1}>
                        <Image
                            source={images.bgNetwordNewsfeed}
                            style={styles.image}></Image>
                        <View style={styles.blockView}></View>
                    </TouchableOpacity>
                </View>
                <View style={styles.subContainer}>
                    <TouchableOpacity
                        style={styles.rectContainer}
                        activeOpacity={1}>
                        <Image
                            source={images.bgMusicNewsfeed}
                            style={styles.image}></Image>
                        <View style={styles.blockView}></View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.squareImageContainer}
                        activeOpacity={1}>
                        <Image
                            source={images.bgCultureNewsfeed}
                            style={styles.image}></Image>
                        <View style={styles.blockView}></View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    subContainer: {
        width: '45%',
    },
    squareImageContainer: {
        width: '100%',
        aspectRatio: 1,
        marginVertical: 10,
        position: 'relative',
    },
    rectContainer: {
        width: '100%',
        aspectRatio: 0.7,
        marginVertical: 10,
        position: 'relative',
    },
    blockView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333333Bf',
        borderRadius: 10,
    },
    blockText: {
        transform: [{ rotate: '-35deg' }],
        fontSize: 20,
        color: '#ffffff',
        fontWeight: '500',
        width: '70%',
        textAlign: 'center',
    },
});

export default NewsFeed;

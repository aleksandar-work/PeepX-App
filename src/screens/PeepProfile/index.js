import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    Linking,
} from 'react-native';
import { Button } from 'native-base';
import { TabView } from 'react-native-tab-view';

import {
    TwitterView,
    InstagramView,
    LinkedinView,
} from '../../components/common/SocialView';

import { navigationPropTypes } from '../../types';
import { NavigationService } from '../../services/NavigationService';

class PeepProfile extends React.Component {
    static navigationOptions = {
        title: 'Peep Profile',
    };

    static propTypes = {
        ...navigationPropTypes,
    };

    state = {
        user: {},
        tabsNavigation: {
            index: 0,
            routes: [],
        },
    };

    getProfilePhoto = () => {
        const { profilePhoto } = this.state.user;

        if (profilePhoto) {
            return profilePhoto;
        } else {
            return 'https://pbs.twimg.com/profile_images/453956388851445761/8BKnRUXg.png';
        }
    };

    updateRoute = (routes, route, fields, values) => {
        if (fields.length !== values.length) return;

        for (let i = 0; i < fields.length; i++) {
            routes.filter(r => r.key === route)[0][fields[i]] = values[i];
        }
        return routes;
    };

    generateRoutes = info => {
        const routes = [
            {
                active: 0,
                key: 'twitter',
                title: 'Twitter',
                icon: 'twitter',
                uri: '',
            },
            {
                active: 0,
                key: 'linkedin',
                title: 'Linkedin',
                icon: 'linkedin',
                uri: '',
            },
            {
                active: 0,
                key: 'instagram',
                title: 'Instagram',
                icon: 'instagram',
                uri: '',
            },
        ];

        if (info.isTwitterActive && info.twitterLink)
            this.updateRoute(
                routes,
                'twitter',
                ['uri', 'active'],
                [info.twitterLink, 1],
            );
        if (info.isLinkedinActive && info.linkedinLink)
            this.updateRoute(
                routes,
                'linkedin',
                ['uri', 'active'],
                [info.linkedinLink, 1],
            );
        if (info.isInstagramActive && info.instagramLink)
            this.updateRoute(
                routes,
                'instagram',
                ['uri', 'active'],
                [info.instagramLink, 1],
            );

        this.setState({
            tabsNavigation: {
                index: this.state.tabsNavigation.index,
                routes: routes.filter(r => r.active),
            },
        });
    };

    updateUserData = newData => {
        this.setState({ user: newData });
    };

    async componentDidMount() {
        const { user } = this.state;
        const newUserData = this.props.navigation.state.params;
        console.log('this.props.navigation.state', this.props.navigation.state);

        if (newUserData && newUserData.user !== user) {
            this.updateUserData(newUserData.user);
            this.generateRoutes(newUserData.user);
        }
    }

    handleFollowClick = () => {
        let activeSocialUrl = '';
        const uri = this.state.tabsNavigation.routes[
            this.state.tabsNavigation.index
        ]
            ? this.state.tabsNavigation.routes[this.state.tabsNavigation.index]
                  .uri
            : '';
        const key = this.state.tabsNavigation.routes[
            this.state.tabsNavigation.index
        ]
            ? this.state.tabsNavigation.routes[this.state.tabsNavigation.index]
                  .key
            : '';

        switch (key) {
            case 'twitter':
                activeSocialUrl = `https://twitter.com/${uri}`;
                break;
            case 'instagram':
                activeSocialUrl = `https://instagram.com/${uri}`;
                break;
            case 'linkedin':
                activeSocialUrl = `https://linkedin.com/in/${uri}`;
                break;
        }

        if (activeSocialUrl !== '') {
            Linking.openURL(activeSocialUrl);
        }
    };

    handleMessageClick = (userName, imageUri, id) => () => {
        NavigationService.navigate('Chat', {
            userName,
            imageUri,
            destinationUserId: id,
        });
    };

    render() {
        const { navigation } = this.props;
        const { tabsNavigation } = this.state;
        const user = navigation.getParam('user');
        console.log('user', user);
        const imageUri = this.getProfilePhoto();

        const activeNavigation = tabsNavigation.routes.filter(r => r.active);

        return (
            <View style={styles.container}>
                <StatusBar />
                <View style={styles.header}>
                    <View style={styles.thumbnailContainer}>
                        <Image
                            style={styles.thumbnail}
                            source={{ uri: imageUri }}
                        />
                    </View>
                </View>
                <View style={styles.profile}>
                    <Text>{user.bio}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}>
                        <Button
                            onPress={this.handleMessageClick(
                                user.userName,
                                imageUri,
                                user.id,
                            )}
                            bordered
                            rounded
                            small
                            style={{
                                paddingHorizontal: 10,
                                margin: 5,
                            }}>
                            <Text>Message</Text>
                        </Button>
                        <Button
                            onPress={this.handleFollowClick}
                            bordered
                            rounded
                            small
                            style={{
                                paddingHorizontal: 10,
                                margin: 5,
                            }}>
                            <Text>Follow</Text>
                        </Button>
                    </View>
                </View>
                {activeNavigation.length ? (
                    <TabView
                        navigationState={{ ...tabsNavigation }}
                        renderScene={({ route, jumpTo }) => {
                            switch (route.key) {
                                case 'twitter':
                                    return (
                                        <TwitterView
                                            jumpTo={jumpTo}
                                            uri={route.uri}
                                        />
                                    );
                                case 'linkedin':
                                    return (
                                        <LinkedinView
                                            jumpTo={jumpTo}
                                            uri={route.uri}
                                        />
                                    );
                                case 'instagram':
                                    return (
                                        <InstagramView
                                            jumpTo={jumpTo}
                                            uri={route.uri}
                                        />
                                    );
                            }
                        }}
                        onIndexChange={index =>
                            this.setState({
                                tabsNavigation: Object.assign(tabsNavigation, {
                                    index: index,
                                }),
                            })
                        }
                        initialLayout={{}}
                    />
                ) : (
                    <Text>No social media registered</Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    thumbnailContainer: {
        height: 140,
        width: 140,
    },
    thumbnail: {
        height: 140,
        width: 140,
        borderRadius: 70,
        borderColor: '#FFF',
        borderWidth: 5,
    },
    photoUpload: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'column',
        padding: 4,
        width: 45,
        height: 45,
        alignContent: 'center',
        backgroundColor: '#cbcbcb',
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 23,
    },
    profile: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    socialMedia: {
        marginTop: 5,
        paddingHorizontal: 20,
        borderColor: '#DDD',
        borderWidth: 3,
        borderRadius: 2,
    },
});

export default PeepProfile;

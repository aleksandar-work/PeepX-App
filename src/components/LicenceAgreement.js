import * as React from 'react';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { theme } from '../constants';

export default class LicenceAgreement extends React.Component {
    static navigationOptions = {
        title: 'LICENSED AGREEMENT',
        headerStyle: {
            backgroundColor: theme.color.peepBlue,
            marginTop: 5,
        },
        headerTintColor: theme.color.white,
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    handleStartLoading = () => {
        console.log('start');
        this.setState({ isLoading: true });
    };
    handleEndLoading = () => {
        console.log('stop');
        this.setState({ isLoading: false });
    };

    render() {
        return (
            <View style={{ width: '100%', height: '100%' }}>
                <WebView
                    source={{
                        uri:
                            'https://drive.google.com/file/d/1vI6YLU--T1TvSVOR6ZtGRfPlVQYXeSgP/view',
                    }}
                    onLoadStart={this.handleStartLoading}
                    onLoadEnd={this.handleEndLoading}
                />
                {this.state.isLoading ? (
                    <View
                        style={{
                            ...StyleSheet.absoluteFill,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <ActivityIndicator
                            size="large"
                            color={theme.color.peepBlue}
                        />
                    </View>
                ) : null}
            </View>
        );
    }
}

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

class CustomText extends Component {
    static propTypes = {
        content: PropTypes.string,
        style: PropTypes.object,
        bgStyle: PropTypes.object,
    };
    render() {
        const { content, style, bgStyle } = this.props;
        return (
            <View style={bgStyle}>
                <Text style={style}>{content}</Text>
            </View>
        );
    }
}

export default CustomText;

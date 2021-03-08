import React from 'react';
import { Feather } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import HeaderButton from './HeaderButton';
import { theme } from '../../constants';

const InboxButton = ({ ...rest }) => {
    return (
        <HeaderButton {...rest}>
            <Feather name="inbox" size={30} color={theme.color.white} />
        </HeaderButton>
    );
};

InboxButton.propTypes = {
    rest: PropTypes.any,
};
export default InboxButton;

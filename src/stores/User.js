import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { types, flow } from 'mobx-state-tree';
import Constants from 'expo-constants';

import {
    userEndpoint,
    nearByUsersEndpoint,
    chatEndpoint,
    newsfeedEndpoint,
} from '../api/Endpoints';
import { promisify, reject } from '../utils';

const REQUEST_TIMEOUT = 5000;

export const UserStore = types.model('UserStore').actions(self => ({
    getUserAuthToken: flow(function*() {
        const [token, tokenErr] = yield promisify(
            AsyncStorage.getItem(Constants.manifest.extra.jwtTokenStorageKey),
        );
        if (tokenErr) {
            console.log(tokenErr);

            throw new Error(tokenErr);
        }

        return Promise.resolve(token);
    }),
    /**
     * Return all users in db
     */
    allUsers: flow(function*() {
        const url = `${userEndpoint}/`;
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data.response);
        }

        return Promise.resolve(null);
    }),
    /**
     * Persist user location data from expo to local storage
     */
    saveUserLocationData: flow(function*(locationData) {
        /* eslint-disable no-unused-vars */
        const [_, locationErr] = yield promisify(
            AsyncStorage.setItem(
                Constants.manifest.extra.userLocationStorageKey,
                JSON.stringify(locationData),
            ),
        );
        /* eslint-enable no-unused-vars */
        if (locationErr) {
            console.log(locationErr);

            throw new Error(locationErr);
        }
    }),
    /**
     * Retrieve user location data from local storage
     */
    getUserLocationData: flow(function*() {
        const [location, locationErr] = yield promisify(
            AsyncStorage.getItem(
                Constants.manifest.extra.userLocationStorageKey,
            ),
        );
        if (locationErr) {
            console.log(locationErr);

            throw new Error(locationErr);
        }

        if (location) {
            return Promise.resolve(JSON.parse(location));
        }
    }),
    /**
     * Get one user
     *
     * @param {string} userId
     *
     * @returns {object}
     */
    oneUser: flow(function*(userId) {
        const url = `${userEndpoint}/${userId}`;
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );

        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data.response);
        }

        return Promise.resolve(null);
    }),
    /**
     * Updates a users location in db, should only be called
     * after the users location has been save to local storage
     * @see saveUserLocationData
     */
    updateUserLocation: flow(function*() {
        const authToken = yield self.getUserAuthToken();
        const location = yield self.getUserLocationData();
        const { latitude, longitude } = location.coords;
        const url = `${nearByUsersEndpoint}?latitude=${latitude}&longitude=${longitude}`;
        /* eslint-disable no-unused-vars */
        const [_, responseErr] = yield promisify(
            axios(url, {
                method: 'PATCH',
                withCredentials: true,
                data: '{}',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authToken,
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        /* eslint-enable no-unused-vars */
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }
    }),
    /**
     * Get users that are nearby
     *
     * @param {object} currentUser full user object thats currently in authStore
     *
     * @returns {array} of user objects
     */
    getNearByUsers: flow(function*() {
        // Stubbed for now will eventually come from currentUser object
        // in meters
        const searchRadius = 1000000000;

        const authToken = yield self.getUserAuthToken();
        const url = `${nearByUsersEndpoint}?radius=${searchRadius}`;
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authToken,
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data.response);
        }
    }),
    updateUserProfile: flow(function*(data) {
        const filteredData = reject(data, [
            'id',
            'createdAt',
            'updatedAt',
            'isLoading',
            'error',
            'oauthProviders',
            'password',
        ]);

        // Remove null values
        for (const key in filteredData) {
            if (filteredData[key] === null) {
                delete filteredData[key];
            }
        }

        const url = `${userEndpoint}/${data.id}`;
        const authToken = yield self.getUserAuthToken();
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'PATCH',
                withCredentials: true,
                data: JSON.stringify(filteredData),
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authToken,
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data.response);
        }
    }),
    getAllChats: flow(function*() {
        const authToken = yield self.getUserAuthToken();
        const url = chatEndpoint;
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authToken,
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        console.log(response, responseErr);
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data.response);
        }
    }),
    getChat: flow(function*(chatId) {
        const authToken = yield self.getUserAuthToken();
        const url = `${chatEndpoint}/${chatId}`;
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authToken,
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        console.log(response, responseErr);
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data.response);
        }
    }),
    getChatWithUser: flow(function*(destinationId) {
        const authToken = yield self.getUserAuthToken();
        const url = `${chatEndpoint}/findChatWithUser/${destinationId}`;
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authToken,
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        console.log(response, responseErr);
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data.response);
        }
    }),
    getPosts: flow(function*(userId) {
        const authToken = yield self.getUserAuthToken();
        const url = `${newsfeedEndpoint}/${userId}`;
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authToken,
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        console.log(response, responseErr);
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data.newsFeed);
        }
    }),
    createNewPost: flow(function*(data) {
        const authToken = yield self.getUserAuthToken();
        const url = `${newsfeedEndpoint}`;
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'POST',
                withCredentials: true,
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authToken,
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        console.log(response, responseErr);
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data);
        }
    }),
    reportPost: flow(function*(postId) {
        const authToken = yield self.getUserAuthToken();
        const url = `${newsfeedEndpoint}/post/${postId}/report`;
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authToken,
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        console.log(response, responseErr);
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data);
        }
    }),
    blockUser: flow(function*(userId) {
        const authToken = yield self.getUserAuthToken();
        const url = `${userEndpoint}/${userId}/block`;
        const [response, responseErr] = yield promisify(
            axios(url, {
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: authToken,
                },
                timeout: REQUEST_TIMEOUT,
            }),
        );
        console.log(response, responseErr);
        if (responseErr) {
            console.log(responseErr);

            throw new Error(responseErr);
        }

        if (response && response.data) {
            return Promise.resolve(response.data);
        }
    }),
}));

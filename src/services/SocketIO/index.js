import io from 'socket.io-client';
import { socketEndpoint } from '../../api/Endpoints';

const createSocket = (token, chatId) =>
    io(`${socketEndpoint}?token=${token}&chatId=${chatId}`);
export default createSocket;

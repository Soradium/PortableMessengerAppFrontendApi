import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';

let stompClient = null;

const initializeStompClient = (subscriptions = []) => {
    let stompClient = null;

    const connect = () => {
        const socket = new SockJS(`http://localhost:8081/my-endpoint?jwtToken=${localStorage.getItem("jwtToken")}`);
        stompClient = new StompJs.Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');

                // Subscribe to each topic provided
                subscriptions.forEach(({ topic, callback }) => {
                    stompClient.subscribe(topic, (message) => {
                        const parsedMessage = JSON.parse(message.body);
                        callback(parsedMessage);
                    });
                });
            },
        });

        stompClient.activate();
    };

    connect();

    // Return the stompClient instance
    return stompClient;
};

export default initializeStompClient;

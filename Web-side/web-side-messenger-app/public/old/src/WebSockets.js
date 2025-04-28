import React, {useEffect, useState} from 'react';
import * as StompJs from '@stomp/stompjs'

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Create SockJS-based STOMP client
        const client = new StompJs.Client({
            brokerURL: 'ws://localhost:8080/my-endpoint',
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');

                // Subscribe to topic
                client.subscribe('/topics/messages-topic', (message) => {
                    console.log('Received:', message.body);
                    setMessages((prevMessages) => [...prevMessages, message.body]);

                });
                var a = 0;
                const obj = {
                    message: 'MyMessage!' + a

                }

                // Optionally send a message to backend
                // client.publish({ destination: '/app/map', body: 'Client says hi!' });

                // This will trigger the @MessageMapping("/map") method
                const sendMessagesWithDelay = (count, delay) => {
                    for (let i = 0; i < count; i++) {
                        setTimeout(() => {
                            const messageObj = {message: 'MyMessage!' + i};
                            console.log(messageObj);
                            client.publish({
                                destination: '/app/map',
                                headers: {
                                    'content-type': 'application/json'
                                },
                                body: JSON.stringify(messageObj)
                            });
                        }, i * delay); // Delay increases with each iteration
                    }
                };

                // Call the function to send 10 messages with a 1-second delay
                sendMessagesWithDelay(10, 1000);

            },
        });


        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    return (
        <div>
            <h2>Messages from Server:</h2>
            <ul>
                {messages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketComponent;

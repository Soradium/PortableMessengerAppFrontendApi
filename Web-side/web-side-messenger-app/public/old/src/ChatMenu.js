import React, { useEffect, useState, useRef } from 'react';
import * as StompJs from '@stomp/stompjs';
import apiClient from './login-related/newApiClient';

const ChatMenu = ({ targetUserName }) => {
    const [messages, setMessages] = useState([]); // Ensure messages is initialized as an array
    const [message, setMessage] = useState(''); // Message to send
    const [client, setClient] = useState(null); // WebSocket client
    const chatContainerRef = useRef(null); // Ref for the chat container

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const payload = {
                    requestedToUser: targetUserName,
                };

                const response = await apiClient.post('/chat/retrieve-messages-per-user', payload);
                console.log('Request to retrieve messages sent:', response.data);
            } catch (error) {
                console.error('Error sending message retrieval request:', error);
            }
        };

        const stompClient = new StompJs.Client({
            brokerURL: 'ws://localhost:8081/my-endpoint',
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');

                stompClient.subscribe(`/user/topics/messages-topic`, (message) => {
                    console.log('Received:', message.body);

                    try {
                        const parsedMessage = JSON.parse(message.body);

                        if (Array.isArray(parsedMessage)) {
                            setMessages(parsedMessage);
                        } else if (parsedMessage.message) {
                            setMessages((prevMessages) => [...prevMessages, parsedMessage]);
                        } else {
                            console.error('Unexpected message format:', parsedMessage);
                        }
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });
            },
        });

        fetchMessages();
        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, [targetUserName]);

    useEffect(() => {
        // Scroll to the bottom of the chat container whenever messages change
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        console.log('Sending message:', message);
        if (client && targetUserName && message) {
            const sentMessage = {
                targetUserName: targetUserName,
                message: message,
            };
            console.log('Sending message s:', sentMessage);
            try {
                const response = await apiClient.post('/chat/send-message', sentMessage);
                console.log('Message sent:', response.data);

                setMessages((prevMessages) => [...prevMessages, sentMessage]);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        } else {
            console.error('Client not connected or missing fields');
        }
    };

    return (
  <div className="d-flex flex-column overflow-y-auto" style={{  height: "80vh"}}>
    {/* Header */}
    <header className="bg-primary text-white p-3">
      <h2 className="h5 mb-0">Chat with {targetUserName}</h2>
    </header>

    {/* Chat Messages Scrollable Area */}
    <div
      className="flex-grow-1 overflow-auto p-3"
      style={{  height: "60vh"}}
      ref={chatContainerRef}
    >
      <ul className="list-unstyled mb-0 overflow-y-auto" style={{  height: "60vh"}}>
        {Array.isArray(messages) ? (
          messages.map((msg, idx) => (
            <li
              key={idx}
              className={`d-flex ${
                msg.targetUserName === targetUserName
                  ? 'justify-content-start'
                  : 'justify-content-end'
              } mb-2`}
            >
              <span
                className={`p-2 rounded-pill ${
                  msg.targetUserName === targetUserName
                    ? 'bg-dark text-light'
                    : 'bg-primary text-light'
                }`}
              >
                {msg.message || 'No message content'}
              </span>
            </li>
          ))
        ) : (
          <li>No messages available</li>
        )}
      </ul>
    </div>

    {/* Footer (Input) */}
    <footer className="p-3 border-top bg-white">
      <div className="input-group">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-control"
          placeholder="Enter your message"
        />
        <button className="btn btn-primary" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </footer>
  </div>
);

}    
export default ChatMenu;
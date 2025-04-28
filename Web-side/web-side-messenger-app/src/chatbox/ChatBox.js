import { useState, useEffect, useRef } from "react";
import apiClient from "../api/apiClient";// Import the API client
import SockJS from "sockjs-client"; // Import SockJS
import * as StompJs from "@stomp/stompjs"; // Import StompJS  



export default function ChatBox({ targetUserName }) {
  const [messages, setMessages] = useState([]); // Ensure messages is initialized as an array
    const [message, setMessage] = useState(''); // Message to send
    const [client, setClient] = useState(null); // WebSocket client
    const [messagesLoaded, setMessagesLoaded] = useState(false); // Flag to check if messages are loaded
    const chatContainerRef = useRef(null); // Ref for the chat container
    const [currentUser, setCurrentUser] = useState(''); // Current user

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        let stompClient;
        let subscription;
        setCurrentUser(localStorage.getItem('username')); // Get the current user from local storage

        const fetchMessages = async () => {    
            try {
                const payload = {
                    requestedToUser: Array.isArray(targetUserName) ? targetUserName[0] : targetUserName
                };
                await new Promise((resolve) => setTimeout(resolve, 600));

                console.log('Payload to retrieve messages:', payload);
                console.log('Target user name:', payload.requestedToUser);
                console.log('Stringified payload:', JSON.stringify(payload));
                const response = await apiClient.post('/chat/retrieve-messages-per-user', JSON.stringify(payload));
                console.log('Request to retrieve messages sent:', response.data);
            } catch (error) {
                console.error('Error sending message retrieval request:', error);
            }
        };

                const socket = new SockJS('http://localhost:8081/my-endpoint');
                stompClient = new StompJs.Client({
                    webSocketFactory: () => socket,
                    connectHeaders: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
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
                            parsedMessage.targetUserName = targetUserName[0];         
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
                targetUserName: Array.isArray(targetUserName) ? targetUserName[0] : targetUserName,    
                message: message,
            };
            console.log('Sending message s:', sentMessage);
            try {
                const response = await apiClient.post('/chat/send-message', sentMessage);
                console.log('Message sent:', response.data);
                sentMessage.targetUserName = currentUser;
                setMessages((prevMessages) => [...prevMessages, sentMessage]);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        } else {
            console.error('Client not connected or missing fields');
        }
    };

  // ChatBox.js
return (
    <div className="d-flex flex-column w-100 h-100">
      {/* Messages pane */}
      <div
        className="flex-grow-1 overflow-auto p-3"
        ref={chatContainerRef}
      >
        {messages.map((msg, index) => {
        
          const isMine = msg.targetUserName === currentUser; // I am the receiver
          
          return (
            <div
              key={index}
              className={`d-flex mb-2 ${isMine ? 'justify-content-end' : 'justify-content-start'}`}
              
            >
              <div className={`p-3 rounded ${isMine ? 'bg-success border border-dark text-white' : 'bg-white border border-dark text-dark'}`}
            
              >
                <strong>{isMine ? 'You' : targetUserName}:</strong> {msg.message}
              </div>
            </div>
          );
        
        })}
      </div>
  
      {/* Input bar */}
      <div className="p-3 border-top">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
          className="btn btn-success"
          type="button"
          onClick={handleSendMessage}
        >
          <i className="bi bi-send"></i>
        </button>
        </div>
      </div>
    </div>
  );
  
}

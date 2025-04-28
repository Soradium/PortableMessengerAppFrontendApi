/* 
as for beta version of Sidebar, it will be 
represented with as a text input field for beta functionality of accessing particular 
person for chat reasons, BUT IT HAS TO BE REWORKED FROM GROUND UP!!!!!
*/

import { useState, useEffect } from "react";
import * as StompJs from "@stomp/stompjs";
import apiClient from "./login-related/newApiClient";
import AddFriend from "./AddFriend";

const SidebarUi = ({ currentChatTargetState, isLoggedIn }) => {
    const [openedInChat, setOpenedInChat] = currentChatTargetState;

    const [formData, setFormData] = useState({
        targetName: "",
    });

    const [client, setClient] = useState(null); // WebSocket client
    const [fetchResponse, setFetchResponse] = useState(null); // Response from WebSocket
    const [username, setUsername] = useState(""); // State to store the username from JWT


    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
                setUsername(payload.username || "Unknown User"); // Set username from payload
            } catch (error) {
                console.error("Error decoding JWT:", error);
            }
        }
    }, []);

    useEffect(() => {
        // Create SockJS-based STOMP client
        const stompClient = new StompJs.Client({
            brokerURL: "ws://localhost:8081/my-endpoint",
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");

                // Subscribe to user-specific topic for friend fetch responses
                stompClient.subscribe(`/user/topics/fetch-friend`, (message) => {
                    console.log("Received fetch response:", message.body);

                    // Parse the response and update the state
                    const parsedResponse = JSON.parse(message.body);
                    setFetchResponse(parsedResponse.response);
                    console.log("Parsed response:", parsedResponse.response);

                    if (parsedResponse.response === "Success") {
                        setOpenedInChat(formData.targetName); // Open chat with the target user
                    } else {
                        alert("Target user not found or unavailable.");
                    }
                });
            },
        });

        // Activate the client
        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, [isLoggedIn, formData.targetName, setOpenedInChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.targetName.trim()) {
            alert("Please enter a valid target name.");
            return;
        }

        const addTargetData = {
            target: formData.targetName,
        };

        try {
            console.log("Sending friend fetch request:", addTargetData);
            const response = await apiClient.post("/chat/find-target-friend", addTargetData);

            if (response.status === 200) {
                console.log("Friend fetch request successfully sent.");
            } else {
                console.error("Failed to send friend fetch request:", response);
                alert("Failed to send request. Please try again.");
            }
        } catch (error) {
            console.error("Error during friend fetch request:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="sidebar bg-light border-right shadow-sm">
            <div className="p-3 border-bottom bg-white shadow-sm">
                <h2 className="h5 text-primary mb-4">Sidebar</h2>
                {isLoggedIn ? (
                    <div className="text-center text-muted">
                        <p>Please log in to access your chats.</p>
                    </div>
                ) : (
                    <div>
                        {/* Add Friend Section */}
                        <div className="mb-4">
                            <h3 className="h6 text-secondary mb-3">Add Friend</h3>
                            <AddFriend />
                        </div>

                        {/* Chat Section */}
                        <div className="mb-4">
                            <h3 className="h6 text-secondary mb-3">Start a Chat</h3>
                            <form onSubmit={handleSubmit} className="mb-3">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="targetName"
                                        name="targetName"
                                        value={formData.targetName}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter target username"
                                    />
                                    <button type="submit" className="btn btn-primary">
                                        Chat
                                    </button>
                                </div>
                            </form>
                        </div>

                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidebarUi;

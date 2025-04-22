import React, { useState, useEffect } from 'react';
import Login from './login-related/Login';
import Signup from './login-related/Signup';
import AddFriend from './AddFriend';
import SidebarUi from './SidebarUi';
import ChatMenu from './ChatMenu'; // Import ChatMenu
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
    const [openedInChat, setOpenedInChat] = useState('nullTarget'); // State for the currently opened chat
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in

useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const isTokenValid = validateToken(token);
            if (isTokenValid) {
                setIsLoggedIn(true); // Valid token: user is logged in
            } else {
                localStorage.removeItem('jwtToken'); // Remove invalid/expired token
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false); // No token found
        }
    }, []);
    
    const validateToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            console.log('Token payload:', payload);
            console.log('Current time:', currentTime);
            return payload.exp > currentTime;
        } catch (error) {
            console.error('Invalid token:', error);
            return false;
        }
    };
    

    return (
        <div className="container-fluid vh-50 d-flex flex-column bg-light">
            <header className="py-3 bg-primary text-white text-center">
                <h1 className="h3">Messenger App</h1>
            </header>

            <div className="row flex-grow-1">
                {/* Sidebar */}
                <div className="col-4 col-md-3 bg-white border-end p-3">
                    <h2 className="h5 text-muted">Sidebar</h2>
                    {isLoggedIn ?  (
                        <SidebarUi currentChatTargetState={[openedInChat, setOpenedInChat]} />
                    ) : (
                        <div>
                            <Login isLoggedInState={[isLoggedIn, setIsLoggedIn]} />
                            <Signup isLoggedInState={[isLoggedIn, setIsLoggedIn]} />
                        </div>
                    ) }
                    {console.log("isLoggedIn: ", isLoggedIn)}
                </div>

                {/* Chat Area */}
                <div className="col-8 col-md-9 p-3 vh-50 " >
                    <h2 className="h5 text-muted">Chat Menu</h2>
                    {isLoggedIn ? (
                        openedInChat === 'nullTarget' ? (
                            <p className="text-muted">No user chosen yet</p>
                        ) : (
                            <ChatMenu targetUserName={openedInChat} />
                        )
                    ) : (
                        <p className="text-muted">Please log in or sign up to start chatting.</p>
                    )}
                </div>
            </div>

            <footer className="py-2 bg-light text-center border-top">
                <small className="text-muted">© 2025 Messenger App</small>
            </footer>
        </div>
    );
}

export default App;

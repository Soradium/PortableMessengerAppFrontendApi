import { useState, useEffect } from "react";
import SideBarUI from "./sidebar/Sidebar";
import ChatBox from "./chatbox/ChatBox"; // Import the ChatBox component
// import bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

import background from './assets/Background.png'; // Import your background image

export default function ChatApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentFriend, setCurrentFriend] = useState('nullTarget');

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
      <div className="container-fluid vh-100">
        <div className="row vh-100">
          {/* Sidebar always reserved and is centered inside the column*/}
          <div className="col-2 align-items-center d-flex flex-column bg-light">
            <SideBarUI
              isLoggedIn={[isLoggedIn, setIsLoggedIn]}
              selectedFriend={[currentFriend, setCurrentFriend]}
            />
          </div>
    
          {/* Chat area: background always shown, ChatBox conditionally mounted */}
          <div
            className="col-10 p-0 vh-100 position-relative d-flex align-items-stretch"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {isLoggedIn && currentFriend !== 'nullTarget' ? (
              <ChatBox
                targetUserName={[currentFriend, setCurrentFriend]}
              />
            ) : (
              <div className="w-100" />
            )}
          </div>
        </div>
      </div>
    );
    
}



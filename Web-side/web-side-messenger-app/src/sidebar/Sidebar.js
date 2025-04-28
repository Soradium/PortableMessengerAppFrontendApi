import { useState, useEffect } from "react";
import FriendList from "./FriendList";  
import AddFriend from "./AddFriend";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import apiClient from "../api/apiClient";

export default function SideBarUI({ isLoggedIn, selectedFriend }) {
    
  const [isLoggedInState, setIsLoggedInState] = isLoggedIn; // Destructure the isLoggedIn state and its setter
  const [selectedFriendState, setSelectedFriendState] = selectedFriend; // Destructure the selectedFriend state and its setter
 
  return (
    <div className="d-flex flex-column gap-4 p-3" style={{ width: "280px" }}>
      {!isLoggedInState ? (
        
        <>{console.log("User is not logged in") }
          <Login isLoggedInPassedState={isLoggedIn} />
          <Signup isLoggedInPassedState={isLoggedIn} />
        </>
      ) : (
        <>
          <FriendList SelectedFriend={ selectedFriend } />
          <AddFriend />
        </>
      )}
    </div>
  );
}

import { useState } from "react";
import apiClient from "../api/apiClient";

const AddFriend = () => {
    const [formData, setFormData] = useState({
        username: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(tryToAddFriend(formData.username));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // AddFriend.js
return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Add Friend</h5>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter friend's username"
            className="form-control mb-3"
          />
          <button type="submit" className="btn btn-success w-100"
          style={{
            backgroundColor: "#E1F1DC",
            color: "#171717",
            borderColor: "#cddcc9"
            }}
            >
            Add Friend
          </button>
        </form>
      </div>
    </div>
  );
  
      
};

async function tryToAddFriend(usernamePassed) {
    const addFriendData = {
        username: usernamePassed,
    };

    try {
        const response = await apiClient.post('/friends/add-friend', addFriendData);
        console.log("Added friend successfully! Response data: ", response.data);
        if (response.status === 200) {
            console.log("Friend added successfully!");
        }
    } catch (error) {
        console.error("Couldn't add friend with username: ", addFriendData.username);
        console.error("Error during add friend request: ", error);
    }
}

export default AddFriend;
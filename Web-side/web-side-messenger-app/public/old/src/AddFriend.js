import { useState } from "react";
import apiClient from "./login-related/newApiClient";

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

    return (
        <div className="container vh-30 d-flex justify-content-center align-items-center bg-light">
            <div className="card shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center text-primary mb-4">Add Friend</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter friend's username"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Add Friend</button>
                    </form>
                </div>
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
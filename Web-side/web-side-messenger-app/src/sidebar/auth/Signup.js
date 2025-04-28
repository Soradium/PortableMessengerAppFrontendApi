import React, { useState } from 'react';
import apiClient from '../../api/apiClient';

export default function Signup({ isLoggedInPassedState }) {
    const [isLoggedIn, setIsLoggedIn] = isLoggedInPassedState; // Destructure the isLoggedIn state and its setter
    const [formData, setFormData] = useState({
        field1: '',
        field2: ''
    });

    const handleSubmit = async () => {
        try {
            await tryToSignUp(formData.field1, formData.field2);
            setIsLoggedIn(true); // Update the isLoggedIn state after successful signup
        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // SignUp.js
return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Sign Up</h5>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="field1"
            value={formData.field1}
            onChange={handleChange}
            placeholder="Username"
            className="form-control mb-2"
          />
          <input
            type="password"
            name="field2"
            value={formData.field2}
            onChange={handleChange}
            placeholder="Password"
            className="form-control mb-3"
          />
          <button type="submit" className="btn btn-success w-100"
          style={{
            backgroundColor: "#E1F1DC",
            color: "#171717",
            borderColor: "#cddcc9"
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  
}

async function tryToSignUp(usernamePassed, passwordPassed) {
    const signUpData = {
        username: usernamePassed,
        password: passwordPassed,
    };

    try {
        const response = await apiClient.post('/sec/signup', signUpData);
        console.log("Signup successful! Response data:", response.data);
        localStorage.setItem('jwtToken', response.data.jwtToken); // Store the JWT token in local storage
    } catch (error) {
        console.error("Signup failed:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        } else {
            console.error("Error message:", error.message);
        }
        throw error; // Rethrow the error to handle it in the calling function
    }
}
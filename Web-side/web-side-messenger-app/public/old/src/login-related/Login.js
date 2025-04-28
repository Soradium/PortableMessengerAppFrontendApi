import React, { useState } from 'react';
import apiClient from './newApiClient';

export default function Login({ isLoggedInState }) {
    const [isLoggedIn, setIsLoggedIn] = isLoggedInState; // Destructure the isLoggedIn state and its setter
    const [formData, setFormData] = useState({
        field1: '',
        field2: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await tryToLogIn(formData.field1, formData.field2);
            setIsLoggedIn(true); // Update the isLoggedIn state after successful login
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="card shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center text-primary mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="field1" className="form-label">Username</label>
                            <input
                                type="text"
                                id="field1"
                                name="field1"
                                value={formData.field1}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="field2" className="form-label">Password</label>
                            <input
                                type="password"
                                id="field2"
                                name="field2"
                                value={formData.field2}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

async function tryToLogIn(usernamePassed, passwordPassed) {
    const loginData = {
        username: usernamePassed,
        password: passwordPassed,
    };

    try {
        const response = await apiClient.post('/sec/login', loginData);
        console.log("Login successful! Response data:", response.data);
        localStorage.setItem('jwtToken', response.data.jwtToken); // Store the JWT token in local storage
    } catch (error) {
        console.error("Login failed:", error);
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
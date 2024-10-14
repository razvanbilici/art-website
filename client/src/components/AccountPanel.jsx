import React, { useState, useEffect } from 'react';


import axios from "axios"
import Nav from './Nav';
import { Navigate } from 'react-router-dom';
const localHost = "http://localhost:5000/"



function AccountPanel() {
    // State to manage user data and loading state
    const [user, setUser] = useState();
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user data on component mount
    useEffect(() => {

        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            
            const response = await axios.get(localHost + 'api/users/user/' + localStorage.getItem("loggedUserID"))
            const userData = response.data;
            console.log(userData)

            // Set user data
            setUser(userData.user);
            setName(userData.user.name); // Set the initial name
            setLoading(false)
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data');
            setLoading(false);
        }
    };

    const handleSave = async () => {

        // Optionally, send the updated name to the backend via axios
        await axios.put(localHost + 'api/users/update/' + localStorage.getItem("loggedUserID"), {name: name})

        // Update the user state with the new name
        setUser({ ...user, name })
        setIsEditing(false)
        // window.location.reload()
        fetchUser()
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='w-full min-h-screen flex flex-col bg-gradient-to-t from-violet-600 via-red-400 to-blue-100'>
        <Nav onSave={fetchUser}/>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg bg-opacity-55">
            <div className="flex items-center mb-6">
                <img 
                    src={user.iconURL} 
                    alt={`${user.name}'s icon`} 
                    className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-gray-600">{user.role} Account</p>
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <p className="text-gray-500">{user.email}</p>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                {isEditing ? (
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                ) : (
                    <p className="text-gray-500">{user.name}</p>
                )}
            </div>
            <div className="flex justify-end">
                {isEditing ? (
                    <>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <button
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Name
                    </button>
                )}
            </div>
            <div className="mb-4 mt-3">
                <label className="block text-gray-700">{"Liked Pieces: " + Object.keys(user.likedPieces).length}</label>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">{"Subscriptions: " + Object.keys(user.subscribedCreators).length}</label>
            </div>
        </div>
        </div>
    );
}

export default AccountPanel;

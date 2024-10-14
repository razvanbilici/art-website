import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Nav from './Nav';

const localHost = "http://localhost:5000/"

const CreatorAccountInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data via axios
    const fetchUserData = async () => {
      try {
        const response = await axios.get(localHost + 'api/users/user/' + localStorage.getItem("loggedUserID"))
        // console.log(response.data)
        setUser(response.data.user)
        setLoading(false);
      } catch (err) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCreatorRequest = async () => {
    try {
      console.log("crt" + user.creatorRequest)
      await axios.put(localHost + 'api/users/update/' + localStorage.getItem("loggedUserID"), {creatorRequest: !user.creatorRequest})
      setUser((prevData) => ({
        ...prevData,
        creatorRequest: !creatorRequest,
      }));
    } catch (err) {
      console.error('Error updating creator request:', err);
    }
  };

  if (loading){ 
    return <div className='w-full h-auto flex flex-col items-center bg-gradient-to-t from-violet-600 via-red-400 to-blue-100'>
    <Nav/>
    <div className="flex items-center justify-center min-h-screen">
  <div className="w-16 h-16 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
</div></div>;
}

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return null; // Ensure no render when data is unavailable
  }

  const { role, creatorRequest } = user;

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-violet-600 via-red-400 to-blue-100'>
        <Nav/>

        <div className='flex-grow w-full flex flex-col items-center mt-2 p-4'>
          <div className='border p-4 bg-white bg-opacity-50 rounded'>
      <h1 className="text-xl font-bold mb-4">Creator Account Info</h1>
      {role === 'Creator' ? (
        <p className="text-green-600 font-bold">You're already a creator!</p>
      ) : creatorRequest ? (
        <div>
        <p className="text-yellow-500">Creator role request pending.</p>
        <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleCreatorRequest}
          >Undo Request</button>
        </div>
      ) : (
        <div>
          <p className="text-blue-600 mb-4">You are not a creator yet.</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleCreatorRequest}
          >
            Request Creator Role
          </button>
        </div>
      )}
      </div>
    </div>
    </div>
  );
};

export default CreatorAccountInfo;

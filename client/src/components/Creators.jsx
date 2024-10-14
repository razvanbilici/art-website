import React, {useState, useEffect} from 'react'
import axios from "axios"
import Nav from './Nav';
import { IoMdArrowDropdown as Dropdown} from "react-icons/io";
import CreatorCard from './CreatorCard';

const localHost = "http://localhost:5000/"

const Creators = ({subscribed, home, creatorsPage}) => {

const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
  const [subscribedCreators, setSubscribedCreators] = useState([]);



  const fetchData = async () => {
    try {
        setLoading(true);
        
        // Fetch the logged user and set the user state
        const _user = await axios.get(localHost + 'api/users/user/' + localStorage.getItem("loggedUserID"));
        setUser(_user.data.user);

        // Fetch all creators
        const response = await axios.get(localHost + 'api/creators/allCreators');
        setCreators(response.data.creators);

        // Use _user directly to access subscribedCreators
        const subscribedKeys = Object.keys(_user.data.user.subscribedCreators);
        console.log("subs");
        console.log(subscribedKeys);

        // Filter creators based on the keys in the subscribedCreators dictionary
        const subs = response.data.creators.filter(creator => 
            subscribedKeys.includes(creator.userID)
        );
        console.log("subs");
        console.log(subs);

        setSubscribedCreators(subs);

    } catch (err) {
        // Handle errors if any
        console.error(err);
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
      fetchData()
  }, [])


  const onEvent = () => {
    setLoading(true)
    fetchData();

  };

  if (loading){ 
    return <div className='w-full h-auto flex flex-col items-center bg-gradient-to-t from-violet-600 via-red-400 to-blue-100'>
    <Nav/>
    <div className="flex items-center justify-center min-h-screen">
  <div className="w-16 h-16 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
</div></div>;
}

    if (creatorsPage){
      return (
        <div className='w-full min-h-screen flex flex-col bg-gradient-to-t from-violet-600 via-red-400 to-blue-100'>
          <Nav />
          <div className='flex-grow w-full flex flex-col items-center mt-2 p-4'>
            {creators.length > 0 && 
              creators.map((creator, index) => (
                <CreatorCard key={index} user={user} creator={creator} onEvent={fetchData} className="mt-2 p-4"/>
              ))
            }
          </div>
        </div>
      );
    }

    if (subscribed){
      return (
        <div className='w-full min-h-screen flex flex-col bg-gradient-to-t from-violet-600 via-red-400 to-blue-100'>
          <Nav />
          <div className='flex-grow w-full flex flex-col items-center mt-2 p-4'>
            {subscribedCreators.length > 0 && 
              subscribedCreators.map((creator, index) => (
                <CreatorCard key={index} user={user} creator={creator} onEvent={fetchData} className="mt-2 p-4"/>
              ))
            }
          </div>
        </div>
      );
    }

  return (
    <div className='relative w-full h-auto flex flex-col items-center justify-center'>
       {!home && <Nav/> }

       <div >
    
        {(subscribedCreators.length && subscribed) ?
        
            subscribedCreators.map((creator, index) => (
                <CreatorCard user={user} creator={creator} onEvent={fetchData} className="mt-2 p-4"/>
            ))
            :
            <div className='mt-2 p-4'>
        {creators.length > 0 && 
        
        creators.map((creator, index) => (
                <CreatorCard user={user} creator={creator} onEvent={fetchData} className="mt-2 p-4"/>
            ))
        }
        </div>

            
        }

    </div>
        </div>
  )
}

export default Creators

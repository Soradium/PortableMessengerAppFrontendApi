import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient'; // your axios instance
import SockJS from 'sockjs-client'; // Import SockJS
import * as StompJs from '@stomp/stompjs'; // Import StompJS

export default function FriendList({ SelectedFriend }) {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFriendState, setSelectedFriendState] = SelectedFriend; // Destructure the selectedFriend state and its setter
  
    useEffect(() => {
      let stompClient;
      let subscription;

      const fetchFriendsRequest = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            await apiClient.post('/sidebar/fetch-friends').then(console.log('Sent friend list fetch request'));
            setLoading(false);
          } catch (err) {
            console.error('Fetch error:', err);
            setError('Unable to request friend list.');
            setLoading(false);
            return;
          }
      }
  
      const fetchAndSubscribe = async () => {  

        const socket = new SockJS('http://localhost:8081/my-endpoint');
        stompClient = new StompJs.Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
          debug: (str) => console.log(str),
          reconnectDelay: 5000,
          onConnect: () => {
            console.log('WebSocket connected');
            subscription = stompClient.subscribe(
              '/user/topics/friendlist-fetch-response',
              ({ body }) => {
                console.log('Received friend list:', body);
                const response = JSON.parse(body);
                setFriends(response);
                setLoading(false);
              }
            );
          },
          onStompError: (frame) => {
            console.error('Broker error:', frame);
            setError('WebSocket error.');
            setLoading(false);
          },
        });
  
        stompClient.activate();
      };
      fetchAndSubscribe();
      fetchFriendsRequest();

      return () => {
        if (subscription) subscription.unsubscribe();
        if (stompClient) stompClient.deactivate();
      };
    }, []);  // <-- run only once
  
    const handleSelect = (username) => {
        setSelectedFriendState(username);
    };
  
    if (loading) return <div>Loading friends…</div>;
    if (error)   return <div className="text-red-500">{error}</div>;
  
    // FriendList.js
return (
  <div className="card mb-4">
    <div className="card-body">
      <h5 className="card-title">Choose Friend</h5>
      <ul className="list-group overflow-auto" style={{ maxHeight: '200px' }}>
        {friends.length > 0 ? (
          friends.map((username) => (
            <li
              key={username}
              className={`list-group-item list-group-item-action ${username === selectedFriendState ? 'active' : ''}`}
              style={username === selectedFriendState ? { 
                backgroundColor: "#E1F1DC",
                color: "#171717",
                borderColor: "#cddcc9"} : {}}
              onClick={() => handleSelect(username)}
            >
              {username}
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">No friends found.</li>
        )}
      </ul>
    </div>
  </div>
);

  }
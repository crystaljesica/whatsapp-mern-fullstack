import './App.css';
import SideBar from "./Sidebar";
import Chat from './Chat';
import { useEffect, useState } from 'react';
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);

	useEffect(() => {
		axios.get("/messages/sync").then((response) => {
			setMessages(response.data);
		});
	}, []);



  useEffect(()=>{
    const pusher = new Pusher('b70c9dc33cd1fedb799f', {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('message');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage]);
    });

    // Clean up function
		return () => {
			channel.unbind_all();
			channel.unsubscribe("message");
		};
  },[messages])

  return (
    <div className="app">
      <div className="app__body">
        <SideBar />
        <Chat messages={messages}/>
      </div>
      
    </div>
  );
}

export default App;

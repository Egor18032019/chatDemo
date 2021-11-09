import React from 'react';
import './app.css'
import LongPulling from "./LongPulling";
import EventSourcing from "./EventSourcing";
 import WebSock from "./WebSock";
import SockJS from "./StompClient.jsx";

function App() {

  return (
      <div>
        <SockJS/>
      </div>
  )
}


export default App;
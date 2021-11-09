import React, { useRef, useState } from 'react';

const SockJS = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')

    function connect() {
        console.log("SockJS")
        let StompJs = require('@stomp/stompjs');
        let Stomp = StompJs.Stomp;
        var SockJS = require("sockjs-client");
        SockJS = new SockJS("http://localhost:8080/ws");
        socket.current = Stomp.over(SockJS);
        socket.current.connect({}, onConnected, onError);

        function onError(error) {
            console.warn("onError")
            console.log("onError")
        }

        function onConnected() {
            // Subscribe to the Public Topic
            console.log("onConnect ")
            setConnected(true)

            console.log("connected " + connected)

            socket.current.subscribe('/topic/public', onMessageReceived);

            console.log("username " + username)

            socket.current.send("/app/chat.addUser",
                {},
                JSON.stringify({ sender: username, type: 'JOIN' })
            )

        }

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const sendMessage = async () => {
        console.log(connected)
        const message = {
            username,
            sender: username,
            message: value,
            content: value,
            id: Date.now(),
            event: 'message',
            type: 'CHAT'
        }
        socket.current.send("/app/chat.sendMessage", {}, JSON.stringify(message));

        setValue('')
    }

    function onMessageReceived(payload) {
        console.log(payload)
        const message = JSON.parse(payload.body)
        message.id = payload.headers["message-id"]
        console.log(message)
         
        setMessages(prev => [message, ...prev])
    }

    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        placeholder="Введите ваше имя" />
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        )
    }
    else {

        return (
            <div className="center">
                <div>
                    <div className="form">
                        <input value={value} onChange={e => setValue(e.target.value)} type="text" />
                        <button onClick={sendMessage}>Отправить</button>
                    </div>
                    <div className="messages">
                        {messages.map(mess =>
                            <div key={mess.id}>
                                {mess.type === 'JOIN'
                                    ? <div className="connection_message">
                                        Пользователь {mess.username} подключился
                                    </div>
                                    : <div className="message">
                                        {mess.sender}. {mess.content}
                                    </div>
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
};

export default SockJS;
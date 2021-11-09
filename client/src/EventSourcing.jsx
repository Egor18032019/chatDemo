import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";

const EventSourcing = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const [username, setUsername] = useState(false);
    let myNameRef = useRef(null)
    let flag = false
    useEffect(() => {
        subscribe()
    }, [])

    const subscribe = async () => {
        /*
        встроенный класс EventSource используется для получения серверных событий (Server-sent events).
         Только для событий в формате text/event-stream без закрытия соединения.
         Если нам нужно получать поток данных с сервера: неважно, сообщения в чате или же цены для магазина
         – с этим легко справится EventSource. 
         К тому же, он поддерживает автоматическое переподключение при потере соединения, 
         которое, используя WebSocket, нам бы пришлось реализовывать самим. 
         Кроме того, используется старый добрый HTTP, а не новый протокол.
        */
        const eventSource = new EventSource("http://localhost:8080/ws")
        eventSource.onmessage = function (event) {
            const message = JSON.parse(event.data);
            if (!flag) {
                setMessages(prev => [...message, ...prev]);
                flag = true
            }
            else {
                setMessages(prev => [message, ...prev]);
            }
        }
    }

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now(),
            name: username
        })
    }

    const deleteHistory = async () => {
        await axios.post('http://localhost:5000/clear', {
            message: "value",
  
        })
    }

    if (!username) {
        return (
            <div className="center">
                <div className="form">
                    <input
                        defaultValue={""}
                        ref={myNameRef}
                        type="text"
                        placeholder="Введите ваше имя" />
                    <button onClick={e => {
                        setUsername(myNameRef.current.value)
                        console.log(myNameRef.current.value)
                    }}>Войти</button>
                </div>
            </div >
        )
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" />
                    <button onClick={sendMessage}>Отправить</button>
                    <button onClick={deleteHistory}>Очистить чат(совсем очистить)</button>

                </div>
                <div className="messages">
                    {messages.map(mess => {
                          return (
                            <div className="message" key={mess.id ? mess.id : mess._id}>
                                {mess.name + ": " + mess.message + " "}
                            </div>)
                    })}
                </div>
            </div>

        </div>
    );
};

export default EventSourcing;
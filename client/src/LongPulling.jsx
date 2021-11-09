import React, { useEffect, useState } from 'react';
import axios from "axios";

const LongPulling = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    console.log(messages)


    const subscribe = async () => {
        try {
            // вытаскиваем обьект data из ответа сервера
            const { data } = await axios.get('http://127.0.0.1:8080/ws/topic/public')
            
            // потом в стайт мы записываем  новые данные плюс к ним старый стайт messages
            setMessages(prev => [data, ...prev])
            // и снова подписываемя на событие
            await subscribe()
        } catch (e) {
            console.log("catch")
            setTimeout(() => {
                subscribe()
            }, 500)
        }
    }

    useEffect(() => {
        subscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sendMessage = async () => {
        await axios.post('http://127.0.0.1:8080/ws/topic/public', {
            message: value,
            id: Date.now(),
            date: new Date()
        })
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div className="message" key={mess.id}>
                            {mess.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LongPulling;
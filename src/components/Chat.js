import React, { useEffect, useState } from "react";
import "../App.css";
import ScrollToBottom from "react-scroll-to-bottom"

function Chat({ socket, username, room }) {
  const [currentMessage, setcurrentMessage] = useState("");
  const [MessageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setcurrentMessage('');
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    //   setcurrentMessage('');
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">

        
        {MessageList.map((messagecontent) => {
          return (
            <div
              className="message"
              id={username === messagecontent.author ? "other" : "you"}
            >
              <div>
                <div className="message-content">
                  <p>{messagecontent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messagecontent.time}</p>
                  <p id="author">{messagecontent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type your message here   .."
          onChange={(e) => {
            setcurrentMessage(e.target.value);
          }}
        />
        <button
          onClick={sendMessage}
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
}

export default Chat;

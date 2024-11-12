import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare, Send, Users } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useSocket } from "../context/SocketContext";
import { useEvents } from "../context/EventContext";

function EventDetails() {
  const { id } = useParams();
  const { event, fetchEventDetails } = useEvents();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { socket } = useSocket();

  useEffect(() => {
    fetchEventDetails(id);
    fetchMessages();

    if (socket) {
      socket.emit("join-event", id);

      socket.on("new-message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off("new-message");
      };
    }
  }, [socket, id]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/events/${id}/messages`);
      setMessages(await response.data);
    } catch (error) {
      toast.error("Failed to fetch messages");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit("send-message", {
      eventId: id,
      content: newMessage,
    });

    setNewMessage("");
  };

  if (!event) return <div>Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-2">
          {new Date(event.date).toLocaleString()}
        </p>
        <p className="text-gray-700 mb-4">{event.description}</p>

        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">
            {event.participants?.length} Participants
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Chat
        </h2>

        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div key={message._id} className="flex space-x-3">
              <div className="flex-shrink-0">
                {message.sender.profilePicture ? (
                  <img
                    src={`http://localhost:3001${message.sender.profilePicture}`}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                )}
              </div>
              <div>
                <div className="font-medium">{message.sender.name}</div>
                <div className="text-gray-700">{message.content}</div>
                <div className="text-gray-500 text-sm">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-md"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default EventDetails;
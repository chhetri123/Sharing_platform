import { useState, useEffect } from "react";
import { Plus, Calendar, Users } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function Events() {
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [unjoinedEvents, setUnjoinedEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchUnjoinedEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (error) {
      toast.error("Failed to fetch events");
    }
  };

  const fetchUnjoinedEvents = async () => {
    try {
      const response = await api.get("/events/unjoined-family");
      setUnjoinedEvents(response.data);
    } catch (error) {
      toast.error("Failed to fetch unjoined events");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", newEvent);
      toast.success("Event created successfully!");
      setShowCreateModal(false);
      fetchEvents();
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/join`);
      toast.success("Successfully joined the event!");
      fetchEvents();
      fetchUnjoinedEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join event");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          My Events
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {events.map((event) => (
          <div
            key={event._id}
            onClick={() => handleEventClick(event._id)}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-2">
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-4">{event.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {event.participants.length} participants
            </div>
          </div>
        ))}
      </div>

      {unjoinedEvents.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <Users className="w-5 h-5 mr-2" />
            Family Events You May Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unjoinedEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-primary/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinEvent(event._id);
                    }}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm hover:bg-primary/20 transition-colors"
                  >
                    Join Event
                  </button>
                </div>
                <p className="text-gray-600 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {event.participants.length} participants
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;

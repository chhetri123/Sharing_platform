import { useState } from "react";
import { Plus, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import EventCard from "../components/events/EventCard";
import { useEffect } from "react";
function Events() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
  });

  const navigate = useNavigate();
  const {
    events,
    unjoinedEvents,
    createEvent,
    joinEvent,
    fetchEvents,
    fetchUnjoinedEvents,
  } = useEvents();

  useEffect(() => {
    fetchEvents();
    fetchUnjoinedEvents();
  }, []);
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const success = await createEvent(newEvent);
    if (success) {
      setShowCreateModal(false);
      setNewEvent({ title: "", date: "", description: "" });
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
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
          <EventCard
            key={event._id}
            event={event}
            onClick={handleEventClick}
            variant="joined"
          />
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
              <EventCard
                key={event._id}
                event={event}
                onJoin={joinEvent}
                variant="unjoined"
              />
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

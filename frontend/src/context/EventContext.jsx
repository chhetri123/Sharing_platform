import { createContext, useContext, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useEffect } from "react";

const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [unjoinedEvents, setUnjoinedEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnjoinedEvents = async () => {
    try {
      const response = await api.get("/events/unjoined");
      setUnjoinedEvents(response.data);
    } catch (error) {
      toast.error("Failed to fetch unjoined events");
    }
  };

  const createEvent = async (eventData) => {
    try {
      const response = await api.post("/events", eventData);
      await Promise.all([fetchEvents(), fetchUnjoinedEvents()]);
      toast.success("Event created successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to create event");
      return false;
    }
  };

  const fetchEventDetails = async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(await response.data.event);
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch event details");
    }
  };

  const joinEvent = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/join`);
      await Promise.all([fetchEvents(), fetchUnjoinedEvents()]);
      toast.success("Successfully joined the event!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join event");
      return false;
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        event,
        unjoinedEvents,
        loading,
        fetchEvents,
        fetchUnjoinedEvents,
        createEvent,
        joinEvent,
        fetchEventDetails,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}

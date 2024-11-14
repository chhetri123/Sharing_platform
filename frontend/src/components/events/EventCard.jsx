import { Calendar, Users, User } from "lucide-react";
import { useSocket } from "../../context/SocketContext";

function EventCard({ event, onJoin, onClick, variant = "joined" }) {
  const isJoined = variant === "joined";
  const { socket } = useSocket();

  const handleJoinClick = async (e) => {
    e.stopPropagation();
    const success = await onJoin(event._id);
    if (success) {
      socket.emit("event-joined", {
        eventId: event._id,
        creatorId: event.creator._id,
      });
    }
  };

  return (
    <div
      onClick={() => onClick?.(event._id)}
      className={`bg-white p-6 rounded-lg shadow-md ${
        isJoined
          ? "cursor-pointer hover:shadow-lg"
          : "border border-gray-100 hover:border-primary/20"
      } transition-all transform hover:-translate-y-1`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex-1">
          {event.title}
        </h3>
        {!isJoined && (
          <button
            onClick={handleJoinClick}
            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm hover:bg-primary/20 transition-colors ml-2"
          >
            Join Event
          </button>
        )}
        {isJoined && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap ml-2">
            {new Date(event.date).toLocaleDateString()}
          </span>
        )}
      </div>
      <p className="text-gray-700 text-base mb-6 line-clamp-3">
        {event.description}
      </p>
      <>
        <div className="flex items-center mb-4 text-sm text-gray-500">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
            {event.creator?.profilePicture ? (
              <img
                src={`${event.creator.profilePicture}`}
                alt={event.creator.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
          <span>Created by {event.creator?.name}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {event.participants.slice(0, 3).map((participant) => (
                <div
                  key={participant._id}
                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                >
                  {participant.profilePicture ? (
                    <img
                      src={` ${participant.profilePicture}`}
                      alt={participant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
              {event.participants.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    +{event.participants.length - 3}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {event.participants.length} participants
            </span>
          </div>
          <Calendar className="w-5 h-5 text-primary/60" />
        </div>
      </>
    </div>
  );
}

export default EventCard;

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function NotificationDropdown({ notifications = [], onAccept, onReject }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">
                Notifications
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`px-4 py-3 hover:bg-gray-50 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-800">
                      {notification.type === "FAMILY_REQUEST" ? (
                        <>
                          <span className="font-medium">
                            {notification.sender.name}
                          </span>{" "}
                          sent you a family request
                        </>
                      ) : (
                        <>
                          <span className="font-medium">
                            {notification.sender.name}
                          </span>{" "}
                          joined your event
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    {notification.type === "FAMILY_REQUEST" &&
                      notification.status === "PENDING" && (
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => onAccept(notification._id)}
                            className="px-3 py-1 text-xs font-medium text-white bg-primary rounded hover:bg-primary/90"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => onReject(notification._id)}
                            className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;

import axios from "axios";
import {
  USER_SEND_REQUESTS_URL,
  USER_REMOVE_CONNECTION,
} from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useDispatch } from "react-redux";
import { removeConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const UserCard = ({
  user,
  isPreview = false,
  hideActions = false,
  onUserAction,
  showRemoveConnection = false,
  showChatButton = false,
  onRemoveConnection,
}) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, age, gender, photoUrl, about } = user;

  const handleUserAction = async (status, userId) => {
    try {
      await axios.post(
        `${USER_SEND_REQUESTS_URL}/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Request error:", err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Unknown error occurred while sending request."
      );
    }
  };

  // Allow parent to override action handlers (for requests)
  const handleAction = (status) => {
    if (typeof onUserAction === "function") {
      onUserAction(status);
    } else {
      handleUserAction(status, _id);
    }
  };

  // Handler for removing a connection
  const handleRemoveConnection = async () => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${firstName} ${lastName} from your connections?`
      )
    ) {
      return;
    }
    try {
      await axios.delete(USER_REMOVE_CONNECTION + `/${_id}`, {
        withCredentials: true,
      });
      if (typeof onRemoveConnection === "function") {
        onRemoveConnection(_id);
      } else {
        dispatch(removeConnection(_id));
      }
      alert(`${firstName} ${lastName} has been removed from your connections.`);
    } catch (err) {
      console.error("Remove connection error:", err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Unknown error occurred while removing connection."
      );
    }
  };

  return (
    <div className="relative bg-white border border-gray-200 shadow-xl rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-6 flex flex-col items-center mx-auto my-4 transition-all hover:shadow-2xl">
      <div className="w-42 h-42 mt-0 mb-3 sm:mb-5">
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full rounded-full object-cover"
        />
        {showRemoveConnection && hideActions && (
          <div className="absolute top-2 right-2 group">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 border-2 border-red-200 text-red-600 shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={handleRemoveConnection}
              aria-label="Remove Connection"
              tabIndex={0}
            >
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="12" fill="#fee2e2" />
                <path
                  d="M9 10v4m3-4v4m-5 6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7z"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 7V5a2 2 0 1 1 4 0v2"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 absolute z-20 right-0 mt-2 px-3 py-1 text-xs rounded bg-gray-800 text-white shadow transition-opacity duration-200 whitespace-nowrap">
              Remove from connections
            </span>
          </div>
        )}
      </div>
      <div className="flex items-end justify-center gap-2 mb-3 flex-wrap">
        <span className="text-2xl sm:text-3xl font-semibold text-gray-800 leading-tight">
          {firstName} {lastName}
        </span>
        <span
          className="text-base sm:text-lg text-gray-400 font-medium align-baseline"
          style={{ marginBottom: "2px" }}
        >
          {age}
        </span>
        {gender === "male" && (
          <span
            className="text-blue-500 text-base sm:text-lg align-baseline"
            style={{ marginBottom: "2px" }}
            title="Male"
          >
            ♂️
          </span>
        )}
        {gender === "female" && (
          <span
            className="text-pink-500 text-base sm:text-lg align-baseline"
            style={{ marginBottom: "2px" }}
            title="Female"
          >
            ♀️
          </span>
        )}
      </div>
      {about && (
        <p className="text-lg text-gray-500 text-center italic mb-3 px-4">
          {about}
        </p>
      )}
      {user.skills && Array.isArray(user.skills) && user.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {user.skills.map((skill, idx) => (
            <span
              key={idx}
              className="badge badge-lg px-3 py-1 bg-blue-100 text-primary border border-blue-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      {!isPreview && !hideActions && (
        <div className="flex gap-6 mt-2">
          {/* Ignore (cross) button */}
          <button
            className="w-12 h-12 mt-2 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 border-2 border-red-200 text-red-600 shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Ignore"
            onClick={() => handleAction("ignored")}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="12" fill="#fee2e2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 8l8 8M16 8l-8 8"
                stroke="#dc2626"
              />
            </svg>
          </button>

          {/* Interested (heart) button */}
          <button
            className="w-12 h-12 mt-2 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 border-2 border-green-200 text-green-600 shadow transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Interested"
            onClick={() => handleAction("interested")}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="12" fill="#bbf7d0" />
              <path
                d="M16.5 8.5C16.5 7.11929 15.3807 6 14 6C13.0411 6 12.2344 6.59489 12 7.4375C11.7656 6.59489 10.9589 6 10 6C8.61929 6 7.5 7.11929 7.5 8.5C7.5 12.5 12 15 12 15C12 15 16.5 12.5 16.5 8.5Z"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="#22c55e"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Chat button */}
      {showChatButton && hideActions && (
        <div className="absolute bottom-4 right-4">
          <Link
            to={`/chat/${_id}`}
            className="flex items-center justify-center w-11 h-11 bg-blue-100 hover:bg-blue-200 rounded-full shadow border border-blue-300 transition"
            aria-label={`Chat with ${firstName}`}
            title={`Chat with ${firstName}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-6 3h-6"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserCard;

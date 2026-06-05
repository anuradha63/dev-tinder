import { useEffect, useState } from "react";
import { USER_CONNECTIONS_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import CardCarousel from "./CardCarousel";
import axios from "axios";
import UserCard from "./UserCard";
import { useOutletContext } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const context = useOutletContext() || {};
  const onlineUsers = context.onlineUsers || [];

  const fetchConnections = async () => {
    try {
      const response = await axios.get(USER_CONNECTIONS_URL, { withCredentials: true });
      let connectionsArr = response.data?.data;
      if (!Array.isArray(connectionsArr) && Array.isArray(response.data)) {
        connectionsArr = response.data;
      }
      if (!Array.isArray(connectionsArr)) {
        setError("Unexpected response format from server.");
        dispatch(addConnections([]));
        return;
      }
      dispatch(addConnections(connectionsArr));
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load connections.");
      dispatch(addConnections([]));
    }
  };

  useEffect(() => { fetchConnections(); }, []);

  if (!connections && !error)
    return (
      <div className="flex flex-1 items-center justify-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (error) {
    return (
      <div className="flex flex-col items-center my-16">
        <div className="w-24 h-24 mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-5xl">⚠️</span>
        </div>
        <h1 className="font-bold text-xl text-error mb-1">{error}</h1>
        <button className="btn btn-primary mt-4 rounded-full px-8" onClick={fetchConnections}>Retry</button>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-16 px-4">
        <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center shadow-inner">
          <span className="text-6xl">🤝</span>
        </div>
        <h1 className="font-extrabold text-2xl text-gray-700 mb-2">No connections yet</h1>
        <p className="text-gray-400 text-base text-center max-w-xs">
          Start swiping on the feed to connect with developers who share your interests!
        </p>
        <a href="/feed" className="mt-6 btn btn-primary rounded-full px-8">Go to Feed</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 justify-center items-center w-full">
      <div className="flex justify-center items-center w-full">
        <CardCarousel
          items={connections}
          renderCard={(connection) =>
            connection && connection._id ? (
              <div className="relative">
                {/* Online dot */}
                {onlineUsers.includes(connection._id) && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 shadow text-xs font-semibold text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
                    Online
                  </div>
                )}
                <UserCard
                  user={connection}
                  key={connection._id}
                  hideActions={true}
                  showRemoveConnection={true}
                  showChatButton={true}
                />
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default Connections;

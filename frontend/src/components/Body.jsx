import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { PROFILE_VIEW_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useRef, useState } from "react";
import { createSocketConnection } from "../utils/socket";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const socketRef = useRef(null);
  const [notification, setNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(PROFILE_VIEW_URL, { withCredentials: true });
      dispatch(addUser(response.data));
    } catch (err) {
      if (err.status === 401) navigate("/login");
      console.error(err.message);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  useEffect(() => {
    if (!userData?._id) return;

    socketRef.current = createSocketConnection();
    socketRef.current.emit("registerUser", userData._id);

    socketRef.current.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on("newMessageNotification", ({ firstName, lastName, text }) => {
      setNotification({ firstName, lastName, text });
      setUnreadCount((prev) => prev + 1);
      setTimeout(() => setNotification(null), 4000);
    });

    return () => { socketRef.current?.disconnect(); };
  }, [userData?._id]);

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      <div className="flex-shrink-0">
        <NavBar
          unreadCount={unreadCount}
          clearUnread={() => setUnreadCount(0)}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-start gap-3 max-w-sm">
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {notification.firstName[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {notification.firstName} {notification.lastName}
            </p>
            <p className="text-gray-500 text-sm truncate max-w-[200px]">
              {notification.text}
            </p>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600 ml-auto text-lg leading-none">×</button>
        </div>
      )}

      <main className="flex-grow flex flex-col justify-center items-center px-2 md:px-0 min-h-0 w-full">
        <Outlet context={{ onlineUsers }} />
      </main>
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
};

export default Body;

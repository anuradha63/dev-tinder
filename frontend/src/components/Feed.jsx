import axios from "axios";
import { USER_FEED_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const response = await axios.get(USER_FEED_URL, { withCredentials: true });
      const users = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      dispatch(addFeed(users));
    } catch (err) {}
  };

  useEffect(() => { getFeed(); }, []);

  if (!feed) return null;

  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-16 px-4">
        <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-tr from-orange-100 via-pink-100 to-yellow-100 flex items-center justify-center shadow-inner">
          <span className="text-6xl">🔍</span>
        </div>
        <h1 className="font-extrabold text-2xl text-gray-700 mb-2">You've seen everyone!</h1>
        <p className="text-gray-400 text-base text-center max-w-xs">
          No more developers to explore right now. Check back later or invite friends to join Dev Tinder!
        </p>
        <button
          onClick={() => dispatch(addFeed(null)) || getFeed()}
          className="mt-6 btn btn-primary rounded-full px-8"
        >
          Refresh Feed
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-10">
      <div className="w-full max-w-md">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;

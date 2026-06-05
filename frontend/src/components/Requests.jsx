import axios from "axios";
import { USER_REQUESTS_URL, USER_REVIEW_REQUESTS_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import UserCard from "./UserCard";
import CardCarousel from "./CardCarousel";

const Requests = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    try {
      const response = await axios.get(USER_REQUESTS_URL, { withCredentials: true });
      dispatch(addRequests(response.data.data));
    } catch (err) {
      if (err?.response?.status === 404) dispatch(addRequests([]));
    }
  };

  const reviewRequests = async (status, _id) => {
    try {
      await axios.post(USER_REVIEW_REQUESTS_URL + `/${status}/${_id}`, {}, { withCredentials: true });
      dispatch(removeRequest(_id));
    } catch (err) {}
  };

  useEffect(() => { fetchRequests(); }, []);

  if (!requests)
    return (
      <div className="flex flex-1 items-center justify-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-16 px-4">
        <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-tr from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center shadow-inner">
          <span className="text-6xl">📭</span>
        </div>
        <h1 className="font-extrabold text-2xl text-gray-700 mb-2">No requests yet</h1>
        <p className="text-gray-400 text-base text-center max-w-xs">
          When someone is interested in connecting with you, their request will appear here.
        </p>
        <a href="/feed" className="mt-6 btn btn-primary rounded-full px-8">Explore Developers</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 justify-center items-center w-full">
      <div className="flex justify-center items-center w-full">
        <CardCarousel
          items={requests}
          showPagination={false}
          renderCard={(request) =>
            request && request.fromUserId ? (
              <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
                <UserCard
                  user={request.fromUserId}
                  isPreview={false}
                  hideActions={false}
                  onUserAction={(status) =>
                    reviewRequests(
                      status === "interested" ? "accepted" : "rejected",
                      request._id
                    )
                  }
                />
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default Requests;

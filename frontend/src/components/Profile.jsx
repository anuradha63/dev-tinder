import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);
  if (!user)
    return (
      <div className="flex flex-1 items-center justify-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <>
      <div className="flex justify-center items-center h-full w-full px-2 py-5 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-fade-in">
        <div className="bg-white/80 rounded-3xl shadow-2xl w-full max-w-3xl border border-gray-100 backdrop-blur-lg relative overflow-y-auto max-h-full flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg px-4 sm:px-8 pt-2 pb-4 border-b border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-1 text-center drop-shadow-sm">
              Your Profile
            </h1>
            <p className="text-gray-500 text-center text-sm sm:text-sm font-medium">
              Update your info and see a live preview instantly.
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="w-full flex flex-col items-center">
              <EditProfile user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

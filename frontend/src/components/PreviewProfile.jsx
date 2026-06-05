import React from "react";
import UserCard from "./UserCard";

const PreviewProfile = ({ user, skills, fields }) => (
  <div className="flex justify-center items-center bg-white rounded-xl">
    <div className="flex justify-center">
      <UserCard
        user={{
          ...user,
          ...fields.reduce((acc, cur) => {
            acc[cur.name] = cur.value;
            return acc;
          }, {}),
          skills,
        }}
        isPreview={true}
      />
    </div>
  </div>
);

export default PreviewProfile;

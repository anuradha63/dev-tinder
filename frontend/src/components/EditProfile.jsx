import { useState } from "react";
import EditProfileForm from "./EditProfileForm";
import PreviewProfile from "./PreviewProfile";
import { PROFILE_EDIT_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";

const DEFAULT_FIELDS = [
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Your Age",
    min: 18,
    max: 80,
    required: true,
    validate: (v) => Number(v) >= 18 && Number(v) <= 80,
    errorMsg: "Age must be between 18 and 80",
  },
  {
    name: "about",
    label: "About",
    type: "textarea",
    placeholder: "Something about you",
    maxLength: 250,
    required: true,
    validate: (v) => v.length > 50 && v.length <= 250,
    errorMsg: "About must be 70-250 characters",
  },
  {
    name: "photoUrl",
    label: "Photo URL",
    type: "text",
    placeholder: "Your Photo URL",
    required: true,
    validate: (v) => /^https?:\/\//.test(v),
    errorMsg: "Please enter a valid Photo URL (http/https)",
  },
];

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [skills, setSkills] = useState(
    Array.isArray(user.skills)
      ? user.skills
      : typeof user.skills === "string"
      ? user.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  );
  const [skillInput, setSkillInput] = useState("");
  const [skillError, setSkillError] = useState("");
  const [gender, setGender] = useState(user.gender || "");
  const [fields, setFields] = useState(() =>
    DEFAULT_FIELDS.map((f) => ({
      ...f,
      value: user[f.name] || "",
    }))
  );
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("edit");

  const saveProfile = async () => {
    setError("");

    // Validate minimum 5 skills
    if (skills.length < 5) {
      return setError("Please add at least 5 skills to continue");
    }

    // Validate gender selection
    if (!gender) {
      return setError("Please select your gender");
    }

    for (let field of fields) {
      if (field.required && !field.validate(field.value)) {
        return setError(field.errorMsg);
      }
    }

    const payload = {};
    fields.forEach((f) => {
      payload[f.name] = f.value;
    });
    payload.skills = skills;
    payload.gender = gender;

    try {
      const response = await axios.post(PROFILE_EDIT_URL, payload, {
        withCredentials: true,
      });
      dispatch(addUser(response?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to save profile");
    }
  };

  const addSkill = () => {
    const newSkill = skillInput.trim();
    if (!newSkill) {
      setSkillError("Skill cannot be empty");
      return;
    }
    if (skills.includes(newSkill)) {
      setSkillError("Skill already added");
      return;
    }
    if (skills.length >= 5) {
      setSkillError("You can add up to 5 skills only");
      return;
    }
    setSkills([...skills, newSkill]);
    setSkillInput("");
    setSkillError("");
  };

  const removeSkill = (idx) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-full w-full px-2">
        <div className="max-w-3xl w-full my-3">
          <div className="flex justify-center mb-3">
            {["edit", "preview"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-1.5 text-sm font-medium border border-primary/50 transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-white text-primary hover:bg-primary/10"
                } ${tab === "edit" ? "rounded-l-xl" : "rounded-r-xl"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "edit" && (
            <div className="flex justify-center items-center w-full">
              <EditProfileForm
                fields={fields}
                setFields={setFields}
                skills={skills}
                setSkills={setSkills}
                skillInput={skillInput}
                setSkillInput={setSkillInput}
                skillError={skillError}
                addSkill={addSkill}
                removeSkill={removeSkill}
                handleSkillInputKeyDown={handleSkillInputKeyDown}
                error={error}
                saveProfile={saveProfile}
                gender={gender}
                setGender={setGender}
              />
            </div>
          )}

          {activeTab === "preview" && (
            <PreviewProfile user={user} skills={skills} fields={fields} />
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="alert alert-success shadow-lg bg-white border border-green-300 text-green-800 rounded-xl px-6 py-3 font-semibold">
            Profile updated successfully!
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;

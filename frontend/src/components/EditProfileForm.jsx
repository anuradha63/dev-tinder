const EditProfileForm = ({
  fields,
  setFields,
  skills,
  setSkills,
  skillInput,
  setSkillInput,
  skillError,
  addSkill,
  removeSkill,
  handleSkillInputKeyDown,
  error,
  saveProfile,
  gender,
  setGender,
}) => {
  const photoField = Array.isArray(fields)
    ? fields.find((f) => f.name === "photoUrl")
    : null;

  const canSave = skills.length >= 5;

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-300 w-full max-w-3xl">
      <form className="flex flex-col-reverse md:grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {/* Skills Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-800 text-sm font-semibold">
                Skills
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="input input-md bg-white border border-gray-400 text-gray-900"
                placeholder="Add a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillInputKeyDown}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm h-[40px] px-4"
                style={{ minHeight: "40px" }}
                onClick={addSkill}
              >
                Add
              </button>
            </div>
            {skillError && (
              <span className="text-xs text-red-500 mt-1">{skillError}</span>
            )}
            {skills.length < 5 && (
              <span className="text-xs text-red-500 mt-1">
                Please add at least 5 skills to continue
              </span>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {(skills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="badge badge-lg px-2 py-1 bg-blue-100 text-sm text-primary border border-blue-300"
                >
                  {skill}
                  <button
                    type="button"
                    className="text-sm text-red-500"
                    onClick={() => removeSkill(idx)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Gender Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-800 text-sm font-semibold">
                Gender
              </span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="radio radio-primary"
                />
                <span className="text-sm text-gray-700">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  className="radio radio-primary"
                />
                <span className="text-sm text-gray-700">Female</span>
              </label>
            </div>
            {!gender && (
              <span className="text-xs text-red-500 mt-1">
                Please select your gender
              </span>
            )}
          </div>

          {/* Other Fields */}
          {(fields || []).map((field, idx) => (
            <div key={field.name} className="form-control">
              <label className="label">
                <span className="label-text text-gray-800 text-sm font-semibold">
                  {field.label}
                </span>
              </label>
              {field.type === "textarea" ? (
                <>
                  <textarea
                    className="textarea textarea-md bg-white border border-gray-400 text-gray-900 resize-none"
                    placeholder={field.placeholder}
                    value={field.value}
                    maxLength={field.maxLength}
                    rows={4}
                    onChange={(e) =>
                      setFields((prev) =>
                        prev.map((f, i) =>
                          i === idx ? { ...f, value: e.target.value } : f
                        )
                      )
                    }
                  />
                  <span className="text-xs text-gray-500 text-right">
                    {field.value.length}/{field.maxLength}
                  </span>
                  {field.name === "about" &&
                    (field.value.length < 70 || field.value.length > 250) && (
                      <span className="text-xs text-red-500 mt-1 block">
                        About must be between 70 and 250 characters.
                      </span>
                    )}
                </>
              ) : (
                <>
                  <input
                    type={field.type}
                    className="input input-md bg-white border border-gray-400 text-gray-900"
                    placeholder={field.placeholder}
                    value={field.value}
                    min={field.min}
                    max={field.max}
                    onChange={(e) =>
                      setFields((prev) =>
                        prev.map((f, i) =>
                          i === idx ? { ...f, value: e.target.value } : f
                        )
                      )
                    }
                  />
                  {field.name === "photoUrl" &&
                    field.value &&
                    !/^https?:\/\//.test(field.value) && (
                      <span className="text-xs text-red-500 mt-1">
                        Must start with http:// or https://
                      </span>
                    )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Image Preview */}
        <div className="flex flex-col items-center justify-center gap-4">
          {photoField?.value ? (
            <img
              src={photoField.value}
              alt={`Preview URL: ${photoField.value}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/150?text=Invalid+Image";
              }}
              className="w-48 h-60 object-cover rounded-2xl shadow-lg border-2 border-primary"
            />
          ) : (
            <div className="w-48 h-60 flex items-center justify-center bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 text-sm text-center px-2">
              No Photo
              <br />
              Enter a valid Photo URL
            </div>
          )}
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center text-sm animate-pulse font-semibold mt-4">
          {error}
        </p>
      )}

      {/* Save Button */}
      <div className="flex justify-center mt-5">
        {(() => {
          const aboutField = (fields || []).find((f) => f.name === "about");
          const aboutIsValid =
            aboutField &&
            aboutField.value.length >= 70 &&
            aboutField.value.length <= 250;
          const buttonDisabled = !canSave || !aboutIsValid;
          return (
            <button
              type="button"
              onClick={saveProfile}
              disabled={buttonDisabled}
              className={`btn px-6 ${
                !buttonDisabled
                  ? "btn-primary"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
              }`}
              title={
                !buttonDisabled
                  ? "Click to save profile"
                  : !canSave
                  ? "Please add at least 5 skills to continue"
                  : "About must be between 70 and 250 characters."
              }
            >
              Save Profile
            </button>
          );
        })()}
      </div>
    </div>
  );
};

export default EditProfileForm;

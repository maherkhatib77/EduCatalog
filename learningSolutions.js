import React, { useEffect, useState } from "react";

const App = () => {
  const [userType, setUserType] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [dropdowns, setDropdowns] = useState({
    instructors: [],
    weekdays: [],
    educationLevels: [],
    educationTypes: [],
    hourCredits: [],
    subjects: [],
    solutionDomains: [],
    learningModes: [],
  });

  // Load user type from localStorage
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType") || "";
    setUserType(storedUserType);
  }, []);

  // Load learning solutions from Firebase
  useEffect(() => {
    const dbRef = firebase.database().ref("learning_solutions");
    dbRef.on("value", (snapshot) => {
      const solutionsData = [];
      snapshot.forEach((childSnapshot) => {
        solutionsData.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setSolutions(solutionsData);
    });

    return () => dbRef.off();
  }, []);

  // Load dropdown options from Firebase
  useEffect(() => {
    const loadDropdown = async (path, field = "title", multi = false) => {
      const snapshot = await firebase.database().ref(path).once("value");
      const items = [];
      snapshot.forEach((child) => {
        items.push({ key: child.key, label: child.val()[field] || child.key });
      });
      return items;
    };

    Promise.all([
      loadDropdown("instructors", "first_name"),
      loadDropdown("weekdays", "name"),
      loadDropdown("education_levels", "title", true),
      loadDropdown("education_types", "title", true),
      loadDropdown("hour_credits", "hours"),
      loadDropdown("subjects", "name"),
      loadDropdown("solution_domains", "name"),
      loadDropdown("learning_modes", "title"),
    ]).then(
      ([
        instructors,
        weekdays,
        educationLevels,
        educationTypes,
        hourCredits,
        subjects,
        solutionDomains,
        learningModes,
      ]) => {
        setDropdowns({
          instructors,
          weekdays,
          educationLevels,
          educationTypes,
          hourCredits,
          subjects,
          solutionDomains,
          learningModes,
        });
      }
    );
  }, []);

  // Form handlers
  const openAddForm = () => {
    setFormData({});
    setIsEdit(false);
    setFormVisible(true);
  };

  const openEditForm = (solution) => {
    setFormData(solution);
    setIsEdit(true);
    setFormVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((o) => o.value);
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: selectedOptions,
    }));
  };

  const saveSolution = () => {
    const requiredFields = ["id", "solution_name", "first_meeting_date"];
    if (!requiredFields.every((f) => formData[f])) {
      alert("שדות חובה: מספר פתרון, שם, תאריך");
      return;
    }

    const updates = {};
    updates[`learning_solutions/${formData.id}`] = formData;
    firebase.database().ref().update(updates);
    setFormVisible(false);
    setFormData({});
  };

  const deleteSolution = (id) => {
    if (window.confirm("למחוק את פתרון הלמידה?")) {
      firebase.database().ref(`learning_solutions/${id}`).remove();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">פתרונות למידה</h2>
        {(userType === "admin" || userType === "operator") && (
          <button
            onClick={openAddForm}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <span>➕ הוסף פתרון למידה</span>
          </button>
        )}

        {/* Vertical Cards View */}
        <div className="space-y-6">
          {solutions.map((solution) => (
            <div
              key={solution.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">מספר פתרון:</p>
                  <p>{solution.id}</p>
                </div>
                <div>
                  <p className="font-semibold">שם פתרון למידה:</p>
                  <p>{solution.solution_name}</p>
                </div>
                <div>
                  <p className="font-semibold">שם יוצר:</p>
                  <p>{solution.creator_name}</p>
                </div>
                <div>
                  <p className="font-semibold">תאריך מפגש ראשון:</p>
                  <p>{solution.first_meeting_date}</p>
                </div>
                <div>
                  <p className="font-semibold">זמן התחלה:</p>
                  <p>{solution.start_time}</p>
                </div>
                <div>
                  <p className="font-semibold">זמן סיום:</p>
                  <p>{solution.end_time}</p>
                </div>
                <div>
                  <p className="font-semibold">יום מפגש:</p>
                  <p>{solution.weekday}</p>
                </div>
                <div>
                  <p className="font-semibold">שלבי חינוך:</p>
                  <p>{(solution.education_levels || []).join(", ")}</p>
                </div>
                <div>
                  <p className="font-semibold">סוג חינוך:</p>
                  <p>{(solution.education_types || []).join(", ")}</p>
                </div>
                <div>
                  <p className="font-semibold">היקף שעות:</p>
                  <p>{solution.hours_count}</p>
                </div>
                <div>
                  <p className="font-semibold">תחום דעת:</p>
                  <p>{solution.subject}</p>
                </div>
                <div>
                  <p className="font-semibold">תחום פתרון:</p>
                  <p>{solution.solution_domain}</p>
                </div>
                <div>
                  <p className="font-semibold">אופן למידה:</p>
                  <p>{solution.learning_mode}</p>
                </div>
                <div>
                  <p className="font-semibold">קישור סילבוס:</p>
                  <a
                    href={solution.syllabus_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {solution.syllabus_link || "-"}
                  </a>
                </div>
                <div>
                  <p className="font-semibold">תקציר:</p>
                  <p>{solution.summary}</p>
                </div>
                <div>
                  <p className="font-semibold">מטרות:</p>
                  <p>{solution.objectives}</p>
                </div>
              </div>

              {(userType === "admin" || userType === "operator") && (
                <div className="mt-4 flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => openEditForm(solution)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    ✎
                  </button>
                  {userType === "admin" && (
                    <button
                      onClick={() => deleteSolution(solution.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal Form */}
        {formVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {isEdit ? "ערוך פתרון למידה" : "הוסף פתרון למידה"}
                </h3>
                <button
                  onClick={() => setFormVisible(false)}
                  className="text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">מספר פתרון:</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id || ""}
                    onChange={handleChange}
                    disabled={isEdit}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">שם פתרון:</label>
                  <input
                    type="text"
                    name="solution_name"
                    value={formData.solution_name || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">שם יוצר:</label>
                  <select
                    name="creator_name"
                    value={formData.creator_name || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">בחר</option>
                    {dropdowns.instructors.map((item) => (
                      <option key={item.key} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">תאריך מפגש ראשון:</label>
                  <input
                    type="date"
                    name="first_meeting_date"
                    value={formData.first_meeting_date || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">זמן התחלה:</label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">זמן סיום:</label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">יום מפגש:</label>
                  <select
                    name="weekday"
                    value={formData.weekday || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">בחר</option>
                    {dropdowns.weekdays.map((item) => (
                      <option key={item.key} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">שלבי חינוך:</label>
                  <select
                    name="education_levels"
                    multiple
                    value={formData.education_levels || []}
                    onChange={handleMultiSelectChange}
                    className="w-full border rounded px-3 py-2 h-24"
                  >
                    {dropdowns.educationLevels.map((item) => (
                      <option key={item.key} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">סוג חינוך:</label>
                  <select
                    name="education_types"
                    multiple
                    value={formData.education_types || []}
                    onChange={handleMultiSelectChange}
                    className="w-full border rounded px-3 py-2 h-24"
                  >
                    {dropdowns.educationTypes.map((item) => (
                      <option key={item.key} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">היקף שעות:</label>
                  <select
                    name="hours_count"
                    value={formData.hours_count || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">בחר</option>
                    {dropdowns.hourCredits.map((item) => (
                      <option key={item.key} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">תחום דעת:</label>
                  <select
                    name="subject"
                    value={formData.subject || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">בחר</option>
                    {dropdowns.subjects.map((item) => (
                      <option key={item.key} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">תחום פתרון:</label>
                  <select
                    name="solution_domain"
                    value={formData.solution_domain || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">בחר</option>
                    {dropdowns.solutionDomains.map((item) => (
                      <option key={item.key} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">אופן למידה:</label>
                  <select
                    name="learning_mode"
                    value={formData.learning_mode || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">בחר</option>
                    {dropdowns.learningModes.map((item) => (
                      <option key={item.key} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">קישור סילבוס:</label>
                  <input
                    type="url"
                    name="syllabus_link"
                    value={formData.syllabus_link || ""}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">תקציר:</label>
                  <textarea
                    name="summary"
                    value={formData.summary || ""}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border rounded px-3 py-2"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">מטרות:</label>
                  <textarea
                    name="objectives"
                    value={formData.objectives || ""}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border rounded px-3 py-2"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
                <button
                  onClick={saveSolution}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  שמור
                </button>
                <button
                  onClick={() => setFormVisible(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

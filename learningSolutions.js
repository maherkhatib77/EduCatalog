import React, { useEffect, useState } from 'react';

const App = () => {
  const [solutions, setSolutions] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [weekdays, setWeekdays] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [educationTypes, setEducationTypes] = useState([]);
  const [hourCredits, setHourCredits] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [solutionDomains, setSolutionDomains] = useState([]);
  const [learningModes, setLearningModes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    solutionId: '',
    solutionName: '',
    creatorName: '',
    firstMeetingDate: '',
    startTime: '',
    endTime: '',
    weekday: '',
    educationLevels: [],
    educationTypes: [],
    hoursCount: '',
    subject: '',
    solutionDomain: '',
    learningMode: '',
    syllabusLink: '',
    summary: '',
    objectives: ''
  });

  // Mock data instead of Firebase
  useEffect(() => {
    // Simulating database fetch
    setTimeout(() => {
      setInstructors([
        { id: '1', first_name: 'יוסי', last_name: 'כהן' },
        { id: '2', first_name: 'רוני', last_name: 'לביא' }
      ]);
      setWeekdays([{ id: '1', name: 'ראשון' }, { id: '2', name: 'שני' }]);
      setEducationLevels([{ id: '1', title: 'יסודי' }, { id: '2', title: 'חטיבת ביניים' }]);
      setEducationTypes([{ id: '1', title: 'פנימייתי' }, { id: '2', title: 'מכינה קדם אקדמית' }]);
      setHourCredits([{ id: '1', hours: '2' }, { id: '2', hours: '3' }]);
      setSubjects([{ id: '1', name: 'מתמטיקה' }, { id: '2', name: 'עברית' }]);
      setSolutionDomains([{ id: '1', name: 'מדעים' }, { id: '2', name: 'ספרות' }]);
      setLearningModes([{ id: '1', title: 'מקוון' }, { id: '2', title: 'בכיתה' }]);
      setSolutions([
        {
          id: '1',
          solution_name: 'קורס מתמטיקה בסיסי',
          creator_name: 'יוסי כהן',
          first_meeting_date: '2024-05-01',
          weekday: 'ראשון',
          education_levels: ['יסודי'],
          hours_count: '2',
          subject: 'מתמטיקה',
          start_time: '09:00',
          end_time: '11:00'
        }
      ]);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelectChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map(o => o.value);
    setFormData({ ...formData, [e.target.name]: options });
  };

  const openModal = (id = null) => {
    if (id) {
      const solutionToEdit = solutions.find(s => s.id === id);
      setFormData({
        solutionId: solutionToEdit.id,
        solutionName: solutionToEdit.solution_name || '',
        creatorName: solutionToEdit.creator_name || '',
        firstMeetingDate: solutionToEdit.first_meeting_date || '',
        startTime: solutionToEdit.start_time || '',
        endTime: solutionToEdit.end_time || '',
        weekday: solutionToEdit.weekday || '',
        educationLevels: solutionToEdit.education_levels || [],
        educationTypes: [],
        hoursCount: solutionToEdit.hours_count || '',
        subject: solutionToEdit.subject || '',
        solutionDomain: '',
        learningMode: '',
        syllabusLink: '',
        summary: '',
        objectives: ''
      });
      setEditingId(id);
    } else {
      setFormData({
        solutionId: '',
        solutionName: '',
        creatorName: '',
        firstMeetingDate: '',
        startTime: '',
        endTime: '',
        weekday: '',
        educationLevels: [],
        educationTypes: [],
        hoursCount: '',
        subject: '',
        solutionDomain: '',
        learningMode: '',
        syllabusLink: '',
        summary: '',
        objectives: ''
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const saveSolution = () => {
    if (!formData.solutionId || !formData.solutionName || !formData.firstMeetingDate) {
      alert('שדות חובה: מספר פתרון, שם, תאריך');
      return;
    }

    const newSolution = {
      id: formData.solutionId,
      solution_name: formData.solutionName,
      creator_name: instructors.find(i => i.id === formData.creatorName)?.first_name + ' ' + instructors.find(i => i.id === formData.creatorName)?.last_name,
      first_meeting_date: formData.firstMeetingDate,
      start_time: formData.startTime,
      end_time: formData.endTime,
      weekday: weekdays.find(w => w.id === formData.weekday)?.name,
      education_levels: formData.educationLevels,
      education_types: formData.educationTypes,
      hours_count: hourCredits.find(h => h.id === formData.hoursCount)?.hours,
      subject: subjects.find(s => s.id === formData.subject)?.name,
      solution_domain: solutionDomains.find(d => d.id === formData.solutionDomain)?.name,
      learning_mode: learningModes.find(m => m.id === formData.learningMode)?.title,
      syllabus_link: formData.syllabusLink,
      summary: formData.summary,
      objectives: formData.objectives
    };

    if (editingId) {
      setSolutions(solutions.map(s => s.id === editingId ? newSolution : s));
    } else {
      setSolutions([...solutions, newSolution]);
    }
    closeModal();
  };

  const deleteSolution = (id) => {
    if (window.confirm("למחוק את פתרון הלמידה?")) {
      setSolutions(solutions.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">פתרונות למידה</h2>
      <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 transition">
        ➕ הוסף פתרון למידה
      </button>

      {/* Learning Solutions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-right">
              {Object.keys(formData).filter(k => k !== 'summary' && k !== 'objectives').map((key, index) => (
                <th key={index} className="px-4 py-2 border">{key}</th>
              ))}
              <th className="px-4 py-2 border">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((solution, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                {Object.entries(solution)
                  .filter(([k]) => k !== 'summary' && k !== 'objectives')
                  .map(([key, value], i) => (
                    <td key={i} className="px-4 py-2 border text-right">{value}</td>
                  ))
                }
                <td className="px-4 py-2 border text-right">
                  <button onClick={() => openModal(solution.id)} className="text-blue-600 mx-1">✎</button>
                  <button onClick={() => deleteSolution(solution.id)} className="text-red-600 mx-1">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl overflow-y-auto max-h-screen">
            <span onClick={closeModal} className="float-left text-xl cursor-pointer">&times;</span>
            <h3 className="text-xl font-bold mb-4">{editingId ? "ערוך פתרון למידה" : "הוסף פתרון למידה"}</h3>
            <form onSubmit={(e) => { e.preventDefault(); saveSolution(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="solutionId" placeholder="מספר פתרון למידה" value={formData.solutionId} onChange={handleInputChange} disabled={!!editingId} className="border p-2 rounded" />
                <input type="text" name="solutionName" placeholder="שם פתרון למידה" value={formData.solutionName} onChange={handleInputChange} className="border p-2 rounded" />
                <select name="creatorName" value={formData.creatorName} onChange={handleInputChange} className="border p-2 rounded">
                  <option value="">בחר מורה</option>
                  {instructors.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.first_name} {inst.last_name}</option>
                  ))}
                </select>
                <input type="date" name="firstMeetingDate" value={formData.firstMeetingDate} onChange={handleInputChange} className="border p-2 rounded" />
                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="border p-2 rounded" />
                <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="border p-2 rounded" />
                <select name="weekday" value={formData.weekday} onChange={handleInputChange} className="border p-2 rounded">
                  <option value="">בחר יום</option>
                  {weekdays.map(day => (
                    <option key={day.id} value={day.id}>{day.name}</option>
                  ))}
                </select>
                <select name="educationLevels" multiple value={formData.educationLevels} onChange={handleMultiSelectChange} className="border p-2 rounded">
                  {educationLevels.map(level => (
                    <option key={level.id} value={level.title}>{level.title}</option>
                  ))}
                </select>
                <select name="educationTypes" multiple value={formData.educationTypes} onChange={handleMultiSelectChange} className="border p-2 rounded">
                  {educationTypes.map(type => (
                    <option key={type.id} value={type.title}>{type.title}</option>
                  ))}
                </select>
                <select name="hoursCount" value={formData.hoursCount} onChange={handleInputChange} className="border p-2 rounded">
                  <option value="">בחר שעות</option>
                  {hourCredits.map(h => (
                    <option key={h.id} value={h.id}>{h.hours}</option>
                  ))}
                </select>
                <select name="subject" value={formData.subject} onChange={handleInputChange} className="border p-2 rounded">
                  <option value="">בחר נושא</option>
                  {subjects.map(subj => (
                    <option key={subj.id} value={subj.id}>{subj.name}</option>
                  ))}
                </select>
                <select name="solutionDomain" value={formData.solutionDomain} onChange={handleInputChange} className="border p-2 rounded">
                  <option value="">בחר תחום פתרון</option>
                  {solutionDomains.map(domain => (
                    <option key={domain.id} value={domain.id}>{domain.name}</option>
                  ))}
                </select>
                <select name="learningMode" value={formData.learningMode} onChange={handleInputChange} className="border p-2 rounded">
                  <option value="">בחר אופן למידה</option>
                  {learningModes.map(mode => (
                    <option key={mode.id} value={mode.id}>{mode.title}</option>
                  ))}
                </select>
                <input type="url" name="syllabusLink" placeholder="קישור לסילבוס" value={formData.syllabusLink} onChange={handleInputChange} className="border p-2 rounded" />
                <textarea name="summary" placeholder="תקציר פתרון הלמידה" value={formData.summary} onChange={handleInputChange} className="border p-2 rounded h-24"></textarea>
                <textarea name="objectives" placeholder="מטרות פתרון הלמידה" value={formData.objectives} onChange={handleInputChange} className="border p-2 rounded h-24"></textarea>
              </div>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">שמור</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

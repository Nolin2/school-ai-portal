import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Users, BookOpen, BarChart2, TrendingUp, TrendingDown, Clipboard, PlusCircle, UserCheck, Shield, MessageSquare, Menu, X, Send
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- 1. SIMULATED MONGODB DATA STRUCTURE ---

const MOCK_CONFIG = {
    classes: ['Class 7 North', 'Class 7 South', 'Class 8'],
    subjects: ['Mathematics', 'English', 'Science', 'History', 'Geography']
};

let MOCK_STUDENTS = [
    { id: 's001', fullName: 'Lucy Otieno', gender: 'Female', dob: '2010-01-15', studentClass: 'Class 7 North', parentPhone: '0712345678', admissionDate: '2022-09-01', prefectStatus: true, boarding: 'Day' },
    { id: 's002', fullName: 'Mark Kimani', gender: 'Male', dob: '2010-03-20', studentClass: 'Class 7 North', parentPhone: '0722334455', admissionDate: '2022-09-01', prefectStatus: false, boarding: 'Boarding' },
    { id: 's003', fullName: 'Jane Wambui', gender: 'Female', dob: '2009-11-10', studentClass: 'Class 7 North', parentPhone: '0733445566', admissionDate: '2021-09-01', prefectStatus: false, boarding: 'Boarding' },
    { id: 's004', fullName: 'David Kiprop', gender: 'Male', dob: '2010-05-05', studentClass: 'Class 8', parentPhone: '0744556677', admissionDate: '2021-01-01', prefectStatus: true, boarding: 'Day' },
    { id: 's005', fullName: 'Mary Achieng', gender: 'Female', dob: '2009-08-28', studentClass: 'Class 7 South', parentPhone: '0755667788', admissionDate: '2022-01-01', prefectStatus: true, boarding: 'Day' },
];

let MOCK_MARKS = [
    // Initial marks to ensure some data is available for calculation
    { id: 'm001', studentId: 's001', studentName: 'Lucy Otieno', class: 'Class 7 North', term: 'Term 1 2024', teacherId: 't001', marks: { Mathematics: 95, English: 90, Science: 92, History: 88, Geography: 93 }, remarks: 'Excellent start to the year.', recommendation: 'Maintain consistency.' },
    { id: 'm002', studentId: 's002', studentName: 'Mark Kimani', class: 'Class 7 North', term: 'Term 1 2024', teacherId: 't001', marks: { Mathematics: 80, English: 75, Science: 85, History: 70, Geography: 78 }, remarks: 'Good potential, needs to push English score up.', recommendation: 'Extra reading practice.' },
    { id: 'm003', studentId: 's001', studentName: 'Lucy Otieno', class: 'Class 7 North', term: 'Term 2 2024', teacherId: 't001', marks: { Mathematics: 98, English: 94, Science: 96, History: 90, Geography: 95 }, remarks: 'Outstanding term, showing great improvement in History.', recommendation: 'Start mentoring younger students.' },
];

let CURRENT_USER = { id: 'admin-jwt-1', role: 'Admin', name: 'Dr. Administrator' }; // Initial simulated JWT payload

// --- 2. SIMULATED EXPRESS/NODE.JS API ENDPOINTS ---

const API_LATENCY = 800; // Simulate network delay

const api = {
    // Simulates GET /api/auth/profile (JWT Verification)
    fetchUserProfile: async () => {
        await new Promise(resolve => setTimeout(resolve, API_LATENCY / 2));
        return { user: CURRENT_USER, token: 'mock-jwt-token' };
    },

    // Simulates GET /api/students
    fetchStudents: async () => {
        await new Promise(resolve => setTimeout(resolve, API_LATENCY));
        return { data: MOCK_STUDENTS };
    },

    // Simulates POST /api/students/new
    addStudent: async (newStudent) => {
        await new Promise(resolve => setTimeout(resolve, API_LATENCY));
        const student = {
            ...newStudent,
            id: 's' + String(MOCK_STUDENTS.length + 1).padStart(3, '0'),
            admissionDate: new Date().toISOString().split('T')[0],
            prefectStatus: newStudent.prefectStatus || false,
            boarding: newStudent.boarding || 'Day',
        };
        MOCK_STUDENTS.push(student);
        return { success: true, student };
    },

    // Simulates GET /api/marks
    fetchMarks: async () => {
        await new Promise(resolve => setTimeout(resolve, API_LATENCY));
        return { data: MOCK_MARKS };
    },

    // Simulates POST /api/marks/upload
    addMarks: async (markEntry) => {
        await new Promise(resolve => setTimeout(resolve, API_LATENCY));
        // In a real system, this would merge new marks with existing records.
        // For simplicity, we just add the new entry to the mock array.
        const newMark = { 
            ...markEntry, 
            id: 'm' + String(MOCK_MARKS.length + 1).padStart(3, '0'),
            timestamp: new Date().toISOString(),
            teacherId: CURRENT_USER.id 
        };
        MOCK_MARKS.push(newMark);
        return { success: true, newMark };
    },
    
    // Simulates GET /api/config
    fetchConfig: async () => {
        await new Promise(resolve => setTimeout(resolve, API_LATENCY));
        return { data: MOCK_CONFIG };
    }
};

// --- 3. SIMULATED AI/GEMINI API FUNCTIONS ---

// This function simulates the core logic of calling the Gemini API for text generation.
const generateRemarks = async (studentName, performanceSummary) => {
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // Logic that would be handled by the LLM
    if (studentName.includes('Lucy')) {
        return {
            remark: "Exceptional diligence and consistent high performance across all major subjects. Maintains a top-tier rank.",
            recommendation: "Challenge: Encourage participation in the regional math competition to push beyond classroom limits."
        };
    } else if (performanceSummary.weakest === 'History') {
        return {
            remark: "A motivated student showing strong aptitude in sciences, but requiring targeted support in humanities.",
            recommendation: "Intervention: Dedicate an extra 30 minutes daily to reading historical texts and linking concepts to current events."
        };
    }
    return {
        remark: "Satisfactory performance with notable effort, showing potential for significant improvement next term.",
        recommendation: "Intervention: Focus on strengthening the foundational understanding in the weakest subject, improving study group attendance."
    };
};

// Simulates answering teacher queries (chat/grounding)
const answerTeacherQuery = async (query, context) => {
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    let mockText = `AI Response for: *${query}*\n\n`;

    if (query.toLowerCase().includes('mary achieng')) {
        mockText += "Mary Achieng (ID: s005) is a prefect in Class 7 South, Day Scholar, admitted 2022. Her parent's phone number is 0755 667 788. She shows moderate performance but has potential in Mathematics. (Data from Context: ${context.substring(0, 50)}...)";
    } else if (query.toLowerCase().includes('top 5 students')) {
        mockText += "The current top 5 students school-wide based on recent term averages are: 1. Lucy Otieno (93.4%), 2. Mark Kimani (81.6%), 3. Jane Wambui (79.0%), 4. David Kiprop (77.5%), 5. Mary Achieng (75.0%).";
    } else if (query.toLowerCase().includes('improved most in mathematics')) {
        mockText += "Based on term-to-term analysis, Jane Wambui showed the greatest proportional improvement in Mathematics this term, increasing her average score from 65% to 80%.";
    } else {
        mockText += "I have successfully compiled the requested data. The response demonstrates the AI's ability to synthesize information from the simulated MongoDB records and respond in a concise, natural language format.";
    }

    return mockText;
};

// --- 4. UTILITY FUNCTIONS ---

const calculatePerformance = (marks, allStudents, subjects) => {
    if (!marks.length || !allStudents.length || !subjects.length) return [];

    const studentDataMap = new Map(allStudents.map(student => [student.id, {
        ...student,
        totalMarksSum: 0,
        termMarks: [],
        subjectScores: subjects.reduce((acc, sub) => ({ ...acc, [sub]: { total: 0, count: 0 } }), {})
    }]));

    // Aggregate marks by student and term
    marks.forEach(mark => {
        const student = studentDataMap.get(mark.studentId);
        if (student) {
            const total = subjects.reduce((sum, sub) => sum + (mark.marks[sub] || 0), 0);
            const average = total / subjects.length;

            student.termMarks.push({ term: mark.term, total, average, marks: mark.marks });

            subjects.forEach(sub => {
                const score = mark.marks[sub] || 0;
                student.subjectScores[sub].total += score;
                student.subjectScores[sub].count += 1;
            });
        }
    });

    // Calculate final averages and ranks
    const finalStudentData = Array.from(studentDataMap.values()).map(student => {
        let totalAverage = 0;
        let validSubjectsCount = 0;

        subjects.forEach(sub => {
            if (student.subjectScores[sub].count > 0) {
                totalAverage += (student.subjectScores[sub].total / student.subjectScores[sub].count);
                validSubjectsCount++;
            }
        });
        
        student.average = validSubjectsCount > 0 ? totalAverage / validSubjectsCount : 0;
        
        // Determine strongest/weakest subjects (based on overall average across all terms)
        const subjectAverages = subjects.map(sub => {
            const data = student.subjectScores[sub];
            return { name: sub, avg: data.count > 0 ? data.total / data.count : 0 };
        }).filter(s => s.avg > 0);

        subjectAverages.sort((a, b) => b.avg - a.avg);
        
        student.strongestSubject = subjectAverages[0] ? subjectAverages[0].name : 'N/A';
        student.weakestSubject = subjectAverages[subjectAverages.length - 1] ? subjectAverages[subjectAverages.length - 1].name : 'N/A';
        student.performanceSummary = { average: student.average.toFixed(2), strongest: student.strongestSubject, weakest: student.weakestSubject };

        return student;
    });

    // Sort by average for ranking
    finalStudentData.sort((a, b) => b.average - a.average);
    
    finalStudentData.forEach((student, index) => {
        student.position = index + 1;
    });

    return finalStudentData;
};


// --- 5. SCHOOL DATA HOOK (MERN Client-Side Simulation) ---

const useSchoolData = () => {
    const [user, setUser] = useState(CURRENT_USER); // Simulated JWT payload
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState([]);
    const [config, setConfig] = useState(MOCK_CONFIG);
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch (Simulating component mounting & initial API calls)
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. JWT Auth Check
                const { user: profile } = await api.fetchUserProfile();
                setUser(profile);
                
                // 2. Fetch Data (Simulated MongoDB collections)
                const [studentRes, marksRes, configRes] = await Promise.all([
                    api.fetchStudents(),
                    api.fetchMarks(),
                    api.fetchConfig()
                ]);

                setStudents(studentRes.data);
                setMarks(marksRes.data);
                setConfig(configRes.data);
            } catch (error) {
                console.error("MERN API Simulation Error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    
    // Derived State: Calculated Student Performance (Memoized)
    const rankedStudents = useMemo(() => {
        return calculatePerformance(marks, students, config.subjects);
    }, [marks, students, config.subjects]);
    
    // Data Actions (Simulating POST/PUT/DELETE API calls)
    
    const handleAddStudent = useCallback(async (newStudent) => {
        setLoading(true);
        const { student } = await api.addStudent(newStudent);
        setStudents(prev => [...prev, student]);
        setLoading(false);
    }, []);

    const handleAddMarks = useCallback(async (markEntry) => {
        setLoading(true);
        const { newMark } = await api.addMarks(markEntry);
        setMarks(prev => [...prev, newMark]);
        setLoading(false);
    }, []);

    // Role switcher for demo purposes (Simulated JWT change)
    const switchRole = (newRole) => {
        // Removed 'Student' role from this map
        const mockUserMap = {
            'Admin': { id: 'admin-jwt-1', role: 'Admin', name: 'Dr. Administrator' },
            'Teacher': { id: 'teacher-jwt-2', role: 'Teacher', name: 'Mr. John Doe' },
        };
        CURRENT_USER = mockUserMap[newRole];
        setUser(mockUserMap[newRole]);
    };

    return {
        loading,
        user,
        role: user.role,
        switchRole,
        students,
        rankedStudents,
        config,
        addStudent: handleAddStudent,
        addMarks: handleAddMarks,
    };
};

// --- 6. CORE COMPONENTS ---

const Card = ({ title, value, icon: Icon, colorClass = 'bg-indigo-600' }) => (
    <div className={`p-6 rounded-xl shadow-lg ${colorClass} text-white transition transform hover:scale-[1.02] cursor-pointer`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium opacity-80">{title}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
            <Icon className="w-8 h-8 opacity-70" />
        </div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
        <div className="h-64">
            {children}
        </div>
    </div>
);

const UserRoleSelector = ({ role, switchRole }) => {
    // Only Admin and Teacher roles remain
    const MOCK_ROLES = ['Admin', 'Teacher'];
    return (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">
                Current Role: <span className="font-bold text-indigo-700">{role}</span>. Switch Role (Simulated JWT):
            </p>
            <div className="flex flex-wrap gap-3">
                {MOCK_ROLES.map(r => (
                    <button
                        key={r}
                        onClick={() => switchRole(r)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-150 ${
                            role === r
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-50'
                        }`}
                    >
                        {r}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- 7. ADMIN DASHBOARD ---

const AdminDashboard = ({ rankedStudents, students, config, addStudent }) => {
    const [isAdding, setIsAdding] = useState(false);

    // Dashboard Analytics
    const totalStudents = students.length;
    const teachersCount = 2; // Mock
    const totalClasses = config.classes.length;
    
    // Calculate school average
    const schoolAverage = rankedStudents.length ? (rankedStudents.reduce((sum, s) => sum + s.average, 0) / rankedStudents.length) : 0;
    
    // Calculate best/weakest subjects school-wide
    const subjectPerformance = useMemo(() => {
        const subjectScores = {};
        
        rankedStudents.forEach(s => {
            if (s.subjectScores) {
                Object.entries(s.subjectScores).forEach(([subject, data]) => {
                    if(data.count > 0) {
                        subjectScores[subject] = (subjectScores[subject] || { total: 0, count: 0 });
                        subjectScores[subject].total += (data.total / data.count);
                        subjectScores[subject].count += 1;
                    }
                });
            }
        });

        const averages = Object.entries(subjectScores).map(([name, data]) => ({
            name,
            average: data.count > 0 ? data.total / data.count : 0
        })).filter(a => a.average > 0).sort((a, b) => a.average - b.average);

        const bestSubject = averages.length ? averages[averages.length - 1] : { name: 'N/A', average: 0 };
        const weakSubject = averages.length ? averages[0] : { name: 'N/A', average: 0 };

        return { best: bestSubject, weak: weakSubject };
    }, [rankedStudents]);
    
    // Top/Underperforming Students (Top 5 and Bottom 5)
    const topStudents = rankedStudents.slice(0, 5);
    const underperformingStudents = rankedStudents.slice(-5).reverse();

    // Student Onboarding Modal
    const StudentOnboarding = () => {
        const initialForm = { fullName: '', gender: 'Male', dob: '', studentClass: config.classes[0] || '', parentPhone: '' };
        const [form, setForm] = useState(initialForm);
        const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

        const handleSubmit = (e) => {
            e.preventDefault();
            addStudent(form);
            setIsAdding(false);
        };

        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h3 className="text-2xl font-bold text-indigo-700">New Student Onboarding</h3>
                        <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-gray-800"><X /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Full Name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                        <div className="flex space-x-4">
                            <select name="gender" value={form.gender} onChange={handleChange} className="w-1/2 p-3 border border-gray-300 rounded-lg">
                                <option>Male</option><option>Female</option>
                            </select>
                            <input type="date" name="dob" value={form.dob} onChange={handleChange} required className="w-1/2 p-3 border border-gray-300 rounded-lg" />
                        </div>
                        <select name="studentClass" value={form.studentClass} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg">
                            <option value="">Select Class</option>
                            {config.classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="tel" name="parentPhone" value={form.parentPhone} onChange={handleChange} required placeholder="Parent Phone (WhatsApp)" className="w-full p-3 border border-gray-300 rounded-lg" />
                        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-150 shadow-lg">
                            Add Student
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    const StudentListItem = ({ student, index, color }) => (
        <li className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
            <span className={`font-bold mr-3 ${color}`}>#{student.position}</span>
            <span className="flex-grow">{student.fullName} ({student.studentClass})</span>
            <span className="font-semibold text-sm">{student.average.toFixed(1)}%</span>
        </li>
    );

    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Students" value={totalStudents} icon={Users} colorClass="bg-indigo-600" />
                <Card title="Teachers Registered" value={teachersCount} icon={UserCheck} colorClass="bg-green-600" />
                <Card title="Classes Managed" value={totalClasses} icon={BookOpen} colorClass="bg-yellow-600" />
                <Card title="Avg. School Performance" value={`${schoolAverage.toFixed(1)} %`} icon={BarChart2} colorClass="bg-red-600" />
            </div>

            <div className="flex justify-end">
                <button onClick={() => setIsAdding(true)} className="flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition duration-150">
                    <PlusCircle className="w-5 h-5 mr-2" /> Add New Student
                </button>
            </div>
            {isAdding && <StudentOnboarding />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartCard title="Overall School Performance Trend (Mock Data)">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[{ term: 'T1', avg: 75 }, { term: 'T2', avg: 78 }, { term: 'T3', avg: 80.5 }]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="term" />
                                <YAxis domain={[60, 100]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="avg" name="School Average (%)" stroke="#4F46E5" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-green-700 mb-3 flex items-center"><TrendingUp className="w-5 h-5 mr-2" /> Best Performing Subject</h3>
                        <p className="text-3xl font-bold">{subjectPerformance.best.name}</p>
                        <p className="text-sm text-gray-600">Avg. Score: {subjectPerformance.best.average.toFixed(1)}%</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-red-700 mb-3 flex items-center"><TrendingDown className="w-5 h-5 mr-2" /> Weakest Performing Subject</h3>
                        <p className="text-3xl font-bold">{subjectPerformance.weak.name}</p>
                        <p className="text-sm text-gray-600">Avg. Score: {subjectPerformance.weak.average.toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Top 5 Students</h3>
                    <ul className="space-y-3">
                        {topStudents.map((s, index) => <StudentListItem key={s.id} student={s} index={index} color="text-green-600" />)}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Underperforming Students</h3>
                    <ul className="space-y-3">
                        {underperformingStudents.map((s, index) => <StudentListItem key={s.id} student={s} index={index} color="text-red-600" />)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// --- 8. TEACHER PORTAL ---

const TeacherPortal = ({ rankedStudents, students, config, addMarks, user }) => {
    const [view, setView] = useState('upload'); // 'upload' or 'ai-query'
    const [selectedClass, setSelectedClass] = useState(config.classes[0] || '');
    const [selectedSubject, setSelectedSubject] = useState(config.subjects[0] || '');
    const [selectedTerm, setSelectedTerm] = useState('Term 3 2024');

    const filteredStudents = students.filter(s => s.studentClass === selectedClass);
    
    const TabButton = ({ isActive, onClick, icon: Icon, children }) => (
        <button
            onClick={onClick}
            className={`flex items-center px-4 py-3 text-lg font-semibold transition duration-150 ${
                isActive ? 'text-indigo-600 border-b-4 border-indigo-600' : 'text-gray-500 hover:text-indigo-600'
            }`}
        >
            <Icon className="w-5 h-5 mr-2" /> {children}
        </button>
    );
    
    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-extrabold text-gray-800">Teacher Portal</h2>
            
            <div className="flex border-b border-gray-200">
                <TabButton isActive={view === 'upload'} onClick={() => setView('upload')} icon={Clipboard}>Marks Upload & Remarks</TabButton>
                <TabButton isActive={view === 'ai-query'} onClick={() => setView('ai-query')} icon={Shield}>AI Analyst Query</TabButton>
            </div>

            {view === 'upload' ? (
                <MarksUpload
                    filteredStudents={filteredStudents}
                    selectedClass={selectedClass}
                    selectedSubject={selectedSubject}
                    selectedTerm={selectedTerm}
                    config={config}
                    addMarks={addMarks}
                    setSelectedClass={setSelectedClass}
                    setSelectedSubject={setSelectedSubject}
                    setSelectedTerm={setSelectedTerm}
                    rankedStudents={rankedStudents}
                    user={user}
                />
            ) : (
                <AIQueryTool students={students} rankedStudents={rankedStudents} />
            )}
        </div>
    );
};

// --- 8.1 MARKS UPLOAD ---

const MarksUpload = ({ filteredStudents, selectedClass, selectedSubject, selectedTerm, config, addMarks, setSelectedClass, setSelectedSubject, setSelectedTerm, rankedStudents, user }) => {
    const [marksInput, setMarksInput] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedRemarks, setGeneratedRemarks] = useState({});

    useEffect(() => {
        // Initialize marks for students when class/subject changes
        const initialMarks = filteredStudents.reduce((acc, student) => {
            acc[student.id] = { mark: '', customRemark: '' };
            return acc;
        }, {});
        setMarksInput(initialMarks);
        setGeneratedRemarks({});
    }, [filteredStudents, selectedSubject]);

    const handleMarkChange = (studentId, value) => {
        const mark = Math.max(0, Math.min(100, parseInt(value) || 0)); // Ensure marks are between 0 and 100
        setMarksInput(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], mark }
        }));
    };

    const handleRemarkChange = (studentId, value) => {
        setMarksInput(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], customRemark: value }
        }));
    };

    const generateAllRemarks = async () => {
        setIsGenerating(true);
        const newRemarks = {};
        for (const student of filteredStudents) {
            // Find student's current calculated performance summary
            const studentPerf = rankedStudents.find(s => s.id === student.id);
            if (studentPerf) {
                const remarks = await generateRemarks(student.fullName, studentPerf.performanceSummary);
                newRemarks[student.id] = remarks;
            }
        }
        setGeneratedRemarks(newRemarks);
        setIsGenerating(false);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        // In a real MERN app, we'd loop through all students and post individual or bulk updates.
        // For simulation, we create one representative bulk entry for the selected class/subject/term.
        const marksEntry = {
            studentId: filteredStudents[0]?.id || 's999',
            studentName: 'Bulk Entry',
            class: selectedClass,
            term: selectedTerm,
            teacherId: user.id,
            marks: filteredStudents.reduce((acc, student) => {
                acc[selectedSubject] = (marksInput[student.id]?.mark || 0); // Simplified: assumes all students get the same mark for demo
                return acc;
            }, {}),
            remarks: 'Bulk Upload Simulated',
            recommendation: 'Data updated for analytics.'
        };
        
        // Use the actual API call
        await addMarks(marksEntry); 
        
        // Clear and reset state
        setMarksInput({});
        setGeneratedRemarks({});
        setIsSubmitting(false);
        // Note: The UI will automatically refresh due to state change in useSchoolData
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Enter Marks</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                    {config.classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                    {config.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Term 1 2024</option>
                    <option>Term 2 2024</option>
                    <option>Term 3 2024</option>
                </select>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Student Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Mark (0-100)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">AI Remark/Teacher Comment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Recommendation</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.map(student => {
                            const studentData = marksInput[student.id] || { mark: '', customRemark: '' };
                            const remarks = generatedRemarks[student.id] || {};
                            return (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="number"
                                            value={studentData.mark}
                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                            min="0"
                                            max="100"
                                            className="w-20 p-2 border rounded-lg text-center focus:ring-indigo-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <textarea
                                            value={studentData.customRemark || remarks.remark || ''}
                                            onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                            placeholder={remarks.remark || 'Optional custom remark...'}
                                            className="w-full p-2 border rounded-lg text-sm"
                                            rows="2"
                                        ></textarea>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {remarks.recommendation || 'N/A'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-between items-center">
                <button
                    onClick={generateAllRemarks}
                    disabled={isSubmitting || isGenerating}
                    className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition duration-150 disabled:opacity-50"
                >
                    <Shield className="w-4 h-4 mr-2" /> {isGenerating ? 'Generating...' : 'Generate AI Remarks'}
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
                >
                    {isSubmitting ? 'Uploading to MongoDB...' : 'Submit All Marks'}
                </button>
            </div>
        </div>
    );
};

// --- 8.2 AI QUERY TOOL ---

const AIQueryTool = ({ students, rankedStudents }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitQuery = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setResponse(null);

        // Prepare comprehensive context for the AI LLM
        const context = JSON.stringify(rankedStudents.slice(0, 10).map(s => ({
            id: s.id, name: s.fullName, class: s.studentClass, rank: s.position, average: s.average.toFixed(1), strongest: s.strongestSubject, weakest: s.weakestSubject
        })));

        const aiResponse = await answerTeacherQuery(query, context);
        
        setResponse(aiResponse);
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <h3 className="text-2xl font-bold text-indigo-700">Ask the AI Analyst</h3>
            <p className="text-gray-600">The AI accesses MongoDB data to answer complex questions (e.g., *Who improved most in Mathematics?*, *Rank students in Class 7 North*).</p>

            <div className="flex space-x-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query here..."
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuery()}
                />
                <button
                    onClick={handleSubmitQuery}
                    disabled={isLoading || !query.trim()}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : 'Ask AI'}
                </button>
            </div>

            {response && (
                <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600 whitespace-pre-line">
                    <h4 className="font-bold mb-2 flex items-center text-indigo-800"><MessageSquare className="w-4 h-4 mr-2" /> AI Response (Simulated OpenAI):</h4>
                    {response}
                </div>
            )}
        </div>
    );
};

// --- 9. MAIN APP COMPONENT ---

const App = () => {
    const { loading, role, switchRole, rankedStudents, students, config, addStudent, addMarks, user } = useSchoolData();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const Sidebar = () => (
        <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition duration-200 ease-in-out w-64 bg-gray-900 text-white p-4 flex flex-col z-40`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-indigo-400">School AI MERN</h1>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white"><X /></button>
            </div>
            <p className="text-sm mb-4">Welcome, <span className="font-bold">{user.name || role}</span>!</p>
            <p className="text-xs mb-4 text-gray-400">Simulated Role: {role}</p>
            
            <nav className="flex-grow space-y-2">
                <SidebarLink icon={BarChart2} label="Dashboard" role="Admin" currentRole={role} />
                <SidebarLink icon={Clipboard} label="Teacher Portal" role="Teacher" currentRole={role} />
                {/* Student Link Removed */}
            </nav>
            <div className="mt-auto pt-4 border-t border-gray-700">
                <UserRoleSelector role={role} switchRole={switchRole} />
            </div>
        </div>
    );
    
    const SidebarLink = ({ icon: Icon, label, role: requiredRole, currentRole }) => {
        if (currentRole !== requiredRole) return null;
        return (
            <a href="#" className="flex items-center px-3 py-2 rounded-lg bg-indigo-600 text-white font-semibold transition duration-150">
                <Icon className="w-5 h-5 mr-3" /> {label}
            </a>
        );
    };

    const MainContent = () => {
        if (loading) {
            return <div className="p-8 text-center text-xl text-indigo-600">Connecting to MERN backend and fetching data...</div>;
        }

        switch (role) {
            case 'Admin':
                return <AdminDashboard rankedStudents={rankedStudents} students={students} config={config} addStudent={addStudent} />;
            case 'Teacher':
                return <TeacherPortal rankedStudents={rankedStudents} students={students} config={config} addMarks={addMarks} user={user} />;
            default:
                return <div className="p-8 text-center text-xl text-red-500">Access Denied (Invalid JWT). Please select a role.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased">
            <script src="https://cdn.tailwindcss.com"></script>
            <div className="flex">
                <Sidebar />

                <div className="flex-grow">
                    <header className="sticky top-0 bg-white shadow-md p-4 flex justify-between items-center lg:hidden z-30">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 hover:text-gray-800">
                            <Menu />
                        </button>
                        <h1 className="text-xl font-bold text-indigo-700">School AI Portal</h1>
                        <div className="w-6"></div> {/* Spacer */}
                    </header>

                    <main className="min-h-[calc(100vh-64px)] lg:min-h-screen">
                        <MainContent />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default App;

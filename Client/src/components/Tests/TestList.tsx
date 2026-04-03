import React, { useState, useEffect } from 'react';
import { Clock, Users, FileText, Plus, Award, ArrowLeft, CheckCircle, UserCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchTests, fetchResults, createTest, submitTest } from '../../api/testApi';

interface TestListProps {
  initialViewState?: 'list' | 'create' | 'take';
}

export const TestList: React.FC<TestListProps> = ({ initialViewState = 'list' }) => {
  const { user } = useAuth();
  const [activeFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [tests, setTests] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for sub-views
  const [viewState, setViewState] = useState<'list' | 'create' | 'take'>(initialViewState);
  const [currentTest, setCurrentTest] = useState<any>(null);
  
  // Teacher UI state mapping expanded test panels
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tData, rData] = await Promise.all([fetchTests(), fetchResults()]);
      setTests(tData);
      setResults(rData);
    } catch (error) {
      console.error("Failed to load tests", error);
    }
    setLoading(false);
  };

  const filteredTests = tests.filter(test => {
    if (activeFilter === 'upcoming') return test.status === 'active';
    if (activeFilter === 'completed') return test.status === 'completed';
    return true;
  });

  // ========== CREATE TEST VIEW ==========
  const CreateTestForm = () => {
    const [formData, setFormData] = useState({
      title: '', description: '', subject: '', duration: 30, totalMarks: 100
    });
    const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);

    const handleAddQuestion = () => {
      setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
      const newQ = [...questions];
      newQ[qIndex].options[oIndex] = value;
      setQuestions(newQ);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await createTest({ ...formData, questions });
        setViewState('list');
        loadData();
      } catch (err) {
        alert("Failed to create test");
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => setViewState('list')} className="text-gray-500 hover:text-gray-900"><ArrowLeft /></button>
          <h2 className="text-2xl font-bold">Create New Test</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Test Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input className="w-full border p-2 rounded" placeholder="Subject" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
          <textarea className="w-full border p-2 rounded" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="flex space-x-4">
            <input type="number" className="w-1/2 border p-2 rounded" placeholder="Duration (mins)" required value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} />
            <input type="number" className="w-1/2 border p-2 rounded" placeholder="Total Marks" required value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: Number(e.target.value)})} />
          </div>

          <div className="space-y-6 mt-6">
            <h3 className="font-semibold text-lg">Questions</h3>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 border rounded-lg space-y-3 bg-gray-50">
                <input className="w-full border p-2 rounded" placeholder={`Question ${qIndex + 1}`} required value={q.questionText} onChange={e => { const newQ = [...questions]; newQ[qIndex].questionText = e.target.value; setQuestions(newQ); }} />
                <div className="grid grid-cols-2 gap-3">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <input type="radio" name={`correct-${qIndex}`} checked={q.correctAnswer === oIndex} onChange={() => { const newQ = [...questions]; newQ[qIndex].correctAnswer = oIndex; setQuestions(newQ); }} />
                      <input className="w-full border p-2 rounded text-sm" placeholder={`Option ${oIndex + 1}`} required value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button type="button" onClick={handleAddQuestion} className="text-blue-600 text-sm font-medium hover:underline">+ Add Another Question</button>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">Submit Test</button>
        </form>
      </div>
    );
  };

  // ========== TAKE TEST VIEW ==========
  const TakeTestForm = () => {
    const [answers, setAnswers] = useState<number[]>(new Array(currentTest.questions.length).fill(-1));
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(currentTest.duration * 60);

    useEffect(() => {
      if (timeLeft <= 0) {
        handleSubmit();
        return;
      }
      
      const timer = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSubmit = async () => {
      setSubmitting(true);
      try {
        await submitTest({ testId: currentTest._id, answers, timeTaken: Math.max(1, (currentTest.duration * 60) - timeLeft) }); 
        setViewState('list');
        loadData();
      } catch (err) {
        alert("Failed to submit test");
      }
      setSubmitting(false);
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => setViewState('list')} className="text-gray-500 hover:text-gray-900"><ArrowLeft /></button>
            <div>
              <h2 className="text-2xl font-bold">{currentTest.title}</h2>
              <p className="text-sm text-gray-500">{currentTest.subject} • Set By: {currentTest.createdBy?.name || 'Instructor'}</p>
            </div>
          </div>
          <div className={`text-xl font-bold flex items-center px-4 py-2 rounded-lg ${timeLeft < 180 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-800'}`}>
            <Clock className="w-5 h-5 mr-2" /> {formatTime(timeLeft)}
          </div>
        </div>

        <div className="space-y-8">
          {currentTest.questions.map((q: any, qIndex: number) => (
            <div key={qIndex} className="space-y-3">
              <p className="font-medium text-gray-900">{qIndex + 1}. {q.questionText}</p>
              <div className="space-y-2">
                {q.options.map((opt: string, oIndex: number) => (
                  <label key={oIndex} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name={`q-${qIndex}`} checked={answers[qIndex] === oIndex} onChange={() => { const newA = [...answers]; newA[qIndex] = oIndex; setAnswers(newA); }} className="h-4 w-4 text-blue-600" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={submitting} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
          {submitting ? "Submitting..." : "Submit Answers"}
        </button>
      </div>
    );
  };

  // ========== LIST VIEWS ==========
  const renderStudentView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2"><FileText className="h-5 w-5 text-blue-600" /><span className="text-sm font-medium text-blue-900">Total Tests</span></div>
          <p className="text-2xl font-bold text-blue-700 mt-1">{tests.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2"><Award className="h-5 w-5 text-green-600" /><span className="text-sm font-medium text-green-900">Average Score</span></div>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {results.length ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length) : 0}%
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2"><CheckCircle className="h-5 w-5 text-orange-600" /><span className="text-sm font-medium text-orange-900">Completed</span></div>
          <p className="text-2xl font-bold text-orange-700 mt-1">{results.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTests.map((test) => {
          const result = results.find(r => r.testId?._id === test._id || r.testId === test._id);
          return (
            <div key={test._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{test.title}</h3>
                  <p className="text-sm text-gray-500 mb-2 flex items-center">
                    <UserCircle className="w-4 h-4 mr-1" /> Set By: <span className="font-medium ml-1 text-gray-700">{test.createdBy?.name || 'Instructor'}</span>
                  </p>
                  <p className="text-gray-600 text-sm mb-3">{test.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {test.duration} min</span>
                    <span className="flex items-center"><FileText className="h-4 w-4 mr-1" /> {test.totalMarks} marks</span>
                  </div>

                  {result && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800"><strong>Score:</strong> {result.score}/{test.totalMarks} ({Math.round(result.percentage)}%)</p>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex items-center h-full pt-2">
                  {!result ? (
                    <button onClick={() => { setCurrentTest(test); setViewState('take'); }} className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Take Test</button>
                  ) : (
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center font-medium"><CheckCircle className="h-4 w-4 mr-2"/> Completed</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {tests.length === 0 && !loading && <p className="text-gray-500 text-center py-8">No tests available.</p>}
      </div>
    </div>
  );

  const renderTeacherView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-900">Test Management</h2></div>
        <button onClick={() => setViewState('create')} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /><span>Create Test</span>
        </button>
      </div>

      <div className="space-y-4">
        {tests.map((test) => {
          const testResults = results.filter(r => r.testId?._id === test._id || r.testId === test._id);
          const isExpanded = expandedTestId === test._id;

          return (
            <div key={test._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{test.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 mt-1">{test.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 bg-gray-50 p-3 rounded-lg w-max">
                    <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5 text-blue-500" /> {test.duration} mins</span>
                    <span className="flex items-center"><FileText className="h-4 w-4 mr-1.5 text-purple-500" /> {test.totalMarks} marks</span>
                    <span className="flex items-center"><FileText className="h-4 w-4 mr-1.5 text-orange-500" /> {test.questions?.length} Questions</span>
                    <span className="flex items-center"><Users className="h-4 w-4 mr-1.5 text-green-500" /> {testResults.length} Submissions</span>
                  </div>
                </div>

                <div className="ml-4">
                   <button 
                     onClick={() => setExpandedTestId(isExpanded ? null : test._id)}
                     className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium"
                   >
                     {isExpanded ? 'Hide Attendees' : 'View Attendees'}
                   </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" /> Student Submissions ({testResults.length})
                  </h4>
                  {testResults.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                       <table className="w-full text-sm text-left text-gray-600">
                         <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                           <tr>
                             <th className="px-4 py-3">Student Name</th>
                             <th className="px-4 py-3">Score</th>
                             <th className="px-4 py-3">Percentage</th>
                           </tr>
                         </thead>
                         <tbody>
                           {testResults.map(r => (
                              <tr key={r._id} className="border-t border-gray-200 bg-white hover:bg-blue-50">
                                <td className="px-4 py-3 font-medium text-gray-800">{r.studentId?.name || 'Unknown Student'}</td>
                                <td className="px-4 py-3 text-blue-600 font-semibold">{r.score} / {test.totalMarks}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.percentage >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {Math.round(r.percentage)}%
                                  </span>
                                </td>
                              </tr>
                           ))}
                         </tbody>
                       </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                      No students have taken this test yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {tests.length === 0 && !loading && <p className="text-gray-500 text-center py-8">You haven't created any tests yet.</p>}
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center mt-20 text-gray-500 animate-pulse">Synchronizing Assessment Hub...</div>;

  return (
    <div className="p-6">
      {viewState === 'create' ? <CreateTestForm /> : null}
      {viewState === 'take' ? <TakeTestForm /> : null}
      {viewState === 'list' && (user?.role === 'student' ? renderStudentView() : renderTeacherView())}
    </div>
  );
};
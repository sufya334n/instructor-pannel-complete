import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Addcourse from './pages/AddCourse';
import './styles/Panel.css';


import PendingPayments from './pages/PendingPayments';
import PaidPayments from './pages/PaidPayments';
import PaidPayoutDetails from './pages/PaidPayoutDetails';












export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [instructorId, setInstructorId] = useState(null);
  const [instructorName, setInstructorName] = useState('');

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuth ? <Navigate to="/courses" /> : <Login onLogin={(id, name) => { setIsAuth(true); setInstructorId(id); setInstructorName(name); }} />
          }
        />
        {/* Signup Route */}
        <Route
          path="/signup"
          element={
            isAuth ? <Navigate to="/courses" /> : <Signup onSignup={() => setIsAuth(true)} />
          }
        />
        {/* Protected Panel Routes */}
        <Route
          path="*"
          element={
            isAuth ? (
              <div className="panel-root">
                <Navbar instructorName={instructorName} onLogout={() => setIsAuth(false)} />
                <div className="panel-content-area">
                  <Routes>
                    <Route
                      path="/courses"
                      element={<Courses instructorId={instructorId} instructorName={instructorName} />}
                    />
                    <Route
                      path="/courses/addcourse"
                      element={<Addcourse instructorId={instructorId} instructorName={instructorName} />}
                    />
                    <Route
                      path="/courses/edit/:courseId"
                      element={<Addcourse instructorId={instructorId} instructorName={instructorName} />}
                    />
                    {/* <Route path="/students" element={<Students />} /> */}
                    <Route path="/profile" element={<Profile instructorId={instructorId} />} />
                    <Route path="/instructor/pending-payments" element={<PendingPayments instructorId={instructorId} />} />
                    <Route path="/instructor/paid-payments" element={<PaidPayments instructorId={instructorId} />} />
                    <Route path="/instructor/paid-payouts/:instructorId" element={<PaidPayments instructorId={instructorId} />} />
                    <Route path="/instructor/paid-payouts/:instructorId/:batchId" element={<PaidPayoutDetails instructorId={instructorId} />} />







                    {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                    <Route path="*" element={<Navigate to="/courses" />} />
                  </Routes>
                  
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}


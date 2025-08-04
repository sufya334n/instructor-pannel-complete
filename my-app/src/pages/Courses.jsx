import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCoursesByInstructor } from '../services/courses';
import InstructorCourseCard from '../components/InstructorCourseCard';
import '../styles/courses.css';

const Courses = ({ instructorId, instructorName }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    const data = await getCoursesByInstructor(instructorId);
    setCourses(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    if (instructorId) fetchCourses();
    // eslint-disable-next-line
  }, [instructorId]);

  const handleEdit = (course) => {
    navigate(`/courses/edit/${course._id}`);
  };

  return (
    <div className="courses-page">
      <h2>My Courses</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="courses-grid">
          {/* Create Course Card (always show) */}
          <div className="course-card create-course-card" onClick={() => navigate('/courses/addcourse')}>
            <div className="create-course-plus">+</div>
            <div>Create Course</div>
          </div>
          {/* Show course cards if any */}
          {courses.length > 0 && courses.map(course => (
            <InstructorCourseCard key={course._id} course={course} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses; 
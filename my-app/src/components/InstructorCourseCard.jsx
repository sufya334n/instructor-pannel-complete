import '../styles/InstructorCourseCard.css';

export default function InstructorCourseCard({ course, onEdit }) {
  return (
    <div className="course-card">
      <img src={course.image} alt={course.title} className="course-card-image" />
      <div className="course-card-body">
        <div className="course-card-title">{course.title}</div>
        <div className="course-card-meta">
          {course.category.name} | {course.level}
        </div>
      </div>
      <div className="course-card-footer">
        <button className="course-card-edit-btn" onClick={() => onEdit(course)}>
          Edit
        </button>
      </div>
    </div>
  );
} 
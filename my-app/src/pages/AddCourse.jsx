import React, { useState } from 'react';
import '../styles/addcourse.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AddCourse = ({ instructorId, instructorName }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(1); // New state for current section
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    instructorAvatar: '',
    image: '',
    lessons: '',
    durationHours: '',
    durationMinutes: '',
    durationSeconds: '',
    price: '',
    originalPrice: '',
    isFree: false,
    category: { name: '', icon: '' },

    level: '',
    tags: '',
    // description: '',
    whoFor: '',
    whatLearn: '',
    outcomes: '',
    tools: '',
    projects: '',
    certificate: '',
    whyTake: '',
    endGoals: '',
    videos: [{ title: '', url: '' }], // ensure videos is present
  });

// State for category list
const [categories, setCategories] = useState([]);

// Fetch categories from DB
useEffect(() => {
  fetch('http://localhost:5001/api/courses/categories')
    .then(res => res.json())
    .then(data => {
      if (data && Array.isArray(data)) {
        setCategories(data);
      }
    })
    .catch(err => console.error("Error fetching categories:", err));
}, []);






  useEffect(() => {
    if (courseId) {
      setIsLoading(true);
      fetch(`http://localhost:5001/api/courses/${courseId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.course) {
            // Prefill formData from fetched course
            const c = data.course;
            setFormData({
              title: c.title || '',
              instructor: c.instructor || '',
              instructorAvatar: c.instructorAvatar || '',
              image: c.image || '',
              lessons: c.lessons || '',
              durationHours: c.duration ? Math.floor(c.duration / 3600) : '',
              durationMinutes: c.duration ? Math.floor((c.duration % 3600) / 60) : '',
              durationSeconds: c.duration ? c.duration % 60 : '',
              price: c.price || '',
              originalPrice: c.originalPrice || '',
              isFree: c.isFree || false,
              category: {
                  name: c.category?.name || '',
                  icon: c.category?.icon || ''
                      },

              level: c.level || '',
              tags: c.tags ? c.tags.join(',') : '',
              whoFor: c.description?.find(d => d.heading === 'Who This Course is For')?.details || '',
              whatLearn: c.description?.find(d => d.heading === 'What You Will Learn')?.details || '',
              outcomes: c.description?.find(d => d.heading === 'Key Learning Outcomes')?.details || '',
              tools: c.description?.find(d => d.heading === 'Tools & Technologies Used')?.details || '',
              projects: c.description?.find(d => d.heading === 'Hands-On Projects Included')?.details || '',
              certificate: c.description?.find(d => d.heading === 'Certificate of Completion')?.details || '',
              whyTake: c.description?.find(d => d.heading === 'Why Take This Course?')?.details || '',
              endGoals: c.description?.find(d => d.heading === 'By the End of This Course, You Will Be Able To:')?.details || '',
              videos: c.videos && c.videos.length > 0 ? c.videos : [{ title: '', url: '' }],
            });
          }
          setIsLoading(false);
        });
    }
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
const handleCategoryChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    category: {
      ...prev.category,
      [field]: value
    }
  }));
};

  // Remove toggleSection as it's no longer needed
  // const toggleSection = (sectionName) => {
  //   setOpenSections(prev => ({
  //     ...prev,
  //     [sectionName]: !prev[sectionName]
  //   }));
  // };

  const handleNext = () => {
    setCurrentSection(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentSection(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Use instructorId and instructorName from props
      if (!instructorId || !instructorName) {
        alert('Please login first');
        return;
      }

      // Calculate duration in seconds
      const hours = parseInt(formData.durationHours) || 0;
      const minutes = parseInt(formData.durationMinutes) || 0;
      const seconds = parseInt(formData.durationSeconds) || 0;
      const totalDurationInSeconds = (hours * 3600) + (minutes * 60) + seconds;

      // Calculate lessons count from videos array
      const lessonsCount = formData.videos.filter(video => video.url.trim() !== '').length;

      // Determine if course is free
      const price = parseFloat(formData.price) || 0;
      const originalPrice = parseFloat(formData.originalPrice) || 0;
      const isFree = (price === 0 && originalPrice === 0);

      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      // Create description array from accordion sections
      const descriptionArray = [
        {
          heading: "Who This Course is For",
          details: formData.whoFor
        },
        {
          heading: "What You Will Learn", 
          details: formData.whatLearn
        },
        {
          heading: "Key Learning Outcomes",
          details: formData.outcomes
        },
        {
          heading: "Tools & Technologies Used",
          details: formData.tools
        },
        {
          heading: "Hands-On Projects Included",
          details: formData.projects
        },
        {
          heading: "Certificate of Completion",
          details: formData.certificate
        },
        {
          heading: "Why Take This Course?",
          details: formData.whyTake
        },
        {
          heading: "By the End of This Course, You Will Be Able To:",
          details: formData.endGoals
        }
      ];

      // Filter out empty sections
      const filteredDescription = descriptionArray.filter(section => 
        section.details && section.details.trim() !== ''
      );

      // Create course data object
      const courseData = {
        title: formData.title,
        instructor: instructorName,
        instructorAvatar: '', // Will be fetched from instructor collection later
        image: formData.image,
        lessons: lessonsCount,
        duration: totalDurationInSeconds,
        price: price,
        originalPrice: originalPrice,
        isFree: isFree,
        category: {
              name: formData.category.name,
              icon: formData.category.icon
                    },

        tags: tagsArray,
        level: formData.level,
        videos: formData.videos.filter(video => video.url.trim() !== '' && video.title.trim() !== ''),
        description: filteredDescription,
        updatedAt: new Date(),
        instructorId: instructorId,
        courseVerified: false
      };

      let response;
      if (courseId) {
        // Update mode
        response = await fetch(`http://localhost:5001/api/courses/${courseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData)
        });
      } else {
        // Add mode
        response = await fetch('http://localhost:5001/api/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData)
        });
      }

      if (response.ok) {
        const result = await response.json();
        alert(courseId ? 'Course updated successfully!' : 'Course created successfully!');
        navigate('/courses');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('Error submitting course:', error);
      alert('Error creating/updating course. Please try again.');
    }
  };

  // const handleVideoChange = (index, field, value) => {
  //   const updatedVideos = [...formData.videos];
  //   updatedVideos[index] = { ...updatedVideos[index], [field]: value };
  //   setFormData((prev) => ({
  //     ...prev,
  //     videos: updatedVideos,
  //   }));
  // };

  const addVideoField = () => {
    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, { title: '', url: '' }],
    }));
  };

  const handleRemoveVideo = (index) => {
    setFormData(prevData => ({
      ...prevData,
      videos: prevData.videos.filter((_, i) => i !== index)
    }));
  };

  const handleAddVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, { title: '', url: '' }],
    }));
  };

  const handleVideoChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      videos: prevData.videos.map((video, i) =>
        i === index ? { ...video, [name]: value } : video
      )
    }));
  };

  return (
    <div className="add-course-container">
      <p >{courseId ? 'Edit Course' : 'Add New Course'}</p>
      {isLoading ? (
        <p>Loading course data...</p>
      ) : (
        <form onSubmit={handleSubmit} className="add-course-form">

          {/* Section 1: Basic Course Information */}
       


          {currentSection === 1 && (
  <div className="form-section">
    <h3>Basic Course Information</h3>

    <div className="form-group">
      <label htmlFor="title">Course Title</label>
      <input
        type="text"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., Master React in 30 Days"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="image">Course Image URL</label>
      <input
        type="text"
        id="image"
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="e.g., https://example.com/react-course.jpg"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="durationHours">Course Duration</label>
      <div className="duration-inputs">
        <input
          type="number"
          id="durationHours"
          name="durationHours"
          value={formData.durationHours}
          onChange={handleChange}
          placeholder="Hours"
          min="0"
        />
        <input
          type="number"
          id="durationMinutes"
          name="durationMinutes"
          value={formData.durationMinutes}
          onChange={handleChange}
          placeholder="Minutes"
          min="0"
          max="59"
        />
        <input
          type="number"
          id="durationSeconds"
          name="durationSeconds"
          value={formData.durationSeconds}
          onChange={handleChange}
          placeholder="Seconds"
          min="0"
          max="59"
        />
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="price">Price (for discount)</label>
      <input
        type="number"
        id="price"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="e.g., 49.99"
        step="0.01"
      />
    </div>

    <div className="form-group">
      <label htmlFor="originalPrice">Original Price</label>
      <input
        type="number"
        id="originalPrice"
        name="originalPrice"
        value={formData.originalPrice}
        onChange={handleChange}
        placeholder="e.g., 99.99"
        step="0.01"
      />
    </div>

  {/* Category Dropdown */}
<div className="form-group">
  <label htmlFor="categorySelect">Category</label>
  <select
    id="categorySelect"
    value={formData.category.name}
    onChange={(e) => handleCategoryChange('name', e.target.value)}
  >
    <option value="">-- Select a Category --</option>
    {categories.map((cat, index) => (
      <option key={cat._id || `${cat.name}-${index}`} value={cat.name}>
        {cat.name}
      </option>
    ))}
    <option value="Other">Other</option>
  </select>
</div>

{/* Show extra inputs if "Other" is selected */}
{formData.category.name === "Other" && (
  <>
    <div className="form-group">
      <label htmlFor="categoryName">New Category Name</label>
      <input
        type="text"
        id="categoryName"
        value={formData.category.name === "Other" ? "" : formData.category.name}
        onChange={(e) => handleCategoryChange('name', e.target.value)}
        placeholder="Enter category name"
      />
    </div>

    <div className="form-group">
      <label htmlFor="categoryIcon">Category Icon URL</label>
      <input
        type="text"
        id="categoryIcon"
        value={formData.category.icon}
        onChange={(e) => handleCategoryChange('icon', e.target.value)}
        placeholder="Enter icon URL"
      />
    </div>
  </>
)}


   <div className="form-group">
  <label htmlFor="level">Level</label>
  <select
    id="level"
    name="level"
    value={formData.level}
    onChange={handleChange}
  >
    <option value="">Select level</option>
    <option value="Beginner">Beginner</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Advanced">Advanced</option>
  </select>
</div>


    <div className="form-group">
      <label htmlFor="tags">Tags (comma-separated)</label>
      <input
        type="text"
        id="tags"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="e.g., react, javascript, frontend"
      />
    </div>

    <button type="button" onClick={handleNext}>Next</button>
  </div>
)}


          {/* Section 2: Course Description and Outcomes */}
          {currentSection === 2 && (
            <div className="form-section">
              <h3>Course Details</h3>
              <div className="form-group">
                <label htmlFor="whoFor">Who This Course is For</label>
                <textarea
                  id="whoFor"
                  name="whoFor"
                  value={formData.whoFor}
                  onChange={handleChange}
                  placeholder="Describe the target audience for this course."
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="whatLearn">What You Will Learn</label>
                <textarea
                  id="whatLearn"
                  name="whatLearn"
                  value={formData.whatLearn}
                  onChange={handleChange}
                  placeholder="List the key topics and skills students will acquire."
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="outcomes">Key Learning Outcomes</label>
                <textarea
                  id="outcomes"
                  name="outcomes"
                  value={formData.outcomes}
                  onChange={handleChange}
                  placeholder="What specific results can students expect after completing the course?"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="tools">Tools & Technologies Used</label>
                <textarea
                  id="tools"
                  name="tools"
                  value={formData.tools}
                  onChange={handleChange}
                  placeholder="Mention any software, frameworks, or tools used in the course."
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="projects">Hands-On Projects Included</label>
                <textarea
                  id="projects"
                  name="projects"
                  value={formData.projects}
                  onChange={handleChange}
                  placeholder="Describe any projects or practical exercises included."
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="certificate">Certificate of Completion</label>
                <textarea
                  id="certificate"
                  name="certificate"
                  value={formData.certificate}
                  onChange={handleChange}
                  placeholder="Details about any certificate provided upon completion."
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="whyTake">Why Take This Course?</label>
                <textarea
                  id="whyTake"
                  name="whyTake"
                  value={formData.whyTake}
                  onChange={handleChange}
                  placeholder="Explain the benefits and value proposition of taking this course."
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="endGoals">By the End of This Course, You Will Be Able To:</label>
                <textarea
                  id="endGoals"
                  name="endGoals"
                  value={formData.endGoals}
                  onChange={handleChange}
                  placeholder="Summarize the ultimate skills or achievements students will gain."
                ></textarea>
              </div>

              <div className="navigation-buttons">
                <button type="button" onClick={handleBack}>Back</button>
                <button type="button" onClick={handleNext}>Next</button>
              </div>
            </div>
          )}

          {/* Section 3: Course Videos */}
          {currentSection === 3 && (
            <div className="form-section">
              <h3>Course Videos</h3>
              {formData.videos.map((video, index) => (
                <div key={index} className="video-input-group">
                  <div className="form-group">
                    <label htmlFor={`videoTitle${index}`}>Video Title</label>
                    <input
                      type="text"
                      id={`videoTitle${index}`}
                      name="title"
                      value={video.title}
                      onChange={(e) => handleVideoChange(index, e)}
                      placeholder="e.g., Introduction to React"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`videoUrl${index}`}>Video URL</label>
                    <input
                      type="text"
                      id={`videoUrl${index}`}
                      name="url"
                      value={video.url}
                      onChange={(e) => handleVideoChange(index, e)}
                      placeholder="e.g., https://youtube.com/watch?v=example"
                    />
                  </div>
                  {formData.videos.length > 1 && (
                    <button type="button" onClick={() => handleRemoveVideo(index)} className="remove-video-btn">Remove Video</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddVideo} className="add-video-btn">Add Another Video</button>
              <div className="navigation-buttons">
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">{courseId ? 'Update Course' : 'Add Course'}</button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AddCourse;

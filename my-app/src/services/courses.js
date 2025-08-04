const API_URL = "http://localhost:5001/api/courses";

export async function getCoursesByInstructor(instructorId) {
  try {
    const res = await fetch(`${API_URL}/instructor/${instructorId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch instructor courses");
    }

    const data = await res.json();
    return data.courses || []; // ✅ Make sure we return array of courses
  } catch (error) {
    console.error("Error in getCoursesByInstructor:", error);
    return [];
  }
}


export async function createCourse(courseData) {
  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData),
  });
  return res.json();
} 
const API_URL = "http://localhost:5001/api/auth";

export async function instructorSignup({ name, email, password }) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { message: data.message || 'Registration failed. Please try again.' };
    }
    return data;
  } catch (err) {
    return { message: 'Network error. Please try again.' };
  }
}

export async function instructorLogin({ email, password }) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { message: data.message || 'Login failed. Please try again.' };
    }
    return data;
  } catch (err) {
    return { message: 'Network error. Please try again.' };
  }
} 




import axios from 'axios';

const API_BASE_URL = "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getPendingPayouts = async (instructorId) => {
  try {
    const response = await api.get(`/api/instructor/pending-payouts/${instructorId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



export const getPaidPayouts = async (instructorId) => {
  const response = await api.get(`/api/paid-payouts/${instructorId}`);
  return response.data; // ✅ you returned just the `data` already
};




// services/instructorAuth.js
// export const getPaidPayouts = async (instructorId) => {
//   try {
//     const response = await api.get(`/api/paid-payouts/${instructorId}`);
//     return response.data; // ✅ Already returns { paidPayouts: [...] }
//   } catch (error) {
//     throw error.response?.data || { message: "Unexpected error" };
//   }
// };

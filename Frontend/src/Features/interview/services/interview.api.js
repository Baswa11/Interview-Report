import axios from "axios";

const API_BASE_URL = axios.create({
  baseURL: "http://localhost:5000/api/interview",
  withCredentials: true,
});

API_BASE_URL.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateInterviewReport = async ({ jobDescription, selfDescription, resume }) => {
  const formData = new FormData();
  if (jobDescription) formData.append("jobDescription", jobDescription);
  if (selfDescription) formData.append("selfDescription", selfDescription);
  if (resume) formData.append("resume", resume);

  const response = await API_BASE_URL.post("/generate-interview-report", formData);
  return response.data;
};

export const getInterviewReportById = async ({ interviewId }) => {
  const response = await API_BASE_URL.get(`/get-interview-report/${interviewId}`);
  return response.data;
};

export const getAllInterviewReportById = getInterviewReportById;

export const getAllInterviewReports = async () => {
  const response = await API_BASE_URL.get("/get-all-interview-reports");
  return response.data;
};
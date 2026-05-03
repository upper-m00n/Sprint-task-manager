import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API functions
// Get user's spaces (projects they are enrolled in)
export const getMySpaces = () => api.get('/projects/my-spaces');
// Get For You page data (spaces, tasks, activity stream)
export const getForYouData = () => api.get('/for-you');
// Mark an issue as complete (sets status to project's Done)
export const completeIssue = (issueId) => api.patch(`/issues/${issueId}/complete`);
// Get detailed project information
export const getProjectDetails = (projectId) => api.get(`/projects/${projectId}`);

// Comments
export const getIssueComments = (issueId) => api.get(`/issues/${issueId}/comments`);
export const addComment = (issueId, content) => api.post(`/issues/${issueId}/comments`, { content });
export const deleteComment = (issueId, commentId) =>
    api.delete(`/comments/${commentId}`);

// Teams
export const getTeams = () => api.get('/teams');
export const getTeam = (teamId) => api.get(`/teams/${teamId}`);
export const createTeam = (data) => api.post('/teams', data);
export const addTeamMember = (teamId, data) => api.post(`/teams/${teamId}/members`, data);
export const removeTeamMember = (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`);
export const updateTeamMemberRole = (teamId, data) => api.patch(`/teams/${teamId}/role`, data);
export const assignTeamToProject = (projectId, teamId) =>
    api.post(`/projects/${projectId}/assign-team`, { team_id: teamId });

// Users search (for adding members)
export const searchUsers = (query) => api.get(`/users?q=${encodeURIComponent(query)}`);

export default api;

import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Request interceptor for adding the bearer token
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('admin_user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/admin/login', { email, password });
        return response.data;
    },
};

export const employeeService = {
    getAll: async () => {
        const response = await api.get('/user/view');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/user/view/${id}`);
        return response.data;
    },
    add: async (userData) => {
        const response = await api.post('/user/add', userData);
        return response.data;
    },
    update: async (id, userData) => {
        const response = await api.patch(`/user/edit/${id}`, userData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/user/delete/${id}`);
        return response.data;
    }
};

export const attendanceService = {
    getAll: async () => {
        const response = await api.get('/attendance/view');
        return response.data;
    },
    checkIn: async (data) => {
        const response = await api.post('/attendance/checkin', data);
        return response.data;
    },
    checkOut: async (data) => {
        const response = await api.post('/attendance/checkout', data);
        return response.data;
    }
};

export const leaveService = {
    getAll: async () => {
        const response = await api.get('/leave/view');
        return response.data;
    },
    apply: async (leaveData) => {
        const response = await api.post('/leave/apply', leaveData);
        return response.data;
    },
    process: async (id, status) => {
        const response = await api.patch(`/leave/process/${id}`, { status });
        return response.data;
    },
    approve: async (id, status) => {
        const response = await api.patch(`/leave/approve/${id}`, { status });
        return response.data;
    },
    getMyLeaves: async () => {
        const response = await api.get('/leave/my-leaves');
        return response.data;
    }
};

export const holidayService = {
    getAll: async () => {
        const response = await api.get('/holiday/view');
        return response.data;
    },
    add: async (holidayData) => {
        const response = await api.post('/holiday/add', holidayData);
        return response.data;
    },
    update: async (id, holidayData) => {
        const response = await api.patch(`/holiday/edit/${id}`, holidayData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/holiday/delete/${id}`);
        return response.data;
    }
};

export const teamService = {
    getAll: async () => {
        const response = await api.get('/team/view');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/team/view/${id}`);
        return response.data;
    },
    add: async (teamData) => {
        const response = await api.post('/team/add', teamData);
        return response.data;
    },
    update: async (id, teamData) => {
        const response = await api.patch(`/team/edit/${id}`, teamData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/team/delete/${id}`);
        return response.data;
    }
};

export const eventService = {
    getAll: async () => {
        const response = await api.get('/event/view');
        return response.data;
    },
    add: async (eventData) => {
        const response = await api.post('/event/add', eventData);
        return response.data;
    },
    update: async (id, eventData) => {
        const response = await api.patch(`/event/edit/${id}`, eventData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/event/delete/${id}`);
        return response.data;
    }
};

export const adminService = {
    getAll: async () => {
        const response = await api.get('/admin/view');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/admin/view/${id}`);
        return response.data;
    },
    add: async (adminData) => {
        const response = await api.post('/admin/add', adminData);
        return response.data;
    },
    update: async (id, adminData) => {
        const response = await api.patch(`/admin/edit/${id}`, adminData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/admin/delete/${id}`);
        return response.data;
    },
};

export default api;

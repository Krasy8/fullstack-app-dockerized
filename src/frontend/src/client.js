import fetch from 'unfetch';

const checkStatus = response => {
    if (response.ok) {
        return response;
    }
    // convert non-2xx HTTP responses into errors:
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}

const getCsrfToken = () => {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
    return cookieValue ? cookieValue.split('=')[1] : null;
};

// StudentController API calls
export const getAllStudents = () =>
    fetch("http://localhost:8080/api/v1/students", { // Ensure the full backend URL
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(), // Include CSRF token
        },
        credentials: 'include', // Include cookies for session management
    }).then(checkStatus);

export const addNewStudent = student =>
    fetch("http://localhost:8080/api/v1/students", { // Ensure the full backend URL
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(), // Include CSRF token
        },
        method: 'POST',
        credentials: 'include', // Include cookies for session management
        body: JSON.stringify(student),
    }).then(checkStatus);

export const deleteStudent = studentId =>
    fetch(`/api/v1/students/${studentId}`, {
        method: 'DELETE'
    }).then(checkStatus);

// AdminController API calls
export const loginAdmin = async (credentials) => {
    const csrfToken = getCsrfToken();
    return fetch("http://localhost:8080/api/v1/admin/login", { // Ensure the full backend URL
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken // Include CSRF token
        },
        method: 'POST',
        credentials: 'include', // Include cookies for CSRF and session management
        body: JSON.stringify(credentials)
    }).then(checkStatus);
};

export const registerAdmin = async (adminData) => {
    const csrfToken = getCsrfToken();
    return fetch("http://localhost:8080/api/v1/admin/register", {
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken // Include CSRF token
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(adminData)
    }).then(checkStatus);
};

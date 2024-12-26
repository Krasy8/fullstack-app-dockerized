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

// const getCsrfToken = () => {
//     const cookieValue = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
//     return cookieValue ? cookieValue.split('=')[1] : null;
// };

export const fetchCsrfToken = async () => {
    const response = await fetch("http://localhost:8080/api/v1/csrf/csrf-token", {
        method: 'GET',
        credentials: 'include' // Include cookies for session management
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.statusText}`);
    }

    // const csrfToken = await response.json();
    // console.log(csrfToken);
    // return csrfToken.token; // Assuming the server sends the token in JSON format as { "token": "your-csrf-token-value" }
};

// StudentController API calls
export const getAllStudents = async () => {
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
        throw new Error('No JWT token found. Please log in.');
    }
    return fetch("http://localhost:8080/api/v1/students", { // Ensure the full backend URL
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
            // 'X-XSRF-TOKEN': getCsrfToken(), // Include CSRF token
        },
        credentials: 'include', // Include cookies for session management
    }).then(response => {
        if (response.ok) {
            console.log(response);
            return response; // Parse the response if successful
        }
        throw new Error('Failed to fetch students');
    }).catch(error => {
        console.error('Fetch students error:', error);
    });
}

// export const getAllStudents = () =>
//     fetchCsrfToken().then((csrfToken) =>
//         fetch("http://localhost:8080/api/v1/students", {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-XSRF-TOKEN': csrfToken, // Use the token retrieved from fetchCsrfToken
//             },
//             credentials: 'include', // Include cookies for session management
//         })
//     ).then(checkStatus);

export const addNewStudent = student =>
    fetch("http://localhost:8080/api/v1/students", { // Ensure the full backend URL
        headers: {
            'Content-Type': 'application/json',
            // 'X-XSRF-TOKEN': getCsrfToken(), // Include CSRF token
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
    // const csrfToken = getCsrfToken();
    // console.log(credentials, csrfToken);
    return fetch("http://localhost:8080/api/v1/admin/login", { // Ensure the full backend URL
        headers: {
            'Content-Type': 'application/json',
            // 'X-XSRF-TOKEN': csrfToken // Include CSRF token
        },
        method: 'POST',
        // credentials: 'include', // Include cookies for CSRF and session management
        body: JSON.stringify(credentials),
    }).then(response => {
        console.log('Response status:', response.status); // Log response status
        console.log('Response OK:', response.ok); // Log if response is OK

        // Check if the response is OK
        if (response.ok) {
            return response.text(); // Response is plain text (JWT token)
        } else {
            return response.text().then(text => {
                console.error('Login failed:', text); // Log error text from the response
                throw new Error('Login failed');
            });
        }
    }).then(async jwtToken => {
        localStorage.setItem('jwtToken', await jwtToken);
    }).catch(error => {
        console.error('Login error', error);
    });
};

export const registerAdmin = async (adminData) => {
    // const csrfToken = getCsrfToken();
    return fetch("http://localhost:8080/api/v1/admin/register", {
        headers: {
            'Content-Type': 'application/json',
            // 'X-XSRF-TOKEN': csrfToken // Include CSRF token
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(adminData)
    }).then(checkStatus);
};

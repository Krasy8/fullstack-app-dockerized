import fetch from 'unfetch';

// const checkStatus = response => {
//     if (response.ok) {
//         return response;
//     }
//     // convert non-2xx HTTP responses into errors:
//     const error = new Error(response.statusText);
//     error.response = response;
//     return Promise.reject(error);
// }

export const fetchApi = async (endpoint, options = {}) => {
    const baseUrl = "http://localhost:8080/api/v1";
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
        throw new Error("No JWT token found. Please log in.");
    }

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
        });

        if (!response.ok) {
            // Attempt to parse error response if available
            let errorMessage = `HTTP error ${response.status}`;
            try {
                const errorResponse = await response.json()
                errorMessage = errorResponse.message || errorMessage;
            } catch (e) {
                console.warn("Failed to parse error response", e);
            }
            throw new Error(errorMessage);
        }

        // Attempt to parse response body if possible
        try {
            return await response.json();
        } catch (e) {
            console.warn("Response has no JSON body:", e);
            return response; // Fallback for no body
        }
    } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error.message);
        throw error; // Rethrow the error for further handling
    }
};

const checkStatus = (response) => {
    if (response.ok) {
        const contentLength = response.headers.get("Content-Length");
        if (contentLength && parseInt(contentLength) > 0) {
            return response.json(); // Parse JSON for non-empty response
        }
        return Promise.resolve(); // Resolve with no value for empty responses
    }

    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
};


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

export const getAllStudents = async () => {
    try {
        return await fetchApi("/students", { method: "GET" });
    } catch (error) {
        console.error("Failed to fetch students:", error.message);
        throw error; // Propagate error for frontend display or fallback
    }
};

export const addNewStudent = async (student) => {
    try {
        return await fetchApi("/students", {
            method: "POST",
            body: JSON.stringify(student),
        });
    } catch (error) {
        console.error("Failed to add new student:", error.message);
        throw error; // Propagate error for frontend display or fallback
    }
};

export const deleteStudent = async (studentId) => {
    try {
        return await fetchApi(`/students/${studentId}`, {
            method: "DELETE",
            body: JSON.stringify(studentId)
        });
    } catch (error) {
        console.error("Failed to delete student with id: ", studentId)
    }
}

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
        // credentials: 'include',
        body: JSON.stringify(adminData)
    // }).then(checkStatus);
    }).then(response => {
        console.log('Response status:', response.status); // Log response status
        console.log('Response OK:', response.ok); // Log if response is OK

        // Check if the response is OK
        if (response.ok) {
            return response.text(); // Response is plain text (JWT token)
        } else {
            return response.text().then(text => {
                console.error('Registration failed:', text); // Log error text from the response
                throw new Error('Registration failed');
            });
        }
    }).then(async jwtToken => {
        localStorage.setItem('jwtToken', await jwtToken);
    }).catch(error => {
        console.error('Registration error', error);
    });
};

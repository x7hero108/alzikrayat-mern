// Small wrapper around fetch used by all pages.
// - sends the logged-in user's id in the "x-user-id" header (basic auth, see server/middleware/auth.js)
// - throws an Error with a readable message when the API answers with an error status

export const STORAGE_KEY = 'alzikrayatUser';

const getStoredUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return user ? user._id : null;
  } catch {
    return null;
  }
};

const request = async (url, { method = 'GET', body } = {}) => {
  const headers = {};
  const userId = getStoredUserId();
  if (userId) headers['x-user-id'] = userId;

  const options = { method, headers };

  if (body instanceof FormData) {
    options.body = body; // the browser sets the multipart Content-Type itself
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || 'Request failed');
    error.errors = data.errors || [];
    error.status = res.status;
    throw error;
  }

  return data;
};

export const api = {
  register: (body) => request('/api/auth/register', { method: 'POST', body }),
  login: (body) => request('/api/auth/login', { method: 'POST', body }),
  getPhotos: () => request('/api/photos'),
  getPhoto: (id) => request(`/api/photos/${id}`),
  uploadPhoto: (formData) => request('/api/photos', { method: 'POST', body: formData }),
  deletePhoto: (id) => request(`/api/photos/${id}`, { method: 'DELETE' }),
  getComments: (id) => request(`/api/photos/${id}/comments`),
  addComment: (id, comment) => request(`/api/photos/${id}/comments`, { method: 'POST', body: { comment } })
};

// Shows all validation messages returned by the server (or the main message)
export const errorMessages = (err) => (err.errors && err.errors.length ? err.errors : [err.message]);

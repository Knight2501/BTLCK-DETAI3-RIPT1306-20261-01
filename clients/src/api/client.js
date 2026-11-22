const BASE = import.meta.env.VITE_API_URL ?? '/api';


export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const api = async (path, { method = 'GET', body, formData, signal } = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...(token && { Authorization: `Bearer ${token}` }) };
  let payload;
  if (formData) {
    payload = formData; 
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${BASE}${path}`, { method, headers, body: payload, signal });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message ?? 'Có lỗi xảy ra', data.details);
  return data;
};

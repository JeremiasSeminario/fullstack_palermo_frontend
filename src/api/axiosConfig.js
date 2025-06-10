import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const backendError = error.response.data?.error || error.response.data?.message || 'Error del servidor';
      throw new Error(backendError);
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al configurar la solicitud');
    }
  }
);

export default api;
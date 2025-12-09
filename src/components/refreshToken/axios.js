import axios from 'axios';
import { setCredentials, forceLogout } from '../../store/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

export const setupInterceptors = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state?.auth?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (!error.response) {
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/refresh-token`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = res.data.accessToken;

          store.dispatch(
            setCredentials({
              accessToken: newAccessToken,
              user: store.getState().auth.user,
            })
          );

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          store.dispatch(forceLogout());
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
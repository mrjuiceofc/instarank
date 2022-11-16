import Axios from 'axios';

const axios = Axios.create();

let isRefreshing = false;

axios.interceptors.request.use((request) => {
  if (request.headers['no-auth']) {
    delete request.headers['no-auth'];

    return request;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    throw {
      response: {
        status: 401,
        data: {
          message: 'No token found',
        },
      },
    };
  }
  request.headers['Authorization'] = `Bearer ${token}`;
  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401 && !isRefreshing) {
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        throw {
          response: {
            status: 401,
            data: {
              message: 'No refresh token found',
            },
          },
        };
      }
      try {
        const response = await axios.post('/api/users/refresh-token', {
          refreshToken,
        });

        const newTokens = response.data;
        localStorage.setItem('token', newTokens.token);
        localStorage.setItem('refreshToken', newTokens.refreshToken);
        const config = error.config;
        const method = config.method;
        const newResponse = await axios[method](config.url, config.data, {
          headers: {
            ...config.headers,
          },
        });
        return newResponse;
      } catch (error) {
        isRefreshing = false;
        throw {
          response: {
            status: 401,
            data: {
              message: 'Refresh token expired',
            },
          },
        };
      }
    }
  }
);

export default axios;

import axios from 'axios';
import { getProxyUrl } from '../use-cases/instagram/getProxyUrl';

export function getInstagramClient() {
  const client = axios.create({
    headers: {
      'x-ig-app-id': '936619743392459',
    },
  });

  client.interceptors.request.use((config) => {
    const url = getProxyUrl({
      url: config.url,
    });

    return {
      ...config,
      url,
    };
  });

  return client;
}

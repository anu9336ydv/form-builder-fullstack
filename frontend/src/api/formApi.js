import axios from 'axios';

const API_URL = 'http://localhost:5000/api/forms';

export const createForm = () => axios.post(API_URL);
export const getForm = (id) => axios.get(`${API_URL}/${id}`);
export const updateForm = (id, formData) => axios.put(`${API_URL}/${id}`, formData);
export const submitForm = (id, answers) => axios.post(`${API_URL}/${id}/submit`, answers);
export const uploadImage = (imageData) => {
  const formData = new FormData();
  formData.append('image', imageData);
  return axios.post(`${API_URL}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

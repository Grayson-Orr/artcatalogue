import axios from 'axios';

let baseURL = '';

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:5000/api';
} else {
  baseURL = 'https://dunedin-school-of-art-22.herokuapp.com/api';
}

const repo = axios.create({
  baseURL,
});

export default {
  async getInfo() {
    return repo.get('/');
  },
  async submitForm(obj) {
    return repo.post('/entries', obj);
  },
  async getEntries() {
    return repo.get('/entries');
  },
  async getEntry(uid) {
    return repo.get(`/entries/${uid}`);
  },
};

import axios from 'axios';
const baseURL = 'http://localhost:3000/api';

console.log(baseURL);
const repo = axios.create({
  baseURL,
});

export default {
  async getInfo() {
    return repo.get('/');
  },
  async submitForm(obj) {
    console.log('Items:', { items: obj.items });
    return repo.post('/entries', obj);
  },
  async getEntries() {
    return repo.get('/entries');
  },
  async getEntry(uid) {
    return repo.get(`/entries/${uid}`);
  },
};

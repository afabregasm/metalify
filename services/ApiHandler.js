// service/index.js
const axios = require('axios');

class CharactersApi {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://rickandmortyapi.com/api'
    });
  }

  getAllCharacters = () => this.api.get('/character');

}


module.exports = CharactersApi;

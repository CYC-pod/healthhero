import axios from "axios";

class ApiClient {
  constructor(remoteHostUrl) {
    this.remoteHostUrl = remoteHostUrl;
    this.token = null;
    this.tokenName = "token";
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem(this.tokenName, token);
  }

  async request(endpoint, method = `GET`, data = {}) {
    const url = `${this.remoteHostUrl}/${endpoint}`;
    console.log("url is: ", url);
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    } else {
      this.token = window.localStorage.getItem("token");
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      console.log(this.token);
      const res = await axios({ url, method, data, headers });
      return { data: res.data, error: null };
    } catch (error) {
      console.error({ errorResponse: error.response });
      const message = error?.response?.data?.error?.message;
      return { data: null, error: message || String(error) };
    }
  }

  async fetchUserFromToken() {
    return await this.request(`auth/me`, `GET`);
  }

  async getNutrition() {
    return await this.request({ endpoint: `nutrition/`, method: `GET` });
  }
  async listcomm() {
    return await this.request({
      endpoint: `community/`,
      method: `GET`,
    });
  }
  async createPost(data, point) {
    return await this.request(point + `/`, `POST`, data);
  }

  async loginUser(credentials) {
    return await this.request(`auth/login`, `POST`, credentials);
  }

  async logoutUser() {
    this.setToken(null);
    localStorage.setItem(this.tokenName, "");
  }

  async signupUser(credentials) {
    const res = await this.request(`auth/register`, `POST`, credentials);
    this.setToken(res.data.token);

    return res;
  }

  async listRestrictions() {
    const res = await this.request("restrictions", "GET");
    return res;
  }

  async listSchools(){
    const res = await this.request("schools", "GET")
    return res; 
  }

  async addSchoolToUser(schoolId){
    console.log("school id in apiClient" , schoolId)
    const data = {schoolId}
    return await this.request( `schools/userschool`, `PATCH`, data);
  }
}

export default new ApiClient("http://localhost:3001");

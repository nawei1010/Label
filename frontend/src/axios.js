import axios from "axios"

const USER_BASE_URL = "http://localhost:8080/api/v1/"
class UserInfo {
      UserLogin(userName, password){
          return axios.post(USER_BASE_URL + 'login/' + userName + '/' + password);
      }

      UserRegister(user){
          return axios.post(USER_BASE_URL + 'register', user);
      }
}

export default new UserInfo();
import axios   from "axios";

export function login(payload :{email: string, password: string}) {
    return axios.post("http://localhost:8080/api/auth/login", payload);
}
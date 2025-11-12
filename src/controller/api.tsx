import axios from "axios";

export function login(payload: { email: string, password: string }) {
    return axios.post("http://localhost:8080/api/auth/login", payload);
}

export function professionalRegistration(payload: object) {
    return axios.post("http://localhost:8080/api/users", payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
}

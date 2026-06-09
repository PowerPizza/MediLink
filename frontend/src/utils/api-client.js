import axios from 'axios'
import { AsyncStorageDriver } from '../data/AsyncStorageDriver';

class ApiClient {
    baseUrl = process.env.EXPO_PUBLIC_API_URL;
    token = null;

    constructor() {
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000,
            headers: {
                "Content-Type": 'application/json',
            }
        });

        this.client.interceptors.request.use(async (config)=>{
            this.token = await AsyncStorageDriver.getItem("jwt");
            if (this.token) {
                config.headers["Authorization"] = `Bearer ${this.token}`;
            }
            return config;
        }, (err) => {
            console.log("API Client Interceptor Error : ", err);
            return Promise.reject(err);
        });
    }

    async sendVerificationCode(to, code) {
        try {
            const response = await this.client.post(this.baseUrl+'/mail/verification-code', {to, code});
            return {status: response.status, data: response.data}
        } catch (err) {
            console.error("Failed to send verification code : error - ", err);
            throw err;
        }
    }

    async signupDoctor(data) {
        try {
            const response = await this.client.post(this.baseUrl+'/auth/signup/doctor', data);
            return {status: response.status, data: response.data}
        }
        catch (err) {
            console.log("Error while signing up as doctor : error - ", err);
            return err
        }
    }

    async signinDoctor(data) {
        try {
            const response = await this.client.post(this.baseUrl+'/auth/signin/doctor', data);
            return {status: response.status, data: response.data};
        }
        catch (err) {
            console.log("Error while doctor login : ", err);
            return err
        }
    }


    async checkGmailExists(gmail) {
        try {
            const response = await this.client.get(`${this.baseUrl}/mail/exists?${(new URLSearchParams({'gmail': gmail})).toString()}`);
            return response.data?.exists || false;
        }
        catch (err) {
            console.log("Error while checking gmail existance : Error -", err);
            throw err;
        }
    }

    async verifySession() {
        try {
            this.token = await AsyncStorageDriver.getItem("jwt");
            if (!this.token) {
                console.log("Warning : Verification request is not being send due to token : ", this.token)
                return {verified: false}
            }
            const response = await this.client.get(`${this.baseUrl}/auth/verify`);
            return response.data;
        }
        catch (err) {
            console.log("Error while token verification : ", err);
            return {verified: false, msg: err}
        }
    }

    async logout() {
        // No backend request just remove JWT
        this.token = null;
        await AsyncStorageDriver.removeItem("jwt");
        const presisting_token = await AsyncStorageDriver.getItem("jwt");
        return !presisting_token;
    }
}

const apiClient = new ApiClient();
export default apiClient;
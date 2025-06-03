import instance from "@/network/index";
import { handleToast } from "@/network/helper";

export const login = async (payload) => {
    try {
        const res = await instance.post("sso/doctor/login", payload);
        const [data, status] = res.data;

        if (status !== 200 || data.status === "failed") {
            throw new Error(data.message || "Login failed");
        }

        return data; // Contains doctor_id, token, etc.
    } catch (error) {
        throw error.response?.data || error.message || "Login failed";;
    }
};


export const registerDoctor = async (data) => {
    // Prepare payload matching your API body structure
    const payload = {
        full_name: data.name,
        email: data.email,
        mobile_number: data.mobile,
        country_code: "+91", // static or from input if you want
        ios_number: data.registrationNumber || "", // assuming this corresponds to registrationNumber field
        password: data.password,
    };

    try {
        const response = await instance.post(`sso/doctor/register`, payload);
        return response.data; // return the API response data
    } catch (error) {
        // throw error to be caught by caller
        throw error.response?.data || error.message || "Registration failed";
    }
};
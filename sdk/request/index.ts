import axios from "axios";
import { notification } from "antd";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

//
request.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["Version"] = "0.1.0";

  return config;
});
request.interceptors.response.use(
  (response) => {
    const data = response.data || {};
    if (data.code !== 0) {
      notification.error({
        message: "Server Error",
        description: data?.message || "Unknown Error",
      });
      throw new Error(data?.message || "Unknown Error");
      // return;
    }
    return data.data;
  },
  // stats != 200
  (error) => {
    console.log("errorerrorstats != 200");
    if (error?.message === "Network Error") {
      notification.error({
        message: "Network Error",
        description: "Please check your network connectivity !",
      });
      throw error("Please check your network connectivity !");
    } else {
      notification.error({
        message: "Server Error",
        description: error?.message || "Unknown Error",
      });
      throw error;
    }
  }
);
export default request;

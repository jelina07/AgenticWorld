import axios from "axios";
import { notification } from "antd";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

//请求拦截器，暂时用不到
request.interceptors.request.use((config) => config);

request.interceptors.response.use(
  (response) => {
    const data = response.data || {};
    if (data.code !== 0 && data.code !== 50005) {
      notification.error({
        message: "Server Error",
        description: data?.message || "Unknown Error",
      });
      throw new Error(data?.message || "Unknown Error");
      // return;
    } else if (data.code === 50005) {
      throw new Error(data?.message || "Unknown Error");
    }
    return data.data;
  },
  // stats != 200
  (error) => {
    console.log("errorerrorstats != 200");
    if (error?.message === "Network Error") {
      notification.error({
        message: "Network Error",
        description: "Please check your network connectivity!",
      });
      throw error("Please check your network connectivity!");
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

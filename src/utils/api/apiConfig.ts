import axiosInstance from "axios";
import { privateBaseUrl, privateApiKey } from "constants/privates";

const settings = {
  withCredentials: true,
  headers: {
    'API-KEY': privateApiKey
  }
};
export const axios = axiosInstance.create({
  baseURL: privateBaseUrl,
  ...settings
});

import axios from "axios";
import { authHeader } from "./authservice/auth-header";

export const anonymousHttpClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

const authenticatedHttpClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: authHeader(),
});

export default authenticatedHttpClient;

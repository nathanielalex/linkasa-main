import axios from "./axios";
import type { User } from "./thread";

export const registerUser = async (
  email: string,
  password: string,
  username: string
): Promise<string> => {
  const response = await axios.post("/auth/register", { email, password, username });
  return response.data.message;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await axios.post("/auth/login", { email, password });
  return response.data.message;
};

export const getMe = async (): Promise<User> => {
  const response = await axios.get<User>("/auth/me");
  return response.data;
};

export const logoutUser = async (): Promise<string> => {
  const response = await axios.post("/auth/logout");
  return response.data.message;
};
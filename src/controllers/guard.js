import { api } from "../services/utils";
import axios from "axios";

export const login = async (data) => {
  const { email, password } = data;
  return await axios.post(`${api.url}login`, { email, password });
};

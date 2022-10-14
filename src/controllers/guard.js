import { api } from "../services/utils";
import axios from "axios";

export const login = async (data) => {
  const { membership_no, password } = data;
  return await axios.post(`${api.url}login`, { membership_no, password });
};

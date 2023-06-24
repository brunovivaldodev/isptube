import axios from "axios";
import { io } from "socket.io-client";

const baseURL = "http://localhost:3333";

export const socket = io(baseURL, {
  autoConnect: false,
});

export const api = axios.create({
  baseURL,
});

export const nextApi = "http://localhost:3000";

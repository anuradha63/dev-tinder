import { io } from "socket.io-client";
import { API_BASE_URL_LOCAL } from "./constants";

export const createSocketConnection = () => {
  const socketUrl = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_LOCAL;
  return io(socketUrl);
};

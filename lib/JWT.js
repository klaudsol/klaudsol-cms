import jwt from "jsonwebtoken";
import UnauthorizedError from "@/components/errors/UnauthorizedError";

export const generateToken = ({ firstName, lastName }) => {
  // Let's reuse SECRET_COOKIE_PASSWORD instead of creating another one
  const token = jwt.sign(
    { firstName, lastName },
    process.env.SECRET_COOKIE_PASSWORD,
    { expiresIn: 10 }
  );

  return token;
};

export const verifyToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.SECRET_COOKIE_PASSWORD);

  return decodedToken;
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  const user = localStorage.getItem("token");
  if (!user) return null;

  return user;
};

export const clearToken = () => {
  localStorage.clear();
};

export const getAuthToken = () => {
  const token = getToken();

  return `Bearer ${token}`;
};

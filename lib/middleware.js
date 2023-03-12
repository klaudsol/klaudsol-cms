// We are not using NextJS's native middleware featuer
// because Amplify might not support it.
import multer from "multer";
import { decodeToken } from "@/lib/JWT";
import InvalidTokenError from "@/components/errors/InvalidTokenError";
import MissingHeaderError from "@/components/errors/MissingHeaderError";

export const parseFormData = async (req, res) => {
  if (req.method !== "POST") return;

  const storage = multer.memoryStorage();
  const multerSetup = multer({ storage });
  const upload = multerSetup.any();

  await new Promise((resolve, reject) => {
    upload(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });

  req.body = JSON.parse(JSON.stringify(req.body));
};

const tokenExtractor = async (req, res) => {
  const header = req.headers.authorization;

  if (!header) throw new MissingHeaderError();
  if (!header.startsWith("Bearer")) throw new InvalidTokenError();

  const token = header.substring(7);
  req.token = token;
};

const tokenDecoder = async (req, res) => {
  const token = req.token;

  console.log(token);

  decodeToken(token);
};

const checkToken = async (req, res) => {
  // Get requests should be public
  if (req.method === "GET") return;

  await tokenExtractor(req, res);
  await tokenDecoder(req, res);
};

export default async (req, res) => {
  await parseFormData(req, res);
  await checkToken(req, res);
};

// We are not using NextJS's native middleware featuer
// because Amplify might not support it.
import multer from "multer";

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

export default async (req, res) => {
  await parseFormData(req, res);
};

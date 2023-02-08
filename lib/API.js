import multer from "multer";

export const setCORSHeaders = ({ response, url }) => {
  if (url) response.setHeader("Access-Control-Allow-Origin", url);
};

export const parseFormData = async (req, res) => {
  const storage = multer.memoryStorage();
  const multerSetup = multer({ storage });
  const upload = multerSetup.any();

  await new Promise((resolve, reject) => {
    upload(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });

  return { req, res };
};

import AWS from "aws-sdk";
import { promisify } from "es6-promisify";
import crypto from "crypto";

const AWS_ACCESS_KEY_ID = process.env.AURORA_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AURORA_AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AURORA_AWS_REGION;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

// Should be put in another file since this can be used globally
const generateRandVals = async (size) => {
  const randomBytes = promisify(crypto.randomBytes);
  const rawBytes = await randomBytes(size);
  const randVal = rawBytes.toString("hex");

  return randVal;
};

const s3Config = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
};

export const initializeS3 = () => {
  const s3 = new AWS.S3(s3Config);

  return s3;
};

export const getS3Param = (file) => {
  return {
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
};

export const generateUniqueKey = async (key) => {
  const randVal = await generateRandVals(4);
  const formattedKey = `${randVal}_${key}`;

  return formattedKey;
};

export const formatS3Param = async (param) => {
  const uniqueKey = await generateUniqueKey(param.Key);
  const newParams = { ...param, Key: uniqueKey };

  return newParams;
};

export const generateEntries = (resFromS3, files, body) => {
  const newBody = { ...body };
  files.forEach((file, i) => (newBody[file.fieldname] = resFromS3[i].Key));

  return newBody;
};

export const uploadFileToBucket = async ({ Key, Body, ContentType }) => {
  const s3 = initializeS3();

  const params = {
    Bucket: AWS_S3_BUCKET,
    Key,
    Body,
    ContentType,
    ACL: "public-read",
  };

  const res = await s3.upload(params).promise();

  return res;
};

export const generateS3ParamsForDeletion = (keysRaw) => {
  const keys = keysRaw.map((key) => ({ Key: key }));
  const params = {
    Bucket: AWS_S3_BUCKET,
    Delete: {
      Objects: keys,
    },
  };

  return params;
};

export const deleteFilesFromBucket = async (keys) => {
  const s3 = initializeS3();
  const params = generateS3ParamsForDeletion(keys);

  const res = await s3.deleteObjects(params).promise();

  return res;
};

export const uploadFilesToBucket = async (files, body) => {
  const promise = await files.map(async (file) => {
    const paramsRaw = getS3Param(file);
    const params = await formatS3Param(paramsRaw);
    const resFromS3 = await uploadFileToBucket(params);

    return resFromS3;
  });
  const resFromS3 = await Promise.all(promise);
  const entries = await generateEntries(resFromS3, files, body);

  return entries;
};

export const updateFilesFromBucket = async (files, body, toDelete) => {
  await deleteFilesFromBucket(toDelete);
  const uploadedFiles = await uploadFilesToBucket(files, body);

  return uploadedFiles;
};

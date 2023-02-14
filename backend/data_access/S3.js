import AWS from "aws-sdk";
import { promisify } from "es6-promisify";
import crypto from "crypto";

const S3_ACCESS_KEY_ID =
  process.env.KS_S3_ACCESS_KEY_ID ??
  process.env.KS_AWS_ACCESS_KEY_ID ??
  process.env.AURORA_AWS_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY =
  process.env.KS_S3_SECRET_ACCESS_KEY ??
  process.env.KS_AWS_SECRET_ACCESS_KEY ??
  process.env.AURORA_AWS_SECRET_ACCESS_KEY;
//TODO: Deprecate AURORA_AWS_REGION on release V3.0.0
const REGION =
  process.env.KS_S3_REGION ??
  process.env.KS_AWS_REGION ??
  process.env.AURORA_AWS_REGION;
const S3_BUCKET = process.env.KS_S3_BUCKET;

// Should be put in another file since this can be used globally
const generateRandVals = async (size) => {
  const randomBytes = promisify(crypto.randomBytes);
  const rawBytes = await randomBytes(size);
  const randVal = rawBytes.toString("hex");

  return randVal;
};

const s3Config = {
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  region: REGION,
};

export const initializeS3 = () => {
  const s3 = new AWS.S3(s3Config);

  return s3;
};

export const getS3Param = (file) => {
  return {
    Bucket: S3_BUCKET,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
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

export const generateEntry = (resFromS3, file) => {
const newBody = { [file.fieldname]: resFromS3.key }
return newBody;
}

export const generateResource = (resFromS3, file) => {
  const newBody = { name: file.fieldname, key: resFromS3.key, type: file.mimetype }
  return newBody
}

export const uploadFileToBucket = async (param) => {
  const s3 = initializeS3();
  const res = await s3.upload(param).promise();

  return res;
};

export const generateS3KeyForDeletion = (key) => {
  return {
    Key: key,
  };
};

export const generateS3ParamsForDeletion = (keysRaw) => {
  const keys = keysRaw.map(generateS3KeyForDeletion);
  const params = {
    Bucket: S3_BUCKET,
    Delete: {
      Objects: keys,
    },
  };

  return params;
};

export const generateS3ParamForDeletion = (keyRaw) => {
  const { Key } = generateS3KeyForDeletion(keyRaw)
  const params = {
    Bucket: S3_BUCKET,
    Key 
  };

  return params;
};

export const deleteFilesFromBucket = async (params) => {
  const s3 = initializeS3();
  const res = await s3.deleteObjects(params).promise();

  return res;
};

export const deleteFileFromBucket = async (params) => {
  const s3 = initializeS3();
  const res = await s3.deleteObject(params).promise();

  return res;
};

export const addFileToBucket = async (file) => {
  const paramsRaw = getS3Param(file);
  const param = await formatS3Param(paramsRaw);
  const resFromS3 = await uploadFileToBucket(param);

  return resFromS3;
};

export const addFilesToBucket = async (files) => {
  const promise = await files.map(addFileToBucket);
  const resFromS3 = await Promise.all(promise);

  return resFromS3;
};

// This function should only do one thing, but it does two things:
// Getting the params for deletion, and updating the files
// Need to refactor this to separate the uploading of the file
// And getting the params for deletion
// We also need a function to update one file. This function updates
// multiple files
export const updateFilesFromBucket = async (file, body, toDelete) => {
  const paramsForDeletion = generateS3ParamsForDeletion(toDelete);
  await deleteFilesFromBucket(paramsForDeletion);
  const uploadedFile = await addFilesToBucket(file, body);
  
  return uploadedFile;
};



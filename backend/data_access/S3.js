import AWS from "aws-sdk";
import { generateRandVals } from "@klaudsol/commons/lib/Math";
import { slsFetch } from "@klaudsol/commons/lib/Client";

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
  process.env.AURORA_AWS_REGION ?? 'us-east-1';
const S3_BUCKET = process.env.KS_S3_BUCKET;

const s3Config = {
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  region: REGION,
  signatureVersion: "v4",
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

export const generatePresignedUrl = (file) => {
  const s3 = initializeS3();

  const params = {
    Bucket: S3_BUCKET,
    Key: file.key,
    Expires: 60,
    ContentType: file.type,
    ACL: "public-read",
  };

  const url = s3.getSignedUrl("putObject", params);

  return { url, originalName: file.originalName };
};

export const generatePresignedUrls = async (fileNames) => {
  const presignedUrls = fileNames.map(generatePresignedUrl);

  return presignedUrls;
};

export const uploadFileToUrl = async (file, url) => {
  const uploadParams = {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: file,
  };

  await slsFetch(url, uploadParams);
};

export const uploadFilesToUrl = async (files, urls) => {
  const promises = await urls.map(async (item) => {
    const file = files.find((file) => file.name === item.originalName);
    await uploadFileToUrl(file, item.url);
  });

  await Promise.all(promises);
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
  const newBody = { [file.fieldname]: resFromS3.key };
  return newBody;
};

export const generateResource = (resFromS3, file) => {
  const newBody = { key: file.fieldname, value: resFromS3.key };
  return newBody;
};

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
  const { Key } = generateS3KeyForDeletion(keyRaw);
  const params = {
    Bucket: S3_BUCKET,
    Key,
  };

  return params;
};

export const deleteObjectsFromBucket = async (params) => {
  const s3 = initializeS3();
  const res = await s3.deleteObjects(params).promise();

  return res;
};

export const deleteObjectFromBucket = async (params) => {
  const s3 = initializeS3();
  const res = await s3.deleteObject(params).promise();

  return res;
};

export const deleteFilesFromBucket = async (toDelete) => {
  const paramsForDeletion = generateS3ParamsForDeletion(toDelete);
  await deleteObjectsFromBucket(paramsForDeletion);
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
  if (toDelete?.length) {
    const paramsForDeletion = generateS3ParamsForDeletion(toDelete);
    await deleteObjectsFromBucket(paramsForDeletion);
  }
  const uploadedFile = await addFilesToBucket(file, body);

  return uploadedFile;
};

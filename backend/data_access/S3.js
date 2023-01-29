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

export const getS3Params = (files) => {
  const initialValue = [];
  const reducer = (acc, curr) => {
    const newParamsObj = getS3Param(curr);

    return [...acc, newParamsObj];
  };
  const listOfParams = files.reduce(reducer, initialValue);

  return listOfParams;
};

export const generateUniqueKey = async (key) => {
  const randVal = await generateRandVals(4);
  const keySplit = key.split(" ");
  const keyJoin = keySplit.join("_");
  const formattedKey = `${randVal}_${keyJoin}`;

  return formattedKey;
};

export const formatS3Param = async (param) => {
  const uniqueKey = await generateUniqueKey(param.Key);
  const newParams = { ...param, Key: uniqueKey };

  return newParams;
};

export const formatS3Params = async (params) => {
  const promises = params.map((param) => formatS3Param(param));
  const newParams = await Promise.all(promises);

  return newParams;
};

export const generateEntry = (resFromS3, file, body) => {
  const fileProperty = {
    [file.fieldname]: resFromS3.Location,
  };

  return { ...fileProperty, ...body };
};

export const generateEntries = (resFromS3, files, body) => {
  const initialValue = {};
  const reducer = (acc, curr, i) => {
    const fileProperty = generateEntry(resFromS3[i], curr, {});

    return { ...fileProperty, ...acc };
  };
  const filteredFiles = files.reduce(reducer, initialValue);
  const entries = { ...body, ...filteredFiles };

  return entries;
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

export const uploadFilesToBucket = async (files) => {
  const promises = files.map((file) => uploadFileToBucket(file));
  const res = await Promise.all(promises);

  return res;
};

export const addImagesToBucket = async (files, body) => {
  const paramsRaw = getS3Params(files);
  const params = await formatS3Params(paramsRaw);
  const resFromS3 = await uploadFilesToBucket(params);
  const entry = await generateEntries(resFromS3, files, body);

  return entry;
};

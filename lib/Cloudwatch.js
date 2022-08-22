
import AWS from "aws-sdk";
import {promisify} from 'es6-promisify';
import { slackSay } from '@/lib/SlackSay';

 
 
export async function cloudwatchLog(message) {  
  
  try {
  
    const accessKeyId = process.env.AURORA_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AURORA_AWS_SECRET_ACCESS_KEY;
    const region = process.env.CLOUDWATCH_AWS_DEFAULT_REGION;
    
    const config = {};
    
    if (region) config.region = region; 
    
    //if accessKeyId and secretAccessKey is not provided, rely on AWS roles
    //for the access.
    if (accessKeyId && secretAccessKey) {
     config.credentials = new AWS.Credentials({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey
     });
    }
   
    const cwl = new AWS.CloudWatchLogs(config);
    const timestamp = (new Date()).getTime();
    var logGroupName = process.env.CLOUDWATCH_AWS_LOG_GROUP_NAME;
    var logStreamName = process.env.CLOUDWATCH_AWS_LOG_STREAM_NAME;
    
    //convert error-first callbacks into functions that return Promises 
    cwl.describeLogStreams = promisify(cwl.describeLogStreams).bind(cwl);
    cwl.putLogEvents = promisify(cwl.putLogEvents).bind(cwl);
  
    let data = await cwl.describeLogStreams({logGroupName: logGroupName});
    let nextSequenceToken = data.logStreams[0].uploadSequenceToken; 
    await cwl.putLogEvents({
      logEvents: [ { message: message, timestamp: timestamp }],
      logGroupName: logGroupName, 
      logStreamName: logStreamName,
      sequenceToken: nextSequenceToken
    });
    
  } catch(error) {
    
    await slackSay(error.stack);  
    throw(error);
    
  }
}
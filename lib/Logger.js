import { slackSay } from '@/lib/SlackSay';
import {cloudwatchLog} from '@/lib/Cloudwatch'
import {discordSay} from '@/lib/Discord';
export async function log(message) {

  console.error(message);
  await slackSay(message);

    //Our cloudwatch logs implementation is a bit buggy at the moment.
  //Fallback to Slack when there is an exception
  
    try {
          await discordSay(message);
          await cloudwatchLog(message);
        } catch (error) {
    
        await slackSay(error.message);
          
        }
  
}
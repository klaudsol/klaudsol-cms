import { log } from '@/lib/Logger';
import { INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';
import { slackSay } from '@/lib/SlackSay';
import { defaultErrorHandler } from '@/lib/ErrorHandler';

export default async function handler(req, res) {
    
  try {
    
    const response = await fetch('https://zenquotes.io/api/random');
    const responseJson = await response.json();
    const {q: question, a: answer} = responseJson[0];
      
    const message = `${question} - ${answer}`;
    
    await log(message);
    
    res.status(200).json({response: message});
  
  } catch (error) {
    //fallback to Slack message if Logger fails.
    await slackSay(error.stack);    
    await defaultErrorHandler(error, req, res);
  }
}
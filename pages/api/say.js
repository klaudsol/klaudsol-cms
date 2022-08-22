import { slackSay } from '@/lib/SlackSay';
import { INTERNAL_SERVER_ERROR } from '@/lib/HttpStatuses';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
export default async function handler(req, res) {
    
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const responseJson = await response.json();
    const {q: question, a: answer} = responseJson[0];
      
    const message = `${question} - ${answer}`;
    
    const json = await slackSay(message);
    
    res.status(200).json({ response: message });
    
  } catch (error) {
    await slackSay(error.stack);  
    await defaultErrorHandler(error, req, res);
  }
}
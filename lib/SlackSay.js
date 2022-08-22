export async function slackSay(message) {
  const channel = process.env.SLACK_CHANNEL;
  const botToken = process.env.SLACK_BOT_TOKEN;
  const data = { channel, "text": message}; 
  const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${botToken}`
        },
      body: JSON.stringify(data) 
  });
  
  return await response.json();
}
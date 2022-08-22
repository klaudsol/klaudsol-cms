export async function discordSay(message) {

    const token = process.env.DISCORD_TOKEN;
    const params = {
      username: "SME Logger",
      avatar_url: "",
      content: message
    }
    
    fetch(token,{
      "method":"POST",
      "headers":{"content-type": "application/json"},
      "body":JSON.stringify(params)
     }); 
}
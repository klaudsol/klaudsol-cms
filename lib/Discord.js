export async function discordSay(message) {

    //TODO: Deprecate DISCORD_TOKEN in release v3.0.0
    const token = process.env.KS_DISCORD_WEBHOOK_URL ?? process.env.DISCORD_TOKEN;
    const params = {
      username: "SME Logger",
      avatar_url: "",
      content: message
    }
    
    if(token) {
      fetch(token,{
        "method":"POST",
        "headers":{"content-type": "application/json"},
        "body":JSON.stringify(params)
      }); 
    }
}

export const createAndInviteUserToSlack = async (slug: string, email: string): Promise<any> => {
  const channel = await fetch("https://slack.com/api/conversations.create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer ${import.meta.env.SLACK_TOKEN}`
    },
    body: JSON.stringify({
      name: slug,
      is_private: true
    })
  }).then((data) => data.json() as any)
  
  if(!channel.ok){
    console.log("channel", channel.error)
  }

  const admin = await fetch(`https://slack.com/api/conversations.invite?channel=${channel.channel.id}&emails=${encodeURIComponent(email)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer ${import.meta.env.SLACK_TOKEN}`,
    },
    body: JSON.stringify({
      channel: channel.channel.id,
      users: "U05V9NC2RJR"
    })
  }).then((data) => data.json() as any)

  if(!admin.ok){
    console.log("admin", admin.error)
  }

  const invites = await fetch(`https://slack.com/api/conversations.inviteShared?channel=${channel.channel.id}&emails=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer ${import.meta.env.SLACK_TOKEN}`,
    }
  }).then((data) => data.json() as any)

  if(!invites.ok){
    console.log("invites", invites.error)
  }

  return { channel, admin, invites }
}

export const sendChannelMessage = async (channel: string, message: string): Promise<any> => {
  return fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer ${import.meta.env.SLACK_TOKEN}`,
    },
    body: JSON.stringify({
      channel: channel,
      text: message
    })
  }).then((data) => data.json() as any)
}
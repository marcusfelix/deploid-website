
export const sendHTMLEmail = async (from: string, to: string, subject: string, html: string) => {
  return fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${import.meta.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "personalizations": [
        {
          "to": [
            {
              "email": to
            }
          ],
          "subject": subject
        }
      ],
      "content": [
        {
          "type": "text/html",
          "value": html
        }
      ],
      "from": {
        "email": from
      },
    })
  });
}

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

export const welcomeTemplate = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Deploid Studio</title>
    <style>
      body {
        font-family: sans-serif;
        font-size: 18px;
        color: #444
      }
      .email {
        max-width: 640px;
      }
      .logo {
        font-size: 72px;
        color: #999;
        margin: 0px -16px;
      }
    </style>
  </head>
  <body>
    <div class="email">
      <div class="logo">﹡</div>
      <p>Hello!</p>
      <p>Welcome to Deploid Studio. To start sharing with our team what you want to build, please, access your <a href="SLACK_URL">private Slack channel</a> (you will receive a Slack e-mail as well).</p>
      <p>You have absolute controll over your subscription at your <a href="PORTAL_URL">customer portal</a>. </p>
      <p>It's a honor to have you as customer and we expect to build great things together.</p>
      <p>Best regards,<br/> Deploid Team.</p>
    </div>
  </body>
</html>
`


export const genericTemplate = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Deploid Studio</title>
    <style>
      body {
        font-family: sans-serif;
        font-size: 18px;
        color: #444
      }
      .email {
        max-width: 640px;
      }
      .logo {
        font-size: 72px;
        color: #999;
        margin: 0px -16px;
      }
    </style>
  </head>
  <body>
    <div class="email">
      <div class="logo">﹡</div>
      HTML_TEXT
    </div>
  </body>
</html>
`


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
    </style>
  </head>
  <body>
    <div class="email">
      <img width="32" height="32" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTciIGhlaWdodD0iNTciIGZpbGw9IiNhMWExYWEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBvbHlnb24gZmlsbD0iI2ExYTFhYSIgcG9pbnRzPSI1MS43MywxMS4yOSAzMi4xNywyMi41OCAzMi4xNywwIDI1LjM0LDAgMjUuMzQsMjIuNTggNS43OCwxMS4yOSAyLjM3LDE3LjIxIDIxLjkzLDI4LjUgMi4zNywzOS43OSA1Ljc4LDQ1LjcxIAogIDI1LjM0LDM0LjQyIDI1LjM0LDU3IDMyLjE3LDU3IDMyLjE3LDM0LjQyIDUxLjczLDQ1LjcxIDU1LjE1LDM5Ljc5IDM1LjU5LDI4LjUgNTUuMTUsMTcuMjEgIi8+Cjwvc3ZnPg=="/>
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
    </style>
  </head>
  <body>
    <div class="email">
      <img width="32" height="32" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTciIGhlaWdodD0iNTciIGZpbGw9IiNhMWExYWEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBvbHlnb24gZmlsbD0iI2ExYTFhYSIgcG9pbnRzPSI1MS43MywxMS4yOSAzMi4xNywyMi41OCAzMi4xNywwIDI1LjM0LDAgMjUuMzQsMjIuNTggNS43OCwxMS4yOSAyLjM3LDE3LjIxIDIxLjkzLDI4LjUgMi4zNywzOS43OSA1Ljc4LDQ1LjcxIAogIDI1LjM0LDM0LjQyIDI1LjM0LDU3IDMyLjE3LDU3IDMyLjE3LDM0LjQyIDUxLjczLDQ1LjcxIDU1LjE1LDM5Ljc5IDM1LjU5LDI4LjUgNTUuMTUsMTcuMjEgIi8+Cjwvc3ZnPg=="/>
      HTML_TEXT
    </div>
  </body>
</html>
`

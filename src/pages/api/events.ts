
import Stripe from 'stripe'
import type { APIRoute } from 'astro';
import { createAndInviteUserToSlack, sendChannelMessage } from '../../includes/slack';
import { genericTemplate, sendHTMLEmail, welcomeTemplate } from '../../includes/email';
import { replaceNonAlphanumericWithHyphen } from '../../includes/utils';

const stripe = () => new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16'
})

const endpointSecret = () => import.meta.env.STRIPE_WEBHOOK_SECRET

export const POST: APIRoute = async function get({ params, request, locals }: any) {

  const buffers = [];
  for await (const chunk of request.body) {
    buffers.push(chunk);
  }

  let body: string = ''

  buffers.forEach((buffer) => {
    body += new TextDecoder().decode(buffer)
  })

  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    event = await stripe().webhooks.constructEventAsync(body, sig, endpointSecret())
    console.log(`Event Type: ${event.type}`)

  } catch (err: any) {
    console.log("Error Type: "+ err.type);
  }

  if (event === undefined) {
    console.log("Event is undefined")
  } else {
    const KV = locals.runtime.env.DEPLOID_SUBSCRIPTIONS as KVNamespace;
    const data = event.data.object as any;

    switch (event.type) {

      case "customer.subscription.created": {
        // Get Stripe customer
        const customer = await stripe().customers.retrieve(data.customer as string) as Stripe.Customer
        const email = customer.email
        if(email) {
          const random = Math.random().toString(36).substring(2, 8);
          const slug = (replaceNonAlphanumericWithHyphen(email?.split('@')[0]!) + "-" + random).toLowerCase()

          // Create Slack channel and invite user
          const invite = await createAndInviteUserToSlack(slug, email)
          const channel = invite.channel.channel.id
          
          // Send welcome messages
          const html = welcomeTemplate.replace("SLACK_URL", `https://deploidstudio.slack.com/messages/${channel}`).replace("PORTAL_URL", import.meta.env.CUSTOMER_PORTAL_URL);
          await sendHTMLEmail("noreply@deploid.studio", email, "Welcome to Deploid Studio", html)
          if(channel){
            await sendChannelMessage(channel, "Welcome to *Deploid Studio*! We're glad to have you here. If you have any questions, please let us know.")
            await sendChannelMessage(channel, "In this channel we will be expecting your tasks for our team. You can share ideas, files and links to get more elaborated feedback, all in a fast and asynchronous way.")
            // await sendChannelMessage(channel, "We have a no-call policy to keep a fast and asynchronous communication. If you need to talk to us in a multimedia way, like a screen cast or webcam recording, consider using Slack's audio/video clip feature. We will be happy to help you.")
            await sendChannelMessage(channel, `If you want to update your subscription, access your customer portal anytime at: ${import.meta.env.CUSTOMER_PORTAL_URL}`)

            // Save email and channel id to Cloudflare KV
            await KV.put(data.id as string, JSON.stringify({
              email: email,
              channel: channel
            }))
          }
        }
        

        break;
      }

      case "customer.subscription.trial_will_end": {

        // Fetch Slack channel id from Cloudflare KV
        const local = await KV.get(data.id).then((data) => JSON.parse(data ?? "null"))

        if(local) {
          // Send trial email
          const html = genericTemplate.replace("HTML_TEXT", `<p>Hello!</p><p>Your trial period is about to end. If you want to update your subscription, access your <a href="${import.meta.env.CUSTOMER_PORTAL_URL}">customer portal</a>.</p><p>Best regards,<br/> Deploid Team.</p>`)
          await sendHTMLEmail("noreply@deploid.studio", local.email, "Welcome to Deploid Studio", html)
          await sendChannelMessage(local.channel, `Hello! Your trial period is about to end. If you want to update your subscription, access your customer portal: ${import.meta.env.CUSTOMER_PORTAL_URL}`)
        } else {
          console.error(`No local data found for subscription ${data.id}`)
        }
      }

      case "customer.subscription.updated": {

        // Fetch Slack channel id from Cloudflare KV
        const local = await KV.get(data.id).then((data) => JSON.parse(data ?? "null"))
        
        if(local) {
          // Send Slack message
          sendChannelMessage(local.channel, `Your subscription status changed to: ${data.status} `)
        } else {
          console.error(`No local data found for subscription ${data.id}`)
        }
      }

      case "customer.subscription.deleted": {
          
          // Fetch Slack channel id from Cloudflare KV
          const local = await KV.get(data.id).then((data) => JSON.parse(data ?? "null"))
  
          if(local) {
            // Send Slack message
            sendChannelMessage(local.channel, `Your subscription was deleted.`)
          } else {
            console.error(`No local data found for subscription ${data.id}`)
          }
      }


      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new Response("", { status: 200 });
  }
  return new Response("", { status: 400 });
}

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
    const { DEPLOID_SUBSCRIPTIONS } = locals.runtime.env;

    switch (event.type) {
      case 'checkout.session.completed': {
        const data = event.data.object as Stripe.Checkout.Session;
        const random = Math.random().toString(36).substring(2, 8);
        const email = data.customer_details?.email
        const slug = replaceNonAlphanumericWithHyphen(email?.split('@')[0]!) + "-" + random

        if(email) {
          // Create Slack channel and invite user
          const invite = await createAndInviteUserToSlack(slug, email)

          // Save email and channel id to Cloudflare KV
          await DEPLOID_SUBSCRIPTIONS.put(data.subscription, JSON.stringify({
            email: data.customer_details?.email,
            channel: invite.channel.id
          }))
        }
      }

      case "customer.subscription.created": {
        const data = event.data.object as Stripe.Subscription

        // Fetch Slack channel id from Cloudflare KV
        const local = await DEPLOID_SUBSCRIPTIONS.get(data.id)
        
        if(local) {
          // Send welcome email
          const html = welcomeTemplate.replace("SLACK_URL", `https://deploidstudio.slack.com/archives/${local.channel}`).replace("PORTAL_URL", import.meta.env.CUSTOMER_PORTAL_URL);
          await sendHTMLEmail("noreply@deploid.studio", local.email, "Welcome to Deploid Studio", html)
        }

        break;
      }

      case "customer.subscription.trial_will_end": {
        const data = event.data.object as Stripe.Subscription

        // Fetch Slack channel id from Cloudflare KV
        const local = await DEPLOID_SUBSCRIPTIONS.get(data.id)

        if(local) {
          // Send trial email
          const html = genericTemplate.replace("HTML_TEXT", `<p>Hello!</p><p>Your trial period is about to end. If you want to update your subscription, access your <a href="${import.meta.env.CUSTOMER_PORTAL_URL}">customer portal</a>.</p><p>Best regards,<br/> Deploid Team.</p>`)
          await sendHTMLEmail("noreply@deploid.studio", local.email, "Welcome to Deploid Studio", html)
        }
      }

      case "customer.subscription.updated": {
        const data = event.data.object as Stripe.Subscription

        // Fetch Slack channel id from Cloudflare KV
        const local = await DEPLOID_SUBSCRIPTIONS.get(data.id)

        if(local) {
          // Send Slack message
          sendChannelMessage(local.channel, `Your subscription status changed to: ${data.status} `)
        }
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new Response("", { status: 200 });
  }
  return new Response("", { status: 400 });
}
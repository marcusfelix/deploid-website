
import Stripe from 'stripe'
import type { APIRoute } from 'astro';
import { createAndInviteUserToSlack } from '../../includes/slack';
import { sendHTMLEmail } from '../../includes/email';

const stripe = () => new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16'
})

const endpointSecret = () => import.meta.env.STRIPE_WEBHOOK_SECRET

export const POST: APIRoute = async function get({ params, request }: any) {

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

    const data = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
      case 'checkout.session.completed': {
        console.log("Session Completed", event);
        // Random string with 6 characters. 
        const random = Math.random().toString(36).substring(2, 8);
        const email = data.customer_details?.email
        const slug = (data.custom_fields.find((e) => e.key === "projectname")?.text?.value ?? email?.split('@')[0]) + "-" + random
        
        if(email) {
          await createAndInviteUserToSlack(slug, email)

          // Send welcome email
          await sendHTMLEmail("noreply@deploid.studio", email, "Get started with Deploid Studio", `<p>Hello!</p><p>You will receive another e-mail with the Slack invitation to your private channel. To manage your subscription, click here <a href="https://billing.stripe.com/p/login/test_cN2eV65300r0dFueUV">subscription portal</a>. </p>`)
        }

        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new Response("", { status: 200 });
  }
  return new Response("", { status: 400 });
}
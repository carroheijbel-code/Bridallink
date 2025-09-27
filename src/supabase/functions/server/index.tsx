import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Routes for invitation management
app.post('/make-server-5ea3da9c/invitations/send', async (c) => {
  try {
    const { guestIds, eventDetails, senderEmail } = await c.req.json();
    
    if (!guestIds || !Array.isArray(guestIds) || guestIds.length === 0) {
      return c.json({ error: 'Guest IDs are required' }, 400);
    }

    const results = [];
    
    for (const guestId of guestIds) {
      try {
        // Get guest data
        const guestData = await kv.get(`guest_${guestId}`);
        if (!guestData) {
          results.push({ guestId, status: 'error', message: 'Guest not found' });
          continue;
        }

        const guest = JSON.parse(guestData);
        
        if (!guest.email) {
          results.push({ guestId, status: 'error', message: 'No email address' });
          continue;
        }

        // Create RSVP token for guest
        const rsvpToken = crypto.randomUUID();
        
        // Store invitation data
        const invitationData = {
          guestId,
          guestName: guest.name,
          guestEmail: guest.email,
          token: rsvpToken,
          sentAt: new Date().toISOString(),
          status: 'sent',
          openedAt: null,
          respondedAt: null,
          eventDetails: eventDetails || {
            coupleName: 'Sarah & John',
            eventDate: '2024-06-15',
            venue: 'Rose Garden Chapel',
            time: '4:00 PM'
          }
        };
        
        await kv.set(`invitation_${guestId}`, JSON.stringify(invitationData));
        await kv.set(`rsvp_token_${rsvpToken}`, guestId);
        
        // Update guest invitation status
        const updatedGuest = { ...guest, invitationSent: true, invitationSentAt: new Date().toISOString() };
        await kv.set(`guest_${guestId}`, JSON.stringify(updatedGuest));
        
        // In a real implementation, you would send an actual email here
        // For this demo, we'll simulate the email sending
        console.log(`Sending invitation to ${guest.email} for guest ${guest.name}`);
        
        results.push({ 
          guestId, 
          status: 'sent', 
          email: guest.email,
          rsvpUrl: `${c.req.url.split('/functions')[0]}/rsvp/${rsvpToken}`
        });
        
      } catch (error) {
        console.error(`Error sending invitation to guest ${guestId}:`, error);
        results.push({ guestId, status: 'error', message: error.message });
      }
    }
    
    return c.json({ results });
    
  } catch (error) {
    console.error('Error in invitation sending:', error);
    return c.json({ error: 'Failed to send invitations' }, 500);
  }
});

// Route to get invitation status
app.get('/make-server-5ea3da9c/invitations/:guestId', async (c) => {
  try {
    const guestId = c.req.param('guestId');
    const invitationData = await kv.get(`invitation_${guestId}`);
    
    if (!invitationData) {
      return c.json({ error: 'Invitation not found' }, 404);
    }
    
    return c.json(JSON.parse(invitationData));
    
  } catch (error) {
    console.error('Error getting invitation status:', error);
    return c.json({ error: 'Failed to get invitation status' }, 500);
  }
});

// Route for RSVP response
app.post('/make-server-5ea3da9c/rsvp/:token', async (c) => {
  try {
    const token = c.req.param('token');
    const { response, message, attendeeCount, dietaryRestrictions } = await c.req.json();
    
    // Get guest ID from token
    const guestId = await kv.get(`rsvp_token_${token}`);
    if (!guestId) {
      return c.json({ error: 'Invalid RSVP token' }, 404);
    }
    
    // Get current guest data
    const guestData = await kv.get(`guest_${guestId}`);
    if (!guestData) {
      return c.json({ error: 'Guest not found' }, 404);
    }
    
    const guest = JSON.parse(guestData);
    
    // Update guest RSVP status
    const rsvpStatus = response === 'attending' ? 'confirmed' : 'declined';
    const updatedGuest = {
      ...guest,
      rsvpStatus,
      rsvpMessage: message || '',
      attendeeCount: attendeeCount || (response === 'attending' ? (guest.plusOne ? 2 : 1) : 0),
      dietaryRestrictions: dietaryRestrictions || guest.dietaryRestrictions || '',
      rsvpRespondedAt: new Date().toISOString()
    };
    
    await kv.set(`guest_${guestId}`, JSON.stringify(updatedGuest));
    
    // Update invitation status
    const invitationData = await kv.get(`invitation_${guestId}`);
    if (invitationData) {
      const invitation = JSON.parse(invitationData);
      invitation.respondedAt = new Date().toISOString();
      invitation.response = response;
      await kv.set(`invitation_${guestId}`, JSON.stringify(invitation));
    }
    
    return c.json({ 
      success: true, 
      message: 'RSVP response recorded',
      guestName: guest.name,
      response: rsvpStatus
    });
    
  } catch (error) {
    console.error('Error processing RSVP response:', error);
    return c.json({ error: 'Failed to process RSVP response' }, 500);
  }
});

// Route to get RSVP form data
app.get('/make-server-5ea3da9c/rsvp/:token', async (c) => {
  try {
    const token = c.req.param('token');
    
    // Get guest ID from token
    const guestId = await kv.get(`rsvp_token_${token}`);
    if (!guestId) {
      return c.json({ error: 'Invalid RSVP token' }, 404);
    }
    
    // Get guest and invitation data
    const guestData = await kv.get(`guest_${guestId}`);
    const invitationData = await kv.get(`invitation_${guestId}`);
    
    if (!guestData || !invitationData) {
      return c.json({ error: 'Guest or invitation not found' }, 404);
    }
    
    const guest = JSON.parse(guestData);
    const invitation = JSON.parse(invitationData);
    
    // Mark invitation as opened if not already
    if (!invitation.openedAt) {
      invitation.openedAt = new Date().toISOString();
      await kv.set(`invitation_${guestId}`, JSON.stringify(invitation));
    }
    
    return c.json({
      guest: {
        name: guest.name,
        email: guest.email,
        plusOne: guest.plusOne,
        rsvpStatus: guest.rsvpStatus,
        alreadyResponded: !!guest.rsvpRespondedAt
      },
      event: invitation.eventDetails
    });
    
  } catch (error) {
    console.error('Error getting RSVP data:', error);
    return c.json({ error: 'Failed to get RSVP data' }, 500);
  }
});

// Route to get all invitations status
app.get('/make-server-5ea3da9c/invitations', async (c) => {
  try {
    const allInvitations = await kv.getByPrefix('invitation_');
    const invitations = allInvitations.map(item => JSON.parse(item));
    
    return c.json({ invitations });
    
  } catch (error) {
    console.error('Error getting all invitations:', error);
    return c.json({ error: 'Failed to get invitations' }, 500);
  }
});

// Stripe payment routes for premium subscriptions
app.post('/make-server-5ea3da9c/create-payment-intent', async (c) => {
  try {
    console.log('Creating payment intent...');
    const { planType } = await c.req.json();
    
    if (!planType || (planType !== 'monthly' && planType !== 'yearly')) {
      console.error('Invalid plan type received:', planType);
      return c.json({ error: 'Invalid plan type. Must be "monthly" or "yearly".' }, 400);
    }

    // Check if Stripe secret key is available
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    console.log('Stripe secret key exists:', !!stripeSecretKey);
    
    // Check for valid Stripe key format (both test and live keys are acceptable)
    const hasValidStripeKey = stripeSecretKey && (
      stripeSecretKey.startsWith('sk_test_') || 
      stripeSecretKey.startsWith('sk_live_')
    );
    
    if (!hasValidStripeKey) {
      console.log('Stripe not configured properly, using demo mode');
      
      // Define pricing for demo mode
      const pricing = {
        monthly: {
          amount: 499, // £4.99 in pence
          currency: 'gbp'
        },
        yearly: {
          amount: 4999, // £49.99 in pence
          currency: 'gbp'
        }
      };

      const plan = pricing[planType];
      
      // Return demo payment intent for development/demo purposes
      const demoPaymentIntent = {
        client_secret: `pi_demo_${planType}_${Date.now()}_secret_demo`,
        amount: plan.amount,
        currency: plan.currency,
        planType,
        isDemoMode: true
      };
      
      console.log('Demo payment intent created:', demoPaymentIntent);
      
      return c.json({
        clientSecret: demoPaymentIntent.client_secret,
        amount: demoPaymentIntent.amount,
        currency: demoPaymentIntent.currency,
        planType: demoPaymentIntent.planType,
        isDemoMode: true,
        message: 'Demo mode: No real payment processing'
      });
    }

    // Define pricing
    const pricing = {
      monthly: {
        amount: 499, // £4.99 in pence
        currency: 'gbp',
        description: 'BridalLink Premium Monthly Subscription'
      },
      yearly: {
        amount: 4999, // £49.99 in pence
        currency: 'gbp', 
        description: 'BridalLink Premium Yearly Subscription'
      }
    };

    const plan = pricing[planType];
    console.log('Plan details:', plan);

    try {
      // Import Stripe dynamically
      console.log('Importing Stripe library...');
      const Stripe = await import('https://esm.sh/stripe@13.11.0');
      console.log('Stripe imported successfully');
      
      const stripe = new Stripe.default(stripeSecretKey, {
        apiVersion: '2023-10-16',
      });
      console.log('Stripe client initialized');

      // Create payment intent
      console.log('Creating Stripe payment intent...');
      const paymentIntent = await stripe.paymentIntents.create({
        amount: plan.amount,
        currency: plan.currency,
        description: plan.description,
        metadata: {
          planType,
          service: 'bridallink-premium'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      console.log('Payment intent created successfully:', paymentIntent.id);

      // Determine publishable key based on secret key type
      const publishableKey = stripeSecretKey.startsWith('sk_test_') 
        ? Deno.env.get('STRIPE_PUBLISHABLE_KEY_TEST') || 'pk_test_...'
        : Deno.env.get('STRIPE_PUBLISHABLE_KEY_LIVE') || 'pk_live_...';

      return c.json({
        clientSecret: paymentIntent.client_secret,
        amount: plan.amount,
        currency: plan.currency,
        planType,
        publishableKey: publishableKey,
        isDemoMode: false
      });

    } catch (stripeError) {
      console.error('Stripe-specific error:', stripeError);
      
      // Check if it's a Stripe API key error
      if (stripeError.message?.includes('Invalid API Key') || stripeError.message?.includes('No such api_key')) {
        return c.json({ 
          error: 'Invalid Stripe API key. Please check your Stripe configuration.',
          code: 'INVALID_STRIPE_KEY',
          details: stripeError.message
        }, 500);
      }
      
      // Check if it's a network/import error
      if (stripeError.message?.includes('fetch') || stripeError.message?.includes('network')) {
        return c.json({ 
          error: 'Unable to connect to payment service. Please try again later.',
          code: 'STRIPE_CONNECTION_ERROR',
          details: stripeError.message
        }, 500);
      }
      
      throw stripeError; // Re-throw other errors to be caught by outer catch
    }

  } catch (error) {
    console.error('General error creating payment intent:', error);
    return c.json({ 
      error: 'Failed to create payment intent', 
      details: error.message,
      code: 'PAYMENT_INTENT_ERROR'
    }, 500);
  }
});

// Confirm payment and activate subscription
app.post('/make-server-5ea3da9c/confirm-payment', async (c) => {
  try {
    const { paymentIntentId, userEmail, userName } = await c.req.json();
    
    if (!paymentIntentId) {
      return c.json({ error: 'Payment intent ID is required' }, 400);
    }

    let planType = 'monthly'; // Default
    let amount = 499; // Default monthly amount
    let currency = 'gbp';

    // Check if this is a demo payment or real Stripe payment
    const isDemoPayment = paymentIntentId.startsWith('pi_demo_');
    
    if (!isDemoPayment) {
      try {
        // Import Stripe dynamically for real payments
        const Stripe = await import('https://esm.sh/stripe@13.11.0');
        const stripe = new Stripe.default(Deno.env.get('STRIPE_SECRET_KEY'), {
          apiVersion: '2023-10-16',
        });

        // Retrieve the payment intent to verify it was successful
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status !== 'succeeded') {
          return c.json({ 
            error: 'Payment not completed', 
            status: paymentIntent.status 
          }, 400);
        }

        // Extract subscription details from metadata
        planType = paymentIntent.metadata.planType || 'monthly';
        amount = paymentIntent.amount;
        currency = paymentIntent.currency;
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
        return c.json({ 
          error: 'Failed to verify payment with Stripe', 
          details: stripeError.message 
        }, 500);
      }
    } else {
      // For demo payments, extract plan type from payment intent ID
      console.log('Processing demo payment:', paymentIntentId);
      if (paymentIntentId.includes('yearly')) {
        planType = 'yearly';
        amount = 4999; // £49.99 in pence
      } else {
        planType = 'monthly';
        amount = 499; // £4.99 in pence
      }
    }
    
    // Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (planType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (planType === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create subscription record
    const subscriptionId = crypto.randomUUID();
    const subscription = {
      id: subscriptionId,
      status: 'active',
      plan: planType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      amount: amount,
      currency: currency,
      paymentIntentId,
      userEmail: userEmail || 'unknown',
      userName: userName || 'Premium User',
      createdAt: new Date().toISOString(),
      stripePaymentId: paymentIntentId,
      isDemoPayment: isDemoPayment
    };

    // Store subscription in KV store
    await kv.set(`subscription_${subscriptionId}`, JSON.stringify(subscription));
    
    // Also store by payment intent ID for easy lookup
    await kv.set(`payment_${paymentIntentId}`, subscriptionId);

    console.log(`Subscription created: ${subscriptionId} for plan: ${planType}`);

    return c.json({
      success: true,
      subscription: {
        id: subscriptionId,
        status: 'active',
        plan: planType,
        startDate: subscription.startDate,
        endDate: subscription.endDate
      }
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    return c.json({ 
      error: 'Failed to confirm payment', 
      details: error.message 
    }, 500);
  }
});

// Get subscription status
app.get('/make-server-5ea3da9c/subscription/:subscriptionId', async (c) => {
  try {
    const subscriptionId = c.req.param('subscriptionId');
    const subscriptionData = await kv.get(`subscription_${subscriptionId}`);
    
    if (!subscriptionData) {
      return c.json({ error: 'Subscription not found' }, 404);
    }

    const subscription = JSON.parse(subscriptionData);
    
    // Check if subscription is still active
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const isActive = subscription.status === 'active' && now < endDate;
    
    // Update status if expired
    if (!isActive && subscription.status === 'active') {
      subscription.status = 'expired';
      await kv.set(`subscription_${subscriptionId}`, JSON.stringify(subscription));
    }

    return c.json({
      subscription: {
        id: subscription.id,
        status: isActive ? 'active' : subscription.status,
        plan: subscription.plan,
        startDate: subscription.startDate,
        endDate: subscription.endDate
      }
    });

  } catch (error) {
    console.error('Error getting subscription:', error);
    return c.json({ error: 'Failed to get subscription' }, 500);
  }
});

// Health check with payment service status
app.get('/make-server-5ea3da9c/health', (c) => {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  const hasValidStripeKey = !!(stripeSecretKey && (
    stripeSecretKey.startsWith('sk_test_') || 
    stripeSecretKey.startsWith('sk_live_')
  ));
  const keyType = stripeSecretKey?.startsWith('sk_live_') ? 'live' : 'test';
  
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      database: 'ok',
      stripe: hasValidStripeKey ? `configured_${keyType}` : 'demo_mode',
      server: 'running'
    },
    environment: {
      hasStripeKey: !!stripeSecretKey,
      stripeKeyValid: hasValidStripeKey,
      stripeKeyType: hasValidStripeKey ? keyType : null
    }
  });
});

// Payment service status endpoint
app.get('/make-server-5ea3da9c/payment-status', (c) => {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  const hasValidStripeKey = !!(stripeSecretKey && (
    stripeSecretKey.startsWith('sk_test_') || 
    stripeSecretKey.startsWith('sk_live_')
  ));
  const keyType = stripeSecretKey?.startsWith('sk_live_') ? 'live' : 'test';
  
  return c.json({
    paymentServiceStatus: hasValidStripeKey ? 'ready' : 'demo_mode',
    stripeConfigured: hasValidStripeKey,
    demoMode: !hasValidStripeKey,
    environment: hasValidStripeKey ? keyType : 'demo',
    message: hasValidStripeKey 
      ? `Payment processing is ready in ${keyType} mode` 
      : 'Running in demo mode - no real payments will be processed'
  });
});

Deno.serve(app.fetch);
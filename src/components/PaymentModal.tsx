import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: any;
  onSuccess: () => void;
}

function PaymentForm({ paymentData, onSuccess, onClose }: { paymentData: any; onSuccess: () => void; onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage('Card information is required');
      setIsProcessing(false);
      return;
    }

    // Check if we're in demo mode
    if (paymentData.isDemoMode) {
      // Demo mode - simulate payment
      console.log('Demo payment processing...');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a mock payment intent ID for demo
      const mockPaymentIntentId = `pi_demo_${paymentData.planType}_${Date.now()}`;

      console.log('Confirming demo payment...');

      try {
        // Confirm the payment on our server
        const confirmResponse = await fetch(`https://${paymentData.projectId}.supabase.co/functions/v1/make-server-5ea3da9c/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${paymentData.publicAnonKey}`,
          },
          body: JSON.stringify({ 
            paymentIntentId: mockPaymentIntentId,
            userEmail: 'premium.user@bridallink.com',
            userName: 'Premium User'
          }),
        });

        if (!confirmResponse.ok) {
          const confirmError = await confirmResponse.json().catch(() => ({ error: 'Payment confirmation failed' }));
          console.error('Payment confirmation error:', confirmError);
          throw new Error(confirmError.error || 'Failed to confirm payment. Please contact support.');
        }

        const { subscription } = await confirmResponse.json();
        console.log('Demo payment confirmed successfully');
        
        // Store subscription locally
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('premiumSubscription', JSON.stringify({
            ...subscription,
            price: paymentData.planType === 'monthly' ? 4.99 : 49.99
          }));
        }
        
        onSuccess();
        
        // Success message for demo
        if (typeof window !== 'undefined' && window.alert) {
          alert(`🎉 Demo Payment Successful! Welcome to BridalLink Premium!\n\n` +
                `Your ${paymentData.planType} subscription is now active.\n` +
                `✓ Access to expert wedding consultations\n` +
                `✓ Mallorca specialist Carolina\n` +
                `✓ Premium planning features\n\n` +
                `Note: This was a demo transaction - no real payment was processed.\n\n` +
                `Thank you for testing!`);
        }
      } catch (error) {
        console.error('Demo payment error:', error);
        setErrorMessage(error.message || 'Demo payment failed. Please try again.');
      }
    } else {
      // Real Stripe payment processing
      try {
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(paymentData.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Premium User',
              email: 'premium.user@bridallink.com',
            },
          },
        });

        if (stripeError) {
          console.error('Stripe payment error:', stripeError);
          setErrorMessage(stripeError.message || 'Payment failed. Please try again.');
          setIsProcessing(false);
          return;
        }

        if (paymentIntent.status !== 'succeeded') {
          setErrorMessage('Payment was not successful. Please try again.');
          setIsProcessing(false);
          return;
        }

        console.log('Real payment successful, confirming with server...');

        // Confirm the successful payment with our server
        const confirmResponse = await fetch(`https://${paymentData.projectId}.supabase.co/functions/v1/make-server-5ea3da9c/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${paymentData.publicAnonKey}`,
          },
          body: JSON.stringify({ 
            paymentIntentId: paymentIntent.id,
            userEmail: 'premium.user@bridallink.com',
            userName: 'Premium User'
          }),
        });

        if (!confirmResponse.ok) {
          const confirmError = await confirmResponse.json().catch(() => ({ error: 'Payment confirmation failed' }));
          console.error('Payment confirmation error:', confirmError);
          throw new Error(confirmError.error || 'Payment was processed but failed to activate subscription. Please contact support.');
        }

        const { subscription } = await confirmResponse.json();
        console.log('Real payment confirmed successfully');
        
        // Store subscription locally
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('premiumSubscription', JSON.stringify({
            ...subscription,
            price: paymentData.planType === 'monthly' ? 4.99 : 49.99
          }));
        }
        
        onSuccess();
        
        // Success message for real payment
        if (typeof window !== 'undefined' && window.alert) {
          alert(`🎉 Payment Successful! Welcome to BridalLink Premium!\n\n` +
                `Your ${paymentData.planType} subscription is now active.\n` +
                `✓ Access to expert wedding consultations\n` +
                `✓ Mallorca specialist Carolina\n` +
                `✓ Premium planning features\n\n` +
                `You will receive a confirmation email shortly.\n\n` +
                `Thank you for upgrading!`);
        }
      } catch (error) {
        console.error('Payment error:', error);
        setErrorMessage(error.message || 'Payment failed. Please try again.');
      }
    }

    setIsProcessing(false);
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-amber-800">
          {paymentData.isDemoMode ? 'Demo Payment' : 'Secure Payment'}
        </h3>
        <p className="text-gray-600">
          Amount: £{(paymentData.amount / 100).toFixed(2)} ({paymentData.planType} plan)
        </p>
        {paymentData.isDemoMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              🔧 Demo Mode: No real payment will be processed. This is for testing purposes only.
            </p>
          </div>
        )}
      </div>

      {!paymentData.isDemoMode && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-lg p-3">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isProcessing || (!paymentData.isDemoMode && !stripe)}
          className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {paymentData.isDemoMode ? 'Processing Demo...' : 'Processing Payment...'}
            </div>
          ) : (
            `Pay £${(paymentData.amount / 100).toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
}

export default function PaymentModal({ isOpen, onClose, paymentData, onSuccess }: PaymentModalProps) {
  const [stripePromise, setStripePromise] = useState<any>(null);

  useEffect(() => {
    if (paymentData && !paymentData.isDemoMode) {
      // Only load Stripe for real payments
      const publishableKey = paymentData.publishableKey || 'pk_test_demo';
      setStripePromise(loadStripe(publishableKey));
    }
  }, [paymentData]);

  if (!isOpen || !paymentData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {paymentData.isDemoMode ? (
          // Demo mode - no need for Stripe Elements
          <PaymentForm paymentData={paymentData} onSuccess={onSuccess} onClose={onClose} />
        ) : (
          // Real payment mode - use Stripe Elements
          stripePromise ? (
            <Elements stripe={stripePromise}>
              <PaymentForm paymentData={paymentData} onSuccess={onSuccess} onClose={onClose} />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading payment form...</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
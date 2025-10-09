import React, { useState } from 'react';
import PaymentModal from './PaymentModal';

interface PaymentIntegrationProps {
  onSuccess: () => void;
  planType?: 'monthly' | 'yearly' | 'both';
}

export default function PaymentIntegration({ onSuccess, planType = 'both' }: PaymentIntegrationProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgradeToPremium = async (planType: 'monthly' | 'yearly') => {
    try {
      setIsLoading(true);
      
      // Import Supabase info with error handling
      let projectId, publicAnonKey;
      try {
        const supabaseInfo = await import('../utils/supabase/info');
        projectId = supabaseInfo.projectId;
        publicAnonKey = supabaseInfo.publicAnonKey;
        
        if (!projectId || !publicAnonKey) {
          throw new Error('Supabase configuration is incomplete');
        }
      } catch (importError) {
        console.error('Failed to load Supabase configuration:', importError);
        throw new Error('Application configuration error. Please refresh and try again.');
      }

      console.log('Creating payment intent for plan:', planType);

      // Create payment intent on the server
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5ea3da9c/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ planType }),
      });

      console.log('Payment intent response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
        console.error('Payment intent error:', errorData);
        
        // Handle specific error codes
        if (errorData.code === 'STRIPE_NOT_CONFIGURED') {
          throw new Error('Payment service is not configured. Please contact support to set up payment processing.');
        } else if (errorData.code === 'INVALID_STRIPE_KEY') {
          throw new Error('Payment service configuration error. Please contact support.');
        } else if (errorData.code === 'STRIPE_CONNECTION_ERROR') {
          throw new Error('Unable to connect to payment service. Please check your internet connection and try again.');
        }
        
        throw new Error(errorData.error || `Server error (${response.status}). Please try again.`);
      }

      const paymentResponse = await response.json();
      console.log('Payment intent created:', paymentResponse);

      // Store payment data and show modal
      setPaymentData({ ...paymentResponse, planType, projectId, publicAnonKey });
      setShowPaymentModal(true);
      
    } catch (error) {
      console.error('Payment setup error:', error);
      
      // Enhanced error messages
      let userMessage = '❌ Payment Setup Failed\n\n';
      
      if (error.message.includes('configuration') || error.message.includes('contact support')) {
        userMessage += 'Payment Service Configuration:\n\n';
        userMessage += error.message + '\n\n';
        userMessage += 'Please contact our support team for assistance with payment processing.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        userMessage += 'Network Error: Unable to connect to the payment service.\n\n';
        userMessage += 'Please check your internet connection and try again.';
      } else {
        userMessage += error.message + '\n\n';
        userMessage += 'If this problem persists, please contact support.';
      }
      
      // Show error message
      if (typeof window !== 'undefined' && window.alert) {
        alert(userMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setPaymentData(null);
    onSuccess();
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setPaymentData(null);
  };

  return (
    <>
      {/* Monthly subscription button */}
      {(planType === 'monthly' || planType === 'both') && (
        <button 
          onClick={() => handleUpgradeToPremium('monthly')}
          disabled={isLoading}
          className="w-full py-3 px-6 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Setting up...' : 'Subscribe Monthly'}
        </button>
      )}

      {/* Yearly subscription button */}
      {(planType === 'yearly' || planType === 'both') && (
        <button 
          onClick={() => handleUpgradeToPremium('yearly')}
          disabled={isLoading}
          className="w-full py-3 px-6 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Setting up...' : 'Subscribe Yearly'}
        </button>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handlePaymentClose}
        paymentData={paymentData}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
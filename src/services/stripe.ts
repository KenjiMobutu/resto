import { supabase } from './supabase';

export const createPaymentIntent = async (
  amount: number,
  currency: string,
  restaurantId: string,
  orderId: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        restaurantId,
        orderId,
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { success: false, error };
  }
};

export const confirmPayment = async (paymentIntentId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('confirm-payment', {
      body: {
        paymentIntentId,
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return { success: false, error };
  }
};

export const createRefund = async (paymentIntentId: string, amount?: number) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-refund', {
      body: {
        paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating refund:', error);
    return { success: false, error };
  }
};

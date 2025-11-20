import { supabase } from './supabase';

interface SendSMSParams {
  to: string;
  message: string;
  restaurantId: string;
}

export const sendSMS = async ({ to, message, restaurantId }: SendSMSParams) => {
  try {
    // Call Supabase Edge Function to send SMS via Twilio
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        to,
        message,
        restaurantId,
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error };
  }
};

export const notifyWaitlistClient = async (
  clientPhone: string,
  restaurantName: string,
  estimatedWaitTime: number,
  restaurantId: string
) => {
  const message = `Bonjour! Votre table au ${restaurantName} sera prête dans environ ${estimatedWaitTime} minutes. Merci de vous présenter à l'accueil.`;

  return sendSMS({
    to: clientPhone,
    message,
    restaurantId,
  });
};

export const notifyReservationConfirmation = async (
  clientPhone: string,
  restaurantName: string,
  date: string,
  time: string,
  partySize: number,
  restaurantId: string
) => {
  const message = `Réservation confirmée au ${restaurantName} pour ${partySize} personne(s) le ${date} à ${time}. À bientôt!`;

  return sendSMS({
    to: clientPhone,
    message,
    restaurantId,
  });
};

export const notifyReservationReminder = async (
  clientPhone: string,
  restaurantName: string,
  time: string,
  restaurantId: string
) => {
  const message = `Rappel: Votre réservation au ${restaurantName} est prévue aujourd'hui à ${time}. À bientôt!`;

  return sendSMS({
    to: clientPhone,
    message,
    restaurantId,
  });
};

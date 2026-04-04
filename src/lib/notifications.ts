/**
 * FCM + Twilio + WhatsApp mock
 */

export async function sendPayoutNotification(params: {
  workerName: string;
  amount: number;
  phone?: string;
}): Promise<{ fcm: boolean; sms: boolean; whatsapp: boolean; text: string }> {
  const text = `₹${Math.round(params.amount)} credited. Stay safe, ${params.workerName.split(" ")[0]} 🛡️`;
  return {
    fcm: true,
    sms: !!process.env.TWILIO_ACCOUNT_SID,
    whatsapp: false,
    text,
  };
}

// Simple email service placeholder
const EMAIL_SERVER_URL = process.env.REACT_APP_EMAIL_SERVER_URL || 'http://localhost:3001';

// Placeholder functions - no actual email functionality
export const validateEmailConfiguration = async () => {
  console.log('📧 Email functionality disabled');
  return { 
    isValid: false, 
    config: {
      serverUrl: EMAIL_SERVER_URL,
      serverAvailable: false
    } 
  };
};

export const sendRentalApprovalEmail = async (rentalProperty, adminNotes = '') => {
  console.log('📧 Email functionality disabled - Rental approval would be sent to:', rentalProperty.agentEmail);
  return { success: false, error: 'Email functionality disabled' };
};

export const sendRentalRejectionEmail = async (rentalProperty, adminNotes = '') => {
  console.log('📧 Email functionality disabled - Rental rejection would be sent to:', rentalProperty.agentEmail);
  return { success: false, error: 'Email functionality disabled' };
};

export const sendNewRentalNotificationEmail = async (rentalProperty) => {
  console.log('📧 Email functionality disabled - New rental notification would be sent');
  return { success: false, error: 'Email functionality disabled' };
};

export const sendBookingRequestEmail = async (bookingDetails) => {
  console.log('📧 Email functionality disabled - Booking request would be sent to:', bookingDetails.agentEmail);
  return { success: false, error: 'Email functionality disabled' };
};

export const sendContactFormEmail = async (contactData) => {
  console.log('📧 Email functionality disabled - Contact form would be sent');
  return { success: false, error: 'Email functionality disabled' };
};

export const sendTestEmail = async (testEmail = 'test@example.com') => {
  console.log('📧 Email functionality disabled - Test email would be sent to:', testEmail);
  return { success: false, error: 'Email functionality disabled' };
};

export const initializeEmailJS = () => {
  console.log('📧 Email functionality disabled');
};

const emailService = {
  initializeEmailJS,
  sendRentalApprovalEmail,
  sendRentalRejectionEmail,
  sendNewRentalNotificationEmail,
  sendBookingRequestEmail,
  sendContactFormEmail,
  validateEmailConfiguration,
  sendTestEmail
};

export default emailService;
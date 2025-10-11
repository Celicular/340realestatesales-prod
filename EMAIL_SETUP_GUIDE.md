# Email Service Setup for 340 Real Estate

This project now includes email functionality for booking request notifications using EmailJS.

## Current Status

🟨 **Demo Mode Active** - Email functionality is configured but using demo credentials. Booking notifications will be logged to the console until real EmailJS credentials are configured.

## Features

✅ **Booking Notifications** - Agents receive emails when new booking requests are submitted  
✅ **Guest Confirmations** - Guests receive confirmation emails for their booking requests  
✅ **Status Updates** - Automated emails when booking status changes (approved/rejected)  
✅ **Admin Configuration Panel** - Built-in admin interface to manage email settings  
✅ **Demo Mode** - Safe testing environment with console logging  

## Setup Instructions

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Create a new email service (Gmail, Outlook, etc.)

### 2. Create Email Templates
Create three templates in your EmailJS dashboard:

#### Template 1: Booking Notification (ID: `template_booking`)
For notifying agents about new booking requests.

**Subject:** `🏡 New Booking Request - {{property_name}}`

**Template:**
```html
Hello {{agent_name}},

You have received a new booking request for your property!

🏡 Property Details:
- Name: {{property_name}}
- Address: {{property_address}}
- Property ID: {{property_id}}

👤 Guest Information:
- Name: {{guest_name}}
- Email: {{guest_email}}
- Phone: {{guest_phone}}

📅 Booking Details:
- Check-in: {{check_in_date}}
- Check-out: {{check_out_date}}
- Guests: {{number_of_guests}}
- Duration: {{total_nights}} nights

💰 Pricing:
- Base Rate: {{base_rate}}
- Cleaning Fee: {{cleaning_fee}}
- Service Fee: {{service_fee}}
- Taxes: {{taxes}}
- Total: {{total_amount}}

💬 Special Requests:
{{special_requests}}

📋 Booking Details:
- Booking ID: {{booking_id}}
- Submitted: {{booking_date}}

👆 Action Required:
Please review and respond to this booking request within 24 hours.
View in Admin Dashboard: {{approval_link}}

Best regards,
{{company_name}} Team
{{company_phone}}
{{company_website}}
```

#### Template 2: Guest Confirmation (ID: `template_guest_confirmation`)
For confirming booking submissions to guests.

**Subject:** `✅ Booking Request Received - {{property_name}}`

**Template:**
```html
Dear {{guest_name}},

Thank you for your booking request! We have received your inquiry and are excited to help you plan your stay.

🏡 Property: {{property_name}}
📍 Location: {{property_address}}

📅 Your Requested Dates:
- Check-in: {{check_in_date}}
- Check-out: {{check_out_date}}
- Guests: {{number_of_guests}}
- Duration: {{total_nights}} nights

💰 Estimated Total: {{total_amount}}

📋 Reference: {{booking_id}}
📅 Submitted: {{booking_date}}

⏱️ What's Next:
The property owner will review your request and respond within 24 hours. You will receive an email confirmation once your booking is approved.

💳 Payment Terms:
- 50% deposit required within 7-9 days to secure reservation
- Balance due 60 days prior to arrival
- Trip cancellation insurance is strongly recommended

❓ Questions?
Contact us at {{support_email}} or {{company_phone}}

Best regards,
{{company_name}} Team
{{company_website}}
```

#### Template 3: Status Update (ID: `template_status_update`)
For booking approval/rejection notifications.

**Subject:** `{{booking_status}} - {{property_name}}`

**Template:**
```html
Dear {{guest_name}},

{{status_message}}

🏡 Property: {{property_name}}
📅 Dates: {{check_in_date}} to {{check_out_date}}

📝 Notes:
{{admin_notes}}

🚀 Next Steps:
{{next_steps}}

If you have any questions, please contact us at {{support_email}} or {{company_phone}}.

Best regards,
{{company_name}} Team
```

### 3. Configure Credentials

1. Get your EmailJS credentials:
   - Service ID (from your email service)
   - Template IDs (from your templates)
   - Public Key (from your account settings)

2. Update `src/services/emailService.js`:

```javascript
// Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'your_service_id_here';
const EMAILJS_TEMPLATE_ID_BOOKING = 'template_booking';
const EMAILJS_TEMPLATE_ID_CONFIRMATION = 'template_guest_confirmation';
const EMAILJS_TEMPLATE_ID_STATUS = 'template_status_update';
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';
```

### 4. Test the Configuration

1. Access the admin dashboard: `/admin`
2. Go to "Email Settings" tab
3. Use the test email functionality
4. Submit a booking request to test end-to-end flow

## Demo Configuration

The system currently uses these demo settings:
- Service ID: `service_demo123`
- Agent Email: `agent.demo@340realestate.com`
- Demo Mode: All emails are logged to console instead of being sent

## How It Works

### Booking Request Flow

1. **Guest submits booking request** → Form validation and Firebase storage
2. **Agent notification sent** → Email to property agent with booking details
3. **Guest confirmation sent** → Confirmation email to guest
4. **Admin can manage** → View/approve/reject in admin dashboard
5. **Status update sent** → Email to guest when status changes

### Email Integration Points

- ✅ `BookingRequestForm.jsx` - Sends emails when booking submitted
- ✅ `RentalDetail.jsx` - Sends emails for inline booking form  
- ✅ `AdminDashboard.jsx` - Email configuration management
- ✅ `EmailConfiguration.jsx` - Admin interface for email settings

## Troubleshooting

### Email Not Sending
1. Check browser console for errors
2. Verify EmailJS credentials are correct
3. Ensure templates exist with correct IDs
4. Check EmailJS dashboard for sending logs

### Demo Mode Active
- Update credentials in `emailService.js`
- Verify `isEmailServiceConfigured()` returns true
- Check admin panel "Email Settings" for status

### Template Errors
- Ensure all template variables are included
- Check template IDs match configuration
- Verify template is published in EmailJS dashboard

## Security Notes

- EmailJS public key is safe to expose in frontend code
- Private key should never be used in frontend applications
- Rate limiting is handled by EmailJS service
- Sensitive data is not stored in email templates

## Support

For technical support with EmailJS setup:
1. Visit [EmailJS Documentation](https://www.emailjs.com/docs/)
2. Check the admin panel "Email Settings" for configuration status
3. Review browser console logs for detailed error messages

---

**Ready to go live?** Simply update the credentials in `emailService.js` and your booking notification system will be fully operational! 🚀
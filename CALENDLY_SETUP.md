# Calendly Booking System Setup

This photography portfolio now uses Calendly for a simplified booking experience. Follow these steps to complete the setup:

## 1. Create a Calendly Account

1. Go to [Calendly.com](https://calendly.com) and sign up for an account
2. Choose a plan that fits your needs (free plan works for basic usage)
3. Set up your profile with your photography business information

## 2. Configure Your Event Types

Create event types for your different photography services:

- **Portrait Session** (e.g., 30-60 minutes)
- **Wedding Photography Consultation** (e.g., 45 minutes)
- **Event Coverage Discussion** (e.g., 30 minutes)
- **Custom Session Planning** (e.g., 60 minutes)

For each event type:
- Set appropriate duration
- Add location details (studio address, "on location", or "virtual")
- Include pricing information in the description
- Set your availability preferences
- Add intake questions to gather client requirements

## 3. Get Your Calendly URL

1. In your Calendly dashboard, find your scheduling URL
2. It will look like: `https://calendly.com/your-username`
3. Copy this URL

## 4. Update the Website

1. Open `client/src/pages/BookingPage.jsx`
2. Find this line:
   ```jsx
   data-url="https://calendly.com/your-calendly-username"
   ```
3. Replace `your-calendly-username` with your actual Calendly username

## 5. Customize Calendly Appearance (Optional)

You can customize your Calendly widget to match your website's branding:

1. In Calendly, go to Account Settings → Appearance
2. Upload your logo
3. Set brand colors that match your website
4. Customize the booking page layout

## 6. Set Up Notifications

Configure email notifications for new bookings:

1. Go to Account Settings → Notifications
2. Set up confirmations and reminders for both you and your clients
3. Consider setting up calendar integrations (Google Calendar, Outlook, etc.)

## 7. Advanced Features (Pro Plans)

If you upgrade to a paid plan, you can access:

- Custom intake forms for detailed client requirements
- Payment collection during booking
- Automated workflow triggers
- Advanced scheduling rules
- Multiple team member scheduling

## Benefits of This Setup

✅ **Simplified booking process** - Clients can see real-time availability  
✅ **Automatic confirmations** - No manual email exchanges needed  
✅ **Calendar integration** - Syncs with your existing calendar  
✅ **Mobile-friendly** - Works perfectly on all devices  
✅ **Professional appearance** - Builds trust with potential clients  
✅ **Time zone handling** - Automatically handles different time zones  
✅ **Reduced no-shows** - Automated reminders sent to clients  

## Support

For Calendly-specific questions, visit the [Calendly Help Center](https://help.calendly.com/) or contact their support team.

For website-related issues, check the main README.md file for development setup instructions. 
export default () => ({
  VERIFY_TOKEN: process.env.VERIFY_TOKEN,
  PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN,
  FB_MESSAGE_URL: 'https://graph.facebook.com/v2.6/me/messages',
  GOOGLE_MAP_TOKEN: process.env.GOOGL_MAP_TOKEN,
  GOOGLE_MAP_STATIC_URL: 'https://maps.googleapis.com/maps/api/staticmap',
  GOOGLE_MAP_GEOCODING_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
});

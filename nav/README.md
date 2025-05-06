# Navigation Component

This folder contains the necessary files for implementing the responsive navigation bar with notification and profile dropdowns across all pages of the Daily Tools website.

## Files

- `style.css` - Contains all styles for the navigation bar
- `script.js` - Contains all functionality including theme toggle, mobile menu, notifications, and user profile management
- `nav-template.html` - HTML template for the navigation that can be copied into new pages

## Including in Your Pages

To include the navigation in your pages, follow these steps:

1. Add the CSS file in the `<head>` section:
   ```html
   <link rel="stylesheet" href="/nav/style.css">
   ```

2. Add the navigation HTML. You can either:
   - Copy the content from `nav-template.html` into your page
   - Include it via a server-side include if your setup supports it

3. Add the JavaScript file before the closing `</body>` tag:
   ```html
   <script src="/nav/script.js"></script>
   ```

## Features

### Responsive Layout
- Adapts to different screen sizes
- Mobile dropdown menu for small screens

### Theme Toggle
- Light/dark mode switch
- Saves preference in both localStorage and cookies for cross-browser consistency

### Notifications System
- Dropdown notifications panel
- Mark as read functionality
- Badge showing unread count
- Remembers read status using cookies

### User Profile
- Displays appropriate UI based on login state
- When logged out: Displays login options
- When logged in: Displays user info and menu
- Maintains login state using cookies

## Testing Login Functionality

For testing purposes, you can simulate a login by running this in the browser console:
```javascript
simulateLogin('Your Name', 'your.email@example.com');
```

## Customizing Active Links

The script automatically highlights the current page in the navigation based on URL matching. No additional configuration is needed. 
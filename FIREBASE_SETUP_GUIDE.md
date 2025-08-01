# Firebase Authentication Setup Guide for MarrowAI

This guide will walk you through setting up Firebase Authentication for your MarrowAI project.

## Prerequisites

- A Google account
- Node.js and npm installed
- Your MarrowAI project cloned and dependencies installed

## Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create a new project**
   - Click "Create a project" or "Add project"
   - Enter project name: `marrow-ai` (or your preferred name)
   - Choose whether to enable Google Analytics (recommended)
   - Click "Create project"

## Step 2: Enable Authentication

1. **Navigate to Authentication**
   - In the Firebase console, select your project
   - In the left sidebar, click "Authentication"
   - Click "Get started"

2. **Set up Sign-in methods**
   - Go to the "Sign-in method" tab
   - Enable the following providers:
     - **Email/Password**: Click, toggle "Enable", then "Save"
     - **Google**: Click, toggle "Enable", select your support email, then "Save"

3. **Configure authorized domains (for production)**
   - In the "Sign-in method" tab, scroll to "Authorized domains"
   - Add your production domain when ready to deploy

## Step 3: Register Your Web App

1. **Add a web app to your project**
   - In the project overview, click the web icon `</>`
   - Register app with nickname: `marrow-ai-web`
   - Check "Set up Firebase Hosting" if you plan to use it
   - Click "Register app"

2. **Save your configuration**
   - Copy the Firebase configuration object that appears
   - You'll need these values for your environment variables

## Step 4: Configure Your Project

1. **Create environment file**
   - In your project root, create a file named `.env.local`
   - Copy the template from `firebase-env-template.txt`
   - Replace placeholder values with your Firebase config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=1:your_sender_id:web:your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-your_measurement_id
```

2. **Where to find each value:**
   - **API Key**: `apiKey` from Firebase config
   - **Auth Domain**: `authDomain` from Firebase config
   - **Project ID**: `projectId` from Firebase config
   - **Storage Bucket**: `storageBucket` from Firebase config
   - **Messaging Sender ID**: `messagingSenderId` from Firebase config
   - **App ID**: `appId` from Firebase config
   - **Measurement ID**: `measurementId` from Firebase config (if Analytics enabled)

## Step 5: Test Your Setup

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test authentication**
   - Open [http://localhost:3000](http://localhost:3000)
   - You should see the beautiful login page with the animated character
   - Try creating an account with email/password
   - Try signing in with Google
   - Test the logout functionality

## Step 6: Configure Firestore (Optional but Recommended)

1. **Enable Firestore Database**
   - In Firebase console, go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" for development
   - Select a location close to your users
   - Click "Done"

2. **Set up security rules (for production)**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Medical reports associated with authenticated users
       match /reports/{reportId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

## Step 7: Production Deployment

1. **Update authorized domains**
   - In Authentication > Sign-in method > Authorized domains
   - Add your production domain (e.g., `marrow-ai.com`)

2. **Set production environment variables**
   - Use the same Firebase project or create a separate production project
   - Update your hosting provider's environment variables

## Troubleshooting

### Common Issues:

1. **"Firebase config is missing"**
   - Ensure your `.env.local` file is in the project root
   - Verify all environment variables are prefixed with `NEXT_PUBLIC_`
   - Restart your development server after adding environment variables

2. **"This domain is not authorized"**
   - Add `localhost:3000` to authorized domains for development
   - For production, add your actual domain

3. **Google Sign-in not working**
   - Ensure Google provider is enabled in Firebase console
   - Check that your domain is authorized
   - Verify the Google client configuration

4. **Users can't sign up**
   - Check that email/password provider is enabled
   - Verify your password requirements in Firebase console

### Security Best Practices:

- Never commit your `.env.local` file to version control
- Use different Firebase projects for development and production
- Regularly review and update Firestore security rules
- Enable multi-factor authentication for admin accounts
- Monitor authentication logs in Firebase console

## Features Implemented

✅ **Email/Password Authentication**
- Account creation with display name
- Secure login with validation
- Password visibility toggle
- Form validation with error messages

✅ **Google OAuth Authentication**
- One-click Google sign-in
- Automatic profile integration

✅ **Beautiful UI/UX**
- Responsive animated character that follows mouse
- Smooth transitions and animations
- Professional medical theme
- Glass-morphism design elements

✅ **User Management**
- Display user info in navbar
- Secure logout functionality
- Authentication state management
- Loading states and error handling

✅ **Security**
- Protected routes
- Automatic redirect handling
- Toast notifications for user feedback
- Proper error handling

## Next Steps

1. **Add user profile management**
2. **Implement password reset functionality**
3. **Add email verification**
4. **Set up user roles and permissions**
5. **Integrate with medical data storage**

Your MarrowAI authentication system is now ready! Users will see the beautiful login page first, and after authentication, they'll have access to the full medical dashboard. 
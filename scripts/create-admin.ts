/**
 * Script to create an admin user for LNL Fitness
 *
 * Run with: npx ts-node scripts/create-admin.ts
 *
 * BEFORE RUNNING:
 * 1. Go to Firebase Console: https://console.firebase.google.com/project/lnl-fitness/authentication
 * 2. Click "Get started" if prompted
 * 3. Enable "Email/Password" sign-in method
 */

import * as admin from 'firebase-admin'

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@lnlfitness.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123!'

async function createAdminUser() {
  try {
    // Check if user already exists
    try {
      const existingUser = await admin.auth().getUserByEmail(ADMIN_EMAIL)
      console.log('Admin user already exists:', existingUser.uid)

      // Set admin custom claim
      await admin.auth().setCustomUserClaims(existingUser.uid, { admin: true })
      console.log('Admin claim set successfully')

      // Save to Firestore
      await admin.firestore().collection('adminUsers').doc(existingUser.uid).set({
        email: ADMIN_EMAIL,
        name: 'Coach Jay',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true })
      console.log('Admin user saved to Firestore')
      return
    } catch (e: any) {
      if (e.code !== 'auth/user-not-found') {
        throw e
      }
    }

    // Create new admin user
    const user = await admin.auth().createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: 'Coach Jay',
    })
    console.log('Admin user created:', user.uid)

    // Set admin custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true })
    console.log('Admin claim set successfully')

    // Save to Firestore
    await admin.firestore().collection('adminUsers').doc(user.uid).set({
      email: ADMIN_EMAIL,
      name: 'Coach Jay',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    console.log('Admin user saved to Firestore')

    console.log('\n===========================================')
    console.log('Admin user created successfully!')
    console.log(`Email: ${ADMIN_EMAIL}`)
    console.log(`Password: ${ADMIN_PASSWORD}`)
    console.log('\nIMPORTANT: Change this password after first login!')
    console.log('===========================================\n')
  } catch (error: any) {
    console.error('Error creating admin user:', error.message)
    if (error.code === 'auth/configuration-not-found') {
      console.log('\n===========================================')
      console.log('Firebase Auth is not enabled!')
      console.log('')
      console.log('Please enable it in the Firebase Console:')
      console.log('https://console.firebase.google.com/project/lnl-fitness/authentication')
      console.log('')
      console.log('1. Click "Get started"')
      console.log('2. Select "Email/Password" provider')
      console.log('3. Enable it and save')
      console.log('4. Run this script again')
      console.log('===========================================\n')
    }
    process.exit(1)
  }
}

createAdminUser()

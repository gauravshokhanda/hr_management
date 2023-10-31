// import { FIREBASE_URL } from "./config";
// import { initializeApp } from "firebase/app";
// import { getToken, getMessaging, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: FIREBASE_URL,
//   authDomain: "hr-management-463f3.firebaseapp.com",
//   projectId: "hr-management-463f3",
//   storageBucket: "hr-management-463f3.appspot.com",
//   messagingSenderId: "741556841345",
//   appId: "1:741556841345:web:aa4ccb3d74660e8064d680",
//   measurementId: "G-5B680FVDD8",
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const messaging = getMessaging(firebaseApp);

// export const getOrRegisterServiceWorker = () => {
//   if ("serviceWorker" in navigator) {
//     return window.navigator.serviceWorker
//       .getRegistration("/firebase-push-notification-scope")
//       .then((serviceWorker) => {
//         if (serviceWorker) return serviceWorker;
//         return window.navigator.serviceWorker.register("/firebase-messaging-sw.js", {
//           scope: "/firebase-push-notification-scope",
//         });
//       });
//   }
//   throw new Error("The browser doesn`t support service worker.");
// };

// export const getFirebaseToken = () =>
//   getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
//     getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY, serviceWorkerRegistration })
//   );

// export const onForegroundMessage = () =>
//   new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));
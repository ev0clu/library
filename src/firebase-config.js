const firebaseConfig = {
    apiKey: 'AIzaSyB__vD-ivkYYtu43RZSbpY9wZ1YKuINubY',
    authDomain: 'library-d5b5e.firebaseapp.com',
    projectId: 'library-d5b5e',
    storageBucket: 'library-d5b5e.appspot.com',
    messagingSenderId: '842227728727',
    appId: '1:842227728727:web:54458332d40edf3182fe12'
};

export default function getFirebaseConfig() {
    if (!firebaseConfig || !firebaseConfig.apiKey) {
        throw new Error(
            'No Firebase configuration object provided.' +
                '\n' +
                "Add your web app's configuration object to firebase-config.js"
        );
    } else {
        return firebaseConfig;
    }
}

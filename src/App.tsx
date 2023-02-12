import React from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth, signInWithPopup } from 'firebase/auth';

import { Query } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAzD287l6JGtJ5Kjlo_H6nL0SZjFQQyS6M',
  authDomain: 'chatapp-d8ad3.firebaseapp.com',
  projectId: 'chatapp-d8ad3',
  storageBucket: 'chatapp-d8ad3.appspot.com',
  messagingSenderId: '28905240343',
  appId: '1:28905240343:web:7e452b122dec1f1c876952',
};
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
// const auth = firebase.auth();
const auth = getAuth(app);
const firestore = firebase.firestore();
// const analytics = firebase.analytics();
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className='App'>
      <h1>
        <SignOut />
      </h1>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google </button>;
}
function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const messagesRef = firestore.collectionGroup('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  
  const [messages] = useCollectionData(query, { idField: 'id' });
  
  
  return (
  <div>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>
  </div>)
}

function ChatMessage(props: any) {
  const {text, uid } = props.message
  return (
    <div>
      {text}
    </div>
  )
}
export default App;

// import React from 'react';
// import './App.css';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import 'firebase/compat/auth';
// import 'firebase/compat/analytics';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import {
//   useCollection,
//   useCollectionData,
// } from 'react-firebase-hooks/firestore';

// import { getFirestore } from 'firebase/firestore'
// import { getAuth, signInWithPopup } from 'firebase/auth';
// import { collection } from 'firebase/firestore';
// import { initializeApp } from 'firebase/app';
// import React, { useRef, useState, useEffect} from 'react';
// import './App.css';	import './App.css';

// import firebase from 'firebase/app';
// import { initializeApp } from 'firebase/app';
// import 'firebase/firestore';
// import {
//   getFirestore,
//   collection,
//   query,
//   orderBy,
//   limit,
//   serverTimestamp,
//   addDoc,
// } from 'firebase/firestore';
// import 'firebase/auth';
// import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import 'firebase/analytics'; //import 'firebase/compat/analytics';

// import { useAuthState } from 'react-firebase-hooks/auth';
// import { useCollectionData } from 'react-firebase-hooks/firestore';
// import { useState } from 'react';

import React, { useRef, useState, useEffect } from 'react';
import './App.css';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
//import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyAzD287l6JGtJ5Kjlo_H6nL0SZjFQQyS6M',
  authDomain: 'chatapp-d8ad3.firebaseapp.com',
  projectId: 'chatapp-d8ad3',
  storageBucket: 'chatapp-d8ad3.appspot.com',
  messagingSenderId: '28905240343',
  appId: '1:28905240343:web:7e452b122dec1f1c876952',
};
initializeApp(firebaseConfig);
// init firestore services
const db = getFirestore();
const auth = getAuth();
//const analytics = firebase.analytics();
const uid = auth.currentUser?.uid;
const photoURL = auth.currentUser?.photoURL;
function App() {
  const [user] = useAuthState(auth);

  return (
    <div className='App'>
      <h1>
        <SignOut />
      </h1>
      <section>{user ? <ChatRoom user={user} /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google </button>;
}
// function SignOut() {
//   return auth.currentUser?.uid !== undefined ? (
//     <button onClick={() => auth.signOut()}>Sign Out</button>
//   ) : (
//     <div></div>
//   );
// }
function SignOut() {
  return (
    auth.currentUser && (
      <button className='sign-out' onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}
function ChatRoom(props: any) {
  // const messagesRef = firestore.collection('messages');
  // const query = messagesRef.orderBy('createdAt');

  // const [messages] = useCollectionData(query, { idField: 'id' });
  // const [messages] = useCollectionData(collection(db, 'messages'), {
  //   snapshotListenOptions: { includeMetadataChanges: true },
  // });
  // const messagesRef = firestore.collection("messages")
  // const q = (messagesRef.orderBy("createdAt"), messagesRef.limit(25))
  // const [messages] = useCollectionData(q, { idField: "id" })
  const { user } = props.user;
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(25));

  const [messages] = useCollectionData(q);

  // const dummy = useRef();
  // const messageInput = useRef();
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e: any) => {
    e.preventDefault();
    // const uid = auth.currentUser?.uid;
    // const photoURL = auth.currentUser?.photoURL;

    // const { uid, photoURL } = auth.currentUser;
    if (formValue !== null) {
      await addDoc(messagesRef, {
        uid,
        photoURL,
        text: formValue || null,
        createdAt: serverTimestamp(),
      });
      // messageInput.current.focus();
      setFormValue('');
    }
  };

  return (
    <div>
      <div>
        {messages &&
          messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={e => setFormValue(e.target.value)} />
        <button type='submit' disabled={!formValue}>
          Send message
        </button>
      </form>
    </div>
  );
}

function ChatMessage(props: any) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser?.uid ? 'sent' : 'recieved';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} referrerPolicy='no-referrer' alt='User' />
      <p>{text}</p>
    </div>
  );
}
export default App;

// Import stylesheets
import "./style.css";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from "firebaseui";



// Document elements
const startRsvpButton = document.getElementById("startRsvp");
const guestbookContainer = document.getElementById("guestbook-container");

const form = document.getElementById("leave-message");
const input = document.getElementById("message");
const slideinput = document.getElementById("slidein"); //input of input slide progress stored in variable
const guestbook = document.getElementById("guestbook");
const descriptionContainer = document.getElementById("description-container");
const mybook = document.getElementById("mybook");
const numberAttending = document.getElementById("number-attending");
const rsvpYes = document.getElementById("rsvp-yes");
const rsvpNo = document.getElementById("rsvp-no");

const currentuser = "";

var rsvpListener = null; //listen to events based upon the variable (based upon id name)
var guestbookListener = null;

async function main() {  
  // Add Firebase project configuration object here
  var firebaseConfig = {
    apiKey: "AIzaSyAgmgU-8iOlTlEhU5L45i0gK5I5Ys9N5Qs",
    authDomain: "fir-web-codelab-542e1.firebaseapp.com",
    projectId: "fir-web-codelab-542e1",
    storageBucket: "fir-web-codelab-542e1.appspot.com",
    messagingSenderId: "4156037743",
    appId: "1:4156037743:web:3c5adac63340a2c6b08b9a",
    measurementId: "G-5HCSHQSQHX"
  };

  // Make sure Firebase is initilized s
  try {
    if (firebaseConfig && firebaseConfig.apiKey) {
      firebase.initializeApp(firebaseConfig);
    }
    let app = firebase.app();
  } catch (e) {
    console.log(e);
    document.getElementById("app").innerHTML =
      "<h1>Welcome to the Codelab! Add your Firebase config object to <pre>/index.js</pre> and refresh to get started</h1>";
    throw new Error(
      "Welcome to the Codelab! Add your Firebase config object from the Firebase Console to `/index.js` and refresh to get started"
    );
  }

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };

  const ui = new firebaseui.auth.AuthUI(firebase.auth());

  // Listen to RSVP button clicks
  startRsvpButton.addEventListener("click", () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      firebase.auth().signOut();
    } else {
      // No user is signed in; allows user to sign in
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  });

  // Listen to the current Auth state
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // currentuser = user;
      startRsvpButton.textContent = "LOGOUT";
      // Show guestbook to logged-in users
      guestbookContainer.style.display = "flex";
      descriptionContainer.style.display = "block";
      subscribeGuestbook();
      subscribeCurrentRSVP(user);
    } else {
      startRsvpButton.textContent = "Join";
      // Hide guestbook for non-logged-in users
      guestbookContainer.style.display = "none";
      descriptionContainer.style.display = "none";      
      unsubscribeGuestbook();
      unsubscribeCurrentRSVP();
    }
  });

  // Listen to the form submission
  form.addEventListener("submit", e => {
    // Prevent the default form redirect
    e.preventDefault();
    // Write a new message to the database collection "guestbook"
    firebase
      .firestore()
      .collection("guestbook")
      .add({
        text: input.value,
        progress: slideinput.value,
        timestamp: Date.now(),
        name: firebase.auth().currentUser.displayName,
        userId: firebase.auth().currentUser.uid
      });
    // clear message input field
    input.value = "";
    // Return false to avoid redirect
    return false;
  });

  // Listen to RSVP responses
  rsvpYes.onclick = () => {
    // Get a reference to the user's document in the attendees collection
    const userDoc = firebase
      .firestore()
      .collection("attendees")
      .doc(firebase.auth().currentUser.uid);

    // If they RSVP'd yes, save a document with attending: true
    userDoc
      .set({
        attending: true
      })
      .catch(console.error);
  };

  rsvpNo.onclick = () => {
    // Get a reference to the user's document in the attendees collection
    const userDoc = firebase
      .firestore()
      .collection("attendees")
      .doc(firebase.auth().currentUser.uid);

    // If they RSVP'd yes, save a document with attending: true
    userDoc
      .set({
        attending: false
      })
      .catch(console.error);
  };

  // Listen for attendee list
  firebase
    .firestore()
    .collection("attendees")
    .where("attending", "==", true)
    .onSnapshot(snap => {
      const newAttendeeCount = snap.docs.length;
      
      numberAttending.innerHTML = "<strong>" + newAttendeeCount + "</strong>"  + " people are grinding with you!";
    });
}
main();

// Listen to guestbook updates
function subscribeGuestbook() {
  // Create query for messages
  guestbookListener = firebase
    .firestore()
    .collection("guestbook")
    .orderBy("timestamp", "desc")
    .onSnapshot(snaps => {
      // Reset page
      guestbook.innerHTML = "";
      // Loop through documents in database
      snaps.forEach(doc => {
        // Create an HTML entry for each document and add it to the chat==================
        const entry = document.createElement("p");
        entry.textContent = doc.data().name + ": " + doc.data().text;
        guestbook.appendChild(entry);

        //example of adding progress bar
        if (doc.data().progress == 0)
          guestbook.innerHTML +=
            "<progress value='0' max='100'> 0 </progress> <br> Not Started <hr>";

        if (doc.data().progress == 1)
          guestbook.innerHTML +=
            "<progress value='50' max='100'> 50 </progress> <br> In Progress <hr>";

        if (doc.data().progress == 2)
          guestbook.innerHTML +=
            "<progress value='100' max='100'> 100 </progress> <br>  Completed <hr>";
      }); //close snaps.forEach

      //display currentuser's resolution================================================
      mybook.innerHTML = "";
      // Loop through documents in database
      snaps.forEach(doc => {
        if (firebase.auth().currentUser.displayName == doc.data().name) {
          // Create an HTML entry for each document and add it to the chat

          // show delete button based upon current user
          //   mybook.innerHTML += "<button data-id='" + "key" + "' onclick='deleteMessage(this);'>";
          /*
          mybook.innerHTML +=
            "<input type='button' data-id='" +
            snaps.key +
            "' value='Click Me' onclick='deleteMessage(this);>";
            */

          const entry = document.createElement("p");
          entry.textContent = doc.data().name + ": " + doc.data().text;
          mybook.appendChild(entry);

          //example of adding progress bar
          if (doc.data().progress == 0)
            mybook.innerHTML +=
              "<progress value='0' max='100'> 0 </progress> <br> Not Started <hr>";

          if (doc.data().progress == 1)
            mybook.innerHTML +=
              "<progress value='50' max='100'> 50 </progress> <br> In Progress <hr>";

          if (doc.data().progress == 2)
            mybook.innerHTML +=
              "<progress value='100' max='100'> 100 </progress> <br>  Completed <hr>";
        } //close if firebase.auth().currentUser.displayName == doc.data().name
      }); //close snaps.forEach
    }); //close onSnapshot
} //close subscribefunction

/*
function deleteMessage(self) {
    // get message ID
    var messageId = self.getAttribute("data-id");
 
    // delete message
    firebase.firestore().collection("guestbook").child(messageId).remove();
}
*/

// Unsubscribe from guestbook updates
function unsubscribeGuestbook() {
  if (guestbookListener != null) {
    guestbookListener();
    guestbookListener = null;
  }
}

// Listen for attendee list
function subscribeCurrentRSVP(user) {
  rsvpListener = firebase
    .firestore()
    .collection("attendees")
    .doc(user.uid)
    .onSnapshot(doc => {
      if (doc && doc.data()) {
        const attendingResponse = doc.data().attending;

        // Update css classes for buttons
        if (attendingResponse) {
          rsvpYes.className = "clicked";
          rsvpNo.className = "";
        } else {
          rsvpYes.className = "";
          rsvpNo.className = "clicked";
        }
      }
    });
}

function unsubscribeCurrentRSVP() {
  if (rsvpListener != null) {
    rsvpListener();
    rsvpListener = null;
  }
  rsvpYes.className = "";
  rsvpNo.className = "";
}



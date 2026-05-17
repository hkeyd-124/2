import {
  doc,
  getDoc,
  onSnapshot
}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   FIREBASE
========================= */

const db = window.db;

/* =========================
   GLOBAL USER
========================= */

window.currentUser = null;

/* =========================
   GET UID
========================= */

window.getUID = function(){

  return (

    localStorage.getItem("uid")

    ||

    localStorage.getItem("wallet")

    ||

    "guest"

  );
}

/* =========================
   LOAD USER
========================= */

window.loadCurrentUser =
async function(){

  try{

    const uid =
      getUID();

    if(
      !uid ||
      uid === "guest"
    ){

      console.warn(
        "Guest mode"
      );

      return null;
    }

    /* =========================
       FIRESTORE
    ========================= */

    const ref =
      doc(
        db,
        "users",
        uid
      );

    const snap =
      await getDoc(ref);

    if(!snap.exists()){

      console.warn(
        "User not found"
      );

      return null;
    }

    /* =========================
       SAVE GLOBAL
    ========================= */

    window.currentUser =
      snap.data();
setUserState(
  currentUser
);
    console.log(

      "CURRENT USER:",
      currentUser

    );

    /* =========================
       UPDATE UI
    ========================= */

    renderProfileCard();

    return currentUser;

  }catch(err){

    console.error(
      "LOAD USER ERROR:",
      err
    );

    return null;
  }
}

/* =========================
   RENDER PROFILE
========================= */

window.renderProfileCard =
function(){

  const box =
    document.getElementById(
      "profileCard"
    );

  if(
    !box ||
    !currentUser
  ) return;

  const username =

    currentUser.name

    ||

    "Unnamed";

  const points =

    currentUser.points

    ||

    0;

  const email =

    currentUser.email

    ||

    "Not linked";

  const wallet =

    currentUser.wallet

    ||

    "Not linked";

  box.innerHTML = `

    <div style="
      font-size:22px;
      font-weight:bold;
      margin-bottom:10px;
    ">

      👤 ${username}

    </div>

    <div style="
      color:#666;
      margin-bottom:8px;
    ">

      📧 ${email}

    </div>

    <div style="
      color:#666;
      margin-bottom:8px;
    ">

      🦊 ${wallet}

    </div>

    <div style="
      margin-top:15px;
      font-size:18px;
      font-weight:bold;
      color:#4CAF50;
    ">

      ⭐ ${points} points

    </div>

  `;
}


/* =========================
   REALTIME USER
========================= */

window.startUserRealtime =
function(){

  try{

    const uid =
      getUID();

    if(
      !uid ||
      uid === "guest"
    ){

      return;
    }

    const ref =
      doc(
        db,
        "users",
        uid
      );

    onSnapshot(

      ref,

      (snap)=>{

        if(!snap.exists()){

          return;
        }

        /* =========================
           UPDATE USER
        ========================= */

        window.currentUser =
          snap.data();

        setUserState(
          currentUser
        );

        /* =========================
           UPDATE UI
        ========================= */

        renderProfileCard();

        console.log(

          "REALTIME USER:",
          currentUser

        );
      }
    );

  }catch(err){

    console.error(

      "REALTIME ERROR:",
      err

    );
  }
}

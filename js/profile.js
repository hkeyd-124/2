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

window.currentUserData =
  currentUser;

setUserState(
  currentUser
);

console.log(

  "CURRENT USER:",
  currentUser

);

/* =========================
   CHECKIN STATE
========================= */

document.getElementById(
  "streak"
).innerText =

  currentUser.streak || 0;

window.currentUserStreak =
  currentUser.streak || 0;

window.currentLastCheckin =
  currentUser.lastCheckin || "";

/* =========================
   UPDATE UI
========================= */

renderProfileCard();

if(
  window.renderDashboardPoints
){
  renderDashboardPoints();
}

if(
  window.updateCheckinButton
){
  updateCheckinButton();
}

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

  <div>

    <div style="
      font-size:34px;
      font-weight:800;
      margin-bottom:14px;
      color:#111;
    ">

      👋 ${username}

    </div>

    <div style="
      color:#666;
      margin-bottom:10px;
      font-size:15px;
    ">

      📧 ${email}

    </div>

    <div style="
      color:#666;
      font-size:15px;
      word-break:break-all;
    ">

      🦊 ${wallet}

    </div>

  </div>

  <div style="
    display:flex;
    align-items:center;
    gap:14px;
    flex-wrap:wrap;
  ">

    <div
      onclick="openCheckin()"

      style="
      background:#111;
      color:white;
      padding:14px 20px;
      border-radius:18px;
      font-weight:bold;
      display:flex;
      align-items:center;
      gap:10px;
      cursor:pointer;
      min-width:110px;
      justify-content:center;
      "
    >

      🧪

      <span id="pointValue">
        0
      </span>

    </div>

    <div style="
      background:#fff7ed;
      color:#ea580c;
      padding:14px 20px;
      border-radius:18px;
      font-weight:bold;
      display:flex;
      align-items:center;
      gap:10px;
      min-width:110px;
      justify-content:center;
      border:1px solid #fed7aa;
    ">

      🔥

      <span id="streak">
        0
      </span>

      ngày

    </div>

    <button

      id="checkinQuickBtn"

      onclick="openCheckin()"

      style="
      border:none;
      background:#facc15;
      color:#111;
      padding:14px 22px;
      border-radius:18px;
      font-weight:700;
      cursor:pointer;
      box-shadow:
        0 8px 20px rgba(250,204,21,0.3);
      "
    >

      ✅ Check-in

    </button>

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

window.currentUserData =
  currentUser;

setUserState(
  currentUser
);

/* =========================
   CHECKIN STATE
========================= */

document.getElementById(
  "streak"
).innerText =

  currentUser.streak || 0;

window.currentUserStreak =
  currentUser.streak || 0;

window.currentLastCheckin =
  currentUser.lastCheckin || "";

/* =========================
   UPDATE UI
========================= */

renderProfileCard();

if(
  window.renderDashboardPoints
){
  renderDashboardPoints();
}

if(
  window.updateCheckinButton
){
  updateCheckinButton();
}

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

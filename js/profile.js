import {
  doc,
  getDoc,
  onSnapshot,
  setDoc
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
   UPDATE UI
========================= */

renderProfileCard();

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
const avatar =

  currentUser.avatar

  ||

  "assets/images/default-avatar.png";
  const points =

    currentUser.points

    ||

    0;
const streak =

  currentUser.streak

  || 0;
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
display:flex;
justify-content:space-between;
align-items:flex-start;
gap:30px;
flex-wrap:wrap;
">

  <!-- LEFT -->

  <div>

    <!-- HEADER -->

    <div style="
    display:flex;
    align-items:center;
    gap:18px;
    margin-bottom:18px;
    ">

      <!-- AVATAR -->

      <div style="
      position:relative;
      ">

        <img

          id="profileAvatar"

          src="${avatar}"

          style="
          width:74px;
          height:74px;

          border-radius:50%;
          object-fit:cover;

          border:3px solid #f1f5f9;
          "

        >

        <!-- EDIT -->

        <div

          onclick="changeAvatar()"

          style="
          position:absolute;
          right:-2px;
          bottom:-2px;

          width:28px;
          height:28px;

          border-radius:50%;
          background:white;

          display:flex;
          align-items:center;
          justify-content:center;

          cursor:pointer;

          border:1px solid #ddd;

          font-size:14px;
          "
        >

          ✏️

        </div>

      </div>

      <!-- TEXT -->

      <div>

        <div style="
        font-size:18px;
        color:#666;
        margin-bottom:2px;
        ">

          Xin chào

        </div>

        <div style="
        font-size:34px;
        font-weight:800;
        color:#111;
        ">

          ${username}

        </div>

      </div>

    </div>

    <!-- POINTS -->

    <div style="
    display:flex;
    gap:16px;
    margin-top:10px;
    ">

      <!-- POINT -->

      <div style="
      background:#111;
      color:white;

      padding:16px 28px;

      border-radius:18px;

      font-weight:700;

      display:flex;
      align-items:center;
      gap:10px;
      ">

        🧪 ${points}

      </div>

      <!-- STREAK -->

      <div style="
      background:#fff7ed;

      color:#ea580c;

      border:1px solid #fdba74;

      padding:16px 28px;

      border-radius:18px;

      font-weight:700;

      display:flex;
      align-items:center;
      gap:10px;
      ">

        🔥

        ${streak} ngày

      </div>

    </div>

  </div>

  <!-- RIGHT -->

  <div style="
  display:flex;
  flex-direction:column;
  align-items:flex-end;
  gap:14px;

  min-width:320px;
  ">

    <!-- WALLET -->

    <div style="
    color:#444;
    font-size:15px;
    text-align:right;

    word-break:break-all;
    ">

      🦊

      ${
        wallet ||

        "Chưa liên kết ví"
      }

    </div>

    <!-- EMAIL -->

    <div style="
    color:#444;
    font-size:15px;
    text-align:right;

    word-break:break-all;
    ">

      📧

      ${
        email ||

        "Chưa liên kết email"
      }

    </div>

    <!-- LOGOUT -->

    <div

      onclick="logout()"

      style="
      margin-top:6px;

      cursor:pointer;

      color:#111;
      font-weight:600;

      display:flex;
      align-items:center;
      gap:8px;
      "
    >

      Đăng xuất

      ↩️

    </div>

  </div>

</div>

`;
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
   UPDATE UI
========================= */

renderProfileCard();

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
/* =========================
   CHANGE AVATAR
========================= */

window.changeAvatar =
function(){

  const input =
    document.getElementById(
      "avatarInput"
    );

  if(!input) return;

  input.click();
}

/* =========================
   AVATAR PICKER
========================= */

window.initAvatarPicker =
function(){

  const input =
    document.getElementById(
      "avatarInput"
    );

  if(!input) return;

  input.onchange =
  async (e)=>{

    try{

      const file =
        e.target.files[0];

      if(!file) return;

      /* =========================
         ONLY IMAGE
      ========================= */

      if(
        !file.type.startsWith(
          "image/"
        )
      ){

        showToast(
          "File phải là ảnh"
        );

        return;
      }

      /* =========================
         READER
      ========================= */

      const reader =
        new FileReader();

      reader.onload =
      async ()=>{

        try{

          const base64 =
            reader.result;

          const uid =
            getUID();

          if(!uid) return;

          /* =========================
             SAVE FIRESTORE
          ========================= */

          await setDoc(

            doc(
              db,
              "users",
              uid
            ),

            {

              avatar:
                base64

            },

            {

              merge:true

            }
          );

          showToast(
            "Đã cập nhật avatar"
          );

        }catch(err){

          console.error(err);

          showToast(
            "Upload thất bại"
          );
        }
      };

      reader.readAsDataURL(
        file
      );

    }catch(err){

      console.error(err);
    }
  };
}



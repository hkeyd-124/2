import {
  doc,
  setDoc,
  getDoc
}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const db = window.db;
/* =========================
   LINK WALLET
========================= */
window.linkWallet = async function(){

  if(!window.ethereum){

    alert("Cần MetaMask!");

    return;
  }

  try{

    /* =========================
       CURRENT UID
    ========================= */

    const uid =
      getUID();

    if(!uid){

      alert("Bạn chưa login!");

      return;
    }

    /* =========================
       CONNECT WALLET
    ========================= */

    const accounts =
      await ethereum.request({

        method:"eth_requestAccounts"

      });

    const wallet =
      accounts[0]
      .toLowerCase();

    /* =========================
       CHECK WALLET EXIST
    ========================= */

    const walletRef =
      doc(
        db,
        "wallet_index",
        wallet
      );

    const walletSnap =
      await getDoc(walletRef);

    /* =========================
       WALLET ĐÃ THUỘC UID KHÁC
    ========================= */

    if(walletSnap.exists()){

      const data =
        walletSnap.data();

      if(data.uid !== uid){

        alert(
          "Ví này đã liên kết với tài khoản khác!"
        );

        return;
      }
    }

    /* =========================
       SIGN MESSAGE
    ========================= */

    const message =
      "Link wallet to HackChem";

    await ethereum.request({

      method:"personal_sign",

      params:[
        message,
        wallet
      ]

    });

    /* =========================
       UPDATE USER
    ========================= */

    await setDoc(

      doc(
        db,
        "users",
        uid
      ),

      {

        wallet,

        "providers.wallet":true

      },

      {

        merge:true

      }

    );

    /* =========================
       SAVE WALLET INDEX
    ========================= */

    await setDoc(

      walletRef,

      {

        uid

      }

    );

    /* =========================
       SAVE LOCAL
    ========================= */

    localStorage.setItem(
      "wallet",
      wallet
    );

    alert(
      "✅ Link wallet thành công!"
    );

  }catch(err){

    console.error(err);

    alert(
      "❌ Link wallet thất bại"
    );
  }
}

/* =========================
   SHOW EMAIL MODAL
========================= */

window.showLinkEmailModal =
function(){

  document.getElementById(
    "linkEmailModal"
  ).style.display = "flex";
}

/* =========================
   LINK EMAIL
========================= */

window.linkEmail =
async function(){

  try{

    const email =
      document.getElementById(
        "linkEmailInput"
      )

      .value
      .trim()
      .toLowerCase();

    const password =
      document.getElementById(
        "linkPasswordInput"
      ).value;

    if(!email || !password){

      alert(
        "Nhập email + password!"
      );

      return;
    }

    const uid =
      getUID();

    if(!uid){

      alert(
        "Bạn chưa login!"
      );

      return;
    }

    /* =========================
       CHECK EMAIL INDEX
    ========================= */

    const emailRef =
      doc(
        db,
        "email_index",
        email
      );

    const emailSnap =
      await getDoc(emailRef);

    if(emailSnap.exists()){

      const data =
        emailSnap.data();

      if(data.uid !== uid){

        alert(
          "Email này đã thuộc tài khoản khác!"
        );

        return;
      }
    }

    /* =========================
       UPDATE USER
    ========================= */

    await setDoc(

      doc(
        db,
        "users",
        uid
      ),

      {

        email,

        "providers.email":true

      },

      {

        merge:true

      }

    );

    /* =========================
       SAVE EMAIL INDEX
    ========================= */

    await setDoc(

      emailRef,

      {

        uid

      }

    );

    localStorage.setItem(
      "email",
      email
    );

    document.getElementById(
      "linkEmailModal"
    ).style.display = "none";

    alert(
      "✅ Link email thành công!"
    );

  }catch(err){

    console.error(err);

    alert(
      "❌ Link email thất bại"
    );
  }
}

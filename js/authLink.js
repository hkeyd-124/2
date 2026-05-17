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

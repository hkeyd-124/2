window.fullWalletDisconnect = async function(){

  try{

    // =========================
    // REOWN / WALLETCONNECT
    // =========================

    if(window.modal){

      try{
        await window.modal.disconnect();
      }catch(e){
        console.log("modal disconnect fail");
      }

    }

    // =========================
    // METAMASK / EVM PROVIDER
    // =========================

    if(window.ethereum){

      try{

        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{
            eth_accounts: {}
          }]
        });

      }catch(err){
        console.log("revoke fail");
      }

    }

    // =========================
    // CLEAR STORAGE
    // =========================

    localStorage.removeItem("wallet");
    localStorage.removeItem("uid");

    sessionStorage.clear();

    // 🔥 WalletConnect cache
    Object.keys(localStorage).forEach(key=>{

      if(
        key.includes("walletconnect") ||
        key.includes("WALLETCONNECT") ||
        key.includes("wc@2") ||
        key.includes("reown")
      ){
        localStorage.removeItem(key);
      }

    });

    // =========================
    // REDIRECT
    // =========================

    window.location.href = "index.html";

  }catch(err){

    console.error(err);

    window.location.href = "index.html";
  }

}

/* =========================
   ETH BALANCE
========================= */

window.loadETHBalance =
async function(){

  try{

    const balanceEl =
      document.getElementById(
        "ethBalance"
      );

    const iconEl =
      document.getElementById(
        "ethIcon"
      );

    if(
      !balanceEl ||
      !iconEl
    ) return;

    const wallet =
      localStorage.getItem(
        "wallet"
      );

    if(!wallet){

      iconEl.innerText = "🦊";

      balanceEl.innerText =
        "No wallet";

      return;
    }

    if(!window.ethereum){

      iconEl.innerText = "⚠️";

      balanceEl.innerText =
        "No provider";

      return;
    }

    /* =========================
       GET BALANCE
    ========================= */

    const balanceWei =

      await ethereum.request({

        method:
          "eth_getBalance",

        params:[
          wallet,
          "latest"
        ]
      });

    const eth =

      parseInt(
        balanceWei,
        16
      )

      /

      1e18;

    /* =========================
       RENDER
    ========================= */

    iconEl.innerText = "Ξ";

    balanceEl.innerText =

      eth.toFixed(4)

      +

      " sETH";

  }catch(err){

    console.error(
      "ETH ERROR:",
      err
    );
  }
}

/* =========================
   REALTIME
========================= */

window.startETHRealtime =
function(){

  loadETHBalance();

  setInterval(

    loadETHBalance,

    30000
  );
}

/* =========================
   FAUCET MODAL
========================= */

window.openFaucetModal =
function(){

  document
    .getElementById(
      "faucetModal"
    )
    .style.display =
      "flex";
}

window.closeFaucetModal =
function(){

  document
    .getElementById(
      "faucetModal"
    )
    .style.display =
      "none";
}

window.openFaucet =
function(url){

  window.open(
    url,
    "_blank"
  );
}

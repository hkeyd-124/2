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

   iconEl.innerHTML = `

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="18"
  height="18"
  viewBox="0 0 320 512"
  fill="#111"
>

<path d="M310.6 246.6l-127.1 76.2V512l127.1-178.9V246.6zM183.5 0v217.1l127.1 76L183.5 0zM136.5 0L9.4 293.1l127.1-76V0zM9.4 333.1L136.5 512V322.8L9.4 333.1z"/>

</svg>

`;

    balanceEl.innerText =

      eth.toFixed(4)

      +

      " ETH";

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

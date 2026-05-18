/* =========================
   ETH BALANCE
========================= */

window.loadETHBalance =
async function(){

  try{

    const box =
      document.getElementById(
        "ethBox"
      );

    if(!box) return;

    const wallet =
      localStorage.getItem(
        "wallet"
      );

    if(!wallet){

      box.innerHTML =
        "🦊 No wallet";

      return;
    }

    if(!window.ethereum){

      box.innerHTML =
        "⚠️ No provider";

      return;
    }

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

    box.innerHTML = `

      <span style="
        font-size:20px;
      ">
        Ξ
      </span>

      ${eth.toFixed(4)} ETH

    `;

  }catch(err){

    console.error(err);
  }
}

/* =========================
   AUTO REFRESH
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
   FAUCET
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

/* =========================
   GLOBAL
========================= */

window.currentTab = "home";

window.tabCache = {};

/* =========================
   ACTIVE MENU
========================= */

window.setActiveMenu = function(id){

  document.querySelectorAll(
    ".menu-item"
  )

  .forEach(el=>{

    el.classList.remove(
      "active"
    );

  });

  const menu =
    document.getElementById(
      `menu-${id}`
    );

  if(menu){

    menu.classList.add(
      "active"
    );
  }
}

/* =========================
   HOME
========================= */

window.loadHome = function(){

  window.currentTab = "home";

  setActiveMenu("home");

  document.getElementById(
    "homeContent"
  ).style.display = "block";

  document.getElementById(
    "spaContainer"
  ).style.display = "none";
}

/* =========================
   LOAD TAB
========================= */

window.loadTab =
async function(tab){

  try{

    window.currentTab = tab;

    setActiveMenu(tab);

    document.getElementById(
      "homeContent"
    ).style.display = "none";

    const container =
      document.getElementById(
        "spaContainer"
      );

    container.style.display =
      "block";

    container.innerHTML = `

      <div class="loading-box">
        ⏳ Loading ${tab}...
      </div>

    `;

    /* =========================
       CACHE
    ========================= */

    if(window.tabCache[tab]){

      container.innerHTML =
        window.tabCache[tab];

    }else{

      const res =
        await fetch(
          `tabs/${tab}.html`
        );

      if(!res.ok){

        throw new Error(
          `Cannot load ${tab}`
        );
      }

      const html =
        await res.text();

      window.tabCache[tab] =
        html;

      container.innerHTML =
        html;
    }

    /* =========================
       TAB INIT
    ========================= */

    if(tab === "courses"){

      bindCourseEvents();

      applyCourseProgress();
    }

    if(tab === "leaderboard"){

      setTimeout(()=>{

        loadLessons();

      },100);
    }

  }catch(err){

    console.error(err);

    document.getElementById(
      "spaContainer"
    ).innerHTML = `

      <div class="loading-box">
        ❌ Cannot load ${tab}
      </div>

    `;
  }
}

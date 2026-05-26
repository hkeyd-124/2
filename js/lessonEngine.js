window.lessonEngine = {

  lessonId:null,

  current:0,

  score:150,

  selected:null,

  answers:{},

  questions:[],

  saveKey:null,

  config:null,

  content:null,

  start:async function(){

    const params =
      new URLSearchParams(
        window.location.search
      );

    this.lessonId =
      params.get("id");

    const uid =

      localStorage.getItem("uid")

      ||

      localStorage.getItem("wallet")

      ||

      "guest";

    this.saveKey =

      "progress_"

      +

      this.lessonId

      +

      "_"

      +

      uid;

    if(!this.lessonId){

      alert("Lesson not found");

      return;
    }

    // LOAD FILES

    await this.loadScript(
      `./lessons/${this.lessonId}/config.js`
    );

    await this.loadScript(
      `./lessons/${this.lessonId}/content.js`
    );

    await this.loadScript(
      `./lessons/${this.lessonId}/questions.js`
    );

    // SAVE

    this.config =
      window.lessonConfig;

    this.content =
      window.lessonContent;

    this.questions =
      window.lessonQuestions;

    // INIT

    this.score =
      this.config.startScore;

    this.loadProgress();

    // UI

    this.renderTools();

    this.loadTool("pdf");

    this.renderNav();

    this.renderQuestion();

    this.updateScore();
  },

  /* =========================
     LOAD SCRIPT
  ========================= */

  loadScript:function(src){

    return new Promise(resolve=>{

      const script =
        document.createElement(
          "script"
        );

      script.src = src;

      script.onload =
        resolve;

      document.body
        .appendChild(script);

    });
  },

  /* =========================
     TOOLS
  ========================= */

  renderTools:function(){

    const bar =
      document.getElementById(
        "toolBar"
      );

    bar.innerHTML = "";

    this.content.tools
    .forEach(tool=>{

      const btn =
        document.createElement(
          "button"
        );

      btn.className =
        "tool-btn";

      btn.innerText =
        tool.title;

      btn.onclick = ()=>{

        this.loadTool(
          tool.id
        );

        document
          .querySelectorAll(
            ".tool-btn"
          )
          .forEach(b=>
            b.classList
             .remove("active")
          );

        btn.classList
          .add("active");
      };

      bar.appendChild(btn);

    });
  },

  loadTool:function(id){

    const tool =
      this.content.tools
      .find(t=>t.id===id);

    if(!tool) return;

    const left =
      document.getElementById(
        "leftContent"
      );

    if(tool.type==="pdf"){

      left.innerHTML = `

        <iframe
          src="${tool.src}"
          width="100%"
          height="100%"
          style="border:none;">
        </iframe>

      `;
    }
  },

  /* =========================
     QUESTIONS
  ========================= */

  renderQuestion:function(){

    const q =
      this.questions[
        this.current
      ];

    questionText.innerHTML =
      q.q;

    options.innerHTML = "";

    this.selected = null;

    if(
      this.answers[this.current]
      === "correct"
    ){

      this.selected = q.a;
    }

    if(q.type==="single"){

      q.opt.forEach((opt,i)=>{

        const btn =
          document.createElement(
            "button"
          );

        btn.innerHTML =
          opt;

        if(
          this.selected === i
        ){

          btn.classList
            .add("selected");
        }

        btn.onclick = ()=>{

          this.selected = i;

          document
            .querySelectorAll(
              "#options button"
            )
            .forEach(b=>
              b.classList
               .remove(
                 "selected"
               )
            );

          btn.classList
            .add("selected");
        };

        options.appendChild(btn);

      });

    }

  },

  /* =========================
     CHECK
  ========================= */

  checkAnswer:function(){

    const q =
      this.questions[
        this.current
      ];

    if(q.type==="single"){

      if(
        this.selected === null
      ) return;

      if(
        this.selected === q.a
      ){

        this.answers[
          this.current
        ] = "correct";

        this.score += 20;

      }else{

        this.score -= 5;
      }

    }

    this.updateScore();

    this.renderNav();

    this.saveProgress();
  },

  /* =========================
     NAV
  ========================= */

  renderNav:function(){

    navBar.innerHTML = "";

    this.questions
    .forEach((q,i)=>{

      const div =
        document.createElement(
          "div"
        );

      div.className =
        "nav-item";

      div.innerText =
        i+1;

      if(
        this.answers[i]
        === "correct"
      ){

        div.style.background =
          "#4CAF50";

        div.style.color =
          "white";
      }

      div.onclick = ()=>{

        this.current = i;

        this.saveProgress();

        this.renderQuestion();

        this.renderNav();
      };

      navBar.appendChild(div);

    });

  },

  /* =========================
     LOAD PROGRESS
  ========================= */

  loadProgress:function(){

    const raw =

      localStorage.getItem(
        this.saveKey
      );

    if(!raw) return;

    try{

      const data =
        JSON.parse(raw);

      this.current =
        data.current || 0;

      this.score =
        data.score
        || this.score;

      this.answers =
        data.answers || {};

    }catch(err){

      console.error(
        "LOAD PROGRESS ERROR",
        err
      );
    }
  },

  /* =========================
     SAVE PROGRESS
  ========================= */

  saveProgress:function(){

    localStorage.setItem(

      this.saveKey,

      JSON.stringify({

        current:
          this.current,

        score:
          this.score,

        answers:
          this.answers

      })

    );
  },

  /* =========================
     SCORE
  ========================= */

  updateScore:function(){

    scoreValue.innerText =
      this.score;
  }

};

/* =========================
   GLOBAL
========================= */

window.checkAnswer =
function(){

  lessonEngine.checkAnswer();
};

window.goBack =
function(){

  window.location.href =
    "home.html#courses";
};

window.showHint =
function(){

  alert(
    "Hint system phase sau 😄"
  );
};

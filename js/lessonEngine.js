window.lessonEngine = {

  lessonId:null,

  current:0,

  score:150,

  selected:null,

  answers:{},

  questions:[],

  saveKey:null,
cloudSaveTimeout:null,

cloudLoaded:false,
  unsavedChanges:0,
  bestScore:150,
firstScore:null,
completed:false,
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
await this.loadCloudProgress();
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

  // LOCK nếu đã đúng

  if(
    this.answers[
      this.current
    ] === "correct"
  ){
    return;
  }

  if(
    this.selected === q.a
  ){

    this.answers[
      this.current
    ] = "correct";

    this.score += 20;

  }else{

    this.answers[
      this.current
    ] = "wrong";

    this.score -= 5;
  }

}

 if(
  this.score >
  this.bestScore
){

  this.bestScore =
    this.score;
}

this.updateScore();
    this.renderNav();
const totalCorrect =

  Object.values(
    this.answers
  )

  .filter(v=>
    v==="correct"
  )

  .length;

if(
  totalCorrect
  ===
  this.questions.length
){

  this.completed = true;

  // FIRST SCORE LOCK

  if(
    this.firstScore
    === null
  ){

    this.firstScore =
      this.score;
  }

  this.saveCloudProgress();
}
    this.saveProgress();
    this.unsavedChanges++;

if(
  this.unsavedChanges >= 5
){

  this.saveCloudProgress();

  this.unsavedChanges = 0;
}
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

     if(i === this.current){

  div.style.background =
    "#FFC107";

  div.style.color =
    "black";
}

if(
  this.answers[i]
  === "wrong"
){

  div.style.background =
    "#F44336";

  div.style.color =
    "white";
}

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
this.unsavedChanges++;

if(
  this.unsavedChanges >= 5
){

  this.saveCloudProgress();

  this.unsavedChanges = 0;
}
        this.renderQuestion();

        this.renderNav();
      };

      navBar.appendChild(div);

    });

  },
/* =========================
   LOAD CLOUD
========================= */

loadCloudProgress:
async function(){

  try{

    const uid =
      localStorage.getItem(
        "uid"
      );

    if(!uid) return;

    const ref =

      doc(

        db,

        "users",

        uid,

        "lessons",

        this.lessonId

      );

    const snap =
      await getDoc(ref);

    if(!snap.exists()){

      this.cloudLoaded = true;

      return;
    }

    const data =
      snap.data();

    // LOCAL FIRST

    const localRaw =

      localStorage.getItem(
        this.saveKey
      );

    if(localRaw){

      this.cloudLoaded = true;

      return;
    }

    this.current =
      data.current || 0;

    this.score =
      data.score || 150;

    this.answers =
      data.answers || {};
this.bestScore =
  data.bestScore || this.score;

this.firstScore =
  data.firstScore || null;

this.completed =
  data.completed || false;
    this.cloudLoaded = true;

  }catch(err){

    console.error(
      "CLOUD LOAD ERROR",
      err
    );
  }
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
this.bestScore =
  data.bestScore || this.score;;

this.firstScore =
  data.firstScore || null;

this.completed =
  data.completed || false;
    }catch(err){

      console.error(
        "LOAD PROGRESS ERROR",
        err
      );
    }
  },
/* =========================
   SAVE CLOUD
========================= */

saveCloudProgress:
async function(){

  try{

    const uid =
      localStorage.getItem(
        "uid"
      );

    if(!uid) return;

    const ref =

      doc(

        db,

        "users",

        uid,

        "lessons",

        this.lessonId

      );

    await setDoc(

      ref,

      {

        current:
          this.current,

        score:
          this.score,

        answers:
          this.answers,
bestScore:
  this.bestScore,

firstScore:
  this.firstScore,

completed:
  this.completed,
        updatedAt:
          serverTimestamp()

      },

      {
        merge:true
      }

    );

  }catch(err){

    console.error(
      "CLOUD SAVE ERROR",
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
  this.answers,
bestScore:
  this.bestScore,

firstScore:
  this.firstScore,

completed:
  this.completed,
      })

    );
  },

  /* =========================
     SCORE
  ========================= */

  updateScore:function(){

  scoreValue.innerText =
    this.score;

  bestScoreValue.innerText =
    this.bestScore;
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
async function(){

  await lessonEngine
    .saveCloudProgress();

  showToast(
    "📤 Đã nộp bài!"
  );

  setTimeout(()=>{

    window.location.href =
      "home.html#courses";

  },400);
};

window.showHint =
function(){

  alert(
    "Hint system phase sau 😄"
  );
};

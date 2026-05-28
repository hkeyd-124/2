window.lessonEngine = {

  lessonId:null,

  current:0,

  score:150,

  answers:{},
  selectedAnswers:{},
hints:{},
  hiddenOptions:{},
  questions:[],

  saveKey:null,
cloudSaveTimeout:null,

cloudLoaded:false,
  unsavedChanges:0,
  bestScore:150,
firstScore:null,
completed:false,
  rank:"C",
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

// RESET

questionText.innerHTML =
"";

options.innerHTML =
"";

// ROUTER

switch(q.type){

case "single":
  this.renderSingle(q);
  break;

}
},

/* =========================
SINGLE RENDER
========================= */

renderSingle:function(q){

questionText.innerHTML =
q.q;
if(
  this.answers[
    this.current
  ]
  === "correct"
){

  this.selectedAnswers[
  this.current
] = q.a;
}
q.opt.forEach((opt,i)=>{

const btn =
  document.createElement(
    "button"
  );

btn.innerHTML = opt;
const hidden =

  this.hiddenOptions[
    this.current
  ] || [];

if(
  hidden.includes(i)
){

  btn.style.opacity =
    "0.3";

  btn.disabled = true;
}
const state =
  this.answers[
    this.current
  ];


if(
  state === "correct"
  &&
  i === q.a
){

  btn.classList.add(
    "correct"
  );
}

// WRONG

if(
  state === "wrong"
  btn.disabled = false;
  &&
  this.selectedAnswers[
  this.current
] === i
){

  btn.classList.add(
    "wrong"
  );
}

// SELECTED

if(
  state !== "wrong"
  &&
  this.selectedAnswers[
    this.current
  ] === i
){
  btn.classList.add(
    "selected"
  );
}

// CLICK

btn.onclick = ()=>{

  // LOCK IF CORRECT

  if(
    this.answers[
      this.current
    ]
    === "correct"
  ){
    return;
  }

  
this.selectedAnswers[
  this.current
] = i;
  this.renderQuestion();
};

options.appendChild(btn);

});
},

/* =========================
CHECK
========================= */

checkAnswer:function(){

const q =
this.questions[
this.current
];

// ROUTER

switch(q.type){

case "single":

  this.checkSingle(q);

  break;


}
},

/* =========================
SINGLE CHECK
========================= */

checkSingle:function(q){

if(
this.selectedAnswers[
  this.current
] == null
){
return;
}

// LOCK

if(
this.answers[
this.current
]
=== "correct"
){
return;
}

// CORRECT

if(
this.selectedAnswers[
  this.current
] === q.a
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

// BEST SCORE

if(
this.score >
this.bestScore
){

this.bestScore =
  this.score;

}

// UPDATE UI

this.updateScore();

this.renderQuestion();

this.renderNav();

// SAVE

this.unsavedChanges++;

this.saveProgress();

if(
this.unsavedChanges >= 5
){


this.saveCloudProgress();

this.unsavedChanges = 0;


}

// COMPLETE

const totalCorrect =


Object.values(
  this.answers
)

.filter(
  v=>v==="correct"
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
    this.selectedAnswers =
  data.selectedAnswers || {};
    this.hints =
  data.hints || {};
    this.hiddenOptions =
  data.hiddenOptions || {};
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
      this.selectedAnswers =
  data.selectedAnswers || {};
      this.hints =
  data.hints || {};
      this.hiddenOptions =
  data.hiddenOptions || {};
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
        selectedAnswers:
  this.selectedAnswers,
        hints:
  this.hints,
        hiddenOptions:
  this.hiddenOptions,
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
        selectedAnswers:
  this.selectedAnswers,
        hints:
  this.hints,
        hiddenOptions:
  this.hiddenOptions,
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
    hint
  ========================= */
  useHint:function(){

  const q =
    this.questions[
      this.current
    ];

  // ALREADY USED

  if(
    this.hints[
      this.current
    ]
  ){
    return;
  }

  // COST

  this.score -= 15;

  // SAVE HINT

  this.hints[
    this.current
  ] = true;

  // SINGLE CHOICE

  if(
    q.type === "single"
  ){

    this.singleHint(q);
  }

  this.updateScore();

  this.saveProgress();
},

singleHint:function(q){

  let wrongIndexes = [];

  q.opt.forEach((_,i)=>{

    if(i !== q.a){

      wrongIndexes.push(i);
    }
  });

  // SHUFFLE

  wrongIndexes.sort(
    ()=>Math.random()-0.5
  );

  // SAVE HIDDEN

  this.hiddenOptions[
    this.current
  ] = wrongIndexes.slice(0,2);

  this.renderQuestion();
},
  /* =========================
     RANK + SCORE
  ========================= */
getRank:function(score){

  if(score >= 450){
    return "SSS";
  }

  if(score >= 400){
    return "SS";
  }

  if(score >= 350){
    return "S";
  }

  if(score >= 300){
    return "A";
  }

  if(score >= 250){
    return "B";
  }

  return "C";
},

  
  updateScore:function(){

  this.rank =
    this.getRank(
      this.bestScore
    );

  scoreValue.innerText =
    this.score;

  bestScoreValue.innerText =
    this.bestScore;

  rankValue.innerText =
    this.rank;
}};
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

  lessonEngine.useHint();
};

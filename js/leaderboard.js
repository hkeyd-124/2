/* =========================
   LEADERBOARD
========================= */

window.lessonMap = {

  topic1:[

    {
      id:"organic_1",
      name:"Bài 1"
    },

    {
      id:"organic_2",
      name:"Bài 2"
    },

    {
      id:"organic_3",
      name:"Bài 3"
    },

    {
      id:"organic_4",
      name:"Bài 4"
    }

  ]

};

/* =========================
   LOAD LESSONS
========================= */

window.loadLessons = function(){

  const topic =
    document.getElementById(
      "topicFilter"
    ).value;

  const lessonSelect =
    document.getElementById(
      "lessonFilter"
    );

  if(!lessonSelect) return;

  lessonSelect.innerHTML = "";

  const lessons =
    window.lessonMap[topic];

  lessons.forEach(lesson=>{

    lessonSelect.innerHTML += `

      <option value="${lesson.id}">
        ${lesson.name}
      </option>

    `;

  });

  loadLeaderboard();
}

/* =========================
   LOAD LEADERBOARD
========================= */

window.loadLeaderboard =
async function(){

  const container =
    document.getElementById(
      "leaderboardList"
    );

  if(!container) return;

  try{

    container.innerHTML = `
      <div class="lb-loading">
        ⏳ Loading leaderboard...
      </div>
    `;

    const lesson =
      document.getElementById(
        "lessonFilter"
      ).value;

    const usersSnap =
      await getDocs(
        collection(db,"users")
      );

    let leaderboard = [];

    for(const userDoc of usersSnap.docs){

      const userData =
        userDoc.data();

      const uid =
        userDoc.id;

      const lessonRef =
        doc(
          db,
          "users",
          uid,
          "lessons",
          lesson
        );

      const lessonSnap =
        await getDoc(lessonRef);

      if(lessonSnap.exists()){

        const lessonData =
          lessonSnap.data();

        leaderboard.push({

          uid,

          name:
            userData.name
            || "Unknown",

          score:
            lessonData.score || 0

        });

      }
    }

    leaderboard.sort(
      (a,b)=>b.score-a.score
    );

    container.innerHTML = "";

    const currentUid =
      localStorage.getItem("uid");

    leaderboard.forEach((user,index)=>{

      const isMe =
        user.uid === currentUid;

      let badge = "🥉";

      if(index === 0){
        badge = "👑";
      }
      else if(index === 1){
        badge = "🥈";
      }
      else if(index === 2){
        badge = "🥉";
      }

      container.innerHTML += `

        <div class="lb-row
             ${isMe ? 'lb-me' : ''}">

          <div class="lb-rank">
            ${index+1}
          </div>

          <div class="lb-name">
            ${user.name}
          </div>

          <div class="lb-score">
            ${user.score}
          </div>

          <div>
            <div class="lb-badge">
              ${badge}
            </div>
          </div>

          <div></div>

          <div></div>

        </div>

      `;
    });

    if(leaderboard.length === 0){

      container.innerHTML = `

        <div class="lb-loading">
          No leaderboard data
        </div>

      `;
    }

  }catch(err){

    console.error(err);

    container.innerHTML = `

      <div class="lb-loading">
        ❌ Failed to load leaderboard
      </div>

    `;
  }
}

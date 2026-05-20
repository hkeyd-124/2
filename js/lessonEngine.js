/* =========================
   LESSON ENGINE
========================= */

window.lessonState = {

  answers:{},

  current:0,

  score:150,

  firstScore:null,

  best:150,

  completed:false,

  nftMinted:false

};

/* =========================
   GET LESSON ID
========================= */

window.getLessonID =
function(){

  const params =

    new URLSearchParams(
      window.location.search
    );

  return (

    params.get("id")

    ||

    "organic_1"

  );
}

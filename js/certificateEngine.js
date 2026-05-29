window.generateCertificatePreview =
async function(data){

  const tier =
    data.tier;

  const templateSrc =

    certificateTemplates[
      tier
    ];

  const canvas =

    document.createElement(
      "canvas"
    );

  canvas.width =
    certificateLayout.width;

  canvas.height =
    certificateLayout.height;

  const ctx =
    canvas.getContext(
      "2d"
    );

  // TEMPLATE

  const template =
    new Image();

  template.src =
    templateSrc;

  await new Promise(
    resolve=>{

      template.onload =
        resolve;
    }
  );

  ctx.drawImage(

    template,

    0,

    0,

    canvas.width,

    canvas.height

  );

  // NAME

  ctx.fillStyle =
    "#0b2a5b";

  ctx.textAlign =
    certificateLayout
    .studentName
    .align;

  ctx.font =

    `bold ${
      certificateLayout
      .studentName
      .fontSize
    }px Georgia`;

  ctx.fillText(

  data.name
    .toUpperCase(),

  certificateLayout
    .studentName.x,

  certificateLayout
    .studentName.y

);

  // LESSON

  ctx.font =

    `bold ${
      certificateLayout
      .lessonName
      .fontSize
    }px Arial`;

  ctx.fillStyle =
  "#ffffff";
  ctx.fillText(
    data.lesson,

    certificateLayout
    .lessonName.x,

    certificateLayout
    .lessonName.y

  );

  // SCORE

  ctx.font =

    `bold ${
      certificateLayout
      .score
      .fontSize
    }px Arial`;
ctx.fillStyle =
  "#0b2a5b";
  ctx.fillText(

    `${data.score}/${data.maxScore}`,

    certificateLayout
      .score.x,

    certificateLayout
      .score.y

  );
// DATE

const today =

  new Date()
  .toLocaleDateString(
    "vi-VN"
  );

ctx.fillStyle =
  "#0b2a5b";

ctx.textAlign =
  "center";

ctx.font =
  "bold 22px Arial";

ctx.fillText(

  "NGÀY HOÀN THÀNH",

  285,

  805

);

ctx.font =
  "bold 24px Arial";

ctx.fillText(

  today,

  285,

  865

);
  return canvas;
};

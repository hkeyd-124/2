window.uploadCertificateToIPFS =
async function(canvas){

  const blob =
    await new Promise(
      resolve=>
        canvas.toBlob(
          resolve,
          "image/png"
        )
    );

  const formData =
    new FormData();

  formData.append(

    "file",

    blob,

    "certificate.png"

  );

  const res =
    await fetch(

      "/api/uploadCertificate",

      {

        method:"POST",

        body:
          formData

      }

    );

  return await res.json();

};

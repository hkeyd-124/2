window.uploadCertificateToIPFS =
async function(canvas){

  const imageData =

    canvas.toDataURL(
      "image/png"
    );

  const res =
    await fetch(

      "/api/uploadCertificate",

      {

        method:"POST",

        headers:{

          "Content-Type":
          "application/json"

        },

        body:
        JSON.stringify({

          imageData

        })

      }

    );

  return await res.json();

};

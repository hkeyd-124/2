export default async function handler(
  req,
  res
){

  try{

    const jwt =
      process.env.PINATA_JWT;

    const {

      imageData

    } = req.body;

    const base64 =

      imageData.split(
        ","
      )[1];

    const buffer =

      Buffer.from(
        base64,
        "base64"
      );

    const formData =
      new FormData();

    const blob =
      new Blob(

        [buffer],

        {
          type:
          "image/png"
        }

      );

    formData.append(

      "file",

      blob,

      "certificate.png"

    );

    const upload =
      await fetch(

        "https://api.pinata.cloud/pinning/pinFileToIPFS",

        {

          method:"POST",

          headers:{

            Authorization:
              `Bearer ${jwt}`

          },

          body:
            formData

        }

      );

    const data =
      await upload.json();

    return res.json({

      success:true,

      data

    });

  }catch(err){

    return res
      .status(500)
      .json({

        error:
        err.message

      });

  }

}

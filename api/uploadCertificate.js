export default async function handler(
  req,
  res
){

  try{

    const jwt =
      process.env.PINATA_JWT;

    const formData =
      new FormData();

    const blob =
      new Blob(

        ["HackChem Test"],

        {

          type:
          "text/plain"

        }

      );

    formData.append(

      "file",

      blob,

      "test.txt"

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

export default async function handler(
  req,
  res
){

  try{

    const jwt =
      process.env.PINATA_JWT;

    const metadata =
      req.body;

    const upload =
      await fetch(

        "https://api.pinata.cloud/pinning/pinJSONToIPFS",

        {

          method:"POST",

          headers:{

            Authorization:
              `Bearer ${jwt}`,

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify(
              metadata
            )

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

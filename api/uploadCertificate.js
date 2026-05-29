export default async function handler(
  req,
  res
){

  try{

    const jwt =
      process.env.PINATA_JWT;

    if(!jwt){

      return res
      .status(500)
      .json({

        error:
        "PINATA_JWT missing"

      });
    }

    res.status(200).json({

      success:true

    });

  }catch(err){

    res.status(500).json({

      error:
      err.message

    });
  }
}

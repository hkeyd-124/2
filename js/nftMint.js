window.HCERT_CONTRACT =

"0x44c08D7504bf38A421bAecdB30452Cc5Dc88909c";

window.HCERT_ABI = [

  {
    "inputs":[
      {
        "internalType":"bytes32",
        "name":"lessonHash",
        "type":"bytes32"
      },
      {
        "internalType":"string",
        "name":"tokenURI_",
        "type":"string"
      }
    ],
    "name":"mint",
    "outputs":[
      {
        "internalType":"uint256",
        "name":"",
        "type":"uint256"
      }
    ],
    "stateMutability":"nonpayable",
    "type":"function"
  }

];

window.mintCertificateNFT =
async function({

  lessonId,

  metadataCID

}){

  if(
    !window.ethereum
  ){

    throw new Error(
      "Wallet not found"
    );
  }

  const provider =

    new ethers.BrowserProvider(
      window.ethereum
    );

  const signer =

    await provider.getSigner();

  const contract =

    new ethers.Contract(

      window.HCERT_CONTRACT,

      window.HCERT_ABI,

      signer

    );

  const lessonHash =

    ethers.id(
      lessonId
    );

  const tokenURI =

    `ipfs://${metadataCID}`;

  const tx =

    await contract.mint(

      lessonHash,

      tokenURI

    );

  const receipt =

    await tx.wait();

  return {

    txHash:
      receipt.hash,

    lessonHash,

    tokenURI

  };

};

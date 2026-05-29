window.buildCertificateMetadata =
function(data){

  return {

    name:
      `${data.lesson} Certificate`,

    description:
      `HackChem Learning Certificate`,

    image:
      `ipfs://${data.imageCID}`,

    attributes:[

      {
        trait_type:"Student",
        value:data.student
      },

      {
        trait_type:"Lesson",
        value:data.lesson
      },

      {
        trait_type:"Score",
        value:data.score
      },

      {
        trait_type:"Rank",
        value:data.rank
      }

    ]

  };

};

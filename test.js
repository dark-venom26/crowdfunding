const { ethers } = require("ethers");
const CampaignFactory = require("./artifacts/contracts/Campaign.sol/CampaignFactory.json")
require("dotenv").config({path: './.env'})

const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        provider
    )

    const getDeployedCampaign = contract.filters.campaignCreated();

    let events = await contract.queryFilter(getDeployedCampaign);
    let event = events.reverse();
    // console.log(event)

    
  const getAnimalCampaigns = contract.filters.campaignCreated(null, null, null, null, null, null, null, 'animal');
  const animalCampaign = await contract.queryFilter(getAnimalCampaigns);
  const animalCampaignData = animalCampaign.map((e)=>{
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      campaignAddress: e.args.campaignAddress,
      amount: parseInt(e.args.requiredAmount),
      timeStamp: parseInt(e.args.timestamp),
    }
  })

  console.log(animalCampaignData)

}

main();





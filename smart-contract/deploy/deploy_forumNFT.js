const { ethers } =  require("hardhat");


const deployForumNFT = async ({deployments, getNamedAccounts}) => {
  const { deploy } = deployments;
  const { owner } = await getNamedAccounts();

  await deploy("ForumNFT", {
    from: owner,
    args: ["LuksoForum", "LYXtForum", owner, false],
    gasPrice: ethers.BigNumber.from(20_000_000_000),
    log: true
  });
}

module.exports = deployForumNFT;
module.exports.tags = ["ForumNFT"];

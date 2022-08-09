const { ethers } =  require("hardhat");


const deployForumNFT = async ({deployments, getNamedAccounts}) => {
  const { deploy } = deployments;
  const { owner } = await getNamedAccounts();

  await deploy("ForumNFT", {
    from: owner,
    args: ["LuksoForum", "LYXtForum", '0x0CEd2afBb9d4d9023059b2F7Cc07f24C4058CF30', false],
    gasPrice: ethers.BigNumber.from(20_000_000_000),
    log: true
  });
}

module.exports = deployForumNFT;
module.exports.tags = ["ForumNFT"];

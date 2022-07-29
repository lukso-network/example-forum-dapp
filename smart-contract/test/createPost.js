const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("When using Custom LSP7", function () {

  it("should createPost", async function () {
    const [deployer, postCreator] =  await hre.ethers.getSigners()
    const LSP7Factory = await ethers.getContractFactory("ForumNFT", deployer);
    const lsp7Contract = await LSP7Factory.deploy(
      "ForumNFT",
      "FORUM",
      deployer.address,
      false
    );
    await lsp7Contract.deployed();

    const postCreatorBalanceBefore = await lsp7Contract.balanceOf(postCreator.address)
    expect(postCreatorBalanceBefore.toNumber()).to.equal(0);

    //create post
    await lsp7Contract.connect(postCreator).createPost('this is a title', 'this is a text');

    const postCreatorBalanceAfter = await lsp7Contract.balanceOf(postCreator.address)
    expect(postCreatorBalanceAfter.toNumber()).to.equal(1);

  });
});

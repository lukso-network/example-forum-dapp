const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("When using Custom LSP7", function () {

  it("should add and delete likes", async function () {
    const [deployer, postCreator, liker1, liker2] =  await hre.ethers.getSigners()
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
    await lsp7Contract.connect(postCreator).createPost('thisisacid');

    //add like 1
    const tx = await lsp7Contract.connect(liker1).like(1);
    tx.wait(1)
    //add like 1
    const tx2 = await lsp7Contract.connect(liker2).like(1);
    tx2.wait(1)

    const likesBeforeDelete = await lsp7Contract.fetchLikes(1);
    expect(likesBeforeDelete.length).to.equal(2);

    //remove like 1
    await lsp7Contract.connect(liker1).like(1);

    const likesAfterDelete = await lsp7Contract.fetchLikes(1);
    expect(likesAfterDelete.length).to.equal(1);
  });
});

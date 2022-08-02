const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("When using Custom LSP7", function () {

  it("should removePost", async function () {
    const [deployer, postCreator] =  await hre.ethers.getSigners()

    const LSP7Factory = await ethers.getContractFactory("ForumNFT", deployer);
    const lsp7Contract = await LSP7Factory.deploy(
      "ForumNFT",
      "FORUM",
      deployer.address,
      false
    );
    await lsp7Contract.deployed();

    //create post
    await lsp7Contract.connect(postCreator).createPost('tthisisacid');
    //create second post
    await lsp7Contract.connect(postCreator).createPost('thisisanotheracid');

    const postsNumberBefore = await lsp7Contract.fetchPosts();
    expect(postsNumberBefore[0].length).to.equal(2);
    //delete first post
    const tx = await lsp7Contract.connect(postCreator).deletePost(1);
    tx.wait(2)
    await lsp7Contract.connect(postCreator).deletePost(2);

    const postsNumberAfter = await lsp7Contract.fetchPosts();
    expect(postsNumberAfter[0].length).to.equal(0);
  });
});

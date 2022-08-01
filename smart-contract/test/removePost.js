const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("When using Custom LSP7", function () {

  it("should removeComment", async function () {
    const [deployer, postCreator, commentor] =  await hre.ethers.getSigners()

    const LSP7Factory = await ethers.getContractFactory("ForumNFT", deployer);
    const lsp7Contract = await LSP7Factory.deploy(
      "ForumNFT",
      "FORUM",
      deployer.address,
      false
    );
    await lsp7Contract.deployed();

    //create post
    await lsp7Contract.connect(postCreator).createPost('this is a title', 'this is a description');
    //create second post
    await lsp7Contract.connect(postCreator).createPost('this is second title', 'this is a second description');

    //delete first post
    await lsp7Contract.connect(postCreator).deletePost(1);
    await lsp7Contract.connect(postCreator).deletePost(2);

    const postsNumber = await lsp7Contract.fetchPosts();

  });
});

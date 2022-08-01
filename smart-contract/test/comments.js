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


    //create comment
    const postId = 1
    await lsp7Contract.connect(commentor).createComment(postId, 'this is the first comment');
    await lsp7Contract.connect(commentor).createComment(postId, 'this is the second comment');


    const tx = await lsp7Contract.connect(postCreator).removeComment(postId, 1);

    await lsp7Contract.connect(commentor).removeComment(postId, 2);
    // expect(commentsLength).to.equal(2)
  });
});

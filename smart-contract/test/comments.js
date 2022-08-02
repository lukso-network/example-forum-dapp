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
    await lsp7Contract.connect(postCreator).createPost('thisisacid');


    //create comment
    const postId = 1
    await lsp7Contract.connect(commentor).createComment(postId, 'thisacommentcid');
    await lsp7Contract.connect(commentor).createComment(postId, 'thisanothercommentcid');

    const commentsBeforeDelete = await lsp7Contract.fetchComments(postId);
    expect(commentsBeforeDelete.length).to.equal(2);

    //delete comment
    const tx = await lsp7Contract.connect(postCreator).removeComment(postId, 1);
    const commentsAfterDelete = await lsp7Contract.fetchComments(postId);
    await lsp7Contract.connect(commentor).removeComment(postId, 2);
    expect(commentsAfterDelete.length).to.equal(1);
  });
});

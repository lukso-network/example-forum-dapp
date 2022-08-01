//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/LSP7Mintable.sol";
import "hardhat/console.sol";

contract ForumNFT is  LSP7Mintable {

    struct Comment {
      string text;
      address commentor;
      uint256 id;
    }

    struct Post {
      string title; //might group title and text into ipfs
      string text;
      address author;
      address[] likes;
      Comment[] comments;
      uint256 id;
    }

    Post latestPost;
    address[] private emptyLikesArr;
    Comment[] private emptyCommentsArr;
    Comment[] private tempCommentsArr; //used for comments deleting since we can pop struct's arrays
    uint[] public postsIds;

    mapping(uint256 => Post) public postByTokenId;

    uint256 private postsCounter;
    uint256 private commentsCounter;

    address private admin;

    constructor(
      string memory _name,
      string memory _symbol,
      address _newOwner,
      bool _isNFT
    ) LSP7Mintable(_name, _symbol, _newOwner, _isNFT) {
      admin = msg.sender;
    }

    modifier onlyAdmin {
      require(msg.sender == admin);
      _;
    }


    //POSTS FUNCTIONS
    function createPost(string calldata _title, string calldata _text) public {


      latestPost.title = _title;
      latestPost.text = _text;
      latestPost.author = msg.sender;
      latestPost.id = ++postsCounter;

      postByTokenId[postsCounter] = latestPost;
      postsIds.push(postsCounter);

      _mint(msg.sender, postsCounter, true, "");
    }

    function editPost(uint256 _tokenId, string calldata _title, string calldata _text) public {
      require(postByTokenId[_tokenId].author == msg.sender, 'Only author can edit post');
      postByTokenId[_tokenId].title = _title;
      postByTokenId[_tokenId].text = _text;
    }

    function deletePost(uint256 _tokenId) public {
      require(postByTokenId[_tokenId].author == msg.sender
        || admin == msg.sender, 'author or admin can delete post');

      uint256[] memory postsList = postsIds;
      uint256 totalPosts = postsList.length;
      uint256 postIndex;
      for (uint256 i = 0; i < totalPosts; i++) {
        if (postsList[i] == _tokenId) {
          postIndex = i;
          break;
        }
      }

      for(uint i = postIndex; i < totalPosts-1; i++){
        postsList[i] = postsList[i+1];
      }
      postsIds = postsList;
      postsIds.pop();
    }

    function fetchPosts() public view returns (Post[] memory posts, uint256, uint256) {

      uint256 postsLength = postsIds.length;
      uint256[] memory postArray = postsIds;
      posts = new Post[](postsLength);

      for (uint i = 0; i < postsLength;) {
        posts[i] = postByTokenId[postArray[i]];
        unchecked {++i;}
      }

      return (posts, postsCounter, commentsCounter);
    }

    //COMMENTS FUNCTIONS
    function createComment(uint256 _tokenId, string calldata _text) public {

      Comment memory comment = Comment({
        text: _text,
        commentor: msg.sender,
        id: ++commentsCounter
      });
      postByTokenId[_tokenId].comments.push(comment);
    }

    function _postCommentor(uint256 _tokenId, uint256 _commentId) internal view returns(address commentor) {

      for(uint i = 0; i < postByTokenId[_tokenId].comments.length;) {
        if(postByTokenId[_tokenId].comments[i].id == _commentId) {
          commentor = postByTokenId[_tokenId].comments[i].commentor;
          break;
        }
        unchecked {++i;}
      }
      return commentor;
    }

    //cant pop structs so have to build new array of structs without the value to delete
    //this function is really unoptimized but it works in the meantime copyof opcode is introduced
    function removeComment(uint256 _tokenId, uint256 _commentId) public {
      require(postByTokenId[_tokenId].author == msg.sender ||
       _postCommentor(_tokenId,_commentId) == msg.sender ||
       admin == msg.sender,
       'Only post author or commentor can remove comment');

       Comment[] memory comments = postByTokenId[_tokenId].comments;
       uint256 totalComments = comments.length;

      if(totalComments == 1){
        postByTokenId[_tokenId].comments = emptyCommentsArr;
      } else {

        tempCommentsArr = emptyCommentsArr;
        for (uint256 i = 0; i < totalComments;) {
          if (comments[i].id != _commentId) {
            tempCommentsArr.push(postByTokenId[_tokenId].comments[i]);
          }
          unchecked {++i;}
        }
        postByTokenId[_tokenId].comments = tempCommentsArr;
      }
    }

    //LIKES FUNCTION
    function like(uint256 _tokenId) public {
      //check if msg.sender is already in the likes array
      //find like index

      address[] memory likesList = postByTokenId[_tokenId].likes;
      uint totalLikes = likesList.length;
      bool hasLiked = false;
      uint256 likeIndex = 0;
      for(uint i = 0; i < totalLikes;) {
        if(postByTokenId[_tokenId].likes[i] == msg.sender) {
          hasLiked = true;
          likeIndex = i;
          break;
        }
        unchecked {++i;}
      }

      //if like index is 0 then add msg.sender to likes array
      if(!hasLiked){
        postByTokenId[_tokenId].likes.push(msg.sender);
      } else {
        //if like index is not 0 then remove msg.sender from likes array
        for(uint i = likeIndex; i < totalLikes-1;) {
          likesList[i] = likesList[i+1];
          unchecked {++i;}
        }
        postByTokenId[_tokenId].likes = likesList;
        postByTokenId[_tokenId].likes.pop();
      }
      console.log("likes", postByTokenId[_tokenId].likes.length);
    }

    //ADMIN FUNCTION
    function changeAdmin(address _newAdmin) public onlyAdmin {
      admin = _newAdmin;
    }

}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/LSP7Mintable.sol";

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

      uint256 index = 0;
      uint256 postsCount = postsIds.length;

      for (uint256 i = 0; i < postsCount;) {
        if (postsIds[i] == _tokenId) {
          index = i;
          break;
        }
        unchecked { ++i;}
      }

      delete postsIds[index];
    }

    function fetchPosts() public view returns (Post[] memory posts, uint256) {

      uint256 postsLength = postsIds.length;
      uint256[] memory postArray = postsIds;
      posts = new Post[](postsLength);

      for (uint i = 0; i < postsLength;) {
        posts[i] = postByTokenId[postArray[i]];
        unchecked {++i;}
      }

      return (posts, postsCounter);
    }

    //COMMENTS FUNCTIONS
    function createComment(uint256 _tokenId, string calldata _text) public {
      require(postByTokenId[_tokenId].author == msg.sender);
      ++commentsCounter;

      Comment memory comment = Comment({
        text: _text,
        commentor: msg.sender,
        id: ++commentsCounter
      });
      postByTokenId[_tokenId].comments.push(comment);
    }

    function removeComment(uint256 _tokenId, uint256 _commentId) public {
      require(postByTokenId[_tokenId].author == msg.sender ||
       postByTokenId[_tokenId].comments[_commentId].commentor == msg.sender ||
       admin == msg.sender,
       'Only post author or commentor can remove comment');
       //delete comment
       delete postByTokenId[_tokenId].comments[_commentId];
    }

    //LIKES FUNCTION
    function like(uint256 _tokenId) public {
      //check if msg.sender is already in the likes array
      bool isLiked = false;
      uint likesCount = postByTokenId[_tokenId].likes.length;
      for (uint256 i = 0; i < likesCount;) {
        if (postByTokenId[_tokenId].likes[i] == msg.sender) {

          isLiked = true;
          delete postByTokenId[_tokenId].likes[i];
          break;
        }
        unchecked{++i;}
      }
      if (!isLiked) {
        postByTokenId[_tokenId].likes.push(msg.sender);
      }
    }

    //ADMIN FUNCTION
    function changeAdmin(address _newAdmin) public onlyAdmin {
      admin = _newAdmin;
    }

}

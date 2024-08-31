// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {Test, console} from "forge-std/Test.sol";
import {Forum} from "../src/Forum.sol";

contract ForumTest is Test {
    Forum public forum;
    Forum.Post public post;

    function setUp() public {
        // create dummy address. this will "prank" for a msg.sender address
        vm.prank(address(1));
        string memory _title = "StackUp";
        string memory _description = "Empowering Developers at Scale!";
        bool _spoil = false;
        forum = new Forum();
        forum.createPost(_title, _description, _spoil);
    }

    function testCreatePoll() public {
        forum.createPoll(0, "Is StackUp The Best?", "Yes", "No");
        Forum.Poll memory _poll = forum.getPollFromPost(0);
        assertEq(_poll.question, "Is StackUp The Best?");
    }

    function testGetPost() public view {
        Forum.Post memory _post = forum.getPost(0);
        assertEq(_post.title, "StackUp");
        assertEq(_post.description, "Empowering Developers at Scale!");
        assertEq(_post.spoil, false);
    }

    function testVotePost() public {
        forum.upVotePost(0);
        Forum.Post memory _post = forum.getPost(0);
        assertEq(_post.likes, 1);
        forum.downVotePost(0);
        _post = forum.getPost(0);
        assertEq(_post.likes, 0);
    }
}

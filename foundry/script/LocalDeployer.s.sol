// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Forum} from "../src/Forum.sol";

// Full command of script is
// `source .env && forge script script/LocalDeployer.s.sol:LocalForumDeployerScript --rpc-url localhost -vvv`
// if done manually
// Requires anvil to run in the background
contract LocalForumDeployerScript is Script {
    Forum public forum;

    function setUp() public {}

    function run() external {
        // reads our .env file
        uint256 deployerPrivateKey = vm.envUint("LOCAL_DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        forum = new Forum();

        vm.stopBroadcast();
    }
}

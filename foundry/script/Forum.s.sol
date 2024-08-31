// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Forum} from "../src/Forum.sol";

// Full command of script is
// `source .env && forge script --chain arbitrum-sepolia script/Forum.s.sol:ForumDeployerScript --rpc-url arbitrum-sepolia --broadcast --etherscan-api-key "${ARBISCAN_API_KEY}" --verifier-url "${VERIFIER_URL}" --verify  -vvvv`
// if done manually
contract ForumDeployerScript is Script {
    Forum public forum;

    function setUp() public {}

    function run() external {
        // reads our .env file
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        forum = new Forum();

        vm.stopBroadcast();
    }
}

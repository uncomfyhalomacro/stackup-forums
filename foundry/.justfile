#!/usr/bin/just

set dotenv-load := true

all: format compile deploy-and-verify

compile:
	forge compile

deploy-and-verify: export-abi
	forge script --chain arbitrum-sepolia script/Forum.s.sol:ForumDeployerScript --rpc-url arbitrum-sepolia --broadcast --etherscan-api-key "${ARBISCAN_API_KEY}" --verifier-url "${VERIFIER_URL}" --verify  -vvvv

export-abi: compile
	forge script script/AbiExport.s.sol:AbiExportScript -vvvv

format:
	forge fmt script
	forge fmt src 
	forge fmt test
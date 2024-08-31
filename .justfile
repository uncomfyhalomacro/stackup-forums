#!/usr/bin/just

build: export-abi
	just stackup-forums/build

export-abi:
	just foundry/export-abi

dev:
	just stackup-forums/dev
	
start:
	just stackup-forums/build
	just stackup-forums/start

format:
	just foundry/format
	just stackup-forums/format

deploy-contract:
	just foundry/deploy-and-verify

contract:
	just foundry/all

check:
	just foundry/check
	just stackup-forums/lint
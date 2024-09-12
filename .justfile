#!/usr/bin/just

build:
	just forum_dapp/compile
	just stackup-forums/build

dev:
	just stackup-forums/dev
	
start:
	just stackup-forums/start

format: check fix
	just forum_dapp/format
	just stackup-forums/format

deploy-contract:
	just forum_dapp/deploy-and-verify

contract:
	just forum_dapp/all

check:
	just forum_dapp/check
	just stackup-forums/lint

fix:
	just stackup-forums/fix

_local-setup:
	just forum_dapp/local-setup

local-setup: _local-setup dev

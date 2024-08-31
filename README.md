# How to get started

```bash
mkdir stackup-forums
pushd $_
git init
forge init --force --vscode --no-commit foundry

# 1. Type stackup-forums for project directory
# 2. Cancel when it asks to initialise a repository 
yarn create @rainbow-me/rainbowkit
rm -rfv stackup-forums/.git
git add -A
git commit -m 'reinitialise project'
``` 

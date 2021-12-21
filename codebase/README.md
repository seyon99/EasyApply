# Codebase

## Environment setup for Windows 10+ users

Follow the guide: https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers to install WSL 2, and to install Docker desktop, etc.

Once you have WSL 2 installed, it is suggested that you choose Ubuntu 20.04 LTS as a distribution (as that is what this has been tested on.)

Open the Ubuntu prompt from Windows (search Ubuntu on your start menu), and clone the repository. You may need to add an SSH key to GitHub.

Generating SSH keys:

    # Side note: Make sure you run "chmod 600 /path/to/ssh.key" -- otherwise, you will not be able to add it using ssh-add.
    ssh-keygen

Adding SSH keys:

    eval $(ssh-agent)
    ssh-add /path/to/ssh.key

Recommended IDE: Visual Studio Code for Windows. It offers WSL (Windows Subsystem for Linux) integration, which is very handy for this.

Once you've added your SSH key, execute:

    git clone git@github.com:UTSCCSCC01/projectf21-Steadfast-Solutions.git
    cd projectf21-Steadfast-Solutions
    
You should now be able to follow the remaining instructions to complete setup.

Video instructions: https://qc-ca.flamz.pw/dl/installation.mp4

## Setting up environment

### Initializing environment variables

    source init.sh

## Building

### Building and running front/back end

    source init.sh
    docker-compose build
    docker-compose up

By default, the frontend is served on port 8000 and backend API on port 8001.

### Building frontend only

    source init.sh
    ./build.sh

## Running backend/frontend individually

### Running frontend only

    cd frontend
    npm install # If you haven't done so before
    npm run start

### Running backend only

    cd backend
    npm install # If you haven't done so before
    npm start

### Workflow
When adding a new feature to the codebase, make sure to follow the below steps:

1. Switch to dev branch if you have not already
2. git fetch + git pull to update your local dev branch
4. Create a new feature branch off dev with your features name
5. Before you push, make sure to run `npx prettier --write .` to standardize your formatting in both `frontend` and `backend`.
6. Commit necessary changes to your branch

When your features is done, and you are ready to create a pull request to merge onto dev, follow the below steps

1. Update your local dev branch to the latest version (git checkout dev + git fetch + git pull)
2. Switch back onto your feature branch and then rebase onto dev (git checkout abc + git rebase dev)
3. Merge conflicts may occur so make sure to resolve those
4. Force push your changes (so git tree won't be messed up) (git push --force)
5. Create the pull request and make changes as necessary
6. After 2+ members have approved, person in charge will merge it onto dev
7. DO NOT DELETE THE BRANCH AFTER MERGING as TA will need to mark it

# Documentation
Documentation will be auto generated based on the doctrings provided each file.
Refer to the following guides for more information: \
Frontend: https://typedoc.org/ \
Backend: https://jsdoc.app/
### Frontend
    npx typedoc --entryPointStrategy expand ./src

### Backend
    npm run docs
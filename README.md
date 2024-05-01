# About the project
The Pill Scheduler backend project is a service which 
    stores and returns pill to box number associations
    stores and returns schedules for each pill
    provides pill to be dispensed per each time range.
    returns server information 

# How to get the application
git clone https://github.com/isabelmariaantony/pill-scheduler-backend.git

# How to setup the application

## Install Node.js (if not already installed)
### Windows and macOS:
Visit the Node.js official website  - https://nodejs.org/ and download the installer for your operating system. You can choose between the LTS (Long Term Support) version, which is more stable, and the Current version, which has the latest features.
Run the installer, following the prompts to complete the installation. This will also install npm (Node Package Manager), which is essential for managing Node.js packages.
## Linux:
You can install Node.js via the package manager of your Linux distribution. For example, on Ubuntu, you can use the following commands:
bash

curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -  # Replace "14.x" with the version you want
sudo apt-get install -y nodejs

This also installs npm automatically.

## Verify Node.js Installation (if not already installed)

Open a terminal or command prompt and type:
node -v

This command should return the version of Node.js that was installed.

Check npm is installed by typing:
npm -v


## Set Up Your Node.js Application

cd pill-scheduler-backend

Install Dependencies: Run the following command in the application directory:
npm install

This command reads the package.json file in your application directory and installs all the necessary dependencies.


## Run the Application
Start your application with the following command:
npm start

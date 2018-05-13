# Server for the Space Technium game
#### 'Tis the greatest server ever made

# Requirements
## Disclaimer
This version was tested _only_ in NodeJS version `8.9.4` & `8.10.0`

## NodeJS
You can download it at [this website](https://nodejs.org/en/)
Or by the following commands in Ubuntu 16.04
```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## NPM
NPM is the nodejs package manager and necessary for the dependencies
```
sudo apt install -y npm
```
Now with NPM installed gyp will also be needed to build the c++ Octree
```
sudo npm install -g node-gyp
```

### Nodejs-websocket
This server depends on the `ws` NPM package to use the WebSocket API as to provide continuous connection between client and server. It is recommended to install only as a local package to this server through the installation process below. You can dig more info at the [official website](https://www.npmjs.com/)

# Installation on Linux systems
Create a directory for this project and copy this repository
```bash
mkdir space-technium && cd space-technium
git clone https://github.com/SpaceTechnium/server.git
```
Install NPM packages
```
cd server && npm install
```
Compiling the C++ Octree Build
```
cd octree/standalone && node-gyp configure build
```
Spin up the server for testing with
```
npm test
```
or 
```
nodejs app.js
```

# TODOs

To check out what needs to be done and the wishlists of the project check out the TODO.md.

# Contributing and Bug Reports

Right now we won't be accepting third party code until the summer of 2018, until then feel free to point out any bugs or request features by creating an issue.

# Licensing
This code is Licensed GPLv3. Please read the LICENSE file for more details.

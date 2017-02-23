Log aggregation service + Refrence web application

! Important
Before using LAS redis server must be set up on your local machine (and start redis server with provided config). I used default stable redis server for windows https://redis.io/download
Use provided "redis.conf" file as your redis configuration (this configuration will create redis snapshots into c:\ disc (you change this place yourself because on some computers c:\ disc has limited access for write, just change the line 107 in redis.conf file), snapshot will be done every 300 seconds if at least one key was changes/created)
Default redis server on windows machine is - http://127.0.0.1:6379/


* LAS *
1. LAS server can be found in "las" folder
2. To build LAS application user needs to run command "npm run build"
3. Compiled LAS application can be found in las/out
4. To run LAS application user needs to write "npm run start:dev" in las folder
5. LAS is using redis caching service so one needs to modify code on his own behalf
6. Server runs on port 5000 (user can change it through code) - full link localhost:5000

LAS idea - application creates several workers (based on how many cores running pc's cpu has) and using custom created worker pool manager gives jobs to those workers. If some worker is working on one process, new job is given to other worker. If all workers are working it is waited while one worker 

* RWA *
1. RWA application can be found in folder "rwa"
2. Application in built on React framework
3. To run RWA application user needs to write command "npm run start:dev" in rwa folder
4. To open RWA application open browser and open http://localhost:5050

* Simple logger *
1. Simple logger application can be found under "simple-logger" folder
2. To build Simple Logger user needs to run command "npm run build"
3. To run tests for this application user needs to run command "npm run test"

To-do in the future
1. Configure and run redis on vagrant server "https://www.vagrantup.com/" (for reusability on different platforms)
2. Create LAS client. It would be similar to simple logger application, but will also have all the functionalities needed to communicate with LAS server, because currently "Simple Logger" usage and LAS communication needs to be coded separately
3. Use GULP task runner for easier application handling
4. Use express server on RWA for production environment
5. Improve workers flow with auto-revive if something fails in between processes (kill worker -> start worker over again)
6. Use redis for workers pool processing and job distribution
cmd_Release/octree := g++ -pthread -rdynamic -m64  -o Release/octree -Wl,--start-group ./Release/obj.target/octree/../demo.o ./Release/obj.target/octree/test.o -Wl,--end-group 

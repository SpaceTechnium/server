cmd_Release/octree := g++ -pthread -rdynamic -m64  -o Release/octree -Wl,--start-group ./Release/obj.target/octree/../OriginalOctree.o ./Release/obj.target/octree/test.o -Wl,--end-group 

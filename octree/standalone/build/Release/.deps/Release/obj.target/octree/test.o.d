cmd_Release/obj.target/octree/test.o := g++ '-DNODE_GYP_MODULE_NAME=octree' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' -I/usr/include/nodejs/include/node -I/usr/include/nodejs/src -I/usr/include/nodejs/deps/uv/include -I/usr/include/nodejs/deps/v8/include -I../..  -fPIC -pthread -Wall -Wextra -Wno-unused-parameter -m64 -O3 -fno-omit-frame-pointer -fno-rtti -std=gnu++0x -MMD -MF ./Release/.deps/Release/obj.target/octree/test.o.d.raw   -c -o Release/obj.target/octree/test.o ../test.cpp
Release/obj.target/octree/test.o: ../test.cpp ../standalone.h
../test.cpp:
../standalone.h:

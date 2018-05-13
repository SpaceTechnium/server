#include <stdio.h> 
#include "octree.h"

int demo(int argc, char* argv[], FILE *out)
{
    Octree<double> o(4096); /* Create 4096x4096x4096 octree containing doubles. */
    o(1,2,3) = 3.1416;      /* Put pi in (1,2,3). */
    o.erase(1,2,3);         /* Erase that node. */
    
    fprintf(out,"Heyo bitches %dislit",69420);
	return 0;
}


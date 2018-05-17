#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <cmath>
#include <time.h>
#include <ctime>

using namespace std;

enum Type{Planet, Player, Bullet};
int maxDepth = 0;
bool debug = false;

struct Point
{
    double x,y,z;
    Point(double x_, double y_, double z_): x(x_),y(y_),z(z_){}
};

struct Object
{
    Point *point;
    double boundingBox;
    Type type;
    struct Object *next;
    bool inBorder = false;
    Object(Point *point_): point(point_){}
};

struct Node
{
    struct Point *center;
    double scope; // size of box
    int depth;
    int numObjects = 0;
    bool firstObject = true;
    struct Object *object;
    struct Node **children;
};

void initialize(Node *root, int scope)
{
    root->children = new Node*[8];
    root->scope = scope;
    root->center = new Point(0,0,0);
    root->depth = 0;

    for(int i=scope;i>=0.5;i/=8)
    {
        maxDepth++;
    }
}

void initNode(Node *root, Node *newd, int sector)
{
    newd->children = new Node*[8];
    newd->scope = root->scope/2;
    double pos = newd->scope/2;
    double x = root->center->x, y = root->center->y, z = root->center->z;

    switch(sector)
    {
        case 0: newd->center =  new Point(x - pos, y - pos, z - pos);break;
        case 1: newd->center =  new Point(x - pos, y - pos, z + pos);break;
        case 2: newd->center =  new Point(x - pos, y + pos, z - pos);break;
        case 3: newd->center =  new Point(x - pos, y + pos, z + pos);break; 
        case 4: newd->center =  new Point(x + pos, y - pos, z - pos);break;
        case 5: newd->center =  new Point(x + pos, y - pos, z + pos);break;
        case 6: newd->center =  new Point(x + pos, y + pos, z - pos);break;
        case 7: newd->center =  new Point(x + pos, y + pos, z + pos);break;
    }
    newd->depth = root->depth + 1;
}

bool lessThan(double x, double y)
{
    return x < y;
}

int calcSector(Point *center, Object *object)
{
    bool x1,x2,y1,y2,z1,z2;

    x1 = lessThan(object->point->x + object->boundingBox,center->x);
    x2 = lessThan(object->point->x - object->boundingBox,center->x);
    y1 = lessThan(object->point->y + object->boundingBox,center->y);
    y2 = lessThan(object->point->y - object->boundingBox,center->y);
    z1 = lessThan(object->point->z + object->boundingBox,center->z);
    z2 = lessThan(object->point->z - object->boundingBox,center->z);

    if(x1 && x2)
    {
        if(y1 && y2)
        {
            if(z1 && z2)
            {
                return 0;
            }
            else if(!z1 && !z2)
            {
                return 1;
            }
        }
        else if(!y1 && !y2)
        {
            if(z1 && z2)
            {
                return 2;
            }
            else if(!z1 && !z2)
            {
                return 3;
            }
        }
    }
    else if(!x1 && !x2)
    {
        if(y1 && y2)
        {
            if(z1 && z2)
            {
                return 4;
            }
            else if(!z1 && !z2)
            {
                return 5;
            }
        }
        else if(!y1 && !y2)
        {
            if(z1 && z2)
            {
                return 6;
            }
            else if(!z1 && !z2)
            {
                return 7;
            }
        }
    }
    
    return -1;
}

void insert(Node *root, Object *object)
{
    int sector = -1;
    if(root->depth != maxDepth)
    {
        sector = calcSector(root->center,object);
        if(sector == -1) object->inBorder = true;
    }

    if(root->depth == maxDepth || sector == -1)
    {
        Object *tmp = root->object;
        object->next = tmp;
        root->object = object;
        root->numObjects++;
        return;
    }

    if(sector >= 0)
    {
        if(root->object!=NULL && root->firstObject)
        {
            Object *tempy = root->object;
            root->object = NULL;
            root->firstObject = false;
            root->numObjects--;
            insert(root,tempy);
        }

        if(root->children[sector]!=NULL)
        {
            insert(root->children[sector],object);
        }
        else
        {
            root->children[sector] = new Node;
            initNode(root,root->children[sector],sector);  
            root->children[sector]->object = object;
            root->children[sector]->numObjects++;
        } 
    }
    if(debug)debug=false; 
}

bool checkCollision(Object *a, Object *b)
{
    double distance = pow(a->point->x - b->point->x, 2.0) + pow(a->point->y - b->point->y, 2.0) + pow(a->point->z - b->point->z, 2.0);
    double radius = pow(a->boundingBox + b->boundingBox,2);
    
    return distance < radius;
}

void collision(Node *root, Object *object)
{
    if(root->numObjects != 0)
    {
        Object *tmp = root->object;
        while(tmp)
        {
            if(checkCollision(object,tmp))
            {
                cout<<object->type<<"("<<object->point->x<<","<<object->point->y<<","<<object->point->z<<") "<<object->boundingBox<<"\t"<<tmp->type<<"("<<tmp->point->x<<","<<tmp->point->y<<","<<tmp->point->z<<") "<<tmp->boundingBox<<endl;
            }
            tmp = tmp->next;
        }
    }

    if(root->depth == maxDepth)return;

    int sector = calcSector(root->center,object);
    if(sector == -1)
    {
        for(int i = 0;i < 8;i++)
            collision(root->children[i],object);
    }
    
    if(sector >= 0)
    {
        collision(root->children[sector],object);
    }
}

void print_helper(Node *root, int lvl, int child)
{
    if(root == NULL) return;
    
    if(lvl == 0)
    {
        cout <<"Me: "<<child<<"\tCenter(" << root->center->x << "," << root->center->y << "," << root->center->z << ")\tScope: "<<root->scope<<"\tDepth: " << root->depth<<"\tBounds: x(" << root->center->x - root->scope/2 << "," << root->center->x + root->scope/2 << ") y(" << root->center->y - root->scope/2 << "," << root->center->y + root->scope/2 << ") z(" << root->center->z - root->scope/2 << "," << root->center->z + root->scope/2 <<")\n";
        if(root->numObjects == 0){cout << "Empty"<<endl<<endl;return;}
        Object *tmp = root->object;
        while(tmp)
        {
            cout << "(" << tmp->point->x << "," << tmp->point->y << "," << tmp->point->z << ")\tBox: "<<tmp->boundingBox<<"\tinBorder? "<<tmp->inBorder<<endl;
            tmp = tmp->next;
        }
        cout << endl;
    }
    else
    {
        print_helper(root->children[0],lvl - 1,0);
        print_helper(root->children[1],lvl - 1,1);
        print_helper(root->children[2],lvl - 1,2);
        print_helper(root->children[3],lvl - 1,3);
        print_helper(root->children[4],lvl - 1,4);
        print_helper(root->children[5],lvl - 1,5);
        print_helper(root->children[6],lvl - 1,6);
        print_helper(root->children[7],lvl - 1,7);
    }
}

void print(Node *root)
{
    if(root == NULL) cout<<"Tree is empty"<<endl;

    cout<<"Printing level by level"<<endl<<endl;

    for(int i = 0; i <= maxDepth; i++)
    {
        cout << "Level: " << i<<endl;
        print_helper(root,i,0);
        cout << "-------------------\n";
    }
}

int entry(int argc, char* argv[], FILE *out)
{
    clock_t begin_time, end_time;
    double insertionTime, collisionTime;
    Node *root = new Node;
    initialize(root,2048);
    srand (time(NULL));//1526338465
    Object *tmp;

    Type type = Planet;

    begin_time = clock();

    for(int i = 0; i < 0; i++)
    {
        Point *p = new Point(rand() % 2049 + (-1024),rand() % 2049 + (-1024),rand() % 2049 + (-1024));
        tmp = new Object(p);
        tmp->boundingBox = rand() % 10 + 5;
        tmp->type = Planet;
        tmp->next = NULL;
        insert(root,tmp);
    }

    for(int i = 0; i < 10000000; i++)
    {
        Point *p = new Point(rand() % 2049 + (-1024),rand() % 2049 + (-1024),rand() % 2049 + (-1024));
        tmp = new Object(p);
        tmp->boundingBox = 0;
        tmp->type = Bullet;
        tmp->next = NULL;
        insert(root,tmp);
    }
    end_time = clock();

    insertionTime = double(end_time - begin_time) / CLOCKS_PER_SEC * 1000;
    
    begin_time = clock();
    for(int i = 0; i < 1000; i++)
    {
        Point *p = new Point(rand() % 2049 + (-1024),rand() % 2049 + (-1024),rand() % 2049 + (-1024));
        tmp = new Object(p);
        tmp->boundingBox = 5;
        tmp->type = Player;
        tmp->next = NULL;
        collision(root,tmp);
    }
    end_time = clock();
    
    collisionTime = double(end_time - begin_time) / CLOCKS_PER_SEC * 1000;

    cout <<"Insertion Time Taken: " << insertionTime << " ms\n"<<endl;
    cout <<"Collision Time Taken: " << collisionTime << " ms\n"<<endl;
    cout <<"Total Time Taken: " << insertionTime + collisionTime << " ms\n"<<endl;
    //print(root);
    //fprintf(out,"Heyo bitches %dislit",69420);
    return 0;
}

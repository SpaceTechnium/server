#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include <ctime>
#include <string.h>

using namespace std;

enum Type{Bullet, Planet, Player};
enum Collision{Conquest, CollisionBullet, CollisionPlanet};

int maxDepth = 0;
bool debug = false;

struct Point
{
    double x,y,z;
    Point(double x_, double y_, double z_): x(x_),y(y_),z(z_){}
};

struct Object
{
    char *name;
    int id;
    Point *point;
    double boundingBox;
    double radius;
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

Node *rooted;

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

bool insert(Node *root, Object *object)
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
        root->firstObject = false;
        root->numObjects++;
        return 0;
    }

    if(sector >= 0)
    {
        if(root->object!=NULL && root->firstObject)
        {
            Object *tempy = root->object;
            root->object = NULL;//tempy->next;
            root->firstObject = false;
            root->numObjects--;
            insert(root,tempy);
        }

        if(root->children[sector]!=NULL)
        {
            insert(root->children[sector],object);
            return 1;
        }
        else
        {
            root->children[sector] = new Node;
            initNode(root,root->children[sector],sector);  
            root->children[sector]->object = object;
            root->children[sector]->numObjects++;
        } 
    }
    return 1;
}

int checkCollision(Object *a, Object *b)
{
    double distance = pow(a->point->x - b->point->x, 2.0) + pow(a->point->y - b->point->y, 2.0) + pow(a->point->z - b->point->z, 2.0);
    double box1 = pow(a->boundingBox,2), box2 = pow(b->boundingBox,2);
    double radius = pow(b->radius,2);
    
    if(distance <= (box1 + box2*radius))
        return 0;   // colisao com objeto

    if(distance <= (box1+box2))
        return 1;   // colisao com bounding box
    
    return -1;       // ain't a colisao
}

void collision(Node *root, Object *object, char * response)
{
    int collisionCheck;
    char reply[300];

    if(root == NULL) return;
    
    if(root->numObjects != 0)
    {
        Object *tmp = root->object;
        while(tmp)
        {
            collisionCheck = checkCollision(object,tmp);
            if(collisionCheck != -1)
            {
                sprintf(reply,
                "{\"player\":{\"name\":\"%s\",\"pos_x\":%lf,\"pos_y\":%lf,\"pos_z\":%lf},\"object\":{\"uuid\":\"%d\",\"pos_x\":%lf,\"pos_y\":%lf,\"pos_z\":%lf,\"conquest\":%d,\"planet\":%d}},\0",
                    object->name,object->point->x,object->point->y,object->point->z,tmp->id,tmp->point->x,tmp->point->y,tmp->point->z,collisionCheck,tmp->type
                );
                strcat(response,reply);
                //cout<<object->type<<"("<<object->point->x<<","<<object->point->y<<","<<object->point->z<<") "<<object->boundingBox<<"\t"<<tmp->type<<"("<<tmp->point->x<<","<<tmp->point->y<<","<<tmp->point->z<<") "<<tmp->boundingBox<<endl;
            }
            tmp = tmp->next;
        }
    }

    if(root->depth == maxDepth)return;

    int sector = calcSector(root->center,object);
    if(sector == -1)
    {
        for(int i = 0;i < 8;i++)
            collision(root->children[i],object,response);
    }
    
    if(sector >= 0)
    {
        collision(root->children[sector],object,response);
    }
}

bool getValues(char **stringy, char *name, double *x, double *y, double *z, double *box, double *radius, int *id)
{
    char *string = stringy[0];
    int coordsAccessed = 0;
    (*x) = (*y) = (*z) = (*box) = -1;
    char buff[20];

    while(string[0] != '}' && string[0] != '\0')
    {
        string++;
        
        strncpy(buff,string,8);
        buff[8] = '\0';

        if(strcmp(buff,"\"pos_x\":") == 0)
        {
            string +=8;
            strncpy(buff,string,20);
            for(int i=0; buff[i] != '\0'; string++, i++)
            {
                if(buff[i] == '}' || buff[i] == ',')
                {
                    buff[i] = '\0';
                    break;
                }
            }
            (*x) = strtod(buff, NULL);
            coordsAccessed++;
            continue;
        }
        else if(strcmp(buff,"\"pos_y\":") == 0)
        {
            string +=8;
            strncpy(buff,string,20);
            for(int i = 0; buff[i] != '\0'; string++, i++)
            {
                if(buff[i] == '}' || buff[i] == ',')
                {
                    buff[i] = '\0';
                    break;
                }
            }
            (*y) = strtod(buff, NULL);
            coordsAccessed++;
            continue;
        }
        else if(strcmp(buff, "\"pos_z\":") == 0)
        {
            string +=8;
            strncpy(buff,string,20);
            for(int i = 0; buff[i] != '\0'; string++, i++)
            {
                if(buff[i] == '}' || buff[i] == ',')
                {
                    buff[i] = '\0';
                    break;
                }
            }
            (*z) = strtod(buff, NULL);
            coordsAccessed++;
            continue;
        }
        else if(strcmp(buff, "\"radis\":") == 0)
        {
            string +=8;
            strncpy(buff,string,20);
            for(int i = 0; buff[i] != '\0'; string++, i++)
            {
                if(buff[i] == '}' || buff[i] == ',')
                {
                    buff[i] = '\0';
                    break;
                }
            }
            (*radius) = strtod(buff, NULL);
            continue;
        }
        else if(strcmp(buff, "\"uniid\":") == 0 && id != NULL)
        {
            string += 8;
            strncpy(buff,string,20);
            for(int i = 0; buff[i] != '\0'; string++, i++)
            {
                if(buff[i] == '}' || buff[i] == ',')
                {
                    buff[i-1] = '\0';
                    break;
                }
            }
            (*id) = strtol(buff, NULL, 10);
            continue;
        }
        else if(strcmp(buff, "\"name\":\"") == 0 && name != NULL)
        {
            string += 8;
            strncpy(buff,string,20);
            for(int i = 0; buff[i] != '\0'; string++, i++)
            {
                if(buff[i] == '}' || buff[i] == ',')
                {
                    buff[i-1] = '\0';
                    break;
                }
            }
            strcpy(name,buff);
            continue;
        }
        else
        {
            strncpy(buff,string,11);
            buff[11] = '\0';
            if(strcmp(buff, "\"boundbox\":") == 0)
            {
                string +=11;
                strncpy(buff,string,20);
                for(int i = 0; buff[i] != '\0'; string++, i++)
                {
                    if(buff[i] == '}' || buff[i] == ',')
                    {
                        buff[i] = '\0';
                        break;
                    }
                }
                (*box) = strtod(buff, NULL);
                continue;
            }
        }
    }

    if((*box) == -1)(*box) = 0;
    string++;
    if(string[0] == ',') string++;

    stringy[0] = string;

    if(coordsAccessed == 3) return true;
    else return false;
}

int entry(int argc, char* argv[], FILE *out)
{
    clock_t begin_time, end_time;
    double insertionTime, collisionTime;
    Node *root = new Node;
    initialize(root,2048);
    rooted = root;
    //srand (time(NULL));//1526338465
    Object *tmp;
    char *string = argv[1]; // new char[2048];
    
    //strcpy(string,"{\"planets\":[{\"pos_x\":882.277,\"pos_y\":390.1,\"pos_z\":109.18,\"radis\":10,\"boundbox\":5},{\"pos_x\":493.464,\"pos_y\":451.908,\"pos_z\":837.736,\"radis\":2,\"boundbox\":30},{\"pos_x\":99.268,\"pos_y\":311.388,\"pos_z\":937.991,\"radis\":30,\"boundbox\":15}],\"bullets\":[{\"pos_x\":200,\"pos_y\":300,\"pos_z\":400,\"boundbox\":0}],\"players\":[{\"name\":\"Claudex\",\"pos_x\":882,\"pos_y\":391,\"pos_z\":108,\"boundbox\":11},{\"name\":\"Vitones\",\"pos_x\":483,\"pos_y\":445,\"pos_z\":840,\"boundbox\":12},{\"name\":\"Pedroscas\",\"pos_x\":200,\"pos_y\":300,\"pos_z\":400,\"boundbox\":13}]}\0"); //argv[1])
    char *name = NULL;
    char buff[50];
    char response[4096] = "{\"collisions\":[\0"; // 
    double x, y, z, box, radius;
    int id;
    begin_time = clock();
    
    for(; string[0] != '\0';)
    {
        if(string[0] == '}') break;
        if(string[0] == '{') string++;
        strncpy(buff,string,9); // cuts string to get the key
        buff[9] = '\0';
        string +=11;
        if(strcmp(buff,"\"planets\"") == 0)
        {
            while(string[0] != ']' && string[0] != '\0')
            {  
                if(!getValues(&string, NULL, &x, &y, &z, &box, &radius, &id)) return 0;
                Point *p = new Point(x,y,z);
                tmp = new Object(p);
                tmp->id = id;
                tmp->name = name;
                tmp->boundingBox = box;
                tmp->radius = radius;
                tmp->type = Planet;
                tmp->next = NULL;
                insert(root,tmp);
            }
            string++;
            if(string[0] == ',')string++;             
        }
        else if(strcmp(buff,"\"bullets\"") == 0)
        {
            while(string[0] != ']' && string[0] != '\0')
            {
                if(!getValues(&string, NULL, &x, &y, &z, &box, &radius, &id)) return 0;
                Point *p = new Point(x,y,z);
                tmp = new Object(p);
                tmp->name = name;
                tmp->id = id;
                tmp->boundingBox = box;
                tmp->radius = radius;
                tmp->type = Bullet;
                tmp->next = NULL;
                insert(root,tmp);
            }
            string++;
            if(string[0] == ',')string++;             
        }
        else if(strcmp(buff,"\"players\"") == 0)
        {
            debug = true;   
            while(string[0] != ']' && string[0] != '\0')
            {
                             
                name = new char[15];
                if(!getValues(&string, name, &x, &y, &z, &box, &radius, NULL)) return 0;
                Point *p = new Point(x,y,z);
                tmp = new Object(p);
                tmp->name = name;
                tmp->boundingBox = box;
                tmp->radius = radius;
                tmp->type = Player;
                tmp->next = NULL;
                collision(root,tmp,response);
            }
            string++;
            if(string[0] == ',')string++;             
        }
    }
    
    
    /*
    for(int i = 0; i < 3; i++)
    {
        Point *p = new Point(rand() % 2049 + (-1024),rand() % 2049 + (-1024),rand() % 2049 + (-1024));
        tmp = new Object(p);
        tmp->boundingBox = rand() % 10 + 5;
        tmp->type = Planet;
        tmp->next = NULL;
        insert(root,tmp);
    }

    for(int i = 0; i < 1; i++)
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
    for(int i = 0; i < 3; i++)
    {
        Point *p = new Point(rand() % 2049 + (-1024),rand() % 2049 + (-1024),rand() % 2049 + (-1024));
        tmp = new Object(p);
        tmp->boundingBox = 5;
        tmp->type = Player;
        tmp->next = NULL;
        collision(root,tmp,response);
    }
    end_time = clock();
    
    collisionTime = double(end_time - begin_time) / CLOCKS_PER_SEC * 1000;
    */

    /*cout <<"Insertion Time Taken: " << insertionTime << " ms\n"<<endl;
    cout <<"Collision Time Taken: " << collisionTime << " ms\n"<<endl;
    cout <<"Total Time Taken: " << insertionTime + collisionTime << " ms\n"<<endl;*/
    //print(root);

    response[strlen(response)-1] = '\0';
    sprintf(buff, "]}\0"); // \n\nTime Taken to run: %lf\n\0", insertionTime
    strcat(response,buff);
    fprintf(out,"%s",response);
    return 1;
}

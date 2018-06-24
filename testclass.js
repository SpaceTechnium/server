"use strict";
class test2
{
    constructor(value) {
        this.value = value;
    }
}
class test
{
    constructor() {
        this.testArray = []
    }

    generate(){
        for(var i = 0; i < 5; i ++)
        {
            this.testArray.push(new test2(i));
        }
    }
}

module.exports = test;
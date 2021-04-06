class Transmission{
    constructor(x, y, destX, destY, senderID, destID, distance){
        this.pos = createVector(x,y);
        this.dest = createVector(destX,destY);
        this.str = distance * 0.001;
        this.destID = destID;
        this.senderID = senderID;
        this.isActive =  true;
    };

    display(){
        fill(100,100,100);
        ellipse(this.pos.x, this.pos.y, 10, 10);
    }

    update(lunasats){
        if(this.isActive){
            this.pos.x = lerp(this.pos.x, this.dest.x, 0.1 );
            this.pos.y = lerp(this.pos.y, this.dest.y, 0.1 );
            var d = this.pos.dist(this.dest);
            if(d < 20){
                this.isActive = false;
                lunasats[this.destID].transmit(lunasats,this);
                lunasats[this.destID].c = color(0,0,0);
            }
        }
    }
}
class Link{
    constructor(Ax, Ay, Aid, Bx, By, Bid){
        this.nodeA = createVector(Ax, Ay);
        this.nodeB = createVector(Bx,By);
        this.dist = dist(Ax,Ay,Bx,By);
        this.Aid = Aid;
        this.Bid = Bid;
    }

    display(){
        stroke(255, 0, 0); 
        line(this.nodeA.x, this.nodeA.y, this.nodeB.x, this.nodeB.y);
    }
}
class Grid{
    constructor(n,m,size){
        this.nCols = n;
        this.nRows = n;
        this.size = size;
        this.vals = [];
        for(let j = 0; j < this.nRows; j++){
            for(let i = 0; i < this.nCols; i++){
                this.vals[i+j*this.nRows] = 0;
            }
        }
    }

    updateVals(vals){
        this.vals = vals;
    }

    display(){
        for(let j = 0; j < this.nRows; j++){
            for(let i = 0; i < this.nCols; i++){
                rect(this.size * i, this.size * j, this.size, this.size);
                // stroke(155, 155, 155); 
                fill(this.vals[i + j*this.nRows],0,0);
            }
        }
    }
}
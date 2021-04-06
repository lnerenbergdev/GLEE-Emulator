function Food(x,y,WIDTH,HEIGHT){
	this.location = {
		x:x,
		y:y
	}

	this.display = function(){
		fill(255);
		ellipse(this.location.x,this.location.y,5,5);
	}

	this.reset = function(){
		this.location.x = Math.floor(Math.random()*WIDTH);
		this.location.y = Math.floor(Math.random()*HEIGHT);
	}
}
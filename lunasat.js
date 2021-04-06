class Lunasat{
	// this.brain = new Network(2,2);

	constructor(x,y,id){
		this.id = id;

		// Motion Vectors
		this.pos = createVector(x, y);

		this.size = 50;
		this.offset = createVector(this.size/2,this.size/2);
		
		this.dragging = false;
		this.rollover = false;

		this.vel = createVector(0,0);
		this.acc = createVector(0,0);

		this.velMag = 0;
		this.heading = 90;

		this.maxSpeed = 9;

		// GLEE Sensor Emulation
		this.temperature = 22;
		this.radation = 1;
		this.magnetic = [10,10];
		this.tpile = 0;
		this.capacitance = 0;

		angleMode(DEGREES);
		colorMode(RGB, 255);

		this.time = 0;

		this.c = color(random(255),random(255),random(255));
		
		this.history = [];
		this.links = [];
		this.nLinks = 0;

		this.lastSample = 0;
		
		this.range = 0;
		this.transmissions = [];
		this.nActiveTransmissions = 0;

		this.transmitting = false;

		this.links = [];
	}
	

	init(WIDTH,HEIGHT){
		// Randomize location
		this.pos = createVector(Math.floor(Math.random()*WIDTH),Math.floor(Math.random()*HEIGHT));

		this.heading = Math.floor(Math.random()*360);

		// this.vel = Vector(cos(this.heading) * this.maxSpeed, sin(this.heading) * this.maxSpeed);

		// Randomized velocity 
		// this.vel.x = cos(this.heading) * this.maxSpeed;
		// this.vel.y = sin(this.heading) * this.maxSpeed;
		
		// Set contents
		this.contents = 1000;

		this.range = 400;
	}

	updateTransmissions(lunasats){

		for(var i = 0; i < this.transmissions.length; i++){
			this.transmissions[i].update(lunasats);
		}

		for(let i = this.transmissions.length - 1; i >= 0; i--){
			if(!this.transmissions[i].isActive){
				this.transmissions.splice(i, 1);
			}
		}

		if(this.transmissions.length == null){
			this.transmitting = false;
		}

	}

	update(lunasats){

		if (this.dragging){
			this.pos.x = mouseX + this.offset.x, 
			this.pos.y = mouseY + this.offset.y;
		}

		this.updateTransmissions(lunasats);
		

		// Stuff for motion

		// this.vel.x = cos(this.heading) * this.maxSpeed;
		// this.vel.y = sin(this.heading) * this.maxSpeed;

		// if(this.vel.x > this.maxSpeed){
		// 	this.vel.x = this.maxSpeed;
		// }

		// if(this.vel.y > this.maxSpeed){
		// 	this.vel.y = this.maxSpeed;
		// }

		// this.pos.x += this.vel.x;
		// this.pos.y += this.vel.y;


		// this.contents-=0.2;

		// if(this.contents < 0){
		// 	this.isAlive = false;
		// }
	}

	transmit(lunasats){
		if(!this.transmitting){
			this.updateLinks(lunasats);
			this.transmitting = true;
			this.nActive = 0;
			for(var i = 0; i < this.nLinks; i++){
				this.transmissions.push(new Transmission(this.pos.x + this.size/2, this.pos.y + this.size/2, this.links[i].nodeB.x, this.links[i].nodeB.y, this.links[i].Aid, this.links[i].Bid, this.links[i].dist));
				this.nActive += 1;
			}
		}
	}

	repeat(lunasats,transmission){
		if(!this.transmitting){
			this.updateLinks(lunasats);
			this.transmitting = true;
			for(var i = 0; i < this.nLinks; i++){
				if(transmission.senderID != this.links[i].Bid){
					if(this.links[i].Bid != transmission.senderID){
						this.transmissions.push(new Transmission(this.pos.x + this.size/2, this.pos.y + this.size/2, this.links[i].nodeB.x, this.links[i].nodeB.y, this.id, this.links[i].Bid, this.links[i].dist));
						this.nActive += 1;
					}
				}
			}
		}		
	}

	updateLinks(lunasats){
		this.links = [];
		this.nLinks = 0;
		for(var i = 0; i < lunasats.length; i++){
			if(this.id!=i){
				if(dist(this.pos.x + this.size/2, this.pos.y + this.size/2, lunasats[i].pos.x + this.size/2, lunasats[i].pos.y + this.size/2)<this.range){
					this.links.push(new Link(this.pos.x + this.size/2, this.pos.y + this.size/2, this.id, lunasats[i].pos.x + this.size/2, lunasats[i].pos.y + this.size/2, i));		
					this.nLinks += 1;
				} 
			}
		}
	}

	getLinks(lunasats){
		let links1 = [];

		for(var i = 0; i < lunasats.length; i++){
			if(this.id!=i){
				if(dist(this.pos.x + this.size/2, this.pos.y + this.size/2, lunasats[i].pos.x + this.size/2, lunasats[i].pos.y + this.size/2)<this.range){
					links1.push([this.id, lunasats[i].id]);		
				} 
			}
		}
		return links1;
	}

	displayTransmissions(){
		if(this.transmitting){
			for(var i = 0; i < this.transmissions.length; i++){
				if(this.transmissions[i].isActive){
					this.transmissions[i].display();
				}
			}
		}
	}

	displayLinks(){
		if(this.nLinks>0){
			for (var i = 0; i < this.links.length; i++){
				this.links[i].display();
			}
		}

		// for(var i = 0; i < lunasats.length; i++){
		// 	if(dist(this.pos.x + this.size/2,this.pos.y+this.size/2, lunasats[i].pos.x +this.size/2, lunasats[i].pos.y+this.size/2)<this.range){
		// 		nLinks += 1;
		// 		stroke(255,0,0);
		// 		line(this.pos.x+this.size/2,this.pos.y+this.size/2,lunasats[i].pos.x+this.size/2,lunasats[i].pos.y+this.size/2);
		// 	}

		// 	if (this.sending) {
		// 		var x = 
		// 		this.sender.x = lerp(this.transmission.x, lunasat[i].pos.x, 0.1);
		// 		this.sender.y = lerp(this.sender.y, this.b.position.y, 0.1);
		// 		var d = p5.Vector.dist(this.sender, this.b.position);
		// 		if (d < 1) {
		// 			this.b.feedforward(this.output);
		// 			this.sending = false;
		// 		}
		// 	}
		// }
	}

	over(){
		if (mouseX > this.pos.x && mouseX < this.pos.x + this.size && mouseY > this.pos.y && mouseY < this.pos.y + this.size){
			this.rollover = true;
		}else{
			this.rollover = false;
		}
	}

	display(){
		noStroke(0);
		
		if (this.dragging){
			fill(100);
		} else if (this.rollover){
			fill(200);
		} else {
			fill(this.c);
		}

		rect(this.pos.x, this.pos.y, this.size,this.size);

		// Stats printout			
		textSize(20);
		var stats = this.defaultSensorSample();
		stats = [nf(stats[0],2,3),nf(stats[1],2,3),nf(stats[2],2,3),nf(stats[3],2,3)]


		this.displayLinks();
		this.displayTransmissions(); 

		
		//text(stats.toString(), this.pos.x, this.pos.y);
	}

	reset(WIDTH, HEIGHT){
		this.pos.x = Math.floor(Math.random()*WIDTH);
		this.pos.y = Math.floor(Math.random()*HEIGHT);

		this.vel.x = Math.floor(Math.random()*2*this.maxSpeed - this.maxSpeed);
		this.vel.y = Math.floor(Math.random()*2*this.maxSpeed - this.maxSpeed);

		this.brain.init();

		this.contents = 100;
		this.isAlive = true;
	}

	getAcclReading(){
		// Returning vel to make it interesting since its always rotating and going forard. can callculate dv
		return this.vel.x;
	}

	getTemperature(){
		this.temperature = this.contents;
		return this.temperature;
	}

	defaultSensorSample(){
		var sample = [1,2,3,4,5,6];
		return sample;
	}

	turn(direction){
		var velMag = Math.sqrt(Math.exp(this.vel.x,2)+Math.exp(this.vel.y,2));
		this.heading += direction;
	}

	pressed(){
		if (mouseX > this.pos.x && 
			mouseX < this.pos.x + this.size && 
			mouseY > this.pos.y && 
			mouseY < this.pos.y + this.size){
			
			this.dragging = true;
			this.offset.x = this.pos.x - mouseX;
			this.offset.y = this.pos.y - mouseY;
		}	
	}

	released(){
		this.dragging = false;
	}
}












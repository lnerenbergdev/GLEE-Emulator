var snippets = {
	"neuron":
`//Neuron constructor takes constant and weights array
function Neuron(c,weights){	
	//Weights array
	this.weights = weights;
	
	//Constant
	this.c = c;
	
	//Feed Forward function that takes inputs and sums
	this.feedForward = function(inputs){
		var sum = 0;
		for(var i in inputs){
			sum += inputs[i] * this.weights[i];
		}
		sum += c;

		return(this.activate(sum));
	}

	//Using sigmoid activation function
	this.activate = function(sum){
		return 1/(1+Math.pow(Math.E, sum * -1))-0.5;
		//return 2/(1+Math.pow(Math.E, i * -1))-1;
	}
}`,
"network":
`function Network(numInputs, numLayers){
	var neurons = [];

	this.init = function(){
		neurons = [];
		
		for(var i = 0; i < numLayers; i++){
			neurons.push([]);
		}

		for(var i = 0; i < neurons.length; i++){
			var newDendrites = [];
			var nextInputs = [];
			for(var j = 0; j < neurons.length; j++){
				var newWeights = [];
				for(var k = 0; k < numInputs; k++){
					newWeights.push(Math.random()-0.5);
				} 
				neurons[i][j] = new Neuron(0.01,newWeights);
				nextInputs.push(neurons[i][j].feedForward());
				newDendrites.push(neurons[i][j]);
			}
			inputs = nextInputs;
			dendrites = newDendrites;
		}
	}

	this.getLastRow = function(){
		return neurons[neurons.length-1];
	}

	this.feedForward = function(inputs){
		for(var i = 0; i < neurons.length; i++){
			var nextInputs = [];
			for(var j = 0; j < neurons[i].length; j++){
				nextInputs[j] = neurons[i][j].feedForward(inputs);
			}
			inputs = nextInputs;
		}
		return inputs;
	}

	this.getWeights = function(){
		var Weights = [];
		for(var z = 0; z < neurons.length; z++){
			Weights.push([]);
			for(var l = 0; l < neurons[z].length; l++){
				Weights[z][l] = neurons[z][l].weights;
			}
		}

		return Weights;
	}

	this.setWeights = function(Weights){
		for(var z = 0; z < neurons.length; z++){
			for(var l = 0; l < neurons[z].length; l++){
				neurons[z][l].weights = Weights[z][l];
			}
		}
	}

	this.getCost = function(trainingSet){
		var cost = 0;

		for(var i = 0; i < trainingSet.inputs.length; i++){
			cost += Math.abs(trainingSet.outputs[i] - this.feedForward(trainingSet.inputs[i])[0]);
		}

		return cost;
	}

	this.backProp = function(trainingSet){
		// Print cost 
		var initialCost = this.getCost(trainingSet);
		var cost = this.getCost(trainingSet);

		for(var z = 0; z < neurons.length; z++){
			for(var l = 0; l < neurons[z].length; l++){
				for(var i = 0; i < neurons[z][l].weights.length; i++){
					neurons[z][l].weights[i] += 0.01;
					if(cost > this.getCost(trainingSet)){
						neurons[z][l].weights[i] += 0.01;
						cost = this.getCost(trainingSet);
					} else {
						neurons[z][l].weights[i] -= 0.02;
						if(cost > this.getCost(trainingSet)){
							neurons[z][l].weights[i] -= 0.01;
							cost = this.getCost(trainingSet);
						} else {
							neurons[z][l].weights[i] += 0.01;
						}
					}
				}
			}
		}
		return cost;
	}
}
`,
"fish":
`function Fish(x,y){
	this.brain = new Network(2,2);

	// Motion Vectors
	this.location = {x:x,y:y};
	this.velocity = {x:0,y:0};
	this.acceleration = {x:0,y:0};

	this.velocityMag = 0;

	this.heading = 90;
	this.maxSpeed = 10;
	this.size = 20;

	this.contents = 10;
	this.isAlive = true;

	angleMode(DEGREES);

	this.init = function(WIDTH,HEIGHT){
		// Randomize location
		this.location.x = Math.floor(Math.random()*WIDTH);
		this.location.y = Math.floor(Math.random()*HEIGHT);

		this.heading = Math.floor(Math.random()*360);

		// Randomize velocity 
		this.velocity.x = cos(this.heading) * this.maxSpeed;
		this.velocity.y = sin(this.heading) * this.maxSpeed;

		
		// Set fish to be alive
		this.isAlive = true;

		// Set contents
		this.contents = 10;
		
		// Initialize brain
		this.brain.init();
	}

	this.update = function(food){
		this.react(food);

		this.velocity.x = cos(this.heading) * this.maxSpeed;
		this.velocity.y = sin(this.heading) * this.maxSpeed;

		if(this.velocity.x > this.maxSpeed){
			this.velocity.x = this.maxSpeed;
		}

		if(this.velocity.y > this.maxSpeed){
			this.velocity.y = this.maxSpeed;
		}

		this.location.x += this.velocity.x;
		this.location.y += this.velocity.y;

		this.eat(food);
		this.contents-=0.1;

		if(this.contents < 0){
			this.isAlive = false;
		}
	}

	this.display = function(){
		stroke(0);

		ellipse(this.location.x, this.location.y, 10, 10);
		stroke(255);
		line(this.location.x,this.location.y,this.location.x + cos(this.heading + 20) * 100, this.location.y + sin(this.heading + 20) * 100);
		line(this.location.x,this.location.y,this.location.x + cos(this.heading - 20) * 100, this.location.y + sin(this.heading - 20) * 100);
		
	}

	this.reset = function(WIDTH, HEIGHT){
		this.location.x = Math.floor(Math.random()*WIDTH);
		this.location.y = Math.floor(Math.random()*HEIGHT);

		this.velocity.x = Math.floor(Math.random()*2*this.maxSpeed - this.maxSpeed);
		this.velocity.y = Math.floor(Math.random()*2*this.maxSpeed - this.maxSpeed);

		this.brain.init();

		this.contents = 10;
		this.isAlive = true;
	}

	this.eye = function(food,lineOfSight){
		var visability = 0;
		var maxVisability = 0;
		var distance = {
			x:0,
			y:0
		};
		stroke(255);
		line(this.location.x,this.location.y,this.location.x + cos(this.heading + lineOfSight) * 100, this.location.y + sin(this.heading + lineOfSight) * 100);

		for(var i = 0; i < food.length; i++){
			distance.x = this.location.x - food[i].location.x;
			distance.y = this.location.y - food[i].location.y;


			var d = atan2(distance.x, distance.y);
			var h = 0;		

			if((360 + this.heading + lineOfSight)%360 > 270){
				h = ((360 + this.heading + lineOfSight)%360 - 270)*-1;
			} else if ((360 + this.heading + lineOfSight)%360 < 90){
				h = ((360 + this.heading + lineOfSight)%360)*-1 - 90;
			} else if ((360 + this.heading + lineOfSight)%360 > 90){
				h = 180 - (((360 + this.heading + lineOfSight)%360)-90);
			}

			if(Math.abs(d - h) < 20 && Math.sqrt(Math.pow(distance.x,2) + Math.pow(distance.y,2)) < 500){
				visability = 100/Math.sqrt(Math.pow(distance.x,2)+Math.pow(distance.y,2));
			}

			if(visability > maxVisability){
				maxVisability = visability;
			}
		}

		return maxVisability;
	}

	this.visualCortex = function(food){
		var output = [];
		output.push(this.eye(food,-20));
		output.push(this.eye(food,20));
		return output;
	}

	this.eat = function(food){
		for(var f of food){
			if(Math.abs(f.location.x - this.location.x) < this.size && Math.abs(f.location.y - this.location.y) < this.size){
				this.contents+=5;
				f.reset();
			}
		}
	}

	this.turn = function(direction){
		var velocityMag = Math.sqrt(Math.exp(this.velocity.x,2)+Math.exp(this.velocity.y,2));
		this.heading += direction;
	}

	this.react = function(food){
		var thought = this.brain.feedForward(this.visualCortex(food));
	
		this.turn(thought[0]*1000);	
	}
}`,
"food":
`function Food(x,y,WIDTH,HEIGHT){
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
}`,
"main":
`var WIDTH = 720;
var HEIGHT = 480;

var canvas;

var numFish = 100;
var numFood = 5;

var fish = [];
var food = [];

function setup() {
	canvas = createCanvas(WIDTH, HEIGHT);
	canvas.parent("canvas-container");

	for(var i = 0; i < numFish; i++){
		// Add new fish
		fish.push(new Fish(0,0));
		// initiate fish
		fish[fish.length-1].init(WIDTH,HEIGHT);
	}

	testFish = new Fish(WIDTH/2,HEIGHT/2);
	testFish.init(WIDTH,HEIGHT);

	for(var i = 0; i < numFood; i++){
		food.push(new Food(WIDTH/2 + 300,HEIGHT/2, WIDTH, HEIGHT));
		food[food.length-1].reset();
	}
}
var numAlive = 0;
var numParents = 3;
var parentWeights = [];

var recorded = false;

function draw() {
	background(10);

	numAlive = 0;
	for(var f of fish){
		if(f.isAlive){
			numAlive ++;
			f.update(food);
			f.display();
		}
	}

	// testFish.update(food);
	// testFish.display();


	for(var f of food){
		f.display();
	}

	if(numAlive < numParents && recorded == false){
		recorded = true;
		parentWeights =[];
		for(var f of fish){
			if(f.isAlive){
				parentWeights.push([]);
				parentWeights[parentWeights.length-1] = f.brain.getWeights();
			}
		}
	}

	if(numAlive < 1){
		var Weights = crossOver(parentWeights);
		recorded = false;
		for(var i = 0; i < numFish; i++){
			// Add new fish

			// initiate fish
			fish[i].init(WIDTH,HEIGHT);
			fish[i].brain.setWeights(Weights[i]);
		}

		var string = '';
		for(var f of fish){
			string += f.location.x;
		}
	}
}

function crossOver(parentWeights) {
	// Get all fish brain weights

	var Weights = [];

	for(var f = 0; f < fish.length; f++){
		Weights.push(fish[f].brain.getWeights());
	}

	for(var z = 0; z < Weights.length; z++){
		for(var l = 0; l < Weights[z].length; l++){
			for(var j = 0; j < Weights[z][l].length; j++){
				for(var k = 0; k < Weights[z][l][j].length; k++){
					if(Math.random() > 0.2 && parentWeights.length >= 1){
						var randParent = Math.floor(Math.random() * parentWeights.length);
						Weights[z][l][j][k] = parentWeights[randParent][l][j][k];
					} else{
						if(Math.random() > 0.5){
							Weights[z][l][j][k] = Math.random()-0.5;
						}
					}
				}
			}
		}
	}

	for(var i in parentWeights){
		Weights[i] = parentWeights[i];
	}
	
	return Weights;
}


function keyPressed(){
	// if(keyCode == LEFT_ARROW){
	// 	testFish.turn(10);
	// }

	// if(keyCode == RIGHT_ARROW){
	// 	testFish.turn(-10);
	// }

	// if(keyCode == UP_ARROW){
	// 	testFish.velocityMag = 1;
	// }

	// if(keyCode == DOWN_ARROW){
	// 	testFish.velocityMag = 0;
	// }
	// console.log(testFish.visualCortex(food));
}`
}


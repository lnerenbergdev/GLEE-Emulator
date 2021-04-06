//Neuron constructor takes constant and weights array
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
}
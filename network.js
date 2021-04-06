function Network(numInputs, numLayers){
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

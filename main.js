var canvas;
var WIDTH = 200;
var HEIGHT = 200;

var numLunasats = 20;
var lunasats = [];
var links = [];

var running = true;

var backgroundLoaded = false;

var transmitting = false;

var gridRes = 25;
var grid = new Grid(WIDTH/gridRes,HEIGHT/gridRes,gridRes);
var tempVals = [];

function setup() {
	WIDTH = displayWidth;
	HEIGHT = windowHeight;

	grid = new Grid(WIDTH/gridRes,HEIGHT/gridRes,gridRes);

	pixelDensity(1);
	canvas = createCanvas(WIDTH, HEIGHT);
	canvas.parent("canvas");

	for(var i = 0; i < numLunasats; i++){
		lunasats.push(new Lunasat(0,0,i));
		lunasats[i].init(WIDTH,HEIGHT);
	}
	

	//(x-min(x))/(max(x)-min(x))

	// let maxTemp = Math.max(tempVals);
	// let minTemp = Math.min(tempVals);

	// for(let i = 0; i<grid.nCols*grid.nRows-1; i){
	// 	//tempVals[i] = (tempVals[i]-minTemp)/(maxTemp - minTemp);
	// }


	grid.updateVals(tempVals);
	// for(var lunasat of lunasats){
	// 	lunasat.updateLinks(lunasats);
	// }
}

function loadBackground(){
    var xoff = 0;
    var yoff = 0;
    
    loadPixels();
    for (var y = 0; y < HEIGHT; y++){
        xoff = 0;
        for (var x = 0; x < WIDTH; x++){    
            var index = (x + y * width) * 4;
            var r = noise(xoff,yoff) * 255;
            //var r = random() * 255;
			pixels[index + 0] = r;
            pixels[index + 1] = r;
            pixels[index + 2] = r;
            pixels[index + 3] = 255; 

            xoff += 0.01;
        }
        yoff += 0.01;
    }
    updatePixels();

	

}

function draw() {
    
    if(!backgroundLoaded){
        loadBackground();
        backgroundLoaded = true;
    }
    updatePixels();

	// grid.display();
	// background(10);
	
	// for(var lunasat of lunasat){
	// 	lunasat.updateLinks(lunasats);
	// }

	for(var lunasat of lunasats){
		lunasat.update(lunasats);
		lunasat.updateLinks(lunasats);
		lunasat.displayLinks();
		lunasat.over();		
		lunasat.display();
	}

	// testFish.update(food);
	// testFish.display();

	// var lastSample = lunasat[0].defaultSensorSample(food);
	// sampleHistory.push(lastSample);
	
	// stroke(255);
	// noFill();
	// // Graph 1
	// beginShape();
	// for (var i = 0; i < sampleHistory.length; i++){
	// 	var y0 = map(sampleHistory[i][0],-10,10,HEIGHT,0);
	// 	vertex(i/8, y0/4);
	// }
	// endShape();

}

function mousePressed(){
	for(var lunasat of lunasats){
		lunasat.pressed();
		lunasat.update();
	}
}

function mouseDragged(){
	for(var lunasat of lunasats){
		// lunasat.updateLinks(lunasats);
	}
}

function mouseReleased(){
	for(var lunasat of lunasats){
		lunasat.released();
	}
}

function keyReleased(){
	for(var lunasat of lunasats){
		if(lunasat.rollover){
			lunasat.transmit(lunasats);
		}
	}
}
 


















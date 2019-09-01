
window.addEventListener('load',function() {

    // Define a path. We want to extend this path to a triangle grid and render the area.
    // The idea is to define a configurable line thickness.
    const pathVerts = [
	new Vertex(-0.7,  -0.3),  
	new Vertex( 0.0,  0.2),  
	new Vertex( 0.7,  -0.3)
    ];

    // Each vertex on the acual path has two vertices in the triangulation.
    // Each vertex in the triangulation buffer has two float elements.
    const thickPath = new Float32Array(pathVerts.length*2*2);

    /*======= Creating a canvas =========*/
    var canvas = document.getElementById('my_canvas');
    var gl = canvas.getContext('webgl');

    var glutils = new GLU( gl );
    var path_buffer = glutils.bufferData( thickPath );

    var vertShader = glutils.compileShader( vertCode, gl.VERTEX_SHADER );
    var fragShader = glutils.compileShader( fragCode, gl.FRAGMENT_SHADER );
    var program = glutils.makeProgram( vertShader, fragShader );


    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 0.9);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Get the attribute location
    var coord = gl.getAttribLocation(program, "position");
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    // at init time
    var fColorLocation = gl.getUniformLocation(program, "uFragColor");

    function drawThickLines( pathVerts, thickPath, color, thickness ) {

	for( var i = 0; i < pathVerts.length; i++ ) {
	    // Inner vertex
	    thickPath[i*4+0] = pathVerts[i].x;
	    thickPath[i*4+1] = pathVerts[i].y;
	    // Outer vertex
	    thickPath[i*4+2] = pathVerts[i].x;
	    thickPath[i*4+3] = pathVerts[i].y-0.1;
	}
	console.log( thickPath.length );
	
	buffer = glutils.bufferData( thickPath );
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);	
	
	// Point an attribute to the currently bound VBO
	gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
	// Set color at render time
	gl.uniform4f(fColorLocation, color[0], color[1], color[2], color[3] ); 
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, pathVerts.length*2);
    }
    

    function renderScene() {
	/*============ Drawing the curve =============*/
	var currentAngle = 0.0;
	var currentRotation = [0,0];

	// Clear the color and depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	uRotationVector =
	    gl.getUniformLocation(program, "uRotationVector");

	let radians = currentAngle * Math.PI / 180.0;
	currentRotation[0] = Math.sin(radians);
	currentRotation[1] = Math.cos(radians);
	gl.uniform2fv(uRotationVector, currentRotation);

	// Draw the handles
	drawThickLines( pathVerts, thickPath, [0.0, 0.75, 1.0, 1.0], 8  );

	// POINTS, LINE_STRIP, LINE_LOOP, LINES,
	// TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES

	// For animations we would use this
	/* window.requestAnimationFrame(function(currentTime) {
	    let deltaAngle = ((currentTime - previousTime) / 1000.0)
		* degreesPerSecond;

	    currentAngle = (currentAngle + deltaAngle) % 360;

	    previousTime = currentTime;
	    renderScene();
	}); */ 
    }

    renderScene();

} );

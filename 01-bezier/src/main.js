
window.addEventListener('load',function() {

    function arr2f32arr( arr ) {
	const ret = new Float32Array(arr.length);
	for( var i = 0; i < arr.length; i++ )
	    ret[i] = arr[i];
	return ret;
    }

    // Bézier curve (3D) computation.
    //
    // @param points [ startx,starty,startz, startcontrolx,startcontroly,startcontrolz, endcontrolx,endcontroly,endcontrolz, endx,endy,endz ]
    //                 0      1      2       3             4             5              6           7           8            9    10   11
    function getPointOnBezierCurve( points, t ) {
	var x = points[0]*Math.pow(1.0-t,3)+points[3]*3*t*Math.pow(1.0-t,2)
	    + points[6]*3*Math.pow(t,2)*(1.0-t)+points[9]*Math.pow(t,3);
	var y = points[1]*Math.pow(1.0-t,3)+points[4]*3*t*Math.pow(1.0-t,2)
	    + points[7]*3*Math.pow(t,2)*(1.0-t)+points[10]*Math.pow(t,3);
	var z = points[2]*Math.pow(1.0-t,3)+points[5]*3*t*Math.pow(1.0-t,2)
	    + points[8]*3*Math.pow(t,2)*(1.0-t)+points[11]*Math.pow(t,3);
	return [x,y,z];
    }
    function getPointsOnBezierCurve(points, numPoints) { 
	const cpoints = [];
	for (let i = 0; i < numPoints; ++i) {
            const t = i / (numPoints -1);
	    const bpoint = getPointOnBezierCurve(points, t);
            cpoints.push( bpoint[0] );
	    cpoints.push( bpoint[1] );
	    cpoints.push( bpoint[2] );
	}
	return cpoints;
    }

    const segCount = 40;
    const bezier = [ -0.7, -0.4, 0.0,  // start vertex
		     -0.5,  0.4, 0.0,  // start control vertex
		      0.5,  0.4, 0.0,  // end control vertex
		      0.7, -0.4, 0.0   // end vertex
		   ];
    const segments = arr2f32arr( getPointsOnBezierCurve(bezier,segCount) );
    const bhandles = arr2f32arr( bezier );

    /*======= Creating a canvas =========*/

    var canvas = document.getElementById('my_canvas');
    var gl = canvas.getContext('webgl');

    /*======= Defining and storing the geometry ======*/
    function bufferData( verts ) {
	// Create an empty buffer object
	var vbuffer = gl.createBuffer();
	// Bind appropriate array buffer to it
	gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
	// Pass the vertex data to the buffer
	gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
	// Unbind the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	return vbuffer;
    }
    var handle_buffer = bufferData( bhandles );
    var segment_buffer = bufferData( segments );


    /*=================== Shaders ====================*/
    function compileShader( shaderCode, type ) {
	// Create a vertex shader object
	var shader = gl.createShader(type);
	// Attach vertex shader source code
	gl.shaderSource(shader, shaderCode);
	// Compile the vertex shader
	gl.compileShader(shader);
	const vertStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!vertStatus) {
	    console.warn("Error in shader:" + gl.getShaderInfoLog(shader) );	
	    gl.deleteShader(shader);
	    return null;
	}
	return shader;
    }

    var vertShader = compileShader( vertCode, gl.VERTEX_SHADER );
    var fragShader = compileShader( fragCode, gl.FRAGMENT_SHADER );

    // Create a shader program object to store
    // the combined shader program
    var program = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(program, vertShader);

    // Attach a fragment shader
    gl.attachShader(program, fragShader);

    // Link both the programs
    gl.linkProgram(program);

    // Use the combined shader program object
    gl.useProgram(program);

    /*======= Do some cleanup ======*/
    gl.detachShader(program, vertShader);
    gl.detachShader(program, fragShader);
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);


    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 0.9);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    function drawLines( buffer, num_verts, mode ) {
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);	
	// Get the attribute location
	var coord = gl.getAttribLocation(program, "position");
	// Point an attribute to the currently bound VBO
	gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
	// Enable the attribute
	gl.enableVertexAttribArray(coord);
	gl.drawArrays(mode, 0, num_verts);
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

	drawLines( handle_buffer, bhandles.length/3, gl.LINE_STRIP );
	drawLines( segment_buffer, segments.length/3, gl.LINE_STRIP );
	
	// Draw the curve
	//gl.drawArrays(gl.LINE_STRIP, 0, vertices.length/3);
	// POINTS, LINE_STRIP, LINE_LOOP, LINES,
	// TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES

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

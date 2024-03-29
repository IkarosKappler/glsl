
window.addEventListener('load',function() {

    let uRotationVector;
    let currentRotation = [0, 1];
    let previousTime = 0.0;
    let degreesPerSecond = 25.0;
    let currentAngle = 0.0;

    function createPolygon( count ) {
	var radius = 0.75;
	var phase = 0.0;
	const vertices = new Float32Array(count * 3);
	for (let index = 0; index < count; index++) {
	    const a = ((index / count) * Math.PI * 2);
	    vertices[(index * 3) + 0] = Math.cos(a + phase) * radius;
	    vertices[(index * 3) + 1] = Math.sin(a + phase) * radius;
	    vertices[(index * 3) + 2] = 0.0;
	}
	return vertices;
    }
    

    /*======= Creating a canvas =========*/

    var canvas = document.getElementById('my_canvas');
    var gl = canvas.getContext('webgl');

    /*======= Defining and storing the geometry ======*/
    var vertices = createPolygon(7);

    // Create an empty buffer object
    var vertex_buffer = gl.createBuffer();

    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    
    // Pass the vertex data to the buffer
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*=================== Shaders ====================*/
    var vertCode = `
precision mediump float;

    attribute vec2 position;

    uniform vec2 uRotationVector;

    void main(void) {
	vec2 rotatedPosition = vec2(
	    position.x * uRotationVector.y +
		position.y * uRotationVector.x,
	    position.y * uRotationVector.y -
		position.x * uRotationVector.x
	);

	gl_Position = vec4(rotatedPosition, 0.0, 1.0);
}`;

    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    // Compile the vertex shader
    gl.compileShader(vertShader);

    const vertStatus = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
    if (!vertStatus) {
	console.warn("Error in vertex shader:" + gl.getShaderInfoLog(vertShader) );	
	gl.deleteShader(vertShader);
	return;
    }

    // Fragment shader source code
    var fragCode = `
precision highp float;

void main(void) {
  gl_FragColor = vec4(0.0,0.75,1.0,1.0);
}`;

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragmentt shader
    gl.compileShader(fragShader);

    const fragStatus = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
    if (!fragStatus) {
	console.warn("Error in shader:" + gl.getShaderInfoLog(fragShader) );	
	gl.deleteShader(fragShader);
    }

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

    /*======= Associating shaders to buffer objects ======*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    
    // Get the attribute location
    var coord = gl.getAttribLocation(program, "position");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    /*============ Drawing the polygon =============*/

    function renderScene() {
	
	// Clear the canvas
	gl.clearColor(0.0, 0.0, 0.0, 0.9);

	// Enable the depth test
	gl.enable(gl.DEPTH_TEST);

	// Clear the color and depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Set the view port
	gl.viewport(0,0,canvas.width,canvas.height);

	uRotationVector =
	    gl.getUniformLocation(program, "uRotationVector");

	let radians = currentAngle * Math.PI / 180.0;
	currentRotation[0] = Math.sin(radians);
	currentRotation[1] = Math.cos(radians);
	gl.uniform2fv(uRotationVector, currentRotation);

	// Draw the polygon
	gl.drawArrays(gl.LINE_LOOP, 0, vertices.length/3);
	// POINTS, LINE_STRIP, LINE_LOOP, LINES,
	// TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES

	window.requestAnimationFrame(function(currentTime) {
	    let deltaAngle = ((currentTime - previousTime) / 1000.0)
		* degreesPerSecond;

	    currentAngle = (currentAngle + deltaAngle) % 360;

	    previousTime = currentTime;
	    renderScene();
	}); 
    }

    renderScene();

} );

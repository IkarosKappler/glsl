

window.addEventListener( 'load', function() {

    var GLU = function( gl ) {
	this.gl = gl;
    };

    GLU.prototype.bufferData = function( verts ) {
	// Create an empty buffer object
	var vbuffer = this.gl.createBuffer();
	// Bind appropriate array buffer to it
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbuffer);
	// Pass the vertex data to the buffer
	this.gl.bufferData(this.gl.ARRAY_BUFFER, verts, this.gl.STATIC_DRAW);
	// Unbind the buffer
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	return vbuffer;
    };
 

    /*=================== Shaders ====================*/
    GLU.prototype.compileShader = function( shaderCode, type ) {
	// Create a vertex shader object
	var shader = this.gl.createShader(type);
	// Attach vertex shader source code
	this.gl.shaderSource(shader, shaderCode);
	// Compile the vertex shader
	this.gl.compileShader(shader);
	const vertStatus = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
	if (!vertStatus) {
	    console.warn("Error in shader:" + this.gl.getShaderInfoLog(shader) );	
	    this.gl.deleteShader(shader);
	    return null;
	}
	return shader;
    };


    GLU.prototype.makeProgram = function( vertShader, fragShader ) {
	// Create a shader program object to store
	// the combined shader program
	var program = this.gl.createProgram();

	// Attach a vertex shader
	this.gl.attachShader(program, vertShader);

	// Attach a fragment shader
	this.gl.attachShader(program, fragShader);

	// Link both the programs
	this.gl.linkProgram(program);

	// Use the combined shader program object
	this.gl.useProgram(program);

	/*======= Do some cleanup ======*/
	this.gl.detachShader(program, vertShader);
	this.gl.detachShader(program, fragShader);
	this.gl.deleteShader(vertShader);
	this.gl.deleteShader(fragShader);

	return program;
    };

    // Export constructor
    window.GLU = GLU;
} );

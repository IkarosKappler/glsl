// Vertex shader source code
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
    }    
`;

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

    vec4 toBezier(float delta, int i, vec4 P0, vec4 P1, vec4 P2, vec4 P3)
    {
	float t = delta * float(i);
	float t2 = t * t;
	float one_minus_t = 1.0 - t;
	float one_minus_t2 = one_minus_t * one_minus_t;
	return (P0 * one_minus_t2 * one_minus_t + P1 * 3.0 * t * one_minus_t2 + P2 * 3.0 * t2 * one_minus_t + P3 * t2 * t);
    }
    
`;

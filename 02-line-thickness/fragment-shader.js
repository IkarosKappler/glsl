// Fragment shader source code
var fragCode = `
    precision highp float;

    uniform vec4 uFragColor;

    void main(void) {
	gl_FragColor = uFragColor; 
    }
`;

/**
 * 创建webgl program
 * @param gl 
 * @param vsSource 
 * @param fsSource 
 */
export const createProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string) => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (vertexShader && fragmentShader) {
        const program = gl.createProgram() as WebGLProgram;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        } else {
            gl.deleteProgram;
            console.error(gl.getProgramInfoLog(program) as string);
            return null;
        }
    } else {
        return null;
    }
};

/**
 * 创建shader
 * @param gl 
 * @param type 
 * @param source 
 */
export const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    } else {
        console.error(gl.getShaderInfoLog(shader) as string);
        gl.deleteShader(shader);
        return null;
    }
};
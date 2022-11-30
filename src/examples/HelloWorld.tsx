// 画点
import React, { useEffect } from 'react';
import { mat4 } from 'gl-matrix';

const Example1 = () => {
    useEffect(() => {
        const vertexString = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;
        const fragmentString = `
            void main() {
                gl_FragColor = vec4(1, 0, 0.5, 1);
            }
        `;
        const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
        const gl = canvas.getContext('webgl') as WebGLRenderingContext;

        const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type) as WebGLShader;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (success) {
                return shader;
            }
            // 编译失败时报错
            gl.deleteShader(shader);
            throw new Error(gl.getShaderInfoLog(shader) as string);
        };

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexString);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentString);

        const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
            const program = gl.createProgram() as WebGLProgram;
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            const success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (success) {
                return program;
            }
            gl.deleteProgram(program);
            throw new Error(gl.getProgramInfoLog(program) as string);
        };
        const program = createProgram(gl, vertexShader, fragmentShader);

        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const positionBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const positions = [
            0, 0,
            0, 0.5,
            0.7, 0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);

        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }, []);
    return <canvas id="canvas" width="400" height="300" />;
};

export default Example1;
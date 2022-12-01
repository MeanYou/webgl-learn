// 基础示例
import React, { useEffect } from 'react';
import { mat4 } from 'gl-matrix';

const Example1 = () => {
    useEffect(() => {
        const vertexString = `
            attribute vec2 a_position;
            uniform vec2 u_resolution;
            void main() {
                vec2 zeroToOne = a_position / u_resolution;

                vec2 zeroToTwo = zeroToOne * 2.0;

                vec2 clipSpace = zeroToTwo - 1.0;

                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            }
        `;
        const fragmentString = `
            precision mediump float;

            uniform vec4 u_color;

            void main() {
                gl_FragColor = u_color;
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

        const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // const positions = [
        //     10, 20,
        //     80, 20,
        //     10, 30,
        //     10, 30,
        //     80, 20,
        //     80, 30
        // ];
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        const colorUniformLocation = gl.getUniformLocation(program, 'u_color');

        gl.enableVertexAttribArray(positionAttributeLocation);

        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        const setRectangle = (gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) => {
            const x1 = x;
            const x2 = x + width;
            const y1 = y;
            const y2 = y + height;

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2
            ]), gl.STATIC_DRAW);
        };
        const randomInt = (range: number) => {
            return Math.floor(Math.random() * range);
        };

        for (let i = 0; i < 50; i++) {
            setRectangle(
                gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300)
            );

            gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }, []);
    return <canvas id="canvas" width="800" height="600" />;
};

export default Example1;
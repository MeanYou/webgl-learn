// 画点
import React, { useEffect } from 'react';
import imgCode from '@/assets/imgs/qrcode.png';

const Example1 = () => {
    useEffect(() => {
        const vertexString = `
            attribute vec2 a_position;
            uniform vec2 u_resolution;

            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;

            void main() {
                v_texCoord = a_texCoord;

                vec2 zeroToOne = a_position / u_resolution;
                vec2 zeroToTwo = zeroToOne * 2.0;
                vec2 clipSpace = zeroToTwo - 1.0;
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            }
        `;
        const fragmentString = `
            precision mediump float;

            uniform sampler2D u_image;
            uniform vec2 u_textureSize;
            varying vec2 v_texCoord;

            void main() {
                vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;

                gl_FragColor = texture2D(u_image, v_texCoord);
                // gl_FragColor = (
                //     texture2D(u_image, v_texCoord) + 
                //     texture2D(u_image, v_texCoord + vec2(onePixel.x, 0.0)) + 
                //     texture2D(u_image, v_texCoord + vec2(-onePixel.x, 0.0))
                // ) / 3.0;
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

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        // 
        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
            0, 0,
            0, 200,
            200, 0,
            200, 0,
            0, 200,
            200, 200
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        gl.enableVertexAttribArray(positionAttributeLocation);

        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        const image = new Image();
        image.src = imgCode;
        image.onload = () => {
            const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
            const texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                0.0, 1.0,
                1.0, 0.0,
                1.0, 1.0
            ]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(texCoordLocation);
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            const textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize');
            gl.uniform2f(textureSizeLocation, image.width, image.height);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };



    }, []);
    return <canvas id="canvas" width="800" height="600" />;
};

export default Example1;
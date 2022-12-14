// 基础示例
import React, { useCallback, useEffect } from 'react';
import { mat4 } from 'gl-matrix';
import { createProgram } from "@/utils";
import webglLessonsUI from "webglLessonsUI";
import OSS from 'ali-oss';
import axios from "axios";


const Example1 = () => {
    useEffect(() => {
        const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
        const gl = canvas.getContext('webgl') as WebGLRenderingContext;

        const vertexSource = `
            attribute vec2 a_position;

            uniform vec2 u_resolution;
            uniform vec2 u_translation;
            
            void main() {
                vec2 position = a_position + u_translation;

                gl_Position = vec4((position / u_resolution * 2.0 - 1.0) * vec2(1, -1), 0, 1);
            }
        `;
        const fragmentSource = `
            precision mediump float;
            uniform vec4 u_color;

            void main() {
                gl_FragColor = u_color;
            }
        `;
        const program = createProgram(gl, vertexSource, fragmentSource);
        if (!program) return;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.useProgram(program);

        // look up vertex data
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        // look up uniforms
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
        const translationLocation = gl.getUniformLocation(program, 'u_translation');
        const colorLocation = gl.getUniformLocation(program, 'u_color');

        // create position buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,

            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,

            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const translation = [0, 0];
        const width = 100;
        const height = 30;
        const color = [Math.random(), Math.random(), Math.random(), 1];


        const drawScene = () => {
            gl.clearColor(0, 0, 0, 255);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform2fv(translationLocation, translation);
            gl.uniform4fv(colorLocation, color);

            gl.drawArrays(gl.TRIANGLES, 0, 18);
        };

        drawScene();

        const updatePosition = (index: number, v: number) => {
            translation[index] = v;
            drawScene();
        };
        webglLessonsUI.setupSlider('#x', { slide: (e: any, ui: any) => updatePosition(0, ui.value as number), max: gl.canvas.width });
        webglLessonsUI.setupSlider('#y', { slide: (e: any, ui: any) => updatePosition(1, ui.value as number), max: gl.canvas.height });
    }, []);

    return (<div>
        <canvas id="canvas" width="800" height="600" />
        <div>
            <div>Translation</div>
            <div id="x"></div>
            <div id="y"></div>
        </div>
    </div>);
};

export default Example1;
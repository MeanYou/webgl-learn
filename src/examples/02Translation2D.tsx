// 基础示例
import React, { useCallback, useEffect } from 'react';
import { mat4 } from 'gl-matrix';
import { createProgram } from "@/utils";
import { Slider } from "antd";
import webglLessonsUI from "webglLessonsUI";

let initialized = false;

const Example1 = () => {
    useEffect(() => {
        initialized = true;
        const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
        const gl = canvas.getContext('webgl') as WebGLRenderingContext;

        const vertexSource = `
            attribute vec2 a_position;
            uniform vec2 u_resolution;
            
            void main() {
                gl_Position = vec4((a_position / u_resolution * 2.0 - 1.0) * vec2(1, -1), 0, 1);
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
        // look up vertex data
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        // look up uniforms
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
        const colorLocation = gl.getUniformLocation(program, 'u_color');

        // create position buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const translation = [0, 0];
        const width = 100;
        const height = 30;
        const color = [Math.random(), Math.random(), Math.random(), 1];

        const drawScene = () => {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(0, 0, 0, 255);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(program);

            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            setRectangle(gl, translation[0], translation[1], width, height);

            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform4fv(colorLocation, color);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };
        const setRectangle = (gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) => {
            const x1 = x;
            const x2 = x + width;
            const y1 = y;
            const y2 = y + height;

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                x1, y1,
                x1, y2,
                x2, y1,
                x2, y1,
                x1, y2,
                x2, y2
            ]), gl.STATIC_DRAW);
        };

        drawScene();

        const updatePosition = (index: number, v: number) => {
            console.log(v);
            translation[index] = v;
            drawScene();
        };
        webglLessonsUI.setupSlider('#x', { slide: (e:any, ui: any) => updatePosition(0, ui.value as number), max: gl.canvas.width });
        webglLessonsUI.setupSlider('#y', { slide: (e:any, ui: any) => updatePosition(1, ui.value as number), max: gl.canvas.height });
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
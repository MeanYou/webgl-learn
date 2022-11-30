// 画多个三角形
import React, { useEffect } from 'react';
import { mat4 } from 'gl-matrix';

const Example1 = () => {
    useEffect(() => {
        let webgl: WebGLRenderingContext;
        const projMat4 = mat4.create();
        let webglDiv: HTMLCanvasElement;
        let program: WebGLProgram;
        const vertexString = `
            attribute vec4 a_position;
            uniform mat4 proj;
            void main() {
                gl_Position = proj * a_position;
                gl_PointSize = 50.0;
            }
        `;
        const fragmentString = `
            void main() {
                gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
            }
        `;
        function init() {
            initWebgl();
            initShader();
            initBuffer();
            draw();
        }

        function initWebgl() {
            webglDiv = document.querySelector('#canvas') as HTMLCanvasElement;
            webgl = webglDiv.getContext('webgl') as WebGLRenderingContext;
            webgl.viewport(0, 0, webglDiv.clientWidth, webglDiv.clientHeight);
            mat4.ortho(projMat4, 0, webglDiv.clientWidth, webglDiv.clientHeight, 0, -1, 1);
        }
        function initShader() {
            const vsShader = webgl.createShader(webgl.VERTEX_SHADER) as WebGLShader;
            const fsShader = webgl.createShader(webgl.FRAGMENT_SHADER) as WebGLShader;

            // 关联shader字符串
            webgl.shaderSource(vsShader, vertexString);
            webgl.shaderSource(fsShader, fragmentString);

            // 编译shader
            webgl.compileShader(vsShader);
            webgl.compileShader(fsShader);

            // 绑定shader
            program = webgl.createProgram() as WebGLProgram;
            webgl.attachShader(program, vsShader);
            webgl.attachShader(program, fsShader);

            webgl.linkProgram(program);
            webgl.useProgram(program);
        }

        const lineArr = [
            100.0, 100.0, 0, 1,
            100.0, 200.0, 0, 1,
            300.0, 200.0, 0, 1,

            250.0, 250.0, 0, 1
        ];

        const indexArr = [
            0, 1, 2,

            1, 2, 3
        ];
        function initBuffer() {
            const aPosition = webgl.getAttribLocation(program, 'a_position');
            
            const indexArray = new Uint16Array(indexArr);
            const indexBuffer = webgl.createBuffer() as WebGLBuffer;
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, indexArray, webgl.STATIC_DRAW);
            
            const pointPosition = new Float32Array(lineArr);
            const lineBuffer = webgl.createBuffer() as WebGLBuffer;
            webgl.bindBuffer(webgl.ARRAY_BUFFER, lineBuffer);
            webgl.bufferData(webgl.ARRAY_BUFFER, pointPosition, webgl.STATIC_DRAW);
            webgl.enableVertexAttribArray(aPosition);
            webgl.vertexAttribPointer(aPosition, 4, webgl.FLOAT, false, 4 * 4, 0 * 4);

            const uniformProj = webgl.getUniformLocation(program, 'proj');
            webgl.uniformMatrix4fv(uniformProj, false, projMat4);
        }

        function draw() {
            webgl.clearColor(0.0, 0.0, 0.0, 1.0);
            webgl.clear(webgl.COLOR_BUFFER_BIT);
            webgl.drawElements(webgl.TRIANGLES, indexArr.length, webgl.UNSIGNED_SHORT, 0);
        }

        init();
    }, []);
    return <canvas id="canvas" width="500" height="500" />;
};

export default Example1;
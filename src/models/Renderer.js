import {Camera} from "@/models/RenderObjs.js";
import {vec3} from "gl-matrix";

export class Renderer {
    constructor(_gl) {
        this.gl = _gl;
        this.shaderProg = null;
        this.currScene = null;
        this.camera = new Camera();
        this.transparentQueue = [];


        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {

            this.gl.clearColor(0.05,0.23,0.17,1);

        } else {
            this.gl.clearColor(0.45,0.91,0.67,1);
        }

        this.setShaderProgram = (shader) => {
            this.shaderProg = shader;
        }

        this.setCurrentScene = (currentScene) => {
            this.currScene = currentScene;
        }

        this.setCurrentCamera = (camera) => {
            this.camera = camera;
        }

        this.sortTransparent  = (a, b) => {
            let camPos = this.camera._transform.position;
            let aPos = a._transform.position;
            let bPos = b._transform.position;

            let aDist = Math.abs(vec3.dist(camPos, aPos));
            let bDist = Math.abs(vec3.dist(camPos, bPos));

            return bDist - aDist;
        }

        this.renderTransparent = () => {
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            for (const obj of this.transparentQueue) {
                obj.render(this, true);
            }
            this.gl.disable(this.gl.BLEND);
        }

        this.render = () => {
            this.transparentQueue = []

            this.shaderProg.use();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.shaderProg.setMat4("uView", this.camera.getViewMatrix())
            this.shaderProg.setMat4("uProjection", this.camera.getProjectionMatrix(this.gl.canvas.width, this.gl.canvas.height));
            this.shaderProg.setVec3("uLights[0].color", vec3.fromValues(100, 100, 90));
            this.shaderProg.setVec3("uLights[0].posDir", vec3.fromValues(5,5,20));


            this.currScene.render(this);

            this.transparentQueue.sort(this.sortTransparent);

            this.renderTransparent();

        }
    }

}
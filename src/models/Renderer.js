import {Camera} from "@/models/RenderObjs.js";

export class Renderer {
    constructor(_gl) {
        this.gl = _gl;
        this.shaderProg = null;
        this.currScene = null;
        this.camera = new Camera();


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

        this.render = () => {
            this.shaderProg.use();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.shaderProg.setMat4("uView", this.camera.getViewMatrix())
            this.shaderProg.setMat4("uProjection", this.camera.getProjectionMatrix(this.gl.canvas.width, this.gl.canvas.height));

            this.currScene.render(this.shaderProg);
        }
    }

}
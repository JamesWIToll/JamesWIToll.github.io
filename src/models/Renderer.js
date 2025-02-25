
export class Renderer {
    constructor(_gl) {
        this.gl = _gl;
        this.shaderProg = null;
        this.currScene = null;


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

        this.render = () => {
            this.shaderProg.use();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            this.currScene.render(this.shaderProg);
            
            requestAnimationFrame(this.render);
        }
    }

}
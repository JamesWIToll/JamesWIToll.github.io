import {Camera} from "@/models/RenderObjs.js";
import {vec3, vec4} from "gl-matrix";
import importer from "@/models/Importer.js";

export class Renderer {
    constructor(_gl) {
        this.gl = _gl;
        this.shaderProg = null;
        this.postProcessProg = null;
        this.currScene = null;
        this.camera = new Camera();
        this.transparentQueue = [];
        this.lineTex1 = null;
        this.lineTex2 = null;
        this.frameBuffer = null;
        this.screenTex = null;
        this.normalTex = null;
        this.linesTex = null;

        this.useHatching = false;
        this.useColorQuantization = false;
        this.hatchingSize = 1;
        this.colorQuantity = 6;

        this.useSobel = false;
        this.sobelThreshold = 1.0;
        this.linesColor = vec3.fromValues(0,0,0);


        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {

            this.gl.clearColor(0.05,0.23,0.17,1);

        } else {
            this.gl.clearColor(0.45,0.91,0.67,1);
        }

        this.loadTexData = async (path) => {
            let tex1 = new Image();
            await new Promise((resolve, reject) => {
                tex1.onload = () => {
                    resolve(tex1);
                }
                tex1.onerror = () => {
                    throw new Error(`Could not load texture ${path}`);
                }
                tex1.src = path;
            });
            return tex1;
        }

        this.loadResources = async () => {
            //load textures for lines
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.lineTex1 = this.gl.createTexture();
            let lines_1 =  await this.loadTexData("/textures/Lines_01.png");
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.lineTex1);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_R, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, lines_1);

            this.gl.activeTexture(this.gl.TEXTURE2);
            this.lineTex2 = this.gl.createTexture();
            let lines_2 =  await this.loadTexData("/textures/Lines_02.png");
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.lineTex2);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_R, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, lines_2);

            //load base frame buffer
            this.frameBuffer = this.gl.createFramebuffer();
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

            this.screenTex = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.screenTex);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.canvas.width, this.gl.canvas.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

            this.normalTex = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalTex);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.canvas.width, this.gl.canvas.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

            this.linesTex = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.linesTex);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.canvas.width, this.gl.canvas.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

            let depthStencilTex = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, depthStencilTex);

            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.screenTex, 0);
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT1, this.gl.TEXTURE_2D, this.normalTex, 0);
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT2, this.gl.TEXTURE_2D, this.linesTex, 0);
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_STENCIL_ATTACHMENT, this.gl.TEXTURE_2D, depthStencilTex, 0);

            let rbo = this.gl.createRenderbuffer();
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, rbo);
            this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_STENCIL, this.gl.canvas.width, this.gl.canvas.height);

            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, rbo);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
        }


        this.setShaderProgram = (shader) => {
            this.shaderProg = shader;
        }

        this.setPostProcessProg = (postProcessProg) => {
            this.postProcessProg = postProcessProg;
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

        this.render = async () => {

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
            this.gl.drawBuffers([this.gl.COLOR_ATTACHMENT0, this.gl.COLOR_ATTACHMENT1, this.gl.COLOR_ATTACHMENT2]);
            this.transparentQueue = []
            this.shaderProg.use();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
            this.gl.clearBufferfv(this.gl.COLOR, 2, vec4.fromValues(0,0,0,0));
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.shaderProg.setMat4("uView", this.camera.getViewMatrix())
            this.shaderProg.setMat4("uProjection", this.camera.getProjectionMatrix(this.gl.canvas.width, this.gl.canvas.height));
            this.shaderProg.setVec3("uLights[0].color", vec3.fromValues(255, 255, 255));
            this.shaderProg.setVec3("uLights[0].posDir", vec3.fromValues(5,5,20));

            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.lineTex1);

            this.gl.activeTexture(this.gl.TEXTURE2);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.lineTex2);

            this.shaderProg.setBoolOrInt("uLines1", 1);
            this.shaderProg.setBoolOrInt("uLines2", 2);

            this.shaderProg.setBoolOrInt("uCrosshatch", this.useHatching);
            this.shaderProg.setBoolOrInt("uQuantizeColors", this.useColorQuantization);
            this.shaderProg.setBoolOrInt("uHatchSize", this.hatchingSize);
            this.shaderProg.setBoolOrInt("uColorQuantity", this.colorQuantity);


            this.currScene.render(this);

            this.transparentQueue.sort(this.sortTransparent);

            this.renderTransparent();


            //post-processing
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

            let quad = await importer.fullscreenQuad(this.gl);
            this.postProcessProg.use();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.screenTex);

            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalTex);

            this.gl.activeTexture(this.gl.TEXTURE2);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.linesTex);

            this.postProcessProg.setBoolOrInt("uScreenTex", 0);
            this.postProcessProg.setBoolOrInt("uNormalTex", 1);
            this.postProcessProg.setBoolOrInt("uLinesTex", 2);
            this.postProcessProg.setBoolOrInt("uSobelLines", this.useSobel);
            this.postProcessProg.setFloat("uSobelThreshold", this.sobelThreshold);
            this.postProcessProg.setVec3("uLineColor", this.linesColor);
            quad.render(this);


        }

        window.addEventListener("resize", this.loadResources, {});
    }

}
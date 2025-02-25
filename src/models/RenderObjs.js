import {glMatrix, mat4, vec2, vec3, vec4} from "gl-matrix";

export class Node {
    constructor() {

        this.parent = null;
        this._children = [];

        this._transform = {
            position : vec3.create(),
            rotation : vec3.create(),
            scale : vec3.create(),
        }

        vec3.set(this._transform.scale, 1,1,1)

        this.addChild = (obj) => {
            obj.parent = this;
            this._children.push(obj);
        }

        this.getModelMatrix = () => {
            let matrix;
            if (this.parent) {
                matrix = this.parent.getModelMatrix();
            } else {
                matrix = mat4.create();
                mat4.identity(matrix);
            }


            mat4.translate(matrix, matrix,  this._transform.position);
            mat4.rotate(matrix, matrix,  this._transform.rotation[0], vec3.fromValues(1,0,0));
            mat4.rotate(matrix, matrix,  this._transform.rotation[1], vec3.fromValues(0,1,0));
            mat4.rotate(matrix, matrix,  this._transform.rotation[2], vec3.fromValues(0,0,1));
            mat4.scale(matrix, matrix, this._transform.scale);

            return matrix;
        }
    }
}

export class Camera extends Node {
    constructor() {
        super();

        this.FOV = 40.0;
        this._transform.rotation[0] = -90.0;
        this.center = vec3.fromValues(0,0,-1);
        this.up = vec3.fromValues(0, 1, 0);
        this.right = vec3.fromValues(1, 0, 0);

        this.updateVectors = () => {
            this.center = vec3.create()
            let yaw = glMatrix.toRadian(this._transform.rotation[0]);
            let pitch = glMatrix.toRadian(this._transform.rotation[1]);
            let centerx = Math.cos(yaw) * Math.cos(pitch);
            let centery = Math.sin(pitch);
            let centerz = Math.sin(yaw) * Math.cos(pitch);
            vec3.set(this.center, centerx, centery, centerz);
            vec3.normalize(this.center, this.center);

            vec3.cross(this.right, this.up, this.center);

        }

        this.getViewMatrix = () => {

            let model = this.getModelMatrix();

            let eye = this._transform.position;
            let front = vec3.create();
            vec3.add(front, eye, this.center)

            let view = mat4.create();
            mat4.lookAt(view, eye, front , this.up)
            return view;
        }

        this.look = (direction, amount) => {
            if (direction === 'horizontal'){
                this._transform.rotation[0] += amount;
            } else if (direction === 'vertical') {
                this._transform.rotation[1] += amount;
            }
            this.updateVectors();
        }

        this.move = (direction, amount) => {
            let movement = vec3.create();
            switch (direction) {
                case 'forward':
                    vec3.copy(movement, this.center);
                    break;
                case 'backward':
                    vec3.copy(movement, this.center);
                    vec3.negate(movement, movement);
                    break;
                case 'left':
                    vec3.copy(movement, this.right);
                    vec3.negate(movement, movement);
                    break;
                case 'right':
                    vec3.copy(movement, this.right);
                    break;
                case 'up':
                    vec3.copy(movement, this.up);
                    break;
                case 'down':
                    vec3.copy(movement, this.up);
                    vec3.negate(movement, movement);
                    break;
            }
            vec3.scale(movement, movement, amount);
            vec3.add(this._transform.position, this._transform.position, movement);
            this.updateVectors();
        }

        this.getProjectionMatrix = (height, width) => {
            let projection = mat4.create();
            return mat4.perspective(projection, glMatrix.toRadian(this.FOV), width/height, 0.01, 100);
        }
    }
}

export class Scene extends Node {
    constructor(_gl) {
        super();
        this.gl = _gl;
        this._currCamera = new Camera();
        this._dirLight = null;
        this._pointLights = [];

        this.setCamera =  (camera) => { this._currCamera = camera; };
        this.setDirLight =  (dirLight) => { this._dirLight = dirLight; };
        this.addPointLight = (pointLight) => { this._pointLights.push(pointLight); };


        this.render = (shader) => {
            let viewport = this.gl.getParameter(this.gl.VIEWPORT);
            let width = viewport[2];
            let height = viewport[3];
            shader.setMat4("uView", this._currCamera.getViewMatrix())
            shader.setMat4("uProjection", this._currCamera.getProjectionMatrix(width, height));

            this._children.forEach((child) => {
                child.render(shader);
            })
        }

    }
}

export class RenderObj extends Node {
    constructor(_gl) {
        super();
        this._vertices = [];
        this._indices = [];
        this.gl = _gl;
        this.VBO = null;
        this.EBO = null;
        this.VAO = null;



        this.addVert = (colorX, colorY, colorZ, colorW,
                        posX, posY, posZ,
                        normalX, normalY, normalZ,
                        texX, texY) => {

            let color = vec4.create();
            color[0] = colorX;
            color[1] = colorY;
            color[2] = colorZ;
            color[3] = colorW;


            let pos = vec3.create();
            pos[0] = posX;
            pos[1] = posY;
            pos[2] = posZ;

            let normal = vec3.create();
            normal[0] = normalX;
            normal[1] = normalY;
            normal[2] = normalZ;

            let tex = vec2.create();
            tex[0] = texX;
            tex[1] = texY;


            this._vertices.push({
                position : pos,
                color : color,
                normal : normal,
                tex : tex
            });
        }


        this.loadBuffers = () => {
            this.VAO = this.gl.createVertexArray();
            this.VBO = this.gl.createBuffer();
            this.EBO = this.gl.createBuffer();

            let verts = [];

            let i = 0;
            for (let vert of this._vertices) {
                verts[i++] = vert.position[0];
                verts[i++] = vert.position[1];
                verts[i++] = vert.position[2];
                verts[i++] = vert.color[0];
                verts[i++] = vert.color[1];
                verts[i++] = vert.color[2];
                verts[i++] = vert.color[3];
                verts[i++] = vert.normal[0];
                verts[i++] = vert.normal[1];
                verts[i++] = vert.normal[2];
                verts[i++] = vert.tex[0];
                verts[i++] = vert.tex[1];
            }

            this.gl.bindVertexArray(this.VAO);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.EBO);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this._indices), this.gl.STATIC_DRAW);

            this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 12*Float32Array.BYTES_PER_ELEMENT, 0);
            this.gl.enableVertexAttribArray(0);

            this.gl.vertexAttribPointer(1, 4, this.gl.FLOAT, false, 12*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT);
            this.gl.enableVertexAttribArray(1);

            this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, 12*Float32Array.BYTES_PER_ELEMENT, 7*Float32Array.BYTES_PER_ELEMENT);
            this.gl.enableVertexAttribArray(2);

            this.gl.vertexAttribPointer(3, 2, this.gl.FLOAT, false, 12*Float32Array.BYTES_PER_ELEMENT, 10*Float32Array.BYTES_PER_ELEMENT);
            this.gl.enableVertexAttribArray(3);

            this.gl.bindVertexArray(null);
        }

        this.render = (shader) => {

            let model = this.getModelMatrix();
            shader.setMat4("uModel", model);

            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.bindVertexArray(this.VAO);
            this.gl.drawElements(this.gl.TRIANGLES, this._indices.length, this.gl.UNSIGNED_INT, 0)
            this.gl.bindVertexArray(null);
        }
    }
}
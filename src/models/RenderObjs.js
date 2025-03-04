import {glMatrix, mat4, quat, vec2, vec3, vec4} from "gl-matrix";

export class Node {
    constructor() {
        this.name = "Node";

        this.parent = null;
        this._children = [];

        this._transform = {
            position : vec3.create(),
            rotation : quat.create(),
            scale : vec3.create(),
        }

        vec3.set(this._transform.scale, 1,1,1)


        this.setPosition = (x, y, z) => {
            this._transform.position = vec3.fromValues(x, y, z);
        }

        this.setRotation = (x, y, z, w) => {
            this._transform.rotation = quat.fromValues(x, y, z, w);
        }

        this.setRotationFromAngleAxis = (degrees, axis) => {
            this._transform.rotation = quat.create();
            quat.setAxisAngle(this._transform.rotation, axis, glMatrix.toRadian(degrees));
        }

        this.setScale = (x, y, z) => {
            this._transform.scale = vec3.fromValues(x, y, z);
        }

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

            let rotMat = mat4.create();
            mat4.fromQuat(rotMat, this._transform.rotation);
            mat4.mul(matrix, matrix, rotMat);

            mat4.scale(matrix, matrix, this._transform.scale);

            return matrix;
        }
    }
}

export class Camera extends Node {
    constructor() {
        super();

        this.FOV = 40.0;
        this.center = vec3.fromValues(0,0,1);
        this.up = vec3.fromValues(0, 1, 0);
        this.right = vec3.fromValues(1, 0, 0);

        this.updateVectors = () => {
            this.center = vec3.create()

            this.center = vec3.fromValues(0, 0, 1);
            vec3.transformQuat(this.center, this.center, this._transform.rotation);
            vec3.normalize(this.center, this.center);

            vec3.cross(this.right, this.up, this.center);

        }

        this.getViewMatrix = () => {
            let eye = this._transform.position;
            let front = vec3.create();
            vec3.add(front, eye, this.center)

            let view = mat4.create();
            mat4.lookAt(view, eye, front , this.up)
            return view;
        }

        this.look = (direction, amount) => {
            if (direction === 'horizontal'){
                quat.rotateY(this._transform.rotation, this._transform.rotation, glMatrix.toRadian(-amount));
            } else if (direction === 'vertical') {
                quat.rotateX(this._transform.rotation, this._transform.rotation, glMatrix.toRadian(-amount));
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

        this.zoom = (amount) => {
            this.FOV += amount;
            this.FOV = this.FOV >= 121 ? 120 : this.FOV;
            this.FOV = this.FOV <= 20 ? 21 : this.FOV;
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
        this._dirLight = null;
        this._pointLights = [];

        this.setDirLight =  (dirLight) => { this._dirLight = dirLight; };
        this.addPointLight = (pointLight) => { this._pointLights.push(pointLight); };


        this.render = (shader) => {

            this._children.forEach((child) => {
                child.render(shader);
            })
        }

    }
}

export class RenderObj extends Node {



    constructor(_gl, primMode=4) {
        super();
        this._vertices = {
            positions: [],
            normals: [],
            colors: [],
            texCoords: []
        }
        this._indices = [];
        this.gl = _gl;
        this.POSBufferObj = null;
        this.NORMBufferObj = null;
        this.COLBufferObj = null;
        this.TEXCBufferObj = null;
        this.VBO = null;
        this.EBO = null;
        this.VAO = null;
        this.primitiveMode = primMode;



        this.loadBuffers = () => {
            this.VAO = this.gl.createVertexArray();
            this.POSBufferObj = this.gl.createBuffer();
            this.NORMBufferObj = this.gl.createBuffer();
            this.COLBufferObj = this.gl.createBuffer();
            this.TEXCBufferObj = this.gl.createBuffer();
            this.EBO = this.gl.createBuffer();

            this.gl.bindVertexArray(this.VAO);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.POSBufferObj);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this._vertices.positions), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.COLBufferObj);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this._vertices.colors), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(1, 4, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(1);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.NORMBufferObj);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this._vertices.normals), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(2);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TEXCBufferObj);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this._vertices.texCoords), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(3, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(3);


            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.EBO);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this._indices), this.gl.STATIC_DRAW);

            this.gl.bindVertexArray(null);
        }

        this.render = (shader) => {

            let model = this.getModelMatrix();
            shader.setMat4("uModel", model);

            this.gl.bindVertexArray(this.VAO);
            this.gl.drawElements(this.primitiveMode, this._indices.length, this.gl.UNSIGNED_INT, 0)
            this.gl.bindVertexArray(null);

            this._children.forEach((child) => {
                child.render(shader);
            })
        }
    }
}
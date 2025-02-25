

export class Shader {
    constructor (_gl, vertSource, fragSource) {

        this.gl = _gl;

        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(this.vertexShader, vertSource);
        this.gl.compileShader(this.vertexShader);

        this.fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(this.fragShader, fragSource);
        this.gl.compileShader(this.fragShader);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragShader);
        this.gl.linkProgram(this.program);

        this.use = () => {
            this.gl.useProgram(this.program);
        }

        this.setBoolOrInt = (name, value) => {
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), value);
        }

        this.setFloat = (name, value) => {
            this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), value);
        }

        this.setMat3 = (name, value) => {
            this.gl.uniformMatrix3fv(this.gl.getUniformLocation(this.program, name), false, value);
        }

        this.setMat4 = (name, value) => {
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), false, value);
        }

        this.setVec3 = (name, value) => {
            this.gl.uniform3fv(this.gl.getUniformLocation(this.program, name), value);
        }

        this.setVec4 = (name, value) => {
            this.gl.uniform4fv(this.gl.getUniformLocation(this.program, name), value);
        }

    }
}
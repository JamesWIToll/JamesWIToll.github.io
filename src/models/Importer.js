import {Scene, RenderObj} from "@/models/RenderObjs.js";
import {vec3} from "gl-matrix";

export default {
    importGLTF2: async (file, gl) => {
        // let filePath = '/models/' + file + '/';
        // return await fetch(filePath + file + '.gltf').then(async (res) => {
        //   let data = await res.json();
        //   let binPath = filePath + data["buffers"][0]["uri"];
        //   let bin = null;
        //   await fetch(binPath).then(async (res) => {
        //     bin = await(await res.blob()).arrayBuffer();
        //   });
        //   let scene = new Scene(gl);
        //
        //   return scene;
        // });

        let scene = new Scene(gl);
        let triangle = new RenderObj(gl);
        triangle.addVert(1,0,0,1,-0.5,0,0,0,0,0,0,0);
        triangle.addVert(0,1,0,1,0.5,0,0,0,0,0,0,0);
        triangle.addVert(0,0,1,1,0,2,0,0,0,0,0,0);
        triangle._indices = [0,1,2];
        triangle.loadBuffers();
        vec3.set(triangle._transform.scale, 1,1,1)
        vec3.set(triangle._transform.position, 0, -0.5, -5);
        scene.addChild(triangle);
        return scene;

    }
}
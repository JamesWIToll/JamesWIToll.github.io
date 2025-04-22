import {RenderObj, Scene} from "@/models/RenderObjs.js";
import {vec4} from "gl-matrix";

export default {

    fullscreenQuad: async(gl) => {
        let scene = new Scene(gl);
        scene.name = "Scene";

        let quad = new RenderObj(gl);
        quad.name = "FullscreenQuad";

        quad._vertices.positions = [
            -1, -1, 0,
            1, 1, 0,
            1, -1, 0,
            -1, 1, 0
        ];

        quad._vertices.texCoordsLists.push([
           0, 0,
           1, 1,
           1, 0,
           0, 1
        ]);

        quad._indices = [
            0, 1, 3,
            0, 2, 1
        ]

        quad.loadBuffers();
        scene.addChild(quad);
        return scene;

    },

    defaultTriangle: async (gl) => {
        let scene = new Scene(gl);
        scene.name = "Scene";

        let triangle = new Scene(gl);
        triangle.name = "TriScene";
        let prim = new RenderObj(gl);
        prim.name = "TriPrim";
        prim._vertices.positions = [
            -1, -1, 0,
            1, -1, 0,
            0, 1, 0
        ]
        prim._vertices.colors = [
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1
        ]
        prim._indices = [
            0,1,2
        ]

        prim.loadBuffers();
        triangle.addChild(prim);
        scene.addChild(triangle);
        return scene;
    },

    importGLTF2: async (file, gl) => {

        let scene = new Scene(gl);
        let filePath = '/models/' + file + '/';
        let data = null;
        let buffer = null;

        let loadComponents = (numComponents, byteOffset, byteSize, dataAccessFunc) => {
            let arr = []
            for (let i = 0; i < numComponents; i++) {
                let item = dataAccessFunc(byteOffset + (i*byteSize));
                arr.push(item);
            }
            return arr;
        }

        let loadElementArray = (count, byteSize, byteOffset, bufferViewData, numComponents, dataAccessFunc) => {
            let arr = [];
            for (let i = 0; i < count; i++) {
                let offset = bufferViewData["byteOffset"] + byteOffset;
                if (bufferViewData["byteStride"]) {
                    offset += bufferViewData["byteStride"] * i;
                } else {
                    offset += i * byteSize * numComponents;
                }
                try{
                    let element = loadComponents(numComponents, offset, byteSize, dataAccessFunc);
                    for (let comp in element) {
                        arr.push(element[comp]);
                    }
                } catch (e) {
                    debugger
                }
            }
            return arr;
        }


        let loadDataFromAccessor = (accessorData) => {
            let arr = [];

            if (accessorData == null) {
                return arr;
            }


            let dataAccessFunc = null;
            let byteSize = 0;
            switch (accessorData["componentType"]){
                case gl.FLOAT:
                    dataAccessFunc = (offset) => {return buffer.getFloat32(offset, true)};
                    byteSize = Float32Array.BYTES_PER_ELEMENT;
                    break;
                case gl.UNSIGNED_INT:
                    dataAccessFunc = (offset) => {return buffer.getUint32(offset, true)};
                    byteSize = Uint32Array.BYTES_PER_ELEMENT;
                    break;
                case gl.SHORT:
                    dataAccessFunc = (offset) => {return buffer.getInt16(offset, true)};
                    byteSize = Int16Array.BYTES_PER_ELEMENT;
                    break;
                case gl.UNSIGNED_SHORT:
                    dataAccessFunc = (offset) => {return buffer.getUint16(offset, true)};
                    byteSize = Uint16Array.BYTES_PER_ELEMENT;
                    break;
                case gl.BYTE:
                    dataAccessFunc = (offset) => {return buffer.getInt8(offset)};
                    byteSize = Int8Array.BYTES_PER_ELEMENT;
                    break;
                case gl.UNSIGNED_BYTE:
                    dataAccessFunc = (offset) => {return buffer.getUint8(offset)};
                    byteSize = Uint8Array.BYTES_PER_ELEMENT;
                    break;
            }

            if (dataAccessFunc) {
                let numComponents = null;

                switch (accessorData["type"]) {
                    case "SCALAR":
                        numComponents = 1;
                        break;
                    case "VEC2":
                        numComponents = 2;
                        break;
                    case "VEC3":
                        numComponents = 3;
                        break;
                    case "VEC4":
                        numComponents = 4;
                        break;
                    case "MAT2":
                        numComponents = 4;
                        break;
                    case "MAT3":
                        numComponents = 9;
                        break;
                    case "MAT4":
                        numComponents = 16;
                        break;
                }
                if (numComponents) {
                    arr = loadElementArray(accessorData["count"], byteSize, accessorData["byteOffset"] ? accessorData["byteOffset"] : 0,
                                            data["bufferViews"][accessorData["bufferView"]], numComponents, dataAccessFunc);
                }
            }

            return arr;
        }

        let loadTexture = async  (texIndex) => {
            let texData = data["textures"][texIndex];
            let sourceData = data["images"][texData["source"]];
            let sampleData = data["samplers"][texData["sampler"]];
            let alpha = false;

            let tex = new Image();

            await new Promise((resolve, reject) => {
                tex.onload = () => {
                    resolve(tex);
                }
                tex.onerror = () => {
                    throw new Error(`Could not load texture ${sourceData["uri"]}`);
                }
                tex.src = filePath + sourceData["uri"];
            });

            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, sampleData['minFilter']);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, sampleData['magFilter']);
            if (sourceData.mimeType === "image/png"){
                alpha = true;
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex);
            } else {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, tex);
            }
            gl.generateMipmap(gl.TEXTURE_2D);

            return { tex: texture, hasAlpha: alpha, img: tex };
        }


        let loadPrimitive = async (primData, name) => {
            let prim = new RenderObj(gl);
            prim.name = name;
            prim.primitiveMode = primData["mode"] ? primData["mode"] : 4;

            prim._indices = loadDataFromAccessor(data["accessors"][primData["indices"]]);
            prim._vertices.positions = loadDataFromAccessor(data["accessors"][primData["attributes"]["POSITION"]]);
            prim._vertices.normals = loadDataFromAccessor(data["accessors"][primData["attributes"]["NORMAL"]]);
            prim._vertices.colors = loadDataFromAccessor(data["accessors"][primData["attributes"]["COLOR_0"]]);

            if (prim._vertices.colors.length === 0){
                for (let i = 0; i < prim._vertices.positions.length; i+= 3) {
                    prim._vertices.colors.push(1);
                    prim._vertices.colors.push(1);
                    prim._vertices.colors.push(1);
                    prim._vertices.colors.push(1);
                }
            } else {
                for (const colorKey in prim._vertices.colors) {
                    prim._vertices.colors[colorKey] /= 255;
                }
            }

            let texCoordKeys = Object.keys(primData["attributes"]).filter(key => key.substring(0, 8) === 'TEXCOORD');

            for (const key of texCoordKeys) {
                prim._vertices.texCoordsLists.push( loadDataFromAccessor(data["accessors"][primData["attributes"][key]]) )
            }


            if (primData["material"] != null){
                prim.material = data["materials"][primData["material"]];
                prim.material.transparent = false;
                if (!prim.material.pbrMetallicRoughness.baseColorFactor){
                    prim.material.pbrMetallicRoughness.baseColorFactor = vec4.fromValues(1,1,1,1);
                } else if (prim.material.pbrMetallicRoughness.baseColorFactor[3] < 1){
                    prim.material.transparent = true;
                }
            }


            if (prim.material.pbrMetallicRoughness.baseColorTexture != null) {
                let texObj  = await loadTexture(prim.material.pbrMetallicRoughness.baseColorTexture.index);
                prim.material.pbrMetallicRoughness.baseColorTexture.texture = texObj.tex;
                if (texObj.hasAlpha && !prim.material.transparent) {
                    prim.material.transparent = true;
                }

            }

            prim.loadBuffers();

            return prim;
        }

        let loadNode = async (nodeData) => {
            let node = new Scene(gl);
            node.name = nodeData["name"];
            let children = nodeData["children"];
            if (children == null) {
                children = nodeData["nodes"];
            }

            if (nodeData["translation"] != null){
                node.setPosition(nodeData["translation"][0], nodeData["translation"][1], nodeData["translation"][2]);
            }

            if (nodeData["rotation"] != null){
                node.setRotation(nodeData["rotation"][0], nodeData["rotation"][1], nodeData["rotation"][2], nodeData["rotation"][3]);
            }

            if (nodeData["scale"] != null){
                node.setScale(nodeData["scale"][0], nodeData["scale"][1], nodeData["scale"][2]);
            }


            if (nodeData["mesh"] != null) {
                let meshData = data["meshes"][nodeData["mesh"]];
                let i = 0;
                for (let primitive of meshData["primitives"]) {
                    node.addChild(await loadPrimitive(primitive, meshData["name"] + '_prim_' + i));
                    i++;
                }

            }

            if (children != null) {
                for (let child of children) {
                    node.addChild(await loadNode(data["nodes"][child]));
                }
            }

            return node;
        }


        await fetch(filePath + file + '.gltf').then(async (res) => {
            data = await res.json();

            if (data["asset"]["version"] !== "2.0"){
              throw new Error("Invalid gltf file version - please only use gLTF 2.0 files with this importer.")
            }

            let binPath = filePath + data["buffers"][0]["uri"];
            let bin = null;
            await fetch(binPath).then(async (res) => {
                bin = await(await res.blob()).arrayBuffer();
            });
            buffer = new DataView(bin);

            scene = loadNode(data["scenes"][data["scene"]])

        });
        return scene;



    }
}
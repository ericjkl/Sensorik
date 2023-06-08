import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {loadAsync, Renderer} from 'expo-three';
import {ExpoWebGLRenderingContext, GLView} from 'expo-gl';
import {THREE} from 'expo-three';
import {Asset} from 'expo-asset';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {Scene, PerspectiveCamera, AmbientLight, PointLight, BoxGeometry, MeshBasicMaterial, Mesh} from 'three';
import React, {useEffect, useState} from 'react';


export default function WebGL() {
    const [loadedObj, setLoadedObj] = useState(null);
    global.THREE = global.THREE || THREE;

    useEffect(() => {
        const asset = Asset.fromModule(require('../../../App/building.obj'));
        asset.downloadAsync().then(r => setLoadedObj(r));
        setLoadedObj(asset)
    }, []);

    let timeout;
    React.useEffect(() => {
        // Clear the animation loop when the component unmounts
        return () => clearTimeout(timeout);
    }, []);

    const width = 300;
    const height = 400;

    return (
        <View style={styles.container}>
            {loadedObj === null?
                <Text>Loading...</Text>
                :
                <GLView
                    style={{flex: 1, width: width, height: height}}
                    onContextCreate={async (gl) => {
                        const {drawingBufferWidth: width, drawingBufferHeight: height} = gl;
                        const sceneColor = 0x00ff00;

                        // Create a WebGLRenderer without a DOM element
                        const renderer = new Renderer({gl});
                        //renderer.setSize(width, height);
                        //renderer.setClearColor(sceneColor);

                        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
                        camera.position.set(2, 5, 5);

                        const scene = new Scene();

                        const ambientLight = new AmbientLight(0xffffff);
                        //scene.add(ambientLight);

                        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
                        pointLight.position.set(0, 200, 200);
                        scene.add(pointLight);

                        const geometry = new BoxGeometry(1, 1, 1);
                        const material = new MeshBasicMaterial({color: 0x00ff00});
                        const cube = new Mesh(geometry, material);
                        scene.add(cube);

                        camera.position.z = 5;

                        const loader = new OBJLoader();
                        // load a resource
                        loader.load(
                            // resource URL
                            loadedObj.uri,
                            // called when resource is loaded
                            function ( object ) {

                                scene.add( object );
                                console.log("added")
                                console.log()

                            },
                            // called when loading is in progresses
                            function ( xhr ) {

                                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                            },
                            // called when loading has errors
                            function ( error ) {

                                console.log( 'An error happened' );
                                console.log(error)

                            }
                        );


                        // Setup an animation loop
                        const render = () => {
                            timeout = requestAnimationFrame(render);
                            renderer.render(scene, camera);
                            gl.endFrameEXP();
                        };
                        render();
                    }}
                />}
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

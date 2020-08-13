import React from "react"
import styled from "styled-components"
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
//import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";

class MainPage extends React.Component{
    animation = null;
    componentDidMount() {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        scene.background = new THREE.Color( 0xffffff );

        var controls = new OrbitControls( camera, renderer.domElement );
        // Instantiate a loader
        var loader = new GLTFLoader();
        var lights = [];
        lights[ 0 ] = new THREE.PointLight( 0xffffff, .4, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, .3, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, .8, 0 );

        lights[ 0 ].position.set( 0, 200, 0 );
        lights[ 1 ].position.set( 100, 200, 100 );
        lights[ 2 ].position.set( - 100, - 200, - 100, 100 );

        scene.add( lights[ 0 ] );
        scene.add( lights[ 1 ] );
        scene.add( lights[ 2 ] );

        var ambientLight = new THREE.AmbientLight( 0x916262 );
        scene.add( ambientLight );

        var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        scene.add( light );
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        //var dracoLoader = new DRACOLoader();
        //dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
        //loader.setDRACOLoader( dracoLoader );

        // Load a glTF resource
        loader.load(
            // resource URL
            '/main-svg.glb',
            // called when the resource is loaded
             ( gltf ) => {

                var model = gltf.scene;
                var mixer = new THREE.AnimationMixer( model );
                this.animation = mixer.clipAction( gltf.animations[0] );

                scene.add( gltf.scene );

                var animate = function () {
                    requestAnimationFrame( animate );
                   // gltf.scene.rotation.y += 0.08;
                    mixer.update(0.01);
                    controls.update();
                    renderer.render( scene, camera );
                };
                animate();
                //gltf.animations; // Array<THREE.AnimationClip>
                //gltf.scene; // THREE.Group
                //gltf.scenes; // Array<THREE.Group>
                //gltf.cameras; // Array<THREE.Camera>
                //gltf.asset; // Object

            },
            // called while loading is progressing
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened' );

            }
        );


        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        this.mount.appendChild( renderer.domElement );
        camera.position.z = 3;
        controls.update();
    }

    render(){
        return <><MainPageContainer ref={ref => (this.mount = ref)}>
        </MainPageContainer>
            <PlayButton onClick={() => {this.animation && this.animation.play()}}>
                plei
            </PlayButton>
        </>
    }
}

const PlayButton = styled.div`
    position: fixed;
    top: 10px;
    right: 10px;
    padding:25px;
    border-radius: 50%;
    color: white;
    background-color: blue;
`;

const MainPageContainer = styled.div`
    
`;

export default MainPage
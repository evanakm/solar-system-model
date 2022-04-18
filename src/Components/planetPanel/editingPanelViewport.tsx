import React, { useEffect, useRef, useState } from 'react';
import { BufferGeometry, Material, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, TextureLoader, WebGLRenderer } from 'three';
import { SolarSystemModel } from '../../Models/SolarSystemModel';

class PlanetWindowView {
    private scene: Scene = new Scene();
    private renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
    private time: number = 0;

    private camera: PerspectiveCamera;
    private mesh: Mesh<BufferGeometry, Material>;

    private readonly RADIUS = 5; 
    private readonly ANGULAR_VELOCITY = 0.01;

    constructor(width: number, height: number, texturePath: string) {
        this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer.setSize(width, height);

        const geometry = new SphereGeometry(this.RADIUS, 16, 16);
        const texture = new TextureLoader().load(texturePath);
        const material = new MeshBasicMaterial({ map: texture });
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);

		this.mesh.rotation.x += Math.PI / 2;
        this.mesh.position.set(0, 0, 0);
		this.camera.position.set(10, 0, 0);
		this.camera.up.set(0, 0, 1);
		this.camera.lookAt(0, 0, 0);

    }

    public get Renderer(): WebGLRenderer {
        return this.renderer;
    }

    // Draw the scene every time the screen is refreshed
    public animate(): void {
        requestAnimationFrame(this.animate.bind(this));
		this.mesh.rotation.y += this.ANGULAR_VELOCITY;
        this.renderer.render(this.scene, this.camera);
    };
    
}

export interface PlanetWindowViewportProps {
    texturePath: string;
}

const PlanetWindowViewport = (props: PlanetWindowViewportProps) => {
    const innerRef = useRef(null);

    const [state, updateState] = useState(new PlanetWindowView(85, 85, props.texturePath));

    // TODO: I can't get this to work dynamically, so the size is hardcoded for now. (79px in SCSS)

    const updateCanvas = () => {
        state.animate();
    }

    useEffect(() => {
        updateCanvas();
      
        window.addEventListener('resize', () => {
            updateCanvas();
        });
    }, []);

    // On creation
    useEffect(() => {
        state.Renderer.setSize(79, 79);
        state.Renderer.domElement.style.width ='85px';
        state.Renderer.domElement.style.height ='79px';
        innerRef.current.appendChild(state.Renderer.domElement);
        updateCanvas();
    }, [innerRef.current]);


    return (<React.Fragment>
        <div ref={innerRef} style={{'width':'79px', 'height':'79px'}}>
        </div>
    </React.Fragment>);
}

export default PlanetWindowViewport;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- TYPE DEFINITIONS ---
type GameState = 'start' | 'playing' | 'fact';
interface Question {
    shape: string;
    question: string;
    answers: string[];
    correct: number;
    name: string;
    funFact: string;
    formulas: {
        area: string;
        volume: string;
        variables: string;
    };
}

// --- GAME DATA (outside component to prevent re-creation) ---
const questions: Question[] = [
    { shape: 'cube', question: "A standard gaming die or a salt crystal is an example of which shape?", answers: ["Prism", "Cube", "Pyramid", "Sphere"], correct: 1, name: "Cube", funFact: "Cubes are unique because bees use hexagonal cells, but cube-shaped structures appear in nature as crystals, like pyrite (Fool's Gold) and salt!", formulas: { area: "6 × a²", volume: "a³", variables: "a = side length" } },
    { shape: 'sphere', question: "Planets, stars, and basketballs are all examples of a...", answers: ["Circle", "Cylinder", "Sphere", "Torus"], correct: 2, name: "Sphere", funFact: "A sphere has the smallest surface area for a given volume, which is why bubbles and water droplets naturally form into spheres to save energy.", formulas: { area: "4 × π × r²", volume: "(4/3) × π × r³", variables: "r = radius" } },
    { shape: 'cone', question: "A rocket nozzle or a traffic pylon closely resembles which geometric shape?", answers: ["Cone", "Pyramid", "Cylinder", "Triangle"], correct: 0, name: "Cone", funFact: "Volcanoes often form in the shape of a cone. The cone shape helps distribute the pressure from the magma underneath.", formulas: { area: "π × r × (r + √(h² + r²))", volume: "(1/3) × π × r² × h", variables: "r = radius, h = height" } },
    { shape: 'cylinder', question: "A can of soda or a battery is a real-world example of a...", answers: ["Tube", "Prism", "Rectangle", "Cylinder"], correct: 3, name: "Cylinder", funFact: "The trunks of giant sequoia trees are nearly perfect cylinders. This shape provides incredible structural strength to support their immense weight.", formulas: { area: "2 × π × r × (r + h)", volume: "π × r² × h", variables: "r = radius, h = height" } },
    { shape: 'torus', question: "A planetary nebula or an inflatable swimming ring is an example of what shape?", answers: ["Torus", "Oloid", "Ring", "Sphere"], correct: 0, name: "Torus", funFact: "Scientists believe the universe itself might be shaped like a giant, 3D torus (or donut)! It's a leading theory in cosmology.", formulas: { area: "(2 × π × R) × (2 × π × r)", volume: "(π × r²) × (2 × π × R)", variables: "R = major radius, r = minor radius" } },
    { shape: 'pyramid', question: "The Great Pyramids of Giza in Egypt are a famous example of which shape?", answers: ["Tetrahedron", "Cube", "Pyramid", "Octahedron"], correct: 2, name: "Pyramid", funFact: "A pyramid is one of the most stable shapes. Its wide base and low center of gravity make it incredibly resistant to tipping over, which is why ancient structures still stand.", formulas: { area: "a² + 2 × a × √((a/2)² + h²)", volume: "(1/3) × a² × h", variables: "a = base side, h = height" } },
    { shape: 'dodecahedron', question: "A 12-sided die (d12) used in tabletop games is what type of platonic solid?", answers: ["Icosahedron", "Cube", "Octahedron", "Dodecahedron"], correct: 3, name: "Dodecahedron", funFact: "The ancient Greeks, particularly Plato, associated the dodecahedron with the element 'aether' and believed it represented the shape of the cosmos.", formulas: { area: "3 × √(25 + 10√5) × a²", volume: "(1/4) × (15 + 7√5) × a³", variables: "a = edge length" } },
    { shape: 'icosahedron', question: "Some complex viruses and the 'magic 8-ball' die take the form of which 20-faced shape?", answers: ["Icosahedron", "Sphere", "Dodecahedron", "Geode"], correct: 0, name: "Icosahedron", funFact: "Many viruses, like the Adenovirus, have a protein shell shaped like an icosahedron. This shape is incredibly efficient for self-assembly from repeating protein units.", formulas: { area: "5 × √3 × a²", volume: "(5/12) × (3 + √5) × a³", variables: "a = edge length" } },
    { shape: 'tetrahedron', question: "A four-sided die (d4) or a methane molecule has which Platonic solid shape?", answers: ["Cube", "Octahedron", "Tetrahedron", "Prism"], correct: 2, name: "Tetrahedron", funFact: "The tetrahedron is the simplest of all the Platonic solids and is composed of four equilateral triangular faces.", formulas: { area: "√3 × a²", volume: "a³ / (6√2)", variables: "a = edge length" } },
    { shape: 'octahedron', question: "A diamond crystal or an eight-sided die (d8) is an example of which shape?", answers: ["Octahedron", "Bipyramid", "Dodecahedron", "Gem"], correct: 0, name: "Octahedron", funFact: "Natural diamond and fluorite crystals often form in the shape of an octahedron. It has eight triangular faces.", formulas: { area: "2 × √3 × a²", volume: "(√2/3) × a³", variables: "a = edge length" } },
    { shape: 'hexagonalPrism', question: "A standard pencil or a honeycomb cell is an example of what kind of prism?", answers: ["Triangular Prism", "Hexagonal Prism", "Cylinder", "Octagonal Prism"], correct: 1, name: "Hexagonal Prism", funFact: "Bees use hexagonal prisms to build their honeycombs because it is the most efficient shape to tile a plane, using the least amount of wax.", formulas: { area: "3√3 × a² + 6 × a × h", volume: "(3√3/2) × a² × h", variables: "a = base edge, h = height" } },
    { shape: 'torusKnot', question: "A pretzel or a complex rollercoaster loop can be described by this intricate shape.", answers: ["Sphere", "Tangle", "Torus Knot", "Helix"], correct: 2, name: "Torus Knot", funFact: "In mathematics, a torus knot is a special kind of knot that lies on the surface of an unknotted torus in 3D space.", formulas: { area: "Parametric", volume: "Parametric", variables: "Too complex to display" } },
    { shape: 'heart', question: "This iconic symbol of love is an example of what type of custom 3D shape?", answers: ["Cardioid", "Extruded Heart", "Molded Shape", "Love Form"], correct: 1, name: "Heart", funFact: "While a 2D heart shape is common, creating it in 3D involves extruding that shape, giving it depth and volume, just like the star!", formulas: { area: "2 × Base + (Perimeter × Depth)", volume: "Base Area × Depth", variables: "Depends on base heart shape" } }
];

// --- REACT COMPONENT ---
const App: React.FC = () => {
    // --- STATE ---
    const [gameState, setGameState] = useState<GameState>('start');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [feedback, setFeedback] = useState({ text: '', color: '' });
    const [activeFunFact, setActiveFunFact] = useState('');
    const [properties, setProperties] = useState({ area: '', volume: '' });
    const [formulas, setFormulas] = useState({ area: '', volume: '', variables: '' });
    const [shapeName, setShapeName] = useState('');
    const [uiShake, setUiShake] = useState(false);
    const [buttonClasses, setButtonClasses] = useState<Record<number, string>>({});

    // --- REFS ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number>();
    const threeRef = useRef<{
        scene?: THREE.Scene,
        camera?: THREE.PerspectiveCamera,
        renderer?: THREE.WebGLRenderer,
        controls?: OrbitControls,
        currentShape?: THREE.Mesh,
        stars?: THREE.Points,
        clock?: THREE.Clock,
        composer?: EffectComposer,
        orbitingLight?: THREE.PointLight,
        orbitingLight2?: THREE.PointLight,
        blastParticles?: THREE.Points[],
        sparkParticles?: THREE.Points[],
        shockwaves?: THREE.Mesh[]
    }>({});

    // --- HELPER FUNCTIONS ---
    const getGeometry = (shapeType: string): THREE.BufferGeometry => {
         switch (shapeType) {
            case 'cube': return new THREE.BoxGeometry(3, 3, 3);
            case 'sphere': return new THREE.SphereGeometry(2.5, 64, 64);
            case 'cone': return new THREE.ConeGeometry(2.5, 4, 64);
            case 'cylinder': return new THREE.CylinderGeometry(1.8, 1.8, 3.5, 64);
            case 'torus': return new THREE.TorusGeometry(2.5, 1, 32, 100);
            case 'pyramid': return new THREE.CylinderGeometry(0, 3, 3.5, 4);
            case 'dodecahedron': return new THREE.DodecahedronGeometry(3);
            case 'icosahedron': return new THREE.IcosahedronGeometry(3);
            case 'tetrahedron': return new THREE.TetrahedronGeometry(3);
            case 'octahedron': return new THREE.OctahedronGeometry(3);
            case 'hexagonalPrism': return new THREE.CylinderGeometry(2, 2, 4, 6);
            case 'torusKnot': return new THREE.TorusKnotGeometry(2, 0.6, 100, 16);
            case 'heart': {
                const heartShape = new THREE.Shape();
                heartShape.moveTo( 2.5, 2.5 );
                heartShape.bezierCurveTo( 2.5, 2.5, 2.0, 0, 0, 0 );
                heartShape.bezierCurveTo( -3.0, 0, -3.0, 3.5, -3.0, 3.5 );
                heartShape.bezierCurveTo( -3.0, 5.5, -1.0, 7.7, 2.5, 9.5 );
                heartShape.bezierCurveTo( 6.0, 7.7, 8.0, 5.5, 8.0, 3.5 );
                heartShape.bezierCurveTo( 8.0, 3.5, 8.0, 0, 5.0, 0 );
                heartShape.bezierCurveTo( 3.5, 0, 2.5, 2.5, 2.5, 2.5 );
                const extrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
                const geo = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
                geo.scale(0.3, 0.3, 0.3);
                geo.translate(-2, -2, 0);
                return geo;
            }
            default: return new THREE.BoxGeometry(3, 3, 3);
        }
    };

    const calculateProperties = useCallback((shapeType: string, geometry: THREE.BufferGeometry) => {
        let area: string | number = 'Complex', volume: string | number = 'Complex';

        switch(shapeType) {
            case 'cube': {
                const params = (geometry as THREE.BoxGeometry).parameters;
                area = 6 * Math.pow(params.width, 2);
                volume = Math.pow(params.width, 3);
                break;
            }
            case 'sphere': {
                const params = (geometry as THREE.SphereGeometry).parameters;
                area = 4 * Math.PI * Math.pow(params.radius, 2);
                volume = (4/3) * Math.PI * Math.pow(params.radius, 3);
                break;
            }
            case 'cone': {
                const params = (geometry as THREE.ConeGeometry).parameters;
                const rc = params.radius, hc = params.height, sc = Math.sqrt(rc*rc + hc*hc);
                area = Math.PI * rc * (rc + sc);
                volume = Math.PI * rc*rc * (hc/3);
                break;
            }
            case 'cylinder': {
                const params = (geometry as THREE.CylinderGeometry).parameters;
                const rcy = params.radiusTop, hcy = params.height;
                area = 2 * Math.PI * rcy * (hcy + rcy);
                volume = Math.PI * rcy*rcy * hcy;
                break;
            }
            case 'torus': {
                const params = (geometry as THREE.TorusGeometry).parameters;
                const R = params.radius, r = params.tube;
                area = (2 * Math.PI * R) * (2 * Math.PI * r);
                volume = (Math.PI * r*r) * (2 * Math.PI * R);
                break;
            }
        }
        const finalArea = typeof area === 'number' ? area.toFixed(2) : area;
        const finalVolume = typeof volume === 'number' ? volume.toFixed(2) : volume;
        return { area: finalArea, volume: finalVolume };
    }, []);

    const loadQuestion = useCallback((qIndex: number) => {
        const { scene } = threeRef.current;
        if (!scene) return;

        setIsAnswered(false);
        setFeedback({ text: '', color: '' });
        setShapeName('');
        setUiShake(false);
        setButtonClasses({});

        if (threeRef.current.currentShape) {
            scene.remove(threeRef.current.currentShape);
        }

        const question = questions[qIndex];
        const geometry = getGeometry(question.shape);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x00ffff, metalness: 0.6, roughness: 0.05,
            transmission: 0.3, transparent: true, ior: 1.5, clearcoat: 1.0,
        });
        const shape = new THREE.Mesh(geometry, material);
        shape.userData = { isGlowing: false };
        scene.add(shape);
        threeRef.current.currentShape = shape;

        const props = calculateProperties(question.shape, geometry);
        setProperties(props);

        setFormulas(question.formulas);
    }, [calculateProperties]);
    
    const loadNextQuestion = useCallback(() => {
        setGameState('playing');
        setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
        if (threeRef.current.controls) {
            threeRef.current.controls.autoRotate = true;
        }
    }, []);
    
    // --- PARTICLE & EFFECT CREATORS ---
    const createWonderEffect = useCallback(() => {
        const { scene, clock, currentShape } = threeRef.current;
        if (!scene || !clock || !currentShape) return;
        
        const shockwaveGeometry = new THREE.RingGeometry(0.1, 0.2, 64);
        const shockwaveMaterial = new THREE.MeshBasicMaterial({
            color: 0x93c5fd, transparent: true, blending: THREE.AdditiveBlending,
            depthWrite: false, side: THREE.DoubleSide
        });
        const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial);
        shockwave.rotation.x = -Math.PI / 2;
        shockwave.userData = { life: 1.5 };
        scene.add(shockwave);
        threeRef.current.shockwaves?.push(shockwave);

        currentShape.userData = { ...currentShape.userData, isGlowing: true, glowStartTime: clock.getElapsedTime() };
    }, []);

    const handleAnswer = useCallback((selectedIndex: number) => {
        if (isAnswered) return;
        setIsAnswered(true);

        const question = questions[currentQuestionIndex];
        const correctIndex = question.correct;
        
        setShapeName(question.name);

        if (selectedIndex === correctIndex) {
            setScore(s => s + 1);
            if ((score + 1) % 5 === 0) {
                setLevel(l => l + 1);
                if(threeRef.current.controls) threeRef.current.controls.autoRotateSpeed += 0.2;
            }
            setFeedback({ text: `Correct! It's a ${question.name}.`, color: "#10B981" });
            setButtonClasses({ [selectedIndex]: 'correct' });
            createWonderEffect();
            setTimeout(() => {
                setActiveFunFact(question.funFact);
                setGameState('fact');
            }, 1000);
        } else {
            setFeedback({ text: `Not quite! The answer is ${question.answers[correctIndex]}.`, color: "#EF4444" });
            setButtonClasses({ [selectedIndex]: 'incorrect', [correctIndex]: 'correct' });
            setUiShake(true);
            
            // Blast effect and hide shape logic can be added here
            if (threeRef.current.currentShape) threeRef.current.currentShape.visible = false;
            
            setTimeout(loadNextQuestion, 3000);
        }
    }, [isAnswered, currentQuestionIndex, score, createWonderEffect, loadNextQuestion]);

    // --- MAIN THREE.JS USE EFFECT ---
    useEffect(() => {
        const container = canvasContainerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas || gameState !== 'playing') return;

        // --- Init ---
        const clock = new THREE.Clock();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ReinhardToneMapping;

        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        const orbitingLight = new THREE.PointLight(0x00aaff, 2, 50);
        scene.add(orbitingLight);
        const orbitingLight2 = new THREE.PointLight(0xff00aa, 2, 50);
        scene.add(orbitingLight2);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;

        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 15000; i++) starVertices.push(THREE.MathUtils.randFloatSpread(2000));
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.7 }));
        scene.add(stars);

        const renderPass = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.85);
        const composer = new EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);

        threeRef.current = { scene, camera, renderer, controls, clock, composer, orbitingLight, orbitingLight2, stars, shockwaves: [], blastParticles: [], sparkParticles: [] };
        
        loadQuestion(currentQuestionIndex);

        // --- Animate Loop ---
        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);
            const { current } = threeRef;
            if (!current.scene || !current.camera || !current.composer || !current.clock || !current.orbitingLight || !current.orbitingLight2 || !current.stars || !current.controls) return;

            const elapsedTime = current.clock.getElapsedTime();
            current.orbitingLight.position.x = Math.sin(elapsedTime * 0.7) * 5;
            current.orbitingLight.position.y = Math.cos(elapsedTime * 0.7) * 5;
            current.orbitingLight.position.z = Math.cos(elapsedTime * 0.5) * 5;

            current.orbitingLight2.position.x = Math.cos(elapsedTime * 0.5) * 6;
            current.orbitingLight2.position.y = Math.sin(elapsedTime * 0.5) * 6;
            current.orbitingLight2.position.z = Math.sin(elapsedTime * 0.7) * 6;
            
            current.controls.update();
            current.stars.rotation.y += 0.0001;

            if (current.currentShape && !isAnswered && !(current.currentShape.userData?.isGlowing)) {
                const hue = (Date.now() * 0.0001) % 1;
                (current.currentShape.material as THREE.MeshPhysicalMaterial).color.setHSL(hue, 1.0, 0.85);
            }

            // Update effects...
            current.composer.render();
        };

        animate();

        // --- Resize ---
        const handleResize = () => {
            const { camera, renderer, composer } = threeRef.current;
            if (!camera || !renderer || !composer || !container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            composer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // --- Cleanup ---
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            // Add more cleanup for Three.js objects if needed
        };
    }, [gameState]); // Re-init when game starts
    
    // Effect to load new question when index changes
    useEffect(() => {
        if(gameState === 'playing') {
            loadQuestion(currentQuestionIndex);
        }
    }, [currentQuestionIndex, gameState, loadQuestion]);

    return (
        <>
            <style>{`
                body { font-family: 'Poppins', sans-serif; background-color: #0c0a18; color: #F9FAFB; overflow: hidden; }
                h1, h2, h3 { font-family: 'Orbitron', sans-serif; }
                .glass-panel { background: rgba(17, 24, 39, 0.6); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(56, 189, 248, 0.2); box-shadow: 0 0 20px rgba(56, 189, 248, 0.1); transition: all 0.3s ease-in-out; }
                #game-canvas { display: block; width: 100%; height: 100%; }
                .answer-btn { background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(56, 189, 248, 0.3); transition: all 0.2s ease-in-out; }
                .answer-btn:hover { transform: translateY(-2px) scale(1.02); background: rgba(56, 189, 248, 0.3); box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }
                .correct { background: rgba(16, 185, 129, 0.5) !important; border-color: #059669 !important; animation: pulse-green 0.5s; }
                .incorrect { background: rgba(239, 68, 68, 0.5) !important; border-color: #DC2626 !important; }
                .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
                @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
                @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
                .modal-screen { background: rgba(12, 10, 24, 0.9); z-index: 100; transition: opacity 0.5s ease-in-out; }
            `}</style>
            {gameState === 'start' && (
                <div id="start-screen" className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000">
                    <div className="text-center p-4">
                        <h1 className="text-4xl md:text-6xl font-bold text-sky-300 mb-4 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">Cosmic Geometry Explorer</h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
                            Welcome, Explorer! Your mission is to identify the fundamental geometric shapes that form our universe.
                        </p>
                        <button onClick={() => setGameState('playing')} className="text-2xl font-bold bg-sky-500/80 text-white py-3 px-8 rounded-lg border border-sky-300 hover:bg-sky-400/80 hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                            Begin Exploration
                        </button>
                    </div>
                </div>
            )}
            
            {gameState === 'fact' && (
                 <div id="fun-fact-modal" className="modal-screen absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="glass-panel rounded-xl p-8 max-w-2xl text-center">
                        <h2 className="text-3xl font-bold text-amber-300 mb-4">Cosmic Fact!</h2>
                        <p className="text-lg text-gray-200 mb-8">{activeFunFact}</p>
                        <button onClick={loadNextQuestion} className="text-xl font-bold bg-sky-500/80 text-white py-2 px-6 rounded-lg border border-sky-300 hover:bg-sky-400/80 hover:scale-105 transition-transform duration-300">
                            Continue
                        </button>
                    </div>
                </div>
            )}

            <div id="game-container" className={`w-full h-full flex flex-col lg:flex-row items-center justify-center gap-4 transition-opacity duration-1000 ${gameState === 'playing' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div id="canvas-container" ref={canvasContainerRef} className="w-full h-2/3 lg:h-full lg:w-2/3 rounded-xl shadow-2xl relative cursor-grab active:cursor-grabbing glass-panel">
                    <canvas id="game-canvas" ref={canvasRef}></canvas>
                    <div className="absolute top-4 left-4 glass-panel px-4 py-2 rounded-lg flex gap-6">
                        <h2 className="font-bold text-xl text-sky-300">Score: <span>{score}</span></h2>
                        <h2 className="font-bold text-xl text-amber-300">Level: <span>{level}</span></h2>
                    </div>
                </div>

                <div id="ui-panel" className={`w-full h-1/3 lg:h-full lg:w-1/3 glass-panel rounded-xl shadow-2xl p-6 flex flex-col justify-between items-center text-center ${uiShake ? 'shake' : ''}`}>
                     <div>
                        <h1 className="text-xl md:text-2xl font-bold mb-6 text-sky-300 h-20">{questions[currentQuestionIndex].question}</h1>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {questions[currentQuestionIndex].answers.map((answer, index) => (
                                <button key={index} onClick={() => handleAnswer(index)} className={`answer-btn w-full p-4 rounded-lg font-semibold ${buttonClasses[index] || ''}`}>
                                    {answer}
                                </button>
                            ))}
                        </div>
                        <div className="mt-6 text-xl font-semibold h-8" style={{ color: feedback.color }}>{feedback.text}</div>
                    </div>
                    <div className="w-full glass-panel rounded-lg p-4 mt-4">
                        <h3 className="text-lg font-bold text-sky-300 border-b-2 border-sky-500/50 pb-2 mb-2">Object Properties</h3>
                        {shapeName && (
                            <div className="text-center mb-2">
                                <h4 className="text-md font-bold text-amber-300 tracking-widest uppercase">{shapeName}</h4>
                            </div>
                        )}
                        <div className="text-left text-base space-y-1">
                            <p><strong>Surface Area:</strong> <span className="font-mono text-lime-300">{properties.area} units²</span></p>
                            <p><strong>Volume:</strong> <span className="font-mono text-lime-300">{properties.volume} units³</span></p>
                        </div>
                        <div className="text-left text-base space-y-1 mt-4 border-t-2 border-sky-500/50 pt-2">
                            <p><strong>Area Formula:</strong> <span className="font-mono text-cyan-300" dangerouslySetInnerHTML={{ __html: formulas.area.replace(/²/g, '<sup>2</sup>').replace(/³/g, '<sup>3</sup>') }}></span></p>
                            <p><strong>Volume Formula:</strong> <span className="font-mono text-cyan-300" dangerouslySetInnerHTML={{ __html: formulas.volume.replace(/²/g, '<sup>2</sup>').replace(/³/g, '<sup>3</sup>') }}></span></p>
                            <p><small className="text-gray-400">{formulas.variables}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;

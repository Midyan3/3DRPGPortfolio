import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

interface ThreeCanvasProps {
  isNightMode?: boolean;
}

export default function ThreeCanvas({ isNightMode = false }: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [popupPosition, setPopupPosition] = useState(20);

  const resumeRef = useRef<THREE.Mesh | null>(null);
  const sectionMeshesRef = useRef<Record<string, THREE.Mesh>>({});
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const movement = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const sectionContent = {
    education: {
      title: "Education",
      subtitle: "City University of New York, Hunter College",
      details:
        "Currently completing my Bachelor of Science in Computer Science with a Minor in Mathematics, with plans to continue into a Master's program afterward. I focus on practical systems programming, advanced computational vision techniques, and efficient data structures. Each course and project has strengthened both my theoretical understanding and hands-on implementation skills, preparing me for graduate-level research and industry challenges.",
      items: [
        "GPA: 3.62 / 4.0 — Expected Graduation: May 2025 — Planning to pursue Master's degree following completion",
        "Core Curriculum: Operating Systems architecture, Advanced Data Structures & Algorithm optimization, Computational Vision research, Virtual/Mixed/Augmented Reality development, Deep Learning applications, Enterprise Database Management",
        "Academic Achievements: Consistent Dean's List recognition and active participation in research initiatives and collaborative learning projects",
      ],
    },
    experience: {
      title: "Professional Experience",
      subtitle: "Academic and Industry Roles",
      details:
        "My professional experience combines practical teaching, cutting-edge research, and real-world system optimization. I enjoy working where theoretical computer science meets practical implementation, whether helping students grasp complex concepts or building efficient systems that solve concrete problems.",
      items: [
        "Undergraduate Teaching Assistant (Sep 2024 – Present): Help students master fundamental concepts in Computer Theory (CS 265) and Operating Systems (CS 340), breaking down complex topics including finite automata theory, Turing machine computation models, memory management systems, and process synchronization protocols. Create supplementary materials and provide one-on-one guidance for challenging assignments.",
        "Research Intern – Computer Vision Lab (Summer 2024 – Present): Conduct research on DeepSDF (Deep Signed Distance Function) models to enhance 3D shape representation and reconstruction accuracy. Currently building and testing a prototype pipeline that addresses existing limitations in object representation while optimizing computational efficiency for real-time applications.",
        "IT Infrastructure Intern – IT Universum (Summer 2021): Worked directly with senior IT specialists to reduce critical system downtime by 80% through implementing proactive monitoring solutions, optimizing maintenance scheduling, and supporting comprehensive infrastructure diagnostics and remediation.",
      ],
    },
    projects: {
      title: "Projects",
      subtitle: "Full-Stack Development & System Architecture",
      details:
        "Each project I build addresses real-world needs through thoughtful design and robust implementation. I create complete solutions from concept to deployment, focusing on user experience, performance optimization, and security at every step. My work reflects my belief that good software combines technical excellence with genuine user value.",
      items: [
        {
          text: "LeagueOS (Sep 2024 – Present): Created a comprehensive OS-inspired web platform using Angular with TypeScript frontend and Golang with GraphQL backend. Features window management with snap functionality, task scheduling, real-time notification widgets, and secure OAuth2 authentication. Containerized with Docker and deployed on DigitalOcean infrastructure with 95.7% uptime reliability and serving over 120 active users.",
          links: [
            { label: "Live Site", url: "https://leagueos.org/" },
            {
              label: "GitHub",
              url: "https://github.com/midyanelghazali/leagueos",
            },
          ],
        },
        {
          text: "Spotify Music Tracker (Sep 2024 – Dec 2024): Developed a React application with Tailwind CSS that connects to the Spotify API to extract and visualize personal listening data. Created interactive data visualizations with Chart.js to display listening patterns, genre preferences, and artist discovery trends through intuitive, responsive interfaces.",
          links: [
            {
              label: "GitHub",
              url: "https://github.com/midyanelghazali/spotify-tracker",
            },
          ],
        },
        {
          text: "TODO List Application (Sep 2024 – Dec 2024): Built a responsive task management application featuring complete CRUD operations, intuitive drag-and-drop task prioritization, and category organization. Implemented with React and Bootstrap frontend connected to a custom RESTful API backend with secure data persistence.",
          links: [
            {
              label: "GitHub",
              url: "https://github.com/midyanelghazali/todo-app",
            },
          ],
        },
        {
          text: "CLANOTEA (Sep 2023 – Jan 2024): Engineered a collaborative note-sharing platform for students with support for rich media content and real-time collaborative editing. Integrated the Dropbox API for reliable media storage, implemented comprehensive JWT authentication, and built a real-time Express/MongoDB backend that scaled to support 175+ concurrent users at peak usage.",
          links: [
            {
              label: "GitHub",
              url: "https://github.com/midyanelghazali/clanotea",
            },
          ],
        },
      ],
    },
    skills: {
      title: "Technical Skills",
      subtitle: "Programming Languages, Frameworks & Tools",
      details:
        "My technical toolkit spans from low-level system programming to modern web frameworks and cloud infrastructure. I continuously expand my capabilities across the full development stack, focusing on technologies that enable me to create secure, performant, and maintainable solutions for complex problems.",
      items: [
        "Programming Languages: TypeScript/JavaScript (ES6+), Python, C++ (STL, modern features), Golang, C# (.NET Core), SQL (PostgreSQL, MySQL), NoSQL schema design",
        "Frameworks & Libraries: React (Hooks, Context API), Angular (RxJS, NgRx), Express.js, TensorFlow/PyTorch, OpenCV, Tailwind CSS, Bootstrap 5, Flutter for cross-platform development",
        "Cloud Services & DevOps: AWS (S3 object storage, DynamoDB, Rekognition ML services, Comprehend NLP), Docker containerization, Firebase real-time database, CI/CD pipeline automation, Nginx server configuration, Certbot for HTTPS, RabbitMQ message queues",
        "Database Technologies & API Integration: MongoDB (aggregation, indexing), PostgreSQL (performance tuning), GraphQL API design, RESTful architecture, Third-party API integration (Dropbox, Spotify, OpenAI, Riot Games, Stripe payment processing)",
        "Development Tools: Git/GitHub workflow, Postman API testing, Figma for UI/UX design, Unity game engine, Chart.js data visualization, JWT authentication implementation, Comprehensive logging and application monitoring solutions",
      ],
    },
  };

  useEffect(() => {
    if (activeSection) {
      const timer = setTimeout(() => {
        setIsPopupVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsPopupVisible(false);
    }
  }, [activeSection]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !immersiveMode;
      console.log(
        `Switched to ${immersiveMode ? "immersive" : "orbital"} mode`,
      );
    }
  }, [immersiveMode]);

  useEffect(() => {
    if (isPopupVisible && activeSection) {
      setTimeout(() => {
        const element = document.querySelector("#section-info-popup");
        if (element) {
          const rect = element.getBoundingClientRect();
          console.log("Popup element found:", rect);
          setPopupPosition(rect.height + 40);
        } else {
          console.log("Element not found in useEffect");
          setPopupPosition(20);
        }
      }, 100);
    } else {
      setPopupPosition(20);
    }
  }, [isPopupVisible, activeSection]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      2000,
    );
    camera.position.z = 400;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 0, 500);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const blueLight = new THREE.DirectionalLight(
      isNightMode ? 0x4455ff : 0x4444ff,
      isNightMode ? 0.6 : 0.5,
    );
    blueLight.position.set(-100, 0, 100);
    scene.add(blueLight);

    const pinkLight = new THREE.DirectionalLight(
      isNightMode ? 0x7744aa : 0xff44aa,
      isNightMode ? 0.6 : 0.5,
    );
    pinkLight.position.set(100, 0, 100);
    scene.add(pinkLight);

    if (isNightMode) {
      const moonLight = new THREE.DirectionalLight(0x8888ff, 0.3);
      moonLight.position.set(0, 500, 100);
      scene.add(moonLight);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controlsRef.current = controls;

    const sections = [
      { id: "education", title: "Education", y: 150, height: 60 },
      { id: "experience", title: "Experience", y: 92, height: 85 },
      { id: "projects", title: "Projects", y: -40, height: 165 },
      { id: "skills", title: "Skills", y: -150, height: 60 },
    ];

    const textureLoader = new THREE.TextureLoader();

    function createResumePlane(texture: THREE.Texture) {
      const geometry = new THREE.PlaneGeometry(300, 400);

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
      resumeRef.current = plane;

      console.log(
        "Resume plane added with size:",
        geometry.parameters.width,
        "x",
        geometry.parameters.height,
      );

      sections.forEach((section) => {
        const sectionGeometry = new THREE.PlaneGeometry(280, section.height);
        const sectionMaterial = new THREE.MeshBasicMaterial({
          color: isNightMode ? 0x8844cc : 0xff88cc,
          transparent: true,
          opacity: 0.0,
          side: THREE.DoubleSide,
        });

        const sectionMesh = new THREE.Mesh(sectionGeometry, sectionMaterial);
        sectionMesh.position.set(0, section.y, 10);
        sectionMesh.userData = { id: section.id, title: section.title };

        scene.add(sectionMesh);
        sectionMeshesRef.current[section.id] = sectionMesh;
      });

      setLoading(false);
    }

    function createFallbackPlane() {
      const geometry = new THREE.PlaneGeometry(300, 400);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });

      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
      resumeRef.current = plane;

      console.log("Fallback plane created");

      sections.forEach((section) => {
        const sectionGeometry = new THREE.PlaneGeometry(290, section.height);
        const sectionMaterial = new THREE.MeshBasicMaterial({
          color: isNightMode ? 0x8844cc : 0xff88cc,
          transparent: true,
          opacity: 0.0,
          side: THREE.DoubleSide,
        });

        const sectionMesh = new THREE.Mesh(sectionGeometry, sectionMaterial);
        sectionMesh.position.set(0, section.y, 1);
        sectionMesh.userData = { id: section.id, title: section.title };

        scene.add(sectionMesh);
        sectionMeshesRef.current[section.id] = sectionMesh;
      });

      setLoading(false);
    }

    textureLoader.load(
      "/resume.png",
      (texture) => {
        console.log("Resume texture loaded successfully");
        createResumePlane(texture);
      },
      (xhr) => {
        console.log(
          `Resume loading: ${Math.floor((xhr.loaded / xhr.total) * 100)}%`,
        );
      },
      (error) => {
        console.error("PNG load failed, trying JPG:", error);

        textureLoader.load(
          "/resume.jpg",
          (texture) => {
            console.log("Resume JPG loaded successfully");
            createResumePlane(texture);
          },
          (xhr) => {
            console.log(
              `JPG loading: ${Math.floor((xhr.loaded / xhr.total) * 100)}%`,
            );
          },
          (error) => {
            console.error("Failed to load resume texture:", error);
            createFallbackPlane();
          },
        );
      },
    );

    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];

    for (let i = 0; i < 500; i++) {
      const x = THREE.MathUtils.randFloatSpread(1000);
      const y = THREE.MathUtils.randFloatSpread(1000);
      const z = THREE.MathUtils.randFloatSpread(1000);
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starsVertices, 3),
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: isNightMode ? 0xaaaaff : 0xffffff,
      size: isNightMode ? 2.5 : 2,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    function createParticles() {
      const particleCount = 100;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 800;
        positions[i3 + 1] = (Math.random() - 0.5) * 800;
        positions[i3 + 2] = (Math.random() - 0.5) * 800;
      }

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );

      const particleMaterial = new THREE.PointsMaterial({
        color: isNightMode ? 0x8844dd : 0xff88cc,
        size: 3,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      return particles;
    }

    const particles = createParticles();

    function handleMouseMove(event: MouseEvent) {
      if (!mountRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const sectionMeshes = Object.values(sectionMeshesRef.current);

      sectionMeshes.forEach((mesh) => {
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.0;
      });

      const intersects = raycaster.intersectObjects(sectionMeshes, false);

      if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object as THREE.Mesh;
        const material = hoveredMesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.2;
        if (mountRef.current) {
          mountRef.current.style.cursor = 'url("/pointcur.cur"), pointer';
        }
      } else {
        if (mountRef.current) {
          mountRef.current.style.cursor = 'url("/pointcur.cur"), pointer';
        }
      }
    }

    function handleClick() {
      raycaster.setFromCamera(mouse, camera);

      const sectionMeshes = Object.values(sectionMeshesRef.current);

      const intersects = raycaster.intersectObjects(sectionMeshes, false);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const sectionId = clickedMesh.userData.id as string;

        setActiveSection((prevSection) =>
          prevSection === sectionId ? null : sectionId,
        );

        zoomToSection(clickedMesh.position.y);

        console.log(`Clicked section: ${sectionId}`);
      }
    }

    let isZooming = false;

    function zoomToSection(yPosition: number) {
      if (!cameraRef.current || isZooming) return;

      isZooming = true;

      const targetPosition = new THREE.Vector3(0, yPosition, 350);
      const startPosition = cameraRef.current.position.clone();
      const duration = 1000;
      const startTime = Date.now();

      function animateCamera() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        cameraRef.current!.position.lerpVectors(
          startPosition,
          targetPosition,
          easeOutCubic,
        );

        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        } else {
          isZooming = false;
        }
      }

      animateCamera();
    }

    const isDragging = { current: false };
    const previousMousePosition = { x: 0, y: 0 };

    function handleMouseDown(event: MouseEvent) {
      isDragging.current = true;
      previousMousePosition.x = event.clientX;
      previousMousePosition.y = event.clientY;
    }

    function handleMouseUp() {
      isDragging.current = false;
    }

    function handleDragMove(event: MouseEvent) {
      if (!isDragging.current || !cameraRef.current) return;

      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      cameraRef.current.rotation.y += deltaX * 0.01;
      cameraRef.current.rotation.x += deltaY * 0.01;

      previousMousePosition.x = event.clientX;
      previousMousePosition.y = event.clientY;
    }

    function handleKeyDown(e: KeyboardEvent) {
      console.log("Key DOWN event:", e.key, e.code);

      if (e.key.toLowerCase() === "t") {
        setImmersiveMode((prev) => !prev);
        return;
      }

      if (
        [
          "w",
          "a",
          "s",
          "d",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }

      if (e.key.toLowerCase() === "w" || e.key === "ArrowUp")
        movement.current.forward = true;
      if (e.key.toLowerCase() === "s" || e.key === "ArrowDown")
        movement.current.backward = true;
      if (e.key.toLowerCase() === "a" || e.key === "ArrowLeft")
        movement.current.left = true;
      if (e.key.toLowerCase() === "d" || e.key === "ArrowRight")
        movement.current.right = true;

      console.log("Movement state after keydown:", movement.current);
    }

    function handleKeyUp(e: KeyboardEvent) {
      console.log("Key UP event:", e.key, e.code);

      if (e.key.toLowerCase() === "w" || e.key === "ArrowUp")
        movement.current.forward = false;
      if (e.key.toLowerCase() === "s" || e.key === "ArrowDown")
        movement.current.backward = false;
      if (e.key.toLowerCase() === "a" || e.key === "ArrowLeft")
        movement.current.left = false;
      if (e.key.toLowerCase() === "d" || e.key === "ArrowRight")
        movement.current.right = false;

      console.log("Movement state after keyup:", movement.current);
    }

    function handleResize() {
      if (!mountRef.current || !cameraRef.current) return;

      cameraRef.current.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();

      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight,
      );
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    mountRef.current.addEventListener("mousemove", handleMouseMove);
    mountRef.current.addEventListener("click", handleClick);
    mountRef.current.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    mountRef.current.addEventListener("mousemove", handleDragMove);

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      if (particles) {
        particles.rotation.y = elapsed * 0.05;

        const positions = particles.geometry.attributes.position
          .array as Float32Array;

        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 0.1;

          if (positions[i] < -400) {
            positions[i] = 400;
          }
        }

        particles.geometry.attributes.position.needsUpdate = true;
      }

      if (resumeRef.current) {
        resumeRef.current.position.y = Math.sin(elapsed * 0.3) * 5;
        resumeRef.current.rotation.y = Math.sin(elapsed * 0.2) * 0.02;
      }

      if (cameraRef.current) {
        const moveSpeed = 2;
        if (movement.current.forward) {
          cameraRef.current.translateZ(-moveSpeed);
          console.log("Moving FORWARD", cameraRef.current.position);
        }

        if (movement.current.backward) {
          cameraRef.current.translateZ(moveSpeed);
          console.log("Moving BACKWARD", cameraRef.current.position);
        }

        if (movement.current.left) {
          cameraRef.current.translateX(-moveSpeed);
          console.log("Moving LEFT", cameraRef.current.position);
        }

        if (movement.current.right) {
          cameraRef.current.translateX(moveSpeed);
          console.log("Moving RIGHT", cameraRef.current.position);
        }
      }

      if (!immersiveMode && controlsRef.current) {
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      console.log("Cleaning up ThreeCanvas");

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseup", handleMouseUp);

      if (mountRef.current) {
        mountRef.current.removeEventListener("mousemove", handleMouseMove);
        mountRef.current.removeEventListener("click", handleClick);
        mountRef.current.removeEventListener("mousedown", handleMouseDown);
        mountRef.current.removeEventListener("mousemove", handleDragMove);
        mountRef.current.style.cursor = "auto";
      }

      if (resumeRef.current) {
        if (resumeRef.current.geometry) resumeRef.current.geometry.dispose();
        if (resumeRef.current.material instanceof THREE.Material) {
          resumeRef.current.material.dispose();
        }
      }

      Object.values(sectionMeshesRef.current).forEach((mesh) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
      });

      renderer.dispose();

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isNightMode]);
  const getActiveSectionContent = () => {
    if (!activeSection) return null;
    return sectionContent[activeSection as keyof typeof sectionContent];
  };

  const content = getActiveSectionContent();
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-white text-xl">Loading Resume...</div>
        </div>
      )}

      <div className="absolute top-3 right-3 z-20 group">
        <div
          className={`absolute top-7 right-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
            isNightMode
              ? "bg-indigo-900/80 text-indigo-200"
              : "bg-emerald-900/80 text-emerald-100"
          } px-2 py-1 text-xs rounded-md backdrop-blur-sm pointer-events-none shadow-md min-w-[160px] text-center`}
        >
          Press T to toggle view mode
        </div>

        <div className="flex items-center gap-2 p-1">
          <span
            className={`text-xs cursor-pointer transition-all duration-300 ${
              !immersiveMode
                ? `font-bold ${isNightMode ? "text-indigo-300" : "text-emerald-400"}`
                : "text-white/60 hover:text-white/90"
            }`}
            onClick={() => setImmersiveMode(false)}
          >
            Orbital
          </span>

          <div
            onClick={() => setImmersiveMode((prev) => !prev)}
            className="relative cursor-pointer"
          >
            <div
              className={`w-8 h-3 rounded-full transition-colors duration-500 ${
                isNightMode
                  ? immersiveMode
                    ? "bg-indigo-600/40"
                    : "bg-indigo-500/30"
                  : immersiveMode
                    ? "bg-emerald-600/40"
                    : "bg-emerald-500/30"
              }`}
            ></div>

            <div
              className={`absolute top-[-2px] w-4 h-4 rounded-full shadow-md transition-all duration-300 ${
                immersiveMode
                  ? `translate-x-4 ${isNightMode ? "bg-indigo-400" : "bg-emerald-400"}`
                  : `${isNightMode ? "bg-indigo-300" : "bg-emerald-300"}`
              }`}
            ></div>
          </div>
          <span
            className={`text-xs cursor-pointer transition-all duration-300 ${
              immersiveMode
                ? `font-bold ${isNightMode ? "text-indigo-300" : "text-emerald-400"}`
                : "text-white/60 hover:text-white/90"
            }`}
            onClick={() => setImmersiveMode(true)}
          >
            Immersive
          </span>
        </div>
      </div>

      {immersiveMode && (
        <div className="absolute top-4 left-4 z-20">
          <div className="relative">
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${
                isNightMode
                  ? "from-indigo-500 to-purple-700"
                  : "from-pink-500 to-purple-500"
              } opacity-70 blur-sm rounded-full animate-pulse transition-colors duration-1000`}
            ></div>

            <div
              className={`relative bg-gradient-to-r ${
                isNightMode
                  ? "from-indigo-500/70 to-purple-700/70"
                  : "from-pink-500/70 to-purple-500/70"
              } text-white px-4 py-1.5 rounded-full font-bold border border-white/30 shadow-lg flex items-center transition-colors duration-1000`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-1.5"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
              Immersive Mode
            </div>
          </div>
        </div>
      )}
      <div
        ref={mountRef}
        className="relative inset-0 w-full h-full bg-transparent cursor-grab active:cursor-grabbing"
      />

      {activeSection && (
        <div
          id="section-info-popup"
          className={`fixed inset-x-0 bottom-10 z-100 flex justify-center items-center transition-all duration-500 ease-in-out ${
            isPopupVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <div className="mx-auto max-w-2xl w-full p-1 mb-8 opacity-65 hover:opacity-100 transition-opacity">
            <div className="bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-blue-500/80 p-[2px] rounded-xl shadow-xl">
              <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 text-white">
                {content && (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                          {content.title}
                        </h3>
                        <p className="text-pink-200 mt-1">{content.subtitle}</p>
                      </div>
                      <button
                        onClick={() => setActiveSection(null)}
                        className="text-pink-300 hover:text-white transition-colors p-1"
                        aria-label="Close"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <p className="text-gray-300 mb-4">{content.details}</p>

                    <div className="space-y-2">
                      {content &&
                        content.items &&
                        Array.isArray(content.items) &&
                        content.items.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-pink-400 mr-2">▹</span>
                            <div className="text-gray-200">
                              {typeof item === "string" && item}

                              {typeof item === "object" && item.text && (
                                <div>
                                  <div>{item.text}</div>
                                  {item.links && item.links.length > 0 && (
                                    <div className="mt-1 flex items-center space-x-3">
                                      {item.links.map((link, linkIdx) => (
                                        <a
                                          key={linkIdx}
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center px-3 py-1 rounded-md bg-pink-500/40 hover:bg-pink-500/60 transition-colors text-white text-xs"
                                        >
                                          {link.label} →
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`
fixed
left-1/2
-translate-x-1/2
${isNightMode ? "bg-indigo-900/60" : "bg-black/60"}
backdrop-blur-sm
text-white text-sm px-3 py-1
rounded-md
z-10
transition-all duration-500 ease-in-out
opacity-100
`}
        style={{ bottom: `${activeSection ? popupPosition : 70}px` }}
      >
        {immersiveMode
          ? "WASD to move • Mouse drag to look around • Press T to toggle view mode"
          : "Drag to rotate • Click on resume sections to explore • WASD to move • Press T to toggle view mode"}
      </div>
    </div>
  );
}

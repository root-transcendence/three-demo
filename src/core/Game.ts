import CameraControls from "../controls/CameraControls";
import Ball from "../entities/Ball";
import EntityManager from "../managers/EntityManager";
import { WrapperCamera } from "./Camera";
import { WrapperRenderer } from "./Renderer";
import { WrapperScene } from "./Scene";

export class Game {
  private _camera: WrapperCamera;
  private _scene: WrapperScene;
  private _renderer: WrapperRenderer;
  private _cameraControls?: CameraControls;

  private _entityManager: EntityManager = EntityManager.getInstance();

  constructor(root: HTMLElement) {
    this._camera = new WrapperCamera();
    this._scene = new WrapperScene();
    this._renderer = new WrapperRenderer();

    root.appendChild(this._renderer.domElement);
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.update();
      this.render();
    };
    this.init();
    animate();
    this.setupScene();
  }

  init() {
    this.setupCamera();
    this.setupRenderer();
  }

  destroy() {
    this._scene.traverse((child) => {
      this._scene.remove(child);
    });
  }

  setupCamera() {
    this._cameraControls = new CameraControls(this._camera, this._renderer.domElement);
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._cameraControls.update();
    this._camera.position.z = 5;
    this._camera.lookAt(0, 0, 0);
  }

  async setupScene() {
    const ball = new Ball(await this._entityManager.getEntity("sphere", "physical"));
    // const ball = await this._entityManager.isThatASupra();

    const light = this._entityManager.getAmbientLight();
    const spot = this._entityManager.getLight();

    spot.position.set(2, 5, -2);
    spot.decay = 0;
    spot.target = ball.mesh;

    this._scene.add(spot);
    this._scene.add(ball.mesh);
    this._scene.add(light);
  }

  setupRenderer() {
    this._renderer.setClearColor(0x000000);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", () => {
      this.updateSizes();
    });
  }

  update() {
    this._cameraControls?.update();
  }

  updateSizes() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  render() {
    this._renderer.render(this._scene, this._camera);
  }
}

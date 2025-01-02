import { AmbientLight } from "three";
import { WrapperScene } from "../core/Scene";

export class EnvironmentManager {
  constructor(renderer, camera, assetManager) {
    this.scenes = new Map();
    this.activeScene = null;
    this.renderer = renderer;
    this.camera = camera;
    this.assetManager = assetManager;
  }

  loadConfig(config) {
    config.scenes.forEach((sceneConfig) => {
      const scene = this.createSceneFromConfig(sceneConfig);
      this.addScene(sceneConfig.name, scene);
    });
  }

  createSceneFromConfig(config) {
    const scene = new WrapperScene();

    // Add default or configured lights
    if (config.lights) {
      config.lights.forEach((lightConfig) => {
        const light = this.assetManager.createLight(lightConfig);
        scene.add(light);
      });
    } else {
      const defaultLight = new AmbientLight(0xffffff, 1);
      scene.add(defaultLight);
    }

    // Add assets (e.g., models, textures) from config
    if (config.assets) {
      config.assets.forEach((assetConfig) => {
        const asset = this.assetManager.get(assetConfig.key, assetConfig.type);
        if (asset) {
          scene.add(asset);
        }
      });
    }

    return scene;
  }

  addScene(name, scene) {
    this.scenes.set(name, scene);
  }

  removeScene(name) {
    this.scenes.delete(name);
  }

  getScene(name) {
    return this.scenes.get(name);
  }

  setActiveScene(name) {
    if (this.activeScene) {
      this.cleanupScene(this.activeScene);
    }
    this.activeScene = this.scenes.get(name);
    if (!this.activeScene) {
      throw new Error(`Scene "${name}" does not exist.`);
    }
    this.setupScene(this.activeScene);
  }

  setupScene(scene) {
    // Attach camera and any runtime settings
    scene.add(this.camera);
  }

  cleanupScene(scene) {
    scene.children.forEach((child) => scene.remove(child));
  }

  render() {
    if (this.activeScene) {
      this.renderer.render(this.activeScene, this.camera);
    }
  }
}

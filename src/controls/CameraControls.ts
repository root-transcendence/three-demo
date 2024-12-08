import { Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class CameraControls extends OrbitControls {

  constructor(camera: Camera, domElement: HTMLElement) {
    super(camera, domElement);
  }
}
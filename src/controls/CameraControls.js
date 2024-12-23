import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class CameraControls extends OrbitControls {
  constructor( camera, domElement ) {
    super( camera, domElement );
  }
}
import { FlyControls } from 'three/examples/jsm/Addons.js';

export class CameraControls extends FlyControls {
  constructor( camera, domElement ) {
    super( camera, domElement );
  }
}
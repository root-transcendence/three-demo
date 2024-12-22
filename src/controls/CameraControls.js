import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class CameraControls extends OrbitControls {

  constructor( camera, domElement ) {
    super( camera, domElement );
  }
}
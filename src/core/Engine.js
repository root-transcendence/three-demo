import { ManagersMixin } from "./Engine.ManagersMixin";
import { SystemsMixin } from "./Engine.SystemsMixin";
import { ThreeMixin } from "./Engine.ThreeMixin";

export default class Engine {
  /**
   * 
   * @param {{
   * socket: string,
   * element: HTMLElement
   * }} engineConfig
   * 
   * @property {HTMLElement} element
   * @property {Map<string, Function>} updateTasks
   */
  constructor( engineConfig ) {
    this.config = engineConfig
    this.element = engineConfig.element;
    this.updateTasks = new Map();
    this.initThree();
    this.initManagers();
    this.initSystems();
    window.engine = this;
  }

  /**
   * @method setInteractionCanvas
   * 
   * @param {"webgl" | "css3d"} renderer
   */
  setInteractionCanvas( renderer ) {
    const { CSS3DRenderer, WebGLRenderer } = this.three;
    const element = CSS3DRenderer.domElement;
    const transformerElement = element.children[0];
    const webglState = renderer == "webgl" ? "all" : "none";
    const css3dState = renderer == "css3d" ? "all" : "none";
    WebGLRenderer.domElement.style.pointerEvents = webglState;
    element.style.pointerEvents = css3dState;
    transformerElement.style.pointerEvents = css3dState;
  }

  march() {
    const animate = () => {
      requestAnimationFrame( animate );
      this.#update();
    };

    this.activateAllSystems();
    animate();
  }

  #update() {
    Object.values( this.systems )
      .filter( s => s.state === "active" )
      .sort( ( a, b ) => a.order - b.order )
      .forEach( ( system ) => system.update() );
  }

  setup() {
    this.setupThree();
    this.setupManagers();
    this.setupSystems();
  }
}

Object.assign( Engine.prototype, ThreeMixin, ManagersMixin, SystemsMixin );

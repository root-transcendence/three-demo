export default class Component { }

export class PositionComponent extends Component {
  constructor( x, y ) {
    super();
    this.x = x;
    this.y = y;
  }
}

export class VelocityComponent extends Component {
  constructor( vx, vy ) {
    super();
    this.vx = vx;
    this.vy = vy;
  }
}

export class BoundaryComponent extends Component {
  constructor( top, bottom, left, right ) {
    super();
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }
}

export class AssetComponent extends Component {
  constructor( key ) {
    super();
    this.key = key;
  }
}

export class UIComponent extends Component {
  constructor( element ) {
    super();
    this.element = element;
  }
}

export class MenuComponent extends Component {
  constructor( element ) {
    super();
    this.element = element;
  }
}

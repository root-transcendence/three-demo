import { traverse } from "../util/HtmlUtil.js";
import UIComponent from "./UIComponent.js";

/**
 * @class DivComponent
 * 
 * @extends UIComponent
 * 
 * @typedef
 */
export class DivComponent extends UIComponent {
  constructor( id, props = {} ) {
    super( id, props.styles, props.object, props.class );
    this.class = props.class || '';
    this.styles = props.styles || {};
    this._elements = props.elements || [];

    this.expectedListeners = () => ( {
      click: this.onClick,
      mouseenter: this.onMouseEnter,
      mouseleave: this.onMouseLeave,
    } );
  }

  /**
   * @param {UIComponent[] | HTMLElement[]} elements
   */
  set elements( elements ) {
    this._elements = elements;
    this._rendered = false;
  }

  get elements() {
    return this._elements;
  }

  render() {
    if ( this._rendered ) {
      return this.element.chil;
    }

    this.element = this.createMenuElement();

    if ( this._object )
      this._object.element = this.element;

    const menuElement = this.element

    this.applyStyles( menuElement );
    this.applyClasses( menuElement );

    menuElement.innerHTML = '';

    this._elements.forEach( ( child ) => {
      menuElement.appendChild( child.render() );
    } );

    if ( this.transitionIn ) {
      this.transitionIn( menuElement );
    }

    this.addEventListeners( menuElement, this.expectedListeners() );

    this._rendered = true;

    return menuElement;
  }

  clearInputs() {
    traverse( this.element,
      /**
       * 
       * @param {HTMLElement} element 
       */
      ( element ) => {
        if ( element instanceof HTMLInputElement ) {
          element.value = "";
        }
      } );
  }

  createMenuElement() {
    if ( this.element )
      return this.element;
    const menuElement = document.createElement( "div" );
    menuElement.id = this.id;
    return menuElement;
  }

  addElement( element ) {
    this._elements.push( element );
  }

  removeElement( element ) {
    this._elements = this._elements?.filter( ( e ) => e !== element );
  }
}

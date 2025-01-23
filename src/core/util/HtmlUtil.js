/**
 * 
 * @param {HTMLElement} parent element
 * @param {(HTMLElement) => void} fnct 
 */
export function traverse( parent, fnct ) {
  fnct( parent );
  if ( parent.children.length > 0 ) {
    for ( const child in parent.children ) {
      traverse( child, fnct );
    }
  }
}

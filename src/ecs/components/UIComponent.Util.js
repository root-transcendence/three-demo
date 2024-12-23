export function withTransitions( component, transitions ) {
  component.transitionIn = () => transitions.in( component );
  component.transitionOut = () => transitions.out( component );
  return component;
}

export function withEventHandlers( component, events ) {
  for ( const [event, handler] of Object.entries( events ) ) {
    component[event] = handler;
  }
  return component;
}

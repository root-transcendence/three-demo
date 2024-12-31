class EnvironmentManager {
  constructor( engine, environments ) {
    this.engine = engine;
    this.environments = environments || new Map();
  }
}
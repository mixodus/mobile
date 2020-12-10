export interface IStateInitiator {
  // group all the state initialization
  // in the method
  //
  // this one should keep all the lifecycle of a component clean
  initState(): void;
}

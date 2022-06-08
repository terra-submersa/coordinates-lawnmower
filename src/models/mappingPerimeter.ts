
export default class MappingPerimeter {
  readonly path: number[];


  constructor(path: number[]) {
    this.path = [...path];
  }

  area(): number {
    return 42;
  }
}

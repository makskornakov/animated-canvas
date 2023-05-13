export interface Area {
  cords: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  cells: number;
}

export type Point = {
  x: number;
  y: number;
};
export interface StarGridFull extends Point {
  size: {
    wall: number;
    star: number;
  };
  completed: boolean;
}
export type RenderedStarMap = {
  starGridWithSize: StarGridFull[];
  squares: Map<string, Area>;
  boomX: number;
  boomY: number;
};
export type Surroundings = { [key: string]: [Point, Point] | false };

export type Coordinate = {
  x: number;
  y: number;
  size: number;
};
export type Grid = Coordinate[][];

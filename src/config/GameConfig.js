import { AmbientLight, Color } from "three";

export const gameConfig = {
  scenes: [
    {
      name: "",
      lights: [
        {
          type: AmbientLight,
          color: new Color( "red" ),
          intensity: 4,
        }
      ],
      assets: [],
      children: [],
    }
  ]
}
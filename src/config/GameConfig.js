import { AmbientLight, Color } from "three";

export const gameConfig = {
  scenes: [
    {
      name: "Test Scene",
      lights: [
        {
          type: AmbientLight,
          color: new Color( "red" ),
          intensity: 4,
        }
      ],
      assets: [],
      children: [
        {
          "metadata": {
            "version": 4.6,
            "type": "Object",
            "generator": "Object3D.toJSON"
          },
          "geometries": [
            {
              "uuid": "b13285b0-d448-422e-a695-752d52ebd4aa",
              "type": "BoxGeometry",
              "width": 1,
              "height": 1,
              "depth": 1,
              "widthSegments": 1,
              "heightSegments": 1,
              "depthSegments": 1
            }
          ],
          "materials": [
            {
              "uuid": "1f047288-5e7f-458d-8114-e34513e27fc1",
              "type": "MeshStandardMaterial",
              "color": 16777215,
              "roughness": 1,
              "metalness": 0,
              "emissive": 0,
              "envMapRotation": [
                0,
                0,
                0,
                "XYZ"
              ],
              "envMapIntensity": 1,
              "blendColor": 0
            }
          ],
          "object": {
            "uuid": "5eb31a2b-19c5-4066-b900-3c717f9daad7",
            "type": "Mesh",
            "name": "Box",
            "layers": 1,
            "matrix": [
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1
            ],
            "up": [
              0,
              1,
              0
            ],
            "geometry": "b13285b0-d448-422e-a695-752d52ebd4aa",
            "material": "1f047288-5e7f-458d-8114-e34513e27fc1"
          }
        }
      ],
    }
  ]
}
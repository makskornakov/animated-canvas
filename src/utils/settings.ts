export interface Settings {
  [key: string]: {
    value: boolean | number | string;
    min?: number;
    max?: number;
    step?: number;
  };
}

export interface SettingList {
  [key: string]: Settings;
}

export const consolesIWannaSee: string[] = [
  'animationStartRef',
  'animationCleanRef',
  'resizeRef',
  'drawTickRef',
  'overlayDrawRef',
  // ? add more specific console logs here for them to be visualized
];

export const animationSettingsSetter: SettingList = {
  ball: {
    size: {
      value: 100,
      min: 10,
      max: 300,
    },
    randomSize: {
      value: false,
    },
    randomX: {
      value: false,
    },
    randomY: {
      value: false,
    },
  },
  square: {
    size: {
      value: 100,
      min: 10,
      max: 300,
    },
    randomSize: {
      value: false,
    },
    randomForce: {
      value: 0.2,
      max: 2,
      step: 0.01,
    },
  },
};

export const otherSettingsSetter: SettingList = {
  general: {
    canvasOverlay: {
      value: false,
    },
    canvasOverlayBehind: {
      value: false,
    },
    overlayOpacity: {
      value: 0.8,
      max: 1,
      step: 0.01,
    },
  },
};

export default {
  'autoUpdate': true,
  'alpha': {
    'start': 0.5,
    'end': 0.25,
  },
  'scale': {
    'start': 0.1,
    'end': 0.15,
    'minimumScaleMultiplier': 0.5,
  },
  'color': {
    'start': 'ffffff',
    'end': 'ffffff',
  },
  'speed': {
    'start': 100,
    'end': 75,
  },
  'startRotation': {
    'min': 50,
    'max': 70,
  },
  'rotationSpeed': {
    'min': 0,
    'max': 200,
  },
  'lifetime': {
    'min': 4,
    'max': 4,
  },
  'blendMode': 'normal',
  'ease': [
    {
      's': 0,
      'cp': 0.379,
      'e': 0.548,
    },
    {
      's': 0.548,
      'cp': 0.717,
      'e': 0.676,
    },
    {
      's': 0.676,
      'cp': 0.635,
      'e': 1,
    },
  ],
  'frequency': 0.004,
  'emitterLifetime': 0,
  'maxParticles': 500,
  'pos': {
    'x': 0,
    'y': 0,
  },
  'addAtBack': false,
  'spawnType': 'rect',
}
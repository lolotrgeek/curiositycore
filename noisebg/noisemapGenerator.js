class NoisemapGenerator {

  static generateNoisemap(noiseIncrement, time, highpass, octaves, amplitudeDecrease, frequencyIncrease) {

    let noisemap = [];

    for (let y = 0; y < rows; y++) {
   
      noisemap[y] = [];
      
      for (let x = 0; x < cols; x++) {

        let amplitude = 1;
        let frequency = 1;
        let noiseHeight = 0;
        
        for (let i = 0; i < octaves; i++) {
          let sampleX = x * noiseIncrement * frequency + octaveOffsets[i].x
          let sampleY = y * noiseIncrement * frequency + octaveOffsets[i].y
          
          // returns value between -1 and 1
          let simplexNoiseValue = simplex.noise3D(sampleX, sampleY, time);
          
          // note: noiseHeight not necessarily between -1 and 1 anymore!
          noiseHeight += simplexNoiseValue * amplitude;
          
          // amplitude decreases with each octave, frecquency increases
          amplitude *= amplitudeDecrease;
          frequency *= frequencyIncrease;
        }
        
        noisemap[y].push(noiseHeight);
      }
    }
    
    // find largest possible value
    let max = 0;
    let amplitude = 1
    for (let i = 0; i < octaves; i++) {
      max += amplitude;
      amplitude *= amplitudeDecrease;
    }
    
    // normalizing and highpass filtering
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        
        let noiseValue = noisemap[y][x]
        
        // map value to a range between 0 and 1
        noiseValue = map(noiseValue, -max, max, 0, 1);
        
        // set all values below the highpass to zero
        noiseValue -= highpass;
        if (noiseValue < 0) noiseValue = 0
        
        // map values again to a range between 0 and 1
        noiseValue = map(noiseValue, 0, 1 - highpass, 0, 1);
        
        // reassign value to noiseMap
        noisemap[y][x] = noiseValue
      }
    }
    
    return noisemap;
  }
}
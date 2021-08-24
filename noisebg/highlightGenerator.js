class HighlightGenerator {

  static generateHighlight(critDist, maxStrength) {

    let highlight = []

    let onScreen = false
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      onScreen = true;
    }

    for (let y = 0; y < rows; y++) {

      highlight[y] = [];

      for (let x = 0; x < cols; x++) {
        if (onScreen) {
          let cellCenter = createVector(x * scl + scl / 2, y * scl + scl / 2)
          let dist = (createVector(mouseX, mouseY).sub(cellCenter)).mag()

          let value = 1
          
          if (dist < scl * critDist) {
              value = sq(map(dist, 0, scl * critDist, maxStrength, 1))
          }
          
          highlight[y][x] = value;
        }
        else {
          highlight[y][x] = 1;
        }
      }
    }
    return highlight
  }

}
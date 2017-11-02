
float max_distance;
void setup() {
  size(1000, 50);
  smooth();
  noStroke();
  max_distance = dist(0, 0, width, height);
}


void draw()
{
  background(64,64,89);
  for(int i = 0; i <= width; i += 20) {
    for(int j = 0; j <= height; j += 20) {
      float size = dist(mouseX, mouseY, i, j);
      size = size/max_distance * 66;
      fill(255,255,204);
      ellipse(i, j, size, size);
    }
  }
}
import * as d3 from "d3";
import * as Elements from "./elements.js";
import * as Measurements from "./measurements";
import * as Color from "./color";

export function prepScales(data) {
  const radiusScale = d3.scalePow(
    d3.extent(data.map(({ song_share }) => song_share)),
    [Measurements.rem, Measurements.radius * 1.4],
  );

  const globeColor = Color.makeColorScheme(
    data.sort((a, b) => b.global_song_share - a.global_song_share),
    "global_song_share",
  );
  const localColor = Color.makeColorScheme(
    data.sort((a, b) => b.song_share - a.song_share),
    "song_share",
  );

  return {
    radiusScale,
    globeColor,
    localColor,
  };
}

export function prepNodes(data, positions, { radiusScale }) {
  positions = d3.shuffle(positions);
  const nodes = data
    .sort((a, b) => Math.abs(b.delta_arith) - Math.abs(a.delta_arith)) // sorted by delta
    .slice(0, positions.length)
    // .sort((a, b) => b.song_share - a.song_share) // sorted by delta
    // .reverse()
    .map((d, i) => {
      const radius = radiusScale(d.song_share); // sized by local popularity
      const position = positions.at(i);
      return {
        r: radius,
        x: position.cx,
        y: position.cy,
        vx: 0,
        vy: 0,
        ...d,
      };
    });

  return nodes;
}

export function drawDots(canvas, { globeColor, localColor }, nodes) {
  const context = canvas.getContext("2d");
  // context.save();
  context.clearRect(0, 0, canvas.width, canvas.height);

  nodes.forEach(drawDot);

  function drawDot(d) {
    const scaledX = d.x * Measurements.dpi;
    const scaledY = d.y * Measurements.dpi;
    const scaledR = d.r * Measurements.dpi;

    const gradient = context.createRadialGradient(
      scaledX,
      scaledY,
      0,
      scaledX,
      scaledY,
      scaledR,
    );
    gradient.addColorStop(0.1, globeColor(d.global_song_share));
    gradient.addColorStop(0.9, localColor(d.song_share));

    // context.translate(canvas.width / 2, canvas.height / 2);
    context.beginPath();
    context.moveTo(scaledX, scaledY);
    // context.font = "20px black system-ui"
    // context.fillText(Math.round(Math.atan(d.y / d.x) * 100), d.x, d.y)
    context.arc(scaledX, scaledY, scaledR, 0, 2 * Math.PI);
    context.fillStyle = gradient;
    context.fill();
  }
}

export function drawLegend(canvas, { localColor }) {
  canvas.width = 200;
  canvas.height = 10;

  const context = canvas.getContext("2d");
  const resolution = 2;

  localColor
    .ticks(canvas.width / resolution)
    .reverse()
    .forEach((t, i) => {
      context.beginPath();
      context.moveTo(i * resolution, 0);
      context.rect(i * resolution, 0, resolution, canvas.height);
      context.fillStyle = localColor(t);
      context.fill();
    });
}

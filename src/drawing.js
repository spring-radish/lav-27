import * as d3 from "d3";
import * as Elements from "./elements.js";
import * as Measurements from "./measurements";
import * as Color from "./color";

const dpi = window.devicePixelRatio || 1;
const column = (x) => Number(x.song_share);
const key = (x) => Number(x.song_id);

export function resizeCanvas(canvas) {
  canvas.setAttribute("width", document.body.clientWidth * dpi);
  canvas.setAttribute("height", document.body.clientHeight * dpi);
}

export function drawDots(canvas, data, positions) {
  const radiusScale = d3.scaleRadial(
    [0, d3.max(data.map((d) => column(d)))],
    [0, Measurements.radius],
  );
  const globalColor = Color.makeColorScheme(
    data.sort((a, b) => column(b) - column(a)),
  );

  const nodes = data
    .sort((a, b) => column(b) - column(a))
    .slice(0, positions.length)
    .map((d, i) => {
      const radius = radiusScale(column(d));
      const position = positions.at(i);
      return {
        r: radius,
        x: position.cx,
        y: position.cy,
        ...d,
      };
    });

  nodes.forEach((n) => drawDot(canvas, n));

  console.log(nodes);

  function drawDot(canvas, d) {
    console.log(d);
    const context = canvas.getContext("2d");
    // context.scale(dpi, dpi);

    const gradient = context.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
    gradient.addColorStop(0.2, "white");
    gradient.addColorStop(0.9, globalColor(column(d)));

    // context.translate(canvas.width / 2, canvas.height / 2);
    context.beginPath();
    context.moveTo(d.x, d.y);
    // context.font = "20px black system-ui"
    // context.fillText(Math.round(Math.atan(d.y / d.x) * 100), d.x, d.y)
    context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
    context.fillStyle = gradient;
    context.fill();
  }
}

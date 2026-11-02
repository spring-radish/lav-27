import "./style.css";
import * as Measurements from "./measurements";
import * as Elements from "./elements";
import * as Data from "./data";
import * as Drawing from "./drawing";
import * as Motion from "./motion";
import * as Tooltip from "./tooltip";

function init() {
  document.body.classList.add("js");
  const positions = Measurements.locateSpaces(Elements.main, Measurements.em);
  Measurements.resizeCanvas(Elements.canvas);

  const scales = Drawing.prepScales(Data.il);
  const nodes = Drawing.prepNodes(Data.il, positions, scales);

  Drawing.drawDots(Elements.canvas, scales, nodes);

  // Motion.animate(Drawing.drawDots, Elements.canvas, scales, nodes);

  window.addEventListener("mousemove", (e) => Tooltip.detectDot(e, nodes));
  window.addEventListener("pointerdown", (e) => Tooltip.detectDot(e, nodes));
}

init();

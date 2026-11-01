import "./style.css";
import * as Measurements from "./measurements";
import * as Elements from "./elements";
import globalSongShare from "./data";
import * as Drawing from "./drawing";

function init() {
  document.body.classList.add("js");
  const locations = Measurements.locateSpaces(Elements.main, Measurements.em);
  Drawing.resizeCanvas(Elements.canvas);
  Drawing.drawDots(Elements.canvas, globalSongShare, locations);
}

init();

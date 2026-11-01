import * as Elements from "./elements";

export const rem = measureProperty(Elements.body, "font-size");
export const em = measureProperty(Elements.main, "font-size");
export const radius = (2 / 3) * measureProperty(Elements.main, "word-spacing");

function measureProperty(element, property) {
  const stringValue = window
    .getComputedStyle(element)
    .getPropertyValue(property);
  const numberValue = Number(stringValue.replace("px", ""));
  return numberValue;
}

export function locateSpaces(element, margin) {
  let spaces = [];
  const threshold = window.innerWidth - margin;

  // add temporary elements in each space
  element.innerHTML = element.innerHTML.replace(
    /(?<=\S) (?=\S)/g,
    "<d-o-t></d-o-t> ",
  );
  const dots = document.querySelectorAll("d-o-t");

  for (const dot of dots) {
    const rect = dot.getBoundingClientRect();

    // location of center of dot
    const cx = Math.round(window.scrollX + rect.x + radius);
    const cy = Math.round(window.scrollY + rect.y + em / 2);

    // store coordinate if it is within the margin
    if (cx + radius < threshold) {
      spaces.push({ cx, cy });
    }

    // remove placeholder dot
    dot.remove();
  }

  // return array of locations
  return spaces;
}

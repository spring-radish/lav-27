import * as Elements from "./elements";

let activeDot = undefined;

export function detectDot(mouseevent, nodes) {
    const threshold = activeDot ? 20 : 10;
    const intersectingDot = nodes.find(
        ({ x, y, r }) =>
            Math.hypot(
                mouseevent.clientX + window.scrollX - x,
                mouseevent.clientY + window.scrollY - y,
            ) <
            r + threshold,
    );
    if (activeDot === intersectingDot) return;
    if (Elements.tooltip.matches(":hover, :focus")) return;
    activeDot = intersectingDot;
    render(activeDot);
}

function roundPercentage(decimal, sign = false) {
    let string = (Math.round(decimal * 10000) / 100).toString();
    if (string.split(".").at(-1).length === 1) string = string + "0";
    if (sign && decimal > 0) string = "+" + string;
    return string;
}

export function render(node) {
    if (!node) {
        Elements.tooltip.innerHTML = "";
        Elements.tooltip.style.setProperty("translate", "-9999px -9999px");
        return;
    }

    Elements.tooltip.innerHTML =
        `<b>${node.page_num} ${node.title}</b> <span>%</span>` +
        `<label>Average</label> <span>${roundPercentage(node.global_song_share)}</span>` +
        `<label>Illinois</label> <span>${roundPercentage(node.song_share)}</span>` +
        `<label>Difference</label> <span>${roundPercentage(node.delta_arith, true)}</span>`;

    const size = Elements.tooltip.getBoundingClientRect();

    // centered under/above the node
    let tx = node.x - size.width / 2;
    let ty =
        node.y - window.scrollY > window.innerHeight * (3 / 5)
            ? node.y - node.r - size.height - 8
            : node.y + node.r + 8;

    // to the side of the node
    if (tx < 10 || tx + size.width > window.innerWidth - 10) {
        tx =
            node.x > window.innerWidth * (3 / 5)
                ? node.x - node.r - size.width - 10
                : node.x + node.r + 10;
        ty = node.y - size.height / 2 - 5;
    }

    Elements.tooltip.style.setProperty("translate", `${tx}px ${ty}px`);
}

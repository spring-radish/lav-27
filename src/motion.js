import * as d3 from "d3";
import * as Measurements from "./measurements";

export function animate(draw, canvas, scales, nodes) {
    const simulation = d3
        .forceSimulation(nodes)
        .alphaTarget(0.3) // stay hot
        // .alphaDecay(0.1)
        .velocityDecay(0.3) // low friction
        // .force("x", d3.forceX().strength(0.005))
        // .force("y", d3.forceY().strength(0.005))
        .force(
            "y",
            d3
                .forceY(canvas.height / 2)
                .strength((d) =>
                    Math.min(0.005, Math.max(0.001, 0.0001 * d.r ** 2)),
                ),
        )
        .force(
            "collide",
            d3
                .forceCollide()
                .radius((d) => d.r + 2)
                .iterations(3)
                .strength(1),
        )
        // .force("charge", d3.forceManyBody().strength(0.05))
        .on("tick", () => {
            nodes.forEach(checkBounds);
            draw(canvas, scales, nodes);
        });

    function checkBounds(d) {
        let { x, y, r } = d;
        const distance = Math.sqrt(y ** 2 + x ** 2);
        const direction = Math.atan(y / x);
        const sign = x / Math.abs(x);

        const edgeDistance = Math.abs(
            (canvas.height / Measurements.dpi) ** 2 /
                Math.sqrt(
                    ((canvas.height / 2) * Math.cos(direction)) ** 2 +
                        ((canvas.height / 2) * Math.sin(direction)) ** 2,
                ),
        );

        if (edgeDistance - r - 3 < distance) {
            d.x = (edgeDistance - r - 3) * Math.cos(direction) * sign;
            d.y = (edgeDistance - r - 3) * Math.sin(direction) * sign;

            // console.log(`moved ${direction}, ${Math.round(distance)} to ${Math.round(d.x)}, ${Math.round(d.y)}`)
        }
        d.x = Math.min(canvas.width - d.r, d.x);
    }
}

// function naiveAnimate() {
//     // function loop() {
//     //     nodes.forEach((n) => {
//     //         n.vy += 0.4;
//     //         n.x += n.vx;
//     //         n.y += n.vy;
//     //         if (n.x + n.r > canvas.width / Measurements.dpi || n.x - n.r < 0)
//     //             n.vx *= -0.1;
//     //         if (n.y + n.r > canvas.height / Measurements.dpi || n.y - n.r < 0)
//     //             n.vy *= -0.1;
//     //         collisions(nodes);
//     //         n.vx = Math.min(4, Math.max(-4, n.vx));
//     //     });
//     //     draw(canvas, scales, nodes);
//     //     setTimeout(loop, 100);
//     // }
//     // loop();
// }

function collisions(nodes) {
    nodes.sort((a, b) => a.x - a.r - (b.x - b.r));
    for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            if (b.x - b.r > a.x + a.r) break;
            if (intersects(a, b)) {
                bounce(a, b);
            }
        }
    }
}

function intersects(a, b) {
    return (
        a.x - a.r < b.x + b.r &&
        a.x + a.r > b.x - b.r &&
        a.y - a.r < b.y + b.r &&
        a.y + a.r > b.y - b.r
    );
}

function bounce(a, b) {
    let massSum = 2;
    let impact = { x: b.x - a.x, y: b.y - a.y };
    let velDiff = { x: b.vx - a.vx, y: b.vy - a.vy };
    let velDotImpact = impact.x * velDiff.x + impact.y * velDiff.y;
    let distance = Math.hypot(a.x - b.x, a.y - b.y);
    a.vx +=
        (impact.x * 2 * velDotImpact) / (massSum * distance * distance + 0.1);
    a.vy +=
        (impact.y * 2 * velDotImpact) / (massSum * distance * distance + 0.1);
    b.vx +=
        (impact.x * 2 * velDotImpact) / (massSum * distance * distance + 0.1);
    b.vy +=
        (impact.y * 2 * velDotImpact) / (massSum * distance * distance + 0.1);
}

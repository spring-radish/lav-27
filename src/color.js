import * as d3 from "d3";

export function makeColorScheme(sortedData, column) {
  return d3
    .scaleLog()
    .domain(sortedData.map((d) => d[column]))
    .range(
      d3
        .quantize(
          (t) => d3.interpolateCubehelixDefault(0.48 + t / 2),
          // d3.interpolateCubehelixLong.gamma(0.9)("#a54886", "#fdfefc"),
          // d3.interpolateViridis,
          sortedData.length,
        )
        .reverse(),
    );
}

// export function makeColorScheme(sortedData) {
//   return d3
//     .scaleOrdinal()
//     .domain(data.map((d) => d.song_id))
//     .range(
//       d3
//         .quantize((t) => d3.interpolateCubehelixDefault(t * 0.95), data.length)
//         .reverse(),
//     );
// }

import * as d3 from "d3";

export function makeColorScheme(sortedData) {
  return d3
    .scaleLinear()
    .domain(sortedData.map((d) => d.song_share))
    .range(
      d3
        .quantize(
          (t) => d3.interpolateCubehelixDefault(t * 0.95),
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

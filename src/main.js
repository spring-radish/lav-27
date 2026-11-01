import './style.css'
import globalSongShare from './global_song_share.json' with {type: 'json'}

const main = document.querySelector('main')
const svgns = "http://www.w3.org/2000/svg"

function init () {
  document.body.classList.add('js')

  // set up the svg element
  const background = document.querySelector('svg')
  background.setAttribute('width', document.body.clientWidth)
  background.setAttribute('height', document.body.clientHeight)
  background.setAttribute('viewBox', `0 0 ${document.body.clientWidth} ${document.body.clientHeight}`)
  background.style.setProperty('font', '1rem system-ui inherit')

  // get svg children
  const defs = background.querySelector('defs')
  const circles = background.querySelector('g')

  // place invisible dots to measure locations
  const rem = new Number(window.getComputedStyle(main).getPropertyValue('font-size').replace('px', ''))
  const radius = 1/2 * new Number(window.getComputedStyle(main).getPropertyValue('word-spacing').replace('px', ''))
  main.innerHTML = main.innerHTML.replace(/(?<=\S) (?=\S)/g, '<d-o-t></d-o-t> ')  

  const dots = document.querySelectorAll('d-o-t')
  const stats = globalSongShare.slice(0, dots.length)
  stats.sort((a, b) => a.song_id - b.song_id)

  for (const dot of dots) {
    const song = stats.shift()

    // skip dots very close to the right edge of the window
    const rect = dot.getBoundingClientRect()
    if (rect.x + radius * 2 + rem * 2 >= window.innerWidth) {
      dot.remove()
      continue
    }

    // location of center of dot
    const x = Math.round(window.scrollX + rect.x + radius * 4/3)
    const y = Math.round(window.scrollY + rect.y + rem / 2)

    const circle = document.createElementNS(svgns, 'circle')
    circle.setAttribute('r', radius * 1.5)
    circle.setAttribute('fill', `url(#rg-${song.song_id})`)
    circle.setAttribute('transform', `translate(${x},${y})`)
    circles.append(circle)

    const gradient = document.createElementNS(svgns, 'radialGradient')
    gradient.setAttribute('id', `rg-${song.song_id}`)
    gradient.setAttribute('cx', '0.5')
    gradient.setAttribute('cy', '0.5')
    gradient.setAttribute('r', '1')

    const stop1 = document.createElementNS(svgns, 'stop')
    stop1.setAttribute('offset', '10%')
    stop1.setAttribute('stop-color', `rgb(${Math.round(255 * Math.random())}, ${Math.round(255 * Math.random())}, ${Math.round(255 * Math.random())})`)

    const stop2 = document.createElementNS(svgns, 'stop')
    stop2.setAttribute('offset', '40%')
    stop2.setAttribute('stop-color', 'rgb(230, 247, 241)')

    gradient.append(stop1, stop2)

    defs.append(gradient)

    dot.remove()
  }
}

init()
import React from 'react';
import './index.css';

const weatherURL = "https://www.yr.no/en/content/2-3067696/meteogram.svg";
const whiteColor = "#ffffff";
const blackColor = "#000000";

class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      svgImage: ""
    };

    this.fetchWeatherSvg = this.fetchWeatherSvg.bind(this);
  }

  fetchWeatherSvg() {
    fetch(weatherURL)
      .then(response => response.text())
      .then(response => {
        let domParser = new DOMParser();
        let weatherSVG = domParser.parseFromString(response, "image/svg+xml");

        let svgChartChildren = weatherSVG.children[0].children[weatherSVG.children[0].children.length - 1].children;
        const svgChartSize = svgChartChildren.length - 1;
        for (let i = svgChartSize; i > 2; i--) {
          svgChartChildren[i].remove();
        }

        let svgChildren = weatherSVG.children[0].children;
        const svgSize = svgChildren.length - 2;
        for (let i = svgSize; i >= 0; i--) { // Iterate all except last one
          if (!(svgChildren[i].tagName === "style" || svgChildren[i].tagName === "rect")) {
            console.log(svgChildren[i]);
            svgChildren[i].remove();
          }
        }

        // Translate to beginig, "g" tag is harcoded here
        svgChildren[2].removeAttribute("transform");
        svgChildren[2].setAttribute("transform", "translate(0, 0)");

        let rectngles = svgChildren[2].children[2].children;
        for (let i = rectngles.length - 1; i >= 0; i--) {
          if (rectngles[i].tagName === "rect") {
            rectngles[i].removeAttribute("fill");
            rectngles[i].setAttribute("fill", whiteColor);
            rectngles[i].setAttribute("stroke", blackColor);
          } else if (rectngles[i].tagName === "line") {
            rectngles[i].removeAttribute("stroke");
            rectngles[i].setAttribute("stroke", blackColor);
            rectngles[i].setAttribute("stroke-dasharray", "1,1");
          } else if (rectngles[i].tagName === "path") {
            rectngles[i].removeAttribute("stroke");
            rectngles[i].setAttribute("stroke", blackColor);
            rectngles[i].removeAttribute("stroke-width");
          } else if (rectngles[i].tagName === "svg") {
            let svgPaths = rectngles[i].getElementsByTagName("path");
            for (let j = svgPaths.length - 1; j >= 0; j--) {
              svgPaths[j].removeAttribute("fill");
              svgPaths[j].setAttribute("fill", blackColor);
            }
          }
        }

        let serializer = new XMLSerializer();
        let xmlstring = serializer.serializeToString(weatherSVG);
        return xmlstring;
      })
      .then(data => {
        this.setState({ svgImage: data })
      })
      .catch(error => console.log('error', error));
  }

  componentDidMount() {
    this.fetchWeatherSvg();
  }

  render() {
    const svgImage = this.state.svgImage;
    return (
        <div>
          <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgImage)}`} />
      </div>
    );
  }
}

export default Weather
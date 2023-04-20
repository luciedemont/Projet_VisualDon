import { csv } from "d3-fetch";
import { select, selectAll } from "d3-selection";
import { transition } from "d3-transition";
import { easeLinear } from "d3-ease";
import { arc } from "d3-shape";
import { interpolate } from "d3-interpolate";
import { format } from "d3-format";
import { timeParse } from "d3-time-format";

// Pour importer les données (@rollup/plugin-dsv)
import planets from "../data/planets.csv";
//Trier les données
csv("../data/planets.csv").then(function (data) {
  data.map(
    (d) => (
      (d.color = +d.Color),
      (d.Mass = +d.Mass),
      (d.Density = +d.Density),
      (d.Diameter = +d["Diameter (km)"]),
      (d.Distance_from_sun = +d["Distance from Sun (10^6 km)"])
    )
  );

  const planets = data.map((planet) => ({
    name: planet.Planet,
    distance: planet.Distance_from_sun / 2,
    size: planet.Diameter / 2000,
    color: planet.Color,
  }));

  //Dessin
  // Création du SVG pour avoir toutes les planètes

  //La distance entre le soleil et Neptune
  const distanceMax = d3.max(planets.map((d) => d.distance));

  console.log(distanceMax);

  const width = window.innerWidth;
  const height = 500;

  //L'échelle
  const scale = d3
    .scaleSqrt()
    .domain([0, distanceMax + 10000])
    .range([100, width]);
  //Définir le svg à l'échelle de la distance entre le soleil et Neptune

  const svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //Rectangle descriptif
  var description = select("#SunDescription")
    .append("div")
    .attr("id", "description")
    .style("background-color", "black")
    .style("border", "1px solid white")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 - 100}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 70}px`); // position verticale en dessous du cercle du Soleil

  console.log(planets);

  //Pour créer les autres planètes en fonction de leur distance respective mais ça ne fonctionne pas
  planets.forEach((planet, index) => {
    // Create orbits center on the sun
    const orbit = svg
      .append("circle")
      .attr("cx", scale(planet.distance))
      .attr("cy", height / 2)
      .attr("r", planet.size / 2)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "5,5");

    //Create the sun
    const soleil = svg
      .append("circle")
      .attr("id", "Sun")
      .attr("cx", 0)
      .attr("cy", height / 2)
      .attr("r", 20)
      .attr("fill", "yellow");

    //Rendre le soleil plus grand au clic
    soleil.on("click", function () {
      soleil.transition().duration(1000).attr("r", 100);
      //Et quelques secondes après afficher la fiche
      setTimeout(function () {
        description.html(
          "<h2>Description du Soleil</h2><p>Le Soleil est une étoile de type G2 qui se trouve au centre de notre système solaire.</p><p>C'est la source de chaleur et de lumière qui permet la vie sur Terre.</p>"
        );

        //   // Mise à jour du contenu de la fiche descriptive avec les informations du Soleil
        description.html(
          "<h2>Description du Soleil</h2><p>Le Soleil est une étoile de type G2 qui se trouve au centre de notre système solaire.</p><p>C'est la source de chaleur et de lumière qui permet la vie sur Terre.</p>"
        );
        //   // Affichage de la fiche descriptive
        description.style("display", "block");

        //   //Bouton pour fermer la fiche descriptive
        description
          .append("button")
          .attr("id", "close")
          .text("Fermer")
          .on("click", function () {
            description.style("display", "none");
          });
        //Ajouter un bouton en savoir plus
        description
          .append("button")
          .attr("id", "more")
          .text("En savoir plus")
          .on("click", function () {
            description.style("display", "none");
          });
      }, 1000);
    });

    // Creation planète
    svg
      .append("circle")
      .attr("id", planet.name)
      .attr("cx", scale(planet.distance))
      .attr("cy", height / 2)
      .attr("r", planet.size / 2) // planet.size for real size
      .attr("fill", planet.color)
      .attr("stroke", "white");
  });

  //Faire la fiche descriptive de Mercure
  const mercure = d3.select("#Mercury");
  mercure.on("click", function () {
    description.html(
      "<h2>Description de Mercure</h2><p>Mercure est la planète la plus proche du Soleil et la moins massive du système solaire.</p><p>Sa température moyenne est de -173°C.</p>"
    );
    description.style("display", "block");
    description
      .append("button")
      .attr("id", "close")
      .text("Fermer")
      .on("click", function () {
        description.style("display", "none");
      });
  });
  //Fiche descriptive de Vénus
  const venus = d3.select("#Venus");
  venus.on("click", function () {
    description.html(
      "<h2>Description de Vénus</h2><p>Vénus est la deuxième planète du système solaire par ordre de distance au Soleil.</p><p>Sa température moyenne est de 462°C.</p>"
    );
    description.style("display", "block");
    description
      .append("button")
      .attr("id", "close")
      .text("Fermer")
      .on("click", function () {
        description.style("display", "none");
      });
  });
  //Fiche descriptive de la Terre
  const terre = d3.select("#Earth");
  terre.on("click", function () {
    description.html(
      "<h2>Description de la Terre</h2><p>La Terre est la troisième planète du système solaire par ordre de distance au Soleil.</p><p>Sa température moyenne est de 15°C.</p>"
    );
    description.style("display", "block");
    description
      .append("button")
      .attr("id", "close")
      .text("Fermer")
      .on("click", function () {
        description.style("display", "none");
      });
  });
  //Fiche descriptive de Mars
  const mars = d3.select("#Mars");
  mars.on("click", function () {
    description.html(
      "<h2>Description de Mars</h2><p>Mars est la quatrième planète du système solaire par ordre de distance au Soleil.</p><p>Sa température moyenne est de -65°C.</p>"
    );
    description.style("display", "block");
    description
      .append("button")
      .attr("id", "close")
      .text("Fermer")
      .on("click", function () {
        description.style("display", "none");
      });
  });
});

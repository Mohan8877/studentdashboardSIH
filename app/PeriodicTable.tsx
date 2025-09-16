import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// --- Type Definitions for our data structures ---
interface ElementData {
    number: number;
    symbol: string;
    name: string;
    mass: number;
    category: string;
    summary: string;
}

interface ElementPosition {
    row: number;
    col: number;
}

interface MoleculeAtom {
    el: number;
    x: string;
    y: string;
}

interface MoleculeData {
    atoms: MoleculeAtom[];
    size: [number, number];
}

interface CombinationRecipe {
    name: string;
    formula: string;
    summary: string;
    molecule: MoleculeData;
}

// --- Data Constants ---
const elementsData: ElementData[] = [
    { "number": 1, "symbol": "H", "name": "Hydrogen", "mass": 1.008, "category": "diatomic-nonmetal", "summary": "A colorless, odorless, tasteless, flammable gaseous substance that is the simplest member of the family of chemical elements." },
    { "number": 2, "symbol": "He", "name": "Helium", "mass": 4.002602, "category": "noble-gas", "summary": "A colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas group in the periodic table." },
    { "number": 3, "symbol": "Li", "name": "Lithium", "mass": 6.94, "category": "alkali-metal", "summary": "A soft, silvery-white alkali metal. Under standard conditions, it is the lightest metal and the least dense solid element." },
    { "number": 4, "symbol": "Be", "name": "Beryllium", "mass": 9.0121831, "category": "alkaline-earth-metal", "summary": "A divalent element which occurs naturally only in combination with other elements in minerals." },
    { "number": 5, "symbol": "B", "name": "Boron", "mass": 10.81, "category": "metalloid", "summary": "A metalloid chemical element with symbol B and atomic number 5. Produced entirely by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a low-abundance element in the Solar System and in the Earth's crust." },
    { "number": 6, "symbol": "C", "name": "Carbon", "mass": 12.011, "category": "polyatomic-nonmetal", "summary": "A chemical element with symbol C and atomic number 6. It is nonmetallic and tetravalent—making four electrons available to form covalent chemical bonds." },
    { "number": 7, "symbol": "N", "name": "Nitrogen", "mass": 14.007, "category": "diatomic-nonmetal", "summary": "A chemical element with symbol N and atomic number 7. It is the lightest pnictogen and at room temperature, it is a transparent, odorless diatomic gas." },
    { "number": 8, "symbol": "O", "name": "Oxygen", "mass": 15.999, "category": "diatomic-nonmetal", "summary": "A chemical element with symbol O and atomic number 8. It is a member of the chalcogen group on the periodic table and is a highly reactive nonmetal and oxidizing agent that readily forms oxides with most elements as well as with other compounds." },
    { "number": 9, "symbol": "F", "name": "Fluorine", "mass": 18.998403163, "category": "halogen", "summary": "A chemical element with symbol F and atomic number 9. It is the lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard conditions." },
    { "number": 10, "symbol": "Ne", "name": "Neon", "mass": 20.1797, "category": "noble-gas", "summary": "A chemical element with symbol Ne and atomic number 10. It is in group 18 (noble gases) of the periodic table." },
    { "number": 11, "symbol": "Na", "name": "Sodium", "mass": 22.98976928, "category": "alkali-metal", "summary": "A chemical element with symbol Na and atomic number 11. It is a soft, silvery-white, highly reactive metal." },
    { "number": 12, "symbol": "Mg", "name": "Magnesium", "mass": 24.305, "category": "alkaline-earth-metal", "summary": "A chemical element with symbol Mg and atomic number 12. It is a shiny gray solid which bears a close physical resemblance to the other five elements in the second column (group 2, or alkaline earth metals) of the periodic table." },
    { "number": 13, "symbol": "Al", "name": "Aluminium", "mass": 26.9815385, "category": "post-transition-metal", "summary": "A chemical element with symbol Al and atomic number 13. It is a silvery-white, soft, non-magnetic and ductile metal in the boron group." },
    { "number": 14, "symbol": "Si", "name": "Silicon", "mass": 28.085, "category": "metalloid", "summary": "A chemical element with symbol Si and atomic number 14. It is a hard and brittle crystalline solid with a blue-grey metallic lustre, and it is a tetravalent metalloid." },
    { "number": 15, "symbol": "P", "name": "Phosphorus", "mass": 30.973762, "category": "polyatomic-nonmetal", "summary": "A chemical element with symbol P and atomic number 15. As an element, phosphorus exists in two major forms—white phosphorus and red phosphorus—but because it is highly reactive, phosphorus is never found as a free element on Earth." },
    { "number": 16, "symbol": "S", "name": "Sulfur", "mass": 32.06, "category": "polyatomic-nonmetal", "summary": "A chemical element with symbol S and atomic number 16. It is abundant, multivalent and nonmetallic." },
    { "number": 17, "symbol": "Cl", "name": "Chlorine", "mass": 35.45, "category": "halogen", "summary": "A chemical element with symbol Cl and atomic number 17. The second-lightest of the halogens, it appears between fluorine and bromine in the periodic table and its properties are mostly intermediate between them." },
    { "number": 18, "symbol": "Ar", "name": "Argon", "mass": 39.948, "category": "noble-gas", "summary": "A chemical element with symbol Ar and atomic number 18. It is in group 18 of the periodic table and is a noble gas." },
    { "number": 19, "symbol": "K", "name": "Potassium", "mass": 39.0983, "category": "alkali-metal", "summary": "A chemical element with symbol K and atomic number 19. It is a silvery-white metal that is soft enough to be cut with a knife with little force." },
    { "number": 20, "symbol": "Ca", "name": "Calcium", "mass": 40.078, "category": "alkaline-earth-metal", "summary": "A chemical element with symbol Ca and atomic number 20. It is a soft grey alkaline earth metal, and is the fifth most abundant element by mass in the Earth's crust." },
    { "number": 21, "symbol": "Sc", "name": "Scandium", "mass": 44.955908, "category": "transition-metal", "summary": "A chemical element with symbol Sc and atomic number 21. A silvery-white metallic d-block element, it has historically been sometimes classified as a rare-earth element, together with yttrium and the lanthanides." },
    { "number": 22, "symbol": "Ti", "name": "Titanium", "mass": 47.867, "category": "transition-metal", "summary": "A chemical element with symbol Ti and atomic number 22. It is a lustrous transition metal with a silver color, low density, and high strength." },
    { "number": 23, "symbol": "V", "name": "Vanadium", "mass": 50.9415, "category": "transition-metal", "summary": "A chemical element with symbol V and atomic number 23. It is a hard, silvery grey, ductile, and malleable transition metal." },
    { "number": 24, "symbol": "Cr", "name": "Chromium", "mass": 51.9961, "category": "transition-metal", "summary": "A chemical element with symbol Cr and atomic number 24. It is the first element in Group 6. It is a steely-grey, lustrous, hard and brittle metal which takes a high polish, resists tarnishing, and has a high melting point." },
    { "number": 25, "symbol": "Mn", "name": "Manganese", "mass": 54.938044, "category": "transition-metal", "summary": "A chemical element with symbol Mn and atomic number 25. It is not found as a free element in nature; it is often found in minerals in combination with iron." },
    { "number": 26, "symbol": "Fe", "name": "Iron", "mass": 55.845, "category": "transition-metal", "summary": "A chemical element with symbol Fe and atomic number 26. It is a metal in the first transition series." },
    { "number": 27, "symbol": "Co", "name": "Cobalt", "mass": 58.933194, "category": "transition-metal", "summary": "A chemical element with symbol Co and atomic number 27. Like nickel, cobalt is found in the Earth's crust only in chemically combined form, save for small deposits found in alloys of natural meteoric iron." },
    { "number": 28, "symbol": "Ni", "name": "Nickel", "mass": 58.6934, "category": "transition-metal", "summary": "A chemical element with symbol Ni and atomic number 28. It is a silvery-white lustrous metal with a slight golden tinge." },
    { "number": 29, "symbol": "Cu", "name": "Copper", "mass": 63.546, "category": "transition-metal", "summary": "A chemical element with symbol Cu and atomic number 29. It is a soft, malleable, and ductile metal with very high thermal and electrical conductivity." },
    { "number": 30, "symbol": "Zn", "name": "Zinc", "mass": 65.38, "category": "transition-metal", "summary": "A chemical element with symbol Zn and atomic number 30. It is the first element in group 12 of the periodic table." },
    { "number": 31, "symbol": "Ga", "name": "Gallium", "mass": 69.723, "category": "post-transition-metal", "summary": "A chemical element with symbol Ga and atomic number 31. It is in group 13 of the periodic table, and has similarities to the other metals of the group." },
    { "number": 32, "symbol": "Ge", "name": "Germanium", "mass": 72.63, "category": "metalloid", "summary": "A chemical element with symbol Ge and atomic number 32. It is a lustrous, hard, grayish-white metalloid in the carbon group, chemically similar to its group neighbors tin and silicon." },
    { "number": 33, "symbol": "As", "name": "Arsenic", "mass": 74.921595, "category": "metalloid", "summary": "A chemical element with symbol As and atomic number 33. Arsenic occurs in many minerals, usually in combination with sulfur and metals, but also as a pure elemental crystal." },
    { "number": 34, "symbol": "Se", "name": "Selenium", "mass": 78.971, "category": "polyatomic-nonmetal", "summary": "A chemical element with symbol Se and atomic number 34. It is a nonmetal with properties that are intermediate between the elements above and below in the periodic table, sulfur and tellurium." },
    { "number": 35, "symbol": "Br", "name": "Bromine", "mass": 79.904, "category": "halogen", "summary": "A chemical element with symbol Br and atomic number 35. It is the third-lightest halogen, and is a fuming red-brown liquid at room temperature that evaporates readily to form a similarly coloured gas." },
    { "number": 36, "symbol": "Kr", "name": "Krypton", "mass": 83.798, "category": "noble-gas", "summary": "A chemical element with symbol Kr and atomic number 36. It is a member of group 18 (noble gases) elements." },
    { "number": 37, "symbol": "Rb", "name": "Rubidium", "mass": 85.4678, "category": "alkali-metal", "summary": "A chemical element with symbol Rb and atomic number 37. It is a very soft, silvery-white metal in the alkali metal group." },
    { "number": 38, "symbol": "Sr", "name": "Strontium", "mass": 87.62, "category": "alkaline-earth-metal", "summary": "A chemical element with symbol Sr and atomic number 38. An alkaline earth metal, strontium is a soft silver-white yellowish metallic element that is highly reactive chemically." },
    { "number": 39, "symbol": "Y", "name": "Yttrium", "mass": 88.90584, "category": "transition-metal", "summary": "A chemical element with symbol Y and atomic number 39. It is a silvery-metallic transition metal chemically similar to the lanthanides and has often been classified as a 'rare-earth element'." },
    { "number": 40, "symbol": "Zr", "name": "Zirconium", "mass": 91.224, "category": "transition-metal", "summary": "A chemical element with symbol Zr and atomic number 40. The name of zirconium is taken from the name of the mineral zircon, the most important source of zirconium." },
    { "number": 41, "symbol": "Nb", "name": "Niobium", "mass": 92.90637, "category": "transition-metal", "summary": "A chemical element with symbol Nb and atomic number 41. It is a light grey, crystalline, and ductile transition metal." },
    { "number": 42, "symbol": "Mo", "name": "Molybdenum", "mass": 95.95, "category": "transition-metal", "summary": "A chemical element with symbol Mo and atomic number 42. The name is from Neo-Latin molybdaenum, from Ancient Greek Μόλυβδος molybdos, meaning lead, since its ores were confused with lead ores." },
    { "number": 43, "symbol": "Tc", "name": "Technetium", "mass": 98, "category": "transition-metal", "summary": "A chemical element with symbol Tc and atomic number 43. It is the lightest element whose isotopes are all radioactive, none of which are stable." },
    { "number": 44, "symbol": "Ru", "name": "Ruthenium", "mass": 101.07, "category": "transition-metal", "summary": "A chemical element with symbol Ru and atomic number 44. It is a rare transition metal belonging to the platinum group of the periodic table." },
    { "number": 45, "symbol": "Rh", "name": "Rhodium", "mass": 102.9055, "category": "transition-metal", "summary": "A chemical element with symbol Rh and atomic number 45. It is a rare, silvery-white, hard, corrosion-resistant, and chemically inert transition metal." },
    { "number": 46, "symbol": "Pd", "name": "Palladium", "mass": 106.42, "category": "transition-metal", "summary": "A chemical element with symbol Pd and atomic number 46. It is a rare and lustrous silvery-white metal discovered in 1803 by William Hyde Wollaston." },
    { "number": 47, "symbol": "Ag", "name": "Silver", "mass": 107.8682, "category": "transition-metal", "summary": "A chemical element with symbol Ag and atomic number 47. A soft, white, lustrous transition metal, it exhibits the highest electrical conductivity, thermal conductivity, and reflectivity of any metal." },
    { "number": 48, "symbol": "Cd", "name": "Cadmium", "mass": 112.414, "category": "transition-metal", "summary": "A chemical element with symbol Cd and atomic number 48. This soft, silvery-white metal is chemically similar to the two other stable metals in group 12, zinc and mercury." },
    { "number": 49, "symbol": "In", "name": "Indium", "mass": 114.818, "category": "post-transition-metal", "summary": "A chemical element with symbol In and atomic number 49. It is a post-transition metal that makes up 0.21 parts per million of the Earth's crust." },
    { "number": 50, "symbol": "Sn", "name": "Tin", "mass": 118.71, "category": "post-transition-metal", "summary": "A chemical element with symbol Sn and atomic number 50. It is a post-transition metal in group 14 of the periodic table." },
    { "number": 51, "symbol": "Sb", "name": "Antimony", "mass": 121.76, "category": "metalloid", "summary": "A chemical element with symbol Sb and atomic number 51. A lustrous gray metalloid, it is found in nature mainly as the sulfide mineral stibnite." },
    { "number": 52, "symbol": "Te", "name": "Tellurium", "mass": 127.6, "category": "metalloid", "summary": "A chemical element with symbol Te and atomic number 52. It is a brittle, mildly toxic, rare, silver-white metalloid." },
    { "number": 53, "symbol": "I", "name": "Iodine", "mass": 126.90447, "category": "halogen", "summary": "A chemical element with symbol I and atomic number 53. The heaviest of the stable halogens, it exists as a lustrous, purple-black metallic solid at standard conditions that sublimes readily to form a violet gas." },
    { "number": 54, "symbol": "Xe", "name": "Xenon", "mass": 131.293, "category": "noble-gas", "summary": "A chemical element with symbol Xe and atomic number 54. It is a colorless, dense, odorless noble gas, that occurs in the Earth's atmosphere in trace amounts." },
    { "number": 55, "symbol": "Cs", "name": "Caesium", "mass": 132.90545196, "category": "alkali-metal", "summary": "A chemical element with symbol Cs and atomic number 55. It is a soft, silvery-gold alkali metal with a melting point of 28.5 °C (83.3 °F), which makes it one of only five elemental metals that are liquid at or near room temperature." },
    { "number": 56, "symbol": "Ba", "name": "Barium", "mass": 137.327, "category": "alkaline-earth-metal", "summary": "A chemical element with symbol Ba and atomic number 56. It is the fifth element in Group 2 and is a soft, silvery alkaline earth metal." },
    { "number": 57, "symbol": "La", "name": "Lanthanum", "mass": 138.90547, "category": "lanthanide", "summary": "A chemical element with symbol La and atomic number 57. It is a soft, ductile, silvery-white metal that tarnishes rapidly when exposed to air and is soft enough to be cut with a knife." },
    { "number": 58, "symbol": "Ce", "name": "Cerium", "mass": 140.116, "category": "lanthanide", "summary": "A chemical element with symbol Ce and atomic number 58. It is a soft, ductile and silvery-white metal that tarnishes when exposed to air, and it is soft enough to be cut with a knife." },
    { "number": 59, "symbol": "Pr", "name": "Praseodymium", "mass": 140.90766, "category": "lanthanide", "summary": "A chemical element with symbol Pr and atomic number 59. It is the third member of the lanthanide series and is traditionally considered to be one of the rare-earth metals." },
    { "number": 60, "symbol": "Nd", "name": "Neodymium", "mass": 144.242, "category": "lanthanide", "summary": "A chemical element with symbol Nd and atomic number 60. It is the fourth member of the lanthanide series and is a hard, slightly malleable silvery metal that quickly tarnishes in air and moisture." },
    { "number": 61, "symbol": "Pm", "name": "Promethium", "mass": 145, "category": "lanthanide", "summary": "A chemical element with symbol Pm and atomic number 61. All of its isotopes are radioactive; it is one of only two such elements that are followed in the periodic table by elements with stable forms, the other being technetium." },
    { "number": 62, "symbol": "Sm", "name": "Samarium", "mass": 150.36, "category": "lanthanide", "summary": "A chemical element with symbol Sm and atomic number 62. It is a moderately hard silvery metal that slowly oxidizes in air." },
    { "number": 63, "symbol": "Eu", "name": "Europium", "mass": 151.964, "category": "lanthanide", "summary": "A chemical element with symbol Eu and atomic number 63. It is a moderately hard, silvery metal which readily oxidizes in air and water." },
    { "number": 64, "symbol": "Gd", "name": "Gadolinium", "mass": 157.25, "category": "lanthanide", "summary": "A chemical element with symbol Gd and atomic number 64. It is a silvery-white, malleable and ductile rare-earth element." },
    { "number": 65, "symbol": "Tb", "name": "Terbium", "mass": 158.92535, "category": "lanthanide", "summary": "A chemical element with symbol Tb and atomic number 65. It is a silvery-white, rare earth metal that is malleable, ductile, and soft enough to be cut with a knife." },
    { "number": 66, "symbol": "Dy", "name": "Dysprosium", "mass": 162.5, "category": "lanthanide", "summary": "A chemical element with symbol Dy and atomic number 66. It is a rare earth element with a metallic silver luster." },
    { "number": 67, "symbol": "Ho", "name": "Holmium", "mass": 164.93033, "category": "lanthanide", "summary": "A chemical element with symbol Ho and atomic number 67. It is a rare-earth element and is the eleventh member of the lanthanide series." },
    { "number": 68, "symbol": "Er", "name": "Erbium", "mass": 167.259, "category": "lanthanide", "summary": "A chemical element with symbol Er and atomic number 68. A silvery-white solid metal when artificially isolated, natural erbium is always found in chemical combination with other elements." },
    { "number": 69, "symbol": "Tm", "name": "Thulium", "mass": 168.93422, "category": "lanthanide", "summary": "A chemical element with symbol Tm and atomic number 69. It is the thirteenth and third-last element in the lanthanide series." },
    { "number": 70, "symbol": "Yb", "name": "Ytterbium", "mass": 173.045, "category": "lanthanide", "summary": "A chemical element with symbol Yb and atomic number 70. It is the fourteenth and penultimate element in the lanthanide series, which is the basis of the relative stability of its +2 oxidation state." },
    { "number": 71, "symbol": "Lu", "name": "Lutetium", "mass": 174.9668, "category": "lanthanide", "summary": "A chemical element with symbol Lu and atomic number 71. It is a silvery white metal, which resists corrosion in dry, but not in moist air." },
    { "number": 72, "symbol": "Hf", "name": "Hafnium", "mass": 178.49, "category": "transition-metal", "summary": "A chemical element with symbol Hf and atomic number 72. A lustrous, silvery gray, tetravalent transition metal, hafnium chemically resembles zirconium and is found in zirconium minerals." },
    { "number": 73, "symbol": "Ta", "name": "Tantalum", "mass": 180.94788, "category": "transition-metal", "summary": "A chemical element with symbol Ta and atomic number 73. Previously known as tantalium, its name is derived from Tantalus, an antihero from Greek mythology." },
    { "number": 74, "symbol": "W", "name": "Tungsten", "mass": 183.84, "category": "transition-metal", "summary": "A chemical element with symbol W and atomic number 74. The word tungsten comes from the Swedish language tung sten, which directly translates to heavy stone." },
    { "number": 75, "symbol": "Re", "name": "Rhenium", "mass": 186.207, "category": "transition-metal", "summary": "A chemical element with symbol Re and atomic number 75. It is a silvery-white, heavy, third-row transition metal in group 7 of the periodic table." },
    { "number": 76, "symbol": "Os", "name": "Osmium", "mass": 190.23, "category": "transition-metal", "summary": "A chemical element with symbol Os and atomic number 76. It is a hard, brittle, bluish-white transition metal in the platinum group that is found as a trace element in alloys, mostly in platinum ores." },
    { "number": 77, "symbol": "Ir", "name": "Iridium", "mass": 192.217, "category": "transition-metal", "summary": "A chemical element with symbol Ir and atomic number 77. A very hard, brittle, silvery-white transition metal of the platinum group, iridium is generally credited with being the second-densest element (after osmium)." },
    { "number": 78, "symbol": "Pt", "name": "Platinum", "mass": 195.084, "category": "transition-metal", "summary": "A chemical element with symbol Pt and atomic number 78. It is a dense, malleable, ductile, highly unreactive, precious, silverish-white transition metal." },
    { "number": 79, "symbol": "Au", "name": "Gold", "mass": 196.966569, "category": "transition-metal", "summary": "A chemical element with symbol Au and atomic number 79. In its purest form, it is a bright, slightly reddish yellow, dense, soft, malleable, and ductile metal." },
    { "number": 80, "symbol": "Hg", "name": "Mercury", "mass": 200.592, "category": "transition-metal", "summary": "A chemical element with symbol Hg and atomic number 80. It is commonly known as quicksilver and was formerly named hydrargyrum." },
    { "number": 81, "symbol": "Tl", "name": "Thallium", "mass": 204.38, "category": "post-transition-metal", "summary": "A chemical element with symbol Tl and atomic number 81. It is a gray post-transition metal that is not found free in nature." },
    { "number": 82, "symbol": "Pb", "name": "Lead", "mass": 207.2, "category": "post-transition-metal", "summary": "A chemical element with symbol Pb and atomic number 82. It is a heavy metal that is denser than most common materials." },
    { "number": 83, "symbol": "Bi", "name": "Bismuth", "mass": 208.9804, "category": "post-transition-metal", "summary": "A chemical element with symbol Bi and atomic number 83. It is a brittle metal with a silvery white color when freshly produced, but surface oxidation can give it a pink tinge." },
    { "number": 84, "symbol": "Po", "name": "Polonium", "mass": 209, "category": "post-transition-metal", "summary": "A chemical element with symbol Po and atomic number 84, discovered in 1898 by Marie and Pierre Curie. A rare and highly radioactive metal with no stable isotopes, polonium is chemically similar to bismuth and tellurium, and it occurs in uranium ores." },
    { "number": 85, "symbol": "At", "name": "Astatine", "mass": 210, "category": "halogen", "summary": "A very rare radioactive chemical element with the chemical symbol At and atomic number 85. It occurs on Earth as the decay product of various heavier elements." },
    { "number": 86, "symbol": "Rn", "name": "Radon", "mass": 222, "category": "noble-gas", "summary": "A chemical element with symbol Rn and atomic number 86. It is a radioactive, colorless, odorless, tasteless noble gas." },
    { "number": 87, "symbol": "Fr", "name": "Francium", "mass": 223, "category": "alkali-metal", "summary": "A chemical element with symbol Fr and atomic number 87. It is extremely radioactive; its most stable isotope, francium-223, has a half-life of only 22 minutes." },
    { "number": 88, "symbol": "Ra", "name": "Radium", "mass": 226, "category": "alkaline-earth-metal", "summary": "A chemical element with symbol Ra and atomic number 88. It is the sixth element in group 2 of the periodic table, also known as the alkaline earth metals." },
    { "number": 89, "symbol": "Ac", "name": "Actinium", "mass": 227, "category": "actinide", "summary": "A radioactive chemical element with symbol Ac and atomic number 89. It was first isolated by Friedrich Oskar Giesel in 1902, who gave it the name emanium." },
    { "number": 90, "symbol": "Th", "name": "Thorium", "mass": 232.0377, "category": "actinide", "summary": "A weakly radioactive metallic chemical element with symbol Th and atomic number 90. Thorium is silvery and tarnishes black when exposed to air, forming thorium dioxide; it is moderately hard, malleable, and has a high melting point." },
    { "number": 91, "symbol": "Pa", "name": "Protactinium", "mass": 231.03588, "category": "actinide", "summary": "A chemical element with symbol Pa and atomic number 91. It is a dense, silvery-gray actinide metal which readily reacts with oxygen, water vapor and inorganic acids." },
    { "number": 92, "symbol": "U", "name": "Uranium", "mass": 238.02891, "category": "actinide", "summary": "A chemical element with symbol U and atomic number 92. It is a silvery-white metal in the actinide series of the periodic table." },
    { "number": 93, "symbol": "Np", "name": "Neptunium", "mass": 237, "category": "actinide", "summary": "A radioactive chemical element with symbol Np and atomic number 93. A silvery metallic element, neptunium is the first transuranic element." },
    { "number": 94, "symbol": "Pu", "name": "Plutonium", "mass": 244, "category": "actinide", "summary": "A radioactive chemical element with symbol Pu and atomic number 94. It is an actinide metal of silvery-gray appearance that tarnishes when exposed to air, and forms a dull coating when oxidized." },
    { "number": 95, "symbol": "Am", "name": "Americium", "mass": 243, "category": "actinide", "summary": "A radioactive chemical element with symbol Am and atomic number 95. This transuranic element of the actinide series is located in the periodic table under the lanthanide element europium, and thus by analogy was named after the Americas." },
    { "number": 96, "symbol": "Cm", "name": "Curium", "mass": 247, "category": "actinide", "summary": "A transuranic radioactive chemical element with symbol Cm and atomic number 96. This element of the actinide series was named after Marie and Pierre Curie – both were known for their research on radioactivity." },
    { "number": 97, "symbol": "Bk", "name": "Berkelium", "mass": 247, "category": "actinide", "summary": "A radioactive chemical element with symbol Bk and atomic number 97. It is a member of the actinide and transuranium element series." },
    { "number": 98, "symbol": "Cf", "name": "Californium", "mass": 251, "category": "actinide", "summary": "A radioactive metallic chemical element with symbol Cf and atomic number 98. The element was first made in 1950 at the University of California Radiation Laboratory in Berkeley, by bombarding curium with alpha particles." },
    { "number": 99, "symbol": "Es", "name": "Einsteinium", "mass": 252, "category": "actinide", "summary": "A synthetic element with symbol Es and atomic number 99. It is the seventh transuranic element, and an actinide." },
    { "number": 100, "symbol": "Fm", "name": "Fermium", "mass": 257, "category": "actinide", "summary": "A synthetic element with symbol Fm and atomic number 100. It is the heaviest element that can be formed by neutron bombardment of lighter elements, and hence the last element that can be prepared in macroscopic quantities." },
    { "number": 101, "symbol": "Md", "name": "Mendelevium", "mass": 258, "category": "actinide", "summary": "A synthetic element with symbol Md and atomic number 101. A metallic radioactive transuranic element in the actinide series, it is the first element that currently cannot be produced in macroscopic quantities through neutron bombardment of lighter elements." },
    { "number": 102, "symbol": "No", "name": "Nobelium", "mass": 259, "category": "actinide", "summary": "A synthetic chemical element with symbol No and atomic number 102. It is named in honor of Alfred Nobel, the inventor of dynamite and benefactor of science." },
    { "number": 103, "symbol": "Lr", "name": "Lawrencium", "mass": 266, "category": "actinide", "summary": "A synthetic chemical element with symbol Lr and atomic number 103. It is named in honor of Ernest Lawrence, inventor of the cyclotron, a device that was used to discover many artificial radioactive elements." },
    { "number": 104, "symbol": "Rf", "name": "Rutherfordium", "mass": 267, "category": "transition-metal", "summary": "A chemical element with symbol Rf and atomic number 104, named in honor of physicist Ernest Rutherford. It is a synthetic element (an element that can be created in a laboratory but is not found in nature) and radioactive." },
    { "number": 105, "symbol": "Db", "name": "Dubnium", "mass": 268, "category": "transition-metal", "summary": "A chemical element with symbol Db and atomic number 105. It is named after the town of Dubna in Russia (former Soviet Union), where it was first produced." },
    { "number": 106, "symbol": "Sg", "name": "Seaborgium", "mass": 269, "category": "transition-metal", "summary": "A synthetic chemical element with symbol Sg and atomic number 106. It is named after the American nuclear chemist Glenn T. Seaborg." },
    { "number": 107, "symbol": "Bh", "name": "Bohrium", "mass": 270, "category": "transition-metal", "summary": "A synthetic chemical element with symbol Bh and atomic number 107. It is named after Danish physicist Niels Bohr." },
    { "number": 108, "symbol": "Hs", "name": "Hassium", "mass": 269, "category": "transition-metal", "summary": "A synthetic chemical element with symbol Hs and atomic number 108, named after the German state of Hesse. It is a radioactive, silvery metal or gray solid." },
    { "number": 109, "symbol": "Mt", "name": "Meitnerium", "mass": 278, "category": "unknown", "summary": "A synthetic chemical element with symbol Mt and atomic number 109. It is named after Lise Meitner." },
    { "number": 110, "symbol": "Ds", "name": "Darmstadtium", "mass": 281, "category": "unknown", "summary": "A chemical element with symbol Ds and atomic number 110. It is a synthetic element that was first created in 1994." },
    { "number": 111, "symbol": "Rg", "name": "Roentgenium", "mass": 282, "category": "unknown", "summary": "A synthetic chemical element with symbol Rg and atomic number 111. It is named after the physicist Wilhelm Röntgen, who discovered X-rays." },
    { "number": 112, "symbol": "Cn", "name": "Copernicium", "mass": 285, "category": "transition-metal", "summary": "A chemical element with symbol Cn and atomic number 112. It is a synthetic element that was first created in 1996." },
    { "number": 113, "symbol": "Nh", "name": "Nihonium", "mass": 286, "category": "unknown", "summary": "A synthetic chemical element with symbol Nh and atomic number 113. It is named after the country of Japan (Nihon in Japanese)." },
    { "number": 114, "symbol": "Fl", "name": "Flerovium", "mass": 289, "category": "post-transition-metal", "summary": "A superheavy artificial chemical element with symbol Fl and atomic number 114. It is named after the Flerov Laboratory of Nuclear Reactions of the Joint Institute for Nuclear Research in Dubna, Russia, where the element was discovered in 1998." },
    { "number": 115, "symbol": "Mc", "name": "Moscovium", "mass": 290, "category": "unknown", "summary": "A synthetic chemical element with symbol Mc and atomic number 115. It is named after the Moscow Oblast, where the Joint Institute for Nuclear Research is located." },
    { "number": 116, "symbol": "Lv", "name": "Livermorium", "mass": 293, "category": "unknown", "summary": "A synthetic superheavy element with symbol Lv and atomic number 116. It is named after the Lawrence Livermore National Laboratory in the United States." },
    { "number": 117, "symbol": "Ts", "name": "Tennessine", "mass": 294, "category": "halogen", "summary": "A synthetic chemical element with symbol Ts and atomic number 117. It is named after the state of Tennessee, where the Oak Ridge National Laboratory is located." },
    { "number": 118, "symbol": "Og", "name": "Oganesson", "mass": 294, "category": "noble-gas", "summary": "A synthetic chemical element with symbol Og and atomic number 118. It is named after the nuclear physicist Yuri Oganessian." }
];

const elementPositions: { [key: number]: ElementPosition } = {
    1: { row: 1, col: 1 }, 2: { row: 1, col: 18 }, 3: { row: 2, col: 1 }, 4: { row: 2, col: 2 }, 5: { row: 2, col: 13 }, 6: { row: 2, col: 14 }, 7: { row: 2, col: 15 }, 8: { row: 2, col: 16 }, 9: { row: 2, col: 17 }, 10: { row: 2, col: 18 },
    11: { row: 3, col: 1 }, 12: { row: 3, col: 2 }, 13: { row: 3, col: 13 }, 14: { row: 3, col: 14 }, 15: { row: 3, col: 15 }, 16: { row: 3, col: 16 }, 17: { row: 3, col: 17 }, 18: { row: 3, col: 18 }, 19: { row: 4, col: 1 }, 20: { row: 4, col: 2 },
    21: { row: 4, col: 3 }, 22: { row: 4, col: 4 }, 23: { row: 4, col: 5 }, 24: { row: 4, col: 6 }, 25: { row: 4, col: 7 }, 26: { row: 4, col: 8 }, 27: { row: 4, col: 9 }, 28: { row: 4, col: 10 }, 29: { row: 4, col: 11 }, 30: { row: 4, col: 12 },
    31: { row: 4, col: 13 }, 32: { row: 4, col: 14 }, 33: { row: 4, col: 15 }, 34: { row: 4, col: 16 }, 35: { row: 4, col: 17 }, 36: { row: 4, col: 18 }, 37: { row: 5, col: 1 }, 38: { row: 5, col: 2 }, 39: { row: 5, col: 3 }, 40: { row: 5, col: 4 },
    41: { row: 5, col: 5 }, 42: { row: 5, col: 6 }, 43: { row: 5, col: 7 }, 44: { row: 5, col: 8 }, 45: { row: 5, col: 9 }, 46: { row: 5, col: 10 }, 47: { row: 5, col: 11 }, 48: { row: 5, col: 12 }, 49: { row: 5, col: 13 }, 50: { row: 5, col: 14 },
    51: { row: 5, col: 15 }, 52: { row: 5, col: 16 }, 53: { row: 5, col: 17 }, 54: { row: 5, col: 18 }, 55: { row: 6, col: 1 }, 56: { row: 6, col: 2 }, 57: { row: 9, col: 3 }, 58: { row: 9, col: 4 }, 59: { row: 9, col: 5 }, 60: { row: 9, col: 6 },
    61: { row: 9, col: 7 }, 62: { row: 9, col: 8 }, 63: { row: 9, col: 9 }, 64: { row: 9, col: 10 }, 65: { row: 9, col: 11 }, 66: { row: 9, col: 12 }, 67: { row: 9, col: 13 }, 68: { row: 9, col: 14 }, 69: { row: 9, col: 15 }, 70: { row: 9, col: 16 },
    71: { row: 9, col: 17 }, 72: { row: 6, col: 4 }, 73: { row: 6, col: 5 }, 74: { row: 6, col: 6 }, 75: { row: 6, col: 7 }, 76: { row: 6, col: 8 }, 77: { row: 6, col: 9 }, 78: { row: 6, col: 10 }, 79: { row: 6, col: 11 }, 80: { row: 6, col: 12 },
    81: { row: 6, col: 13 }, 82: { row: 6, col: 14 }, 83: { row: 6, col: 15 }, 84: { row: 6, col: 16 }, 85: { row: 6, col: 17 }, 86: { row: 6, col: 18 }, 87: { row: 7, col: 1 }, 88: { row: 7, col: 2 }, 89: { row: 10, col: 3 }, 90: { row: 10, col: 4 },
    91: { row: 10, col: 5 }, 92: { row: 10, col: 6 }, 93: { row: 10, col: 7 }, 94: { row: 10, col: 8 }, 95: { row: 10, col: 9 }, 96: { row: 10, col: 10 }, 97: { row: 10, col: 11 }, 98: { row: 10, col: 12 }, 99: { row: 10, col: 13 }, 100: { row: 10, col: 14 },
    101: { row: 10, col: 15 }, 102: { row: 10, col: 16 }, 103: { row: 10, col: 17 }, 104: { row: 7, col: 4 }, 105: { row: 7, col: 5 }, 106: { row: 7, col: 6 }, 107: { row: 7, col: 7 }, 108: { row: 7, col: 8 }, 109: { row: 7, col: 9 }, 110: { row: 7, col: 10 },
    111: { row: 7, col: 11 }, 112: { row: 7, col: 12 }, 113: { row: 7, col: 13 }, 114: { row: 7, col: 14 }, 115: { row: 7, col: 15 }, 116: { row: 7, col: 16 }, 117: { row: 7, col: 17 }, 118: { row: 7, col: 18 },
};

const combinationRecipes: { [key: string]: CombinationRecipe } = {
    '1-8': { name: 'Water', formula: 'H₂O', summary: 'The most essential compound for life on Earth, covering over 70% of the planet\'s surface.', molecule: { atoms: [{ el: 8, x: '50%', y: '50%' }, { el: 1, x: '35%', y: '35%' }, { el: 1, x: '65%', y: '35%' }], size: [60, 40] } },
    '6-8': { name: 'Carbon Dioxide', formula: 'CO₂', summary: 'A gas exhaled by animals and used by plants for photosynthesis. It\'s also responsible for the fizz in soda!', molecule: { atoms: [{ el: 6, x: '50%', y: '50%' }, { el: 8, x: '25%', y: '50%' }, { el: 8, x: '75%', y: '50%' }], size: [50, 40] } },
    '11-17': { name: 'Sodium Chloride', formula: 'NaCl', summary: 'Commonly known as table salt, this ionic compound is crucial for nerve function and seasoning your food.', molecule: { atoms: [{ el: 11, x: '35%', y: '50%' }, { el: 17, x: '65%', y: '50%' }], size: [50, 50] } },
};


// --- React Components ---

/**
 * Component for the animated starry background
 */
const BackgroundCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particlesArray: Particle[] = [];

        class Particle {
            x: number; y: number; directionX: number; directionY: number; size: number; color: string;
            constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
            }
            draw() {
                if (!ctx) return;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill();
            }
            update() {
                if (!canvas) return;
                if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
                if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }
                this.x += this.directionX; this.y += this.directionY; this.draw();
            }
        }

        const initBackground = () => {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - .2;
                let directionY = (Math.random() * .4) - .2;
                let color = 'rgba(173, 216, 230, ' + (Math.random() * 0.5 + 0.2) + ')';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        let animationFrameId: number;
        const animateBackground = () => {
            animationFrameId = requestAnimationFrame(animateBackground);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); }
        };

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initBackground();
        };

        setCanvasSize();
        animateBackground();

        window.addEventListener('resize', setCanvasSize);

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} id="background-canvas"></canvas>;
};

/**
 * Component to render the animated Bohr model of an atom
 */
const AtomView: React.FC<{ element: ElementData }> = ({ element }) => {
    const electrons = useMemo(() => {
        const shells = [2, 8, 18, 32, 32, 18, 8];
        let electronsLeft = element.number;
        let shellIndex = 0;
        const electronElements = [];

        while (electronsLeft > 0 && shellIndex < shells.length) {
            const electronsInShell = Math.min(electronsLeft, shells[shellIndex]);
            const radius = 60 + shellIndex * 35;
            for (let i = 0; i < electronsInShell; i++) {
                const duration = 5 + shellIndex * 2;
                const delay = `-${(duration / electronsInShell) * i}s`;
                electronElements.push(
                    <div
                        key={`${shellIndex}-${i}`}
                        className="electron"
                        style={{
                            '--radius': `${radius}px`,
                            animationDuration: `${duration}s`,
                            animationDelay: delay,
                        } as React.CSSProperties}
                    ></div>
                );
            }
            electronsLeft -= electronsInShell;
            shellIndex++;
        }
        return electronElements;
    }, [element.number]);

    return (
        <div className="atom-view">
            <div className="nucleus">{element.symbol}</div>
            {electrons}
        </div>
    );
};

/**
 * Component to render the resulting molecule from a combination
 */
const MoleculeView: React.FC<{ molecule: MoleculeData }> = ({ molecule }) => {
    return (
        <div className="molecule-view">
            {molecule.atoms.map((atomInfo, index) => {
                const atomData = elementsData.find(el => el.number === atomInfo.el);
                if (!atomData) return null;
                
                const atomSize = atomInfo.el === 1 ? molecule.size[1] * 0.8 : molecule.size[1];
                const style = {
                    width: `${atomSize}px`,
                    height: `${atomSize}px`,
                    left: `calc(${atomInfo.x} - ${atomSize / 2}px)`,
                    top: `calc(${atomInfo.y} - ${atomSize / 2}px)`,
                };

                return (
                    <div
                        key={index}
                        className={`molecule-atom ${atomData.category.replace(/ /g, '-')}`}
                        style={style}
                    >
                        {atomData.symbol}
                    </div>
                );
            })}
        </div>
    );
};

/**
 * The main application component
 */
export default function App() {
    const [gameMode, setGameMode] = useState<'explore' | 'combine'>('explore');
    const [selectedForCombination, setSelectedForCombination] = useState<ElementData[]>([]);
    const [failedCombination, setFailedCombination] = useState<number[]>([]);
    
    const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
    const [combinationResult, setCombinationResult] = useState<CombinationRecipe | null>(null);

    const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedForCombination([]);
        setGameMode(e.target.checked ? 'combine' : 'explore');
    };

    const resetCombination = useCallback(() => {
        setSelectedForCombination([]);
        setFailedCombination([]);
    }, []);

    const closeCombinationModal = () => {
        setCombinationResult(null);
        resetCombination();
    };

    const elementClickHandler = (element: ElementData) => {
        if (gameMode === 'explore') {
            setSelectedElement(element);
        } else {
            // Handle combination logic
            if (selectedForCombination.find(sel => sel.number === element.number)) {
                // Deselect if clicked again
                setSelectedForCombination(prev => prev.filter(sel => sel.number !== element.number));
                return;
            }
            
            if (selectedForCombination.length >= 2) return;

            const newSelection = [...selectedForCombination, element];
            setSelectedForCombination(newSelection);

            if (newSelection.length === 2) {
                const [el1, el2] = newSelection.map(e => e.number).sort((a, b) => a - b);
                const key = `${el1}-${el2}`;
                const recipe = combinationRecipes[key];

                setTimeout(() => {
                    if (recipe) {
                        setCombinationResult(recipe);
                    } else {
                        setFailedCombination([newSelection[0].number, newSelection[1].number]);
                        setTimeout(() => {
                           resetCombination();
                        }, 500);
                    }
                }, 300);
            }
        }
    };
    
    return (
        <>
            {/* We inject the CSS directly into the document head for this single-file component */}
            <style>{`
                body {
                    font-family: 'Poppins', sans-serif;
                    background-color: #0c1427;
                    color: #e2e8f0;
                    overflow: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                }
                #root {
                    width: 100%;
                    height: 100%;
                }
                #background-canvas {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }
                #game-container {
                    position: relative;
                    z-index: 1;
                    padding: 2rem 1rem;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .periodic-table {
                    display: grid;
                    grid-template-columns: repeat(18, minmax(0, 1fr));
                    gap: 5px;
                    width: 100%;
                    max-width: 1400px;
                    margin: auto;
                    margin-top: 2rem;
                }
                .element {
                    position: relative;
                    padding: 6px 2px;
                    text-align: center;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease, outline 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    min-height: 55px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.25);
                }
                .element:hover {
                    transform: scale(1.1);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                    z-index: 10;
                }
                .element.selected {
                    transform: scale(1.15);
                    box-shadow: 0 0 25px #a855f7;
                    outline: 3px solid #a855f7;
                    z-index: 11;
                }
                 .element.failed {
                    animation: ping 0.5s cubic-bezier(0, 0, 0.2, 1);
                    background-color: #ef4444;
                }
                @keyframes ping {
                    75%, 100% {
                        transform: scale(1.1);
                        opacity: 0;
                    }
                }
                .element .symbol { font-size: 1rem; font-weight: 700; }
                .element .number { font-size: 0.6rem; position: absolute; top: 2px; left: 3px; }
                .element .name { font-size: 0.5rem; display: none; word-break: break-all; }
                @media (min-width: 768px) { .element .name { display: block; } }
                h1.game-title { text-shadow: 0 0 8px rgba(6, 182, 212, 0.7), 0 0 20px rgba(6, 182, 212, 0.5); }
                .alkali-metal { background-image: linear-gradient(to top right, #ef4444, #f87171); }
                .alkaline-earth-metal { background-image: linear-gradient(to top right, #f97316, #fb923c); }
                .lanthanide { background-image: linear-gradient(to top right, #a16207, #ca8a04); color: #f0f0f0; }
                .actinide { background-image: linear-gradient(to top right, #7e22ce, #a855f7); color: #f0f0f0; }
                .transition-metal { background-image: linear-gradient(to top right, #84cc16, #a3e635); }
                .post-transition-metal { background-image: linear-gradient(to top right, #22c55e, #4ade80); }
                .metalloid { background-image: linear-gradient(to top right, #10b981, #34d399); }
                .nonmetal, .polyatomic-nonmetal, .diatomic-nonmetal { background-image: linear-gradient(to top right, #14b8a6, #2dd4bf); }
                .halogen { background-image: linear-gradient(to top right, #06b6d4, #22d3ee); }
                .noble-gas { background-image: linear-gradient(to top right, #3b82f6, #60a5fa); }
                .unknown { background-image: linear-gradient(to top right, #64748b, #94a3b8); }
                #mode-switcher { position: absolute; top: 1.5rem; right: 2rem; z-index: 20; background-color: rgba(45, 55, 72, 0.5); padding: 0.5rem 1rem; border-radius: 9999px; backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
                #explore-label, #combine-label { transition: color 0.3s ease, transform 0.3s ease, text-shadow 0.3s ease; font-weight: 600; }
                #explore-label.active, #combine-label.active { transform: scale(1.05); text-shadow: 0 0 6px currentColor; }
                #mode-toggle:checked + div { box-shadow: 0 0 10px #a855f7; }
                #mode-toggle + div { transition: background-color 0.3s ease, box-shadow 0.3s ease; }
                .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; z-index: 100; }
                .modal.active { opacity: 1; pointer-events: auto; }
                .modal-content { background: #2d3748; padding: 2rem; border-radius: 16px; width: 90%; max-width: 800px; display: grid; grid-template-columns: 1fr; gap: 2rem; transform: scale(0.9); transition: transform 0.3s ease; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                @media (min-width: 768px) { .modal-content { grid-template-columns: 1fr 1fr; } }
                .modal.active .modal-content { transform: scale(1); }
                #combination-modal .modal-content { grid-template-columns: 1fr; }
                .atom-view { position: relative; width: 100%; min-height: 300px; display: flex; align-items: center; justify-content: center; }
                .molecule-view { position: relative; width: 100%; min-height: 200px; display: flex; align-items: center; justify-content: center; margin-top: 1rem; margin-bottom: 1rem; }
                .molecule-atom { position: absolute; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); border: 2px solid rgba(255, 255, 255, 0.7); }
                .nucleus { width: 50px; height: 50px; background: radial-gradient(circle, #f87171, #b91c1c); border-radius: 50%; position: absolute; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; color: white; box-shadow: 0 0 20px #ef4444, inset 0 0 10px rgba(255,255,255,0.3); }
                .electron { position: absolute; width: 12px; height: 12px; background: radial-gradient(circle, #60a5fa, #2563eb); border-radius: 50%; box-shadow: 0 0 10px #3b82f6; animation: orbit linear infinite; }
                @keyframes orbit { from { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg); } to { transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg); } }
            `}</style>
            
            <BackgroundCanvas />
            
            <div id="game-container" className="p-4 w-full">
                <div id="mode-switcher">
                    <div className="flex items-center justify-center space-x-3">
                        <span id="explore-label" className={`font-semibold ${gameMode === 'explore' ? 'text-cyan-300 active' : 'text-gray-500'}`}>Explore</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="mode-toggle" className="sr-only peer" onChange={handleModeChange} checked={gameMode === 'combine'} />
                            <div className="w-14 h-7 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                        <span id="combine-label" className={`font-semibold ${gameMode === 'combine' ? 'text-purple-400 active' : 'text-gray-500'}`}>Combine</span>
                    </div>
                </div>

                <h1 className="game-title text-5xl font-bold text-center mb-2 text-cyan-300">Atom Explorer</h1>
                <p className="text-center text-gray-400 mb-4">
                    {gameMode === 'explore' ? 'Click an element to explore!' : 'Select two elements to combine!'}
                </p>

                <div className="periodic-table">
                    {elementsData.map(el => {
                        const position = elementPositions[el.number];
                        if (!position) return null;
                        const isSelected = !!selectedForCombination.find(s => s.number === el.number);
                        const isFailed = failedCombination.includes(el.number);

                        return (
                            <div
                                key={el.number}
                                className={`element ${el.category.replace(/ /g, '-')} ${isSelected ? 'selected' : ''} ${isFailed ? 'failed' : ''}`}
                                style={{ gridRowStart: position.row, gridColumnStart: position.col }}
                                onClick={() => elementClickHandler(el)}
                            >
                                <div className="number">{el.number}</div>
                                <div className="symbol">{el.symbol}</div>
                                <div className="name">{el.name}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Element Detail Modal */}
            {selectedElement && (
                <div className={`modal ${selectedElement ? 'active' : ''}`} onClick={() => setSelectedElement(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="info-panel">
                            <h2 className="text-4xl font-bold mb-4">{selectedElement.name}</h2>
                            <div className="grid grid-cols-2 gap-4 text-lg">
                                <p><strong>Symbol:</strong> <span>{selectedElement.symbol}</span></p>
                                <p><strong>Atomic #:</strong> <span>{selectedElement.number}</span></p>
                                <p><strong>Mass:</strong> <span>{selectedElement.mass}</span></p>
                                <p><strong>Group:</strong> <span>{elementPositions[selectedElement.number]?.col || 'N/A'}</span></p>
                                <p><strong>Category:</strong> <span className={`capitalize font-bold ${selectedElement.category.replace(/ /g, '-')} p-1 rounded-md text-gray-900`}>{selectedElement.category.replace(/-/g, ' ')}</span></p>
                            </div>
                            <p className="mt-6 text-gray-300"><strong>Summary:</strong> <span>{selectedElement.summary}</span></p>
                            <button onClick={() => setSelectedElement(null)} className="mt-8 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Back to Table
                            </button>
                        </div>
                        <AtomView element={selectedElement} />
                    </div>
                </div>
            )}
            
            {/* Combination Result Modal */}
            {combinationResult && (
                 <div id="combination-modal" className={`modal ${combinationResult ? 'active' : ''}`} onClick={closeCombinationModal}>
                     <div className="modal-content text-center" onClick={e => e.stopPropagation()}>
                         <h2 className="text-4xl font-bold mb-2">Combination Success!</h2>
                         <MoleculeView molecule={combinationResult.molecule} />
                         <p className="text-xl">You've created <strong>{combinationResult.name}</strong> (<span dangerouslySetInnerHTML={{ __html: combinationResult.formula.replace(/(\d+)/g, '<sub>$1</sub>') }}></span>)!</p>
                         <p className="mt-4 text-gray-300">{combinationResult.summary}</p>
                         <button onClick={closeCombinationModal} className="mt-6 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                             Awesome!
                         </button>
                     </div>
                 </div>
            )}
        </>
    );
}

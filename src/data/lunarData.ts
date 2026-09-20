import { LunarLocation, Spacecraft, MissionObjective, ResourceInfo, TimelineEvent, QuizQuestion, Achievement } from '../types';

export const LUNAR_LOCATIONS: LunarLocation[] = [
  {
    id: 'tycho',
    name: 'Tycho Crater',
    type: 'Crater',
    coordinates: '43.3° S, 11.2° W',
    lat: -43.3,
    lng: -11.2,
    diameter: '85 km (53 mi)',
    depth: '4.8 km (15,700 ft)',
    age: '~108 Million Years (Very Young)',
    description: 'A prominent impact crater with a spectacular central peak and an enormous system of bright radial rays that stretch over 1,500 kilometers across the Moon.',
    formation: 'Formed by a catastrophic high-velocity asteroid collision during the dinosaur era on Earth. The impact blasted powdered pulverized rock high above the Moon.',
    scientificImportance: 'The rays provide pristine young lunar crust samples without billions of years of space weathering. Apollo 17 astronauts sampled Tycho ray material thousands of kilometers away in the Taurus-Littrow valley.',
    imageAccent: '#38bdf8'
  },
  {
    id: 'copernicus',
    name: 'Copernicus Crater',
    type: 'Crater',
    coordinates: '9.6° N, 20.1° W',
    lat: 9.6,
    lng: -20.1,
    diameter: '93 km (58 mi)',
    depth: '3.8 km (12,500 ft)',
    age: '~800 Million Years',
    description: 'Often called "The Monarch of the Moon", Copernicus is a world-class terraced crater in eastern Oceanus Procellarum featuring multiple central peaks.',
    formation: 'Deep excavation into the ancient lunar crust and mantle beneath the mare basalts, creating stepped rim terraces as the crater walls collapsed.',
    scientificImportance: 'Key stratigraphic marker dividing lunar geological history into the Eratosthenian and Copernican periods. Olivine detected in its central peaks reveals deep lunar mantle chemistry.',
    imageAccent: '#818cf8'
  },
  {
    id: 'tranquillitatis',
    name: 'Mare Tranquillitatis',
    type: 'Landing Site',
    coordinates: '0.67° N, 23.47° E',
    lat: 0.67,
    lng: 23.47,
    diameter: '873 km across',
    depth: 'Ancient flooded basin',
    age: '~3.9 Billion Years',
    description: 'The Sea of Tranquility: A vast basaltic volcanic plain with a distinct bluish tint due to high titanium dioxide content.',
    formation: 'A gargantuan primordial impact basin later flooded by low-viscosity basaltic lava flows over hundreds of millions of years.',
    scientificImportance: 'Historic landing site of Apollo 11 on July 20, 1969. Humans first set foot here ("Tranquility Base"). Rock samples proved the Moon was once geologically active and possessed a magma ocean.',
    historicalMission: 'Apollo 11 (Neil Armstrong & Buzz Aldrin)',
    imageAccent: '#22d3ee'
  },
  {
    id: 'imbrium',
    name: 'Mare Imbrium',
    type: 'Mare',
    coordinates: '32.8° N, 15.6° W',
    lat: 32.8,
    lng: -15.6,
    diameter: '1,145 km (711 mi)',
    depth: 'Over 5 km deep basalt deposits',
    age: '~3.85 Billion Years',
    description: 'The Sea of Rains: One of the largest impact craters in the Solar System, ringed by majestic mountain ranges including the Montes Apenninus and Montes Alpes.',
    formation: 'Created by a massive proto-planet impactor ~250 km wide, causing seismic tremors that reshaped the entire Moon, followed by voluminous lava eruptions.',
    scientificImportance: 'Samples from Apollo 15 and China\'s Chang\'e 5 missions revealed complex volcanic evolution and younger basalt volcanism (~2.0 billion years old).',
    historicalMission: 'Apollo 15 & Chang\'e 5',
    imageAccent: '#a855f7'
  },
  {
    id: 'shackleton',
    name: 'Shackleton Crater',
    type: 'Polar Region',
    coordinates: '89.9° S, 0.0° E',
    lat: -89.9,
    lng: 0.0,
    diameter: '21 km (13 mi)',
    depth: '4.2 km (13,800 ft)',
    age: '~3.6 Billion Years',
    description: 'An ultra-deep impact crater located almost exactly at the lunar South Pole. Its interior is shrouded in permanent eternal darkness, while its high rim peaks receive near-continuous sunlight.',
    formation: 'Polar impact that preserved a bowl-shaped structure whose low solar incidence angle prevents sunlight from ever reaching the floor.',
    scientificImportance: 'Prime candidate site for NASA Artemis base camps! Deep cryogenic cold traps (-246°C) preserve vast reserves of water-ice that can be converted into drinking water and rocket propellants (LH2/LOX).',
    historicalMission: 'Artemis Base Camp Target',
    imageAccent: '#06b6d4'
  },
  {
    id: 'southpole_aitken',
    name: 'South Pole - Aitken Basin',
    type: 'Polar Region',
    coordinates: '53° S, 169° W',
    lat: -53.0,
    lng: -169.0,
    diameter: '2,500 km (1,550 mi)',
    depth: '13 km deep (one of deepest)',
    age: '~4.3 Billion Years',
    description: 'The largest, deepest, and oldest recognized impact structure on the Moon, spanning nearly a quarter of the lunar circumference on the Far Side.',
    formation: 'Enormous oblique collision with an asteroid early in Solar System history that punched completely through the lunar crust into the upper mantle.',
    scientificImportance: 'Provides direct access to exposed lunar mantle materials. China\'s Chang\'e 4 made the historic first-ever landing on the lunar Far Side within this basin (Von Kármán crater).',
    historicalMission: 'Chang\'e 4 & Chang\'e 6',
    imageAccent: '#60a5fa'
  },
  {
    id: 'oceanus_procellarum',
    name: 'Oceanus Procellarum',
    type: 'Mare',
    coordinates: '18.4° N, 57.4° W',
    lat: 18.4,
    lng: -57.4,
    diameter: '2,500 km north-south',
    depth: 'Volcanic flood plain',
    age: '~3.5 - 1.2 Billion Years',
    description: 'The Ocean of Storms: The only lunar maria officially designated as an "Ocean" due to its colossal size, covering over 4 million square kilometers.',
    formation: 'High concentrations of heat-producing elements (KREEP: Potassium, Rare Earth Elements, Phosphorus) sustained prolonged volcanic activity longer than anywhere else.',
    scientificImportance: 'Chang\'e 5 retrieved the youngest returned lunar rock samples here, overturning earlier theories that the Moon had cooled and ceased volcanism billions of years ago.',
    imageAccent: '#3b82f6'
  },
  {
    id: 'fra_mauro',
    name: 'Fra Mauro Formation',
    type: 'Landing Site',
    coordinates: '3.65° S, 17.47° W',
    lat: -3.65,
    lng: -17.47,
    diameter: '95 km formation',
    depth: 'Highland rolling hills',
    age: '~3.85 Billion Years',
    description: 'Ejecta blanket deposited during the cataclysmic formation of the Imbrium Basin, characterized by hummocky, grooved ridge terrain.',
    formation: 'Massive debris hurled outward from the Imbrium impact across hundreds of kilometers.',
    scientificImportance: 'Apollo 14 landing site (Alan Shepard & Edgar Mitchell). Alan Shepard famously hit two golf balls on the lunar surface here.',
    historicalMission: 'Apollo 14',
    imageAccent: '#f59e0b'
  }
];

export const SPACECRAFT_LIST: Spacecraft[] = [
  {
    id: 'artemis_orion',
    name: 'Artemis Orion & Starship HLS',
    crewCapacity: 4,
    propulsion: 'Cryogenic Methane / LOX + Aerojet Rocketdyne AJ10',
    payloadCapacity: '15,000 kg to surface',
    fuelEfficiency: 1.2,
    reliability: 98,
    description: 'NASA\'s next-generation deep space exploration architecture designed for sustained human exploration at the lunar South Pole.'
  },
  {
    id: 'lunar_starship',
    name: 'Super Heavy Starship Cargo',
    crewCapacity: 12,
    propulsion: 'Full-Flow Staged Combustion Raptor 3 Engines',
    payloadCapacity: '100,000 kg heavy cargo',
    fuelEfficiency: 1.0,
    reliability: 94,
    description: 'Massive fully-reusable lunar transport vehicle capable of establishing permanent industrial outposts and mining habitats.'
  },
  {
    id: 'apollo_retro',
    name: 'Apollo Saturn V / LM (Classic)',
    crewCapacity: 2,
    propulsion: 'Hypergolic Aerozine 50 / NTO (Zero Boil-off)',
    payloadCapacity: '2,200 kg scientific equipment',
    fuelEfficiency: 0.9,
    reliability: 99,
    description: 'The legendary 1969 Apollo Lunar Module proven across 6 successful human landings on the lunar surface.'
  },
  {
    id: 'nova_autonomous',
    name: 'Nova Autonomous Science Lander',
    crewCapacity: 0,
    propulsion: 'High-Efficiency Hydrazine Electric Hybrid Thrusters',
    payloadCapacity: '1,500 kg autonomous instruments',
    fuelEfficiency: 1.5,
    reliability: 96,
    description: 'Uncrewed scientific robotic scout engineered to drill deep regolith cores and deploy long-range seismic sensors.'
  }
];

export const MISSION_OBJECTIVES: MissionObjective[] = [
  {
    id: 'obj_water',
    title: 'Extract Polar Water-Ice',
    description: 'Locate and core drill cryogenic volatiles in permanently shadowed crater floors.',
    rewardPoints: 300,
    difficulty: 'Extreme'
  },
  {
    id: 'obj_telescope',
    title: 'Deploy Far-Side Radio Array',
    description: 'Set up low-frequency radio antennas shielded from Earth\'s electromagnetic noise.',
    rewardPoints: 250,
    difficulty: 'Advanced'
  },
  {
    id: 'obj_mantle',
    title: 'Sample Lunar Mantle Olivine',
    description: 'Collect deep impact ejecta rocks to analyze early solar system planetary differentiation.',
    rewardPoints: 200,
    difficulty: 'Standard'
  },
  {
    id: 'obj_solar',
    title: 'Test Lunar Concrete & Sintering',
    description: 'Utilize concentrated solar mirrors to melt lunar regolith into habitat brick foundations.',
    rewardPoints: 180,
    difficulty: 'Standard'
  }
];

export const LUNAR_RESOURCES: ResourceInfo[] = [
  {
    id: 'water_ice',
    name: 'Water Ice (H2O)',
    icon: '💧',
    subtitle: 'The Gold of Deep Space Exploration',
    whatItIs: 'Frozen water trapped in dark crater floors that have not seen direct sunlight for billions of years.',
    whereFound: 'Permanently Shadowed Regions (PSRs) at the lunar North and South poles, particularly Shackleton and Cabeus craters.',
    whyImportant: 'Water is extraordinarily heavy and expensive to launch from Earth (~$10,000/kg). Lunar water can be purified for astronauts to drink, split into breathable oxygen (O2), and transformed into liquid hydrogen rocket fuel.',
    futureApplications: 'Enables self-sustaining lunar settlements and serves as an orbital gas station for missions traveling to Mars and beyond.',
    abundanceEstimate: 'Estimated over 600 million metric tons of ice.'
  },
  {
    id: 'minerals',
    name: 'Regolith Minerals & Metals',
    icon: '🪨',
    subtitle: 'Ilmenite, Anorthosite & Volcanic Basalt',
    whatItIs: 'Lunar soil is rich in metals such as titanium (Ti), aluminum (Al), silicon (Si), iron (Fe), and magnesium (Mg).',
    whereFound: 'Basaltic Maria (rich in titanium-bearing ilmenite) and Lunar Highlands (rich in calcium-aluminum plagioclase feldspar).',
    whyImportant: 'Unlike Earth, the Moon has no oxidized rust or biological breakdown, leaving metallic grains and silicates ready for direct manufacturing.',
    futureApplications: '3D-printing radiation shields, roads, solar panels from raw lunar silicon, and extracting oxygen directly from rocks through molten regolith electrolysis.',
    abundanceEstimate: 'Over 40% of lunar soil by weight is chemically bound oxygen!'
  },
  {
    id: 'helium_3',
    name: 'Helium-3 (He-3)',
    icon: '🌑',
    subtitle: 'Clean Nuclear Fusion Power',
    whatItIs: 'A non-radioactive light isotope of helium deposited into lunar regolith over billions of years by the solar wind.',
    whereFound: 'Embedded in the upper few meters of lunar soil, especially in titanium-rich mare regions like Mare Tranquillitatis.',
    whyImportant: 'On Earth, Helium-3 is virtually non-existent because our magnetic field deflects the solar wind. Helium-3 fusion produces tremendous energy without generating dangerous radioactive nuclear waste.',
    futureApplications: 'Just 25 metric tons of Helium-3 could cleanly power the entire United States electrical grid for a full year!',
    abundanceEstimate: 'Estimated 1 million metric tons across the surface.'
  },
  {
    id: 'solar_energy',
    name: 'Peaks of Eternal Light',
    icon: '☀️',
    subtitle: 'Continuous Clean Solar Power',
    whatItIs: 'High elevation rim ridges along polar craters where the Moon\'s tiny axial tilt (1.54°) keeps them in near-constant sunlight.',
    whereFound: 'Rim peaks around Shackleton, Malapert Mountain, and Whipple craters at the lunar poles.',
    whyImportant: 'Normal regions on the Moon endure a brutal two-week long freezing night. Polar light peaks receive solar illumination 80% to 90% of the year with no cloud cover.',
    futureApplications: 'Continuous solar arrays generating round-the-clock electricity for scientific labs, rover recharging stations, and life support systems.',
    abundanceEstimate: 'Virtually unlimited, 1361 W/m² solar irradiance.'
  },
  {
    id: 'psr_cold_traps',
    name: 'Cryogenic Cold Traps',
    icon: '🧊',
    subtitle: 'Natural Deep-Freeze Laboratories',
    whatItIs: 'Craters where sunlight never enters, maintaining natural temperatures as low as 25 Kelvin (-248°C / -415°F), colder than Pluto!',
    whereFound: 'Polar craters such as Hermite, Peary, Shoemaker, and Faustini.',
    whyImportant: 'These environments serve as planetary time capsules, locking in ancient cometary organic molecules and primordial solar system volatile gases in pristine condition.',
    futureApplications: 'Operating superconducting electronics and ultra-cold quantum computing processors with zero artificial refrigeration power.',
    abundanceEstimate: 'Over 30,000 square kilometers of permanently dark terrain.'
  }
];

export const LUNAR_PHASES = [
  {
    id: 'new_moon',
    name: 'New Moon',
    illumination: '0%',
    angleDeg: 0,
    description: 'The Moon is situated directly between Earth and the Sun. Its illuminated hemisphere faces away from Earth, making the Moon invisible against the daytime sky.',
    fact: 'A solar eclipse can only happen during a New Moon when the Moon passes directly in front of the Sun.'
  },
  {
    id: 'waxing_crescent',
    name: 'Waxing Crescent',
    illumination: '1% - 49%',
    angleDeg: 45,
    description: 'A delicate sliver of sunlight becomes visible on the right side (Northern Hemisphere) as the Moon moves eastward in its orbit away from the Sun.',
    fact: '"Waxing" means growing. You can often see "Earthshine" (sunlight reflected off Earth onto the dark lunar face).'
  },
  {
    id: 'first_quarter',
    name: 'First Quarter',
    illumination: '50%',
    angleDeg: 90,
    description: 'Exactly half of the lunar disk facing Earth is illuminated by sunlight. The Moon has completed one-quarter of its 29.5-day synodic cycle.',
    fact: 'This is the best time for amateur telescope viewing because long shadows along the day/night line (terminator) make craters pop in 3D!'
  },
  {
    id: 'waxing_gibbous',
    name: 'Waxing Gibbous',
    illumination: '51% - 99%',
    angleDeg: 135,
    description: 'More than half of the visible disk is illuminated and continues to expand toward Full Moon.',
    fact: '"Gibbous" comes from the Latin word for humpbacked, referring to its rounded, convex shape.'
  },
  {
    id: 'full_moon',
    name: 'Full Moon',
    illumination: '100%',
    angleDeg: 180,
    description: 'Earth is between the Sun and the Moon. The entire side of the Moon facing Earth is brightly lit by direct sunlight.',
    fact: 'A lunar eclipse can only occur during a Full Moon when the Moon passes through Earth\'s shadow.'
  },
  {
    id: 'waning_gibbous',
    name: 'Waning Gibbous',
    illumination: '99% - 51%',
    angleDeg: 225,
    description: 'The illuminated portion begins shrinking ("waning") as the Moon travels around to the morning side of Earth.',
    fact: 'The illuminated fraction decreases every single night as darkness creeps across the lunar eastern limb.'
  },
  {
    id: 'third_quarter',
    name: 'Third Quarter (Last Quarter)',
    illumination: '50%',
    angleDeg: 270,
    description: 'Half of the Moon is illuminated once again, but this time on the opposite side (the left side for observers in the Northern Hemisphere).',
    fact: 'The Third Quarter Moon rises around midnight and is visible high in the sky during morning daylight.'
  },
  {
    id: 'waning_crescent',
    name: 'Waning Crescent',
    illumination: '49% - 1%',
    angleDeg: 315,
    description: 'A slender curve of light visible in the pre-dawn sky just before sunrise, completing the monthly orbit before cycling into New Moon.',
    fact: 'Also known as the "Old Moon", symbolizing the closing of the lunar month.'
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '~4.51 Billion BC',
    title: 'The Giant Impact Hypothesis (Theia)',
    tag: 'Origin',
    description: 'A Mars-sized protoplanet named Theia collides with young Earth. Debris ejected into orbit coalesces over mere weeks to form the Moon.',
    significance: 'Explains why the Moon has a tiny iron core and identical oxygen isotope signatures to Earth.',
    countryOrOrg: 'Solar System Genesis'
  },
  {
    year: '1609 AD',
    title: 'Galileo\'s First Telescope Observations',
    tag: 'Discovery',
    description: 'Galileo Galilei points his homemade 20x spyglass at the Moon and discovers that it is not a smooth ethereal sphere, but has towering mountains and vast valleys.',
    significance: 'Began the scientific era of observational astronomy and lunar mapping.',
    countryOrOrg: 'Padua, Italy'
  },
  {
    year: '1959',
    title: 'Luna 1, 2 & 3: First Robotic Pioneers',
    tag: 'Robotic',
    description: 'Soviet Luna 2 becomes the first human-made object to reach the lunar surface. Luna 3 snaps the historic first blurry photographs of the Moon\'s hidden far side.',
    significance: 'Revealed that the Far Side is completely different: almost no dark maria, covered in craters.',
    countryOrOrg: 'Soviet Space Program'
  },
  {
    year: '1969',
    title: 'Apollo 11: First Human Moon Landing',
    tag: 'Crewed',
    description: 'Astronauts Neil Armstrong and Buzz Aldrin land the Lunar Module "Eagle" at the Sea of Tranquility on July 20, 1969. "That\'s one small step for man, one giant leap for mankind."',
    significance: 'Over 650 million people watched live on television as humans walked on an extraterrestrial world for the first time.',
    countryOrOrg: 'NASA (United States)'
  },
  {
    year: '1970 - 1972',
    title: 'Apollo Lunar Roving Vehicles & Sample Returns',
    tag: 'Exploration',
    description: 'Apollo 15, 16, and 17 astronauts drive electric rovers across rugged mountains and bring home 382 kg of lunar rocks, core samples, and ancient breccias.',
    significance: 'Revolutionized geology and geochronology, proving the ancient lunar magma ocean.',
    countryOrOrg: 'NASA Apollo Program'
  },
  {
    year: '2009',
    title: 'LCROSS & LRO Discover Water Ice',
    tag: 'Science',
    description: 'NASA\'s Lunar Crater Observation and Sensing Satellite (LCROSS) intentionally impacts Cabeus Crater, detecting water vapor and ice crystals in the ejecta plume.',
    significance: 'Confirmed the presence of abundant volatiles at the poles, transforming lunar exploration plans forever.',
    countryOrOrg: 'NASA Ames Research'
  },
  {
    year: '2019',
    title: 'Chang\'e 4: First Far-Side Soft Landing',
    tag: 'Robotic',
    description: 'China successfully lands the Chang\'e 4 lander and Yutu-2 rover in Von Kármán crater inside the South Pole-Aitken basin using the Queqiao relay satellite.',
    significance: 'First landing on the lunar hemisphere that permanently faces away from Earth.',
    countryOrOrg: 'CNSA (China)'
  },
  {
    year: '2023',
    title: 'Chandrayaan-3: Historic South Pole Landing',
    tag: 'Robotic',
    description: 'ISRO\'s Vikram lander and Pragyan rover successfully execute a soft landing in the lunar high-latitude southern polar region, detecting sulfur in the soil.',
    significance: 'Made India the fourth country to achieve a soft lunar landing and the first to explore close to the South Pole.',
    countryOrOrg: 'ISRO (India)'
  },
  {
    year: '2026+',
    title: 'Artemis & Lunar Gateway Era',
    tag: 'Future',
    description: 'International Artemis accords and commercial partners establish the orbiting Gateway station and surface Artemis Base Camp for sustainable human presence.',
    significance: 'Laying the scientific and operational foundation for humanity\'s eventual mission to Mars.',
    countryOrOrg: 'NASA, ESA, JAXA, CSA & Global Partners'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'How strong is the Moon\'s surface gravity compared to Earth?',
    options: ['Equal to Earth', 'About 1/6th (16.6%) of Earth', 'About half (50%)', 'Zero gravity'],
    correctIndex: 1,
    explanation: 'The Moon\'s gravity is approximately 1.62 m/s², which is roughly one-sixth of Earth\'s 9.8 m/s². A 60 kg person feels like they weigh only 10 kg!',
    category: 'Gravity & Physics'
  },
  {
    id: 2,
    question: 'Why does the Moon have so many preserved craters compared to Earth?',
    options: [
      'Earth was never hit by asteroids',
      'The Moon has virtually no atmosphere or weather to erode craters',
      'The Moon is made of soft clay',
      'Craters are created by active alien machinery'
    ],
    correctIndex: 1,
    explanation: 'Earth has wind, water, plate tectonics, and a dense atmosphere that burns up small meteors and erodes craters over time. The Moon has no weather, preserving billions of years of impacts!',
    category: 'Lunar Geology'
  },
  {
    id: 3,
    question: 'What is the primary reason for the changing phases of the Moon as seen from Earth?',
    options: [
      'Earth casts a shadow on the Moon every single night',
      'Clouds in space block portions of the Moon',
      'As the Moon orbits Earth, we see different angles of its sunlit side',
      'The Moon turns its internal lights on and off'
    ],
    correctIndex: 2,
    explanation: 'The Moon does not emit its own light. As it circles Earth every month, the angle between the Sun, Earth, and Moon shifts, changing the portion of the illuminated hemisphere visible to us.',
    category: 'Moon Phases'
  },
  {
    id: 4,
    question: 'Where has substantial frozen water-ice been discovered on the Moon?',
    options: [
      'In liquid lakes near the lunar equator',
      'Deep inside Permanently Shadowed Regions (PSRs) at the poles',
      'Flowing down high mountains during summer',
      'There is absolutely no water anywhere on the Moon'
    ],
    correctIndex: 1,
    explanation: 'Ultra-cold craters at the lunar North and South poles never receive direct sunlight, keeping temperatures below -240°C where water ice remains frozen for billions of years.',
    category: 'Lunar Resources'
  },
  {
    id: 5,
    question: 'Which historic mission was the first to successfully land humans on the lunar surface?',
    options: ['Apollo 8', 'Apollo 11', 'Vostok 1', 'Artemis 1'],
    correctIndex: 1,
    explanation: 'Apollo 11 touched down on July 20, 1969, at Mare Tranquillitatis with astronauts Neil Armstrong and Buzz Aldrin.',
    category: 'Space Exploration'
  },
  {
    id: 6,
    question: 'What are the dark, smooth plains visible on the Moon called?',
    options: ['Maria (Seas)', 'Continents', 'Ice sheets', 'Canyon valleys'],
    correctIndex: 0,
    explanation: 'Early astronomers thought they were oceans of water, calling them "maria" (Latin for seas). They are actually ancient basaltic plains created by massive volcanic lava flows.',
    category: 'Lunar Geography'
  },
  {
    id: 7,
    question: 'What valuable clean energy isotope deposited by the solar wind is abundant in lunar soil?',
    options: ['Uranium-235', 'Helium-3', 'Plutonium-239', 'Petroleum'],
    correctIndex: 1,
    explanation: 'Helium-3 could provide safe, non-radioactive nuclear fusion fuel. Because the Moon lacks a magnetic field, the solar wind has deposited Helium-3 into its regolith for billions of years.',
    category: 'Lunar Resources'
  },
  {
    id: 8,
    question: 'How long does it take for the Moon to rotate once on its axis compared to its orbit around Earth?',
    options: [
      'It rotates in 24 hours just like Earth',
      'It takes the exact same time: ~27.3 days (tidal locking)',
      'The Moon does not rotate at all',
      'It rotates every 12 months'
    ],
    correctIndex: 1,
    explanation: 'Tidal locking (synchronous rotation) means the Moon rotates once on its axis in the exact same time it takes to orbit Earth. This is why the same side always faces Earth!',
    category: 'Moon Facts'
  },
  {
    id: 9,
    question: 'What is the approximate daytime temperature in direct sunlight on the lunar equator?',
    options: ['0°C (Freezing)', '+25°C (Room temperature)', '+120°C (Hotter than boiling water)', '+1,000°C'],
    correctIndex: 2,
    explanation: 'Without an atmosphere to diffuse heat, equatorial daytime temperatures soar to over +120°C (+250°F), while plunging to -130°C (-200°F) during the lunar night.',
    category: 'Science & Environment'
  },
  {
    id: 10,
    question: 'Which lunar crater is famous for its massive bright ray system stretching over 1,500 km?',
    options: ['Tycho Crater', 'Gale Crater', 'Valles Marineris', 'Olympus Mons'],
    correctIndex: 0,
    explanation: 'Tycho Crater, located in the southern highlands, is a young impact crater with brilliant white rays of pulverized rock radiating thousands of kilometers across the lunar surface.',
    category: 'Lunar Geography'
  },
  {
    id: 11,
    question: 'Why are scientists designing radio telescopes to be placed on the FAR SIDE of the Moon?',
    options: [
      'It is closer to Mars',
      'It is completely shielded from Earth\'s artificial radio and cellphone noise',
      'It has warmer weather',
      'Radio waves travel faster in lunar rocks'
    ],
    correctIndex: 1,
    explanation: 'The bulk of the Moon blocks all electromagnetic interference, TV, and radar chatter from Earth, making the Far Side the quietest radio environment in the inner Solar System.',
    category: 'Science & Missions'
  },
  {
    id: 12,
    question: 'What is the leading scientific theory for how the Moon was formed ~4.5 billion years ago?',
    options: [
      'The Moon was captured from another solar system',
      'A Mars-sized protoplanet (Theia) collided with the early molten Earth',
      'The Moon was created by an exploding comet',
      'Earth split into two equal halves'
    ],
    correctIndex: 1,
    explanation: 'The Giant Impact Hypothesis states that a Mars-sized planetesimal named Theia collided with early Earth. The vaporized debris formed an orbital ring that rapidly gathered into our Moon.',
    category: 'Origin of the Moon'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'lunar_pioneer',
    title: 'Lunar Pioneer',
    description: 'Begin your journey across the lunar surface.',
    icon: '🧭',
    unlocked: true,
    xp: 100
  },
  {
    id: 'first_launch',
    title: 'First Launch',
    description: 'Plan and execute your first Moon mission in the Simulator.',
    icon: '🚀',
    unlocked: false,
    xp: 250
  },
  {
    id: 'moon_explorer',
    title: 'Moon Explorer',
    description: 'Inspect 3 or more geological locations on the interactive Moon Map.',
    icon: '🌙',
    unlocked: false,
    xp: 150
  },
  {
    id: 'rover_commander',
    title: 'Rover Commander',
    description: 'Drive the lunar rover and complete exploration surface objectives.',
    icon: '🤖',
    unlocked: false,
    xp: 200
  },
  {
    id: 'lunar_scientist',
    title: 'Lunar Scientist',
    description: 'Run experiments in both the Gravity and Crater laboratories.',
    icon: '🔬',
    unlocked: false,
    xp: 200
  },
  {
    id: 'ice_hunter',
    title: 'Ice Hunter',
    description: 'Investigate Water Ice resources and Polar Cold Traps.',
    icon: '💧',
    unlocked: false,
    xp: 180
  },
  {
    id: 'history_buff',
    title: 'History Buff',
    description: 'Explore historical missions from Apollo 11 to Chandrayaan-3 and Artemis.',
    icon: '📜',
    unlocked: false,
    xp: 150
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Complete the Mission Knowledge Check astronaut exam.',
    icon: '🏆',
    unlocked: false,
    xp: 300
  }
];

export const INITIAL_ACHIEVEMENTS = ACHIEVEMENTS;

import argon2 from "argon2";
import { 
  Campaign, 
  Country, 
  Role, 
  Specie, 
  Tree, 
  User, 
  Order, 
  OrderLine, 
  sequelize 
} from "../../models/index.js";

try {
  // 1. Seed Roles
  console.log("🌱 Seeding roles...");
  const roles = await Role.bulkCreate([
    { name: "admin" },
    { name: "user" },
    { name: "partner" }
  ]);

  // 2. Seed Countries
  console.log("🌱 Seeding countries...");
  const countries = await Country.bulkCreate([
    { name: "France" },
    { name: "Madagascar" },
    { name: "Sénégal" },
    { name: "Brésil" },
    { name: "Indonésie" },
    { name: "Kenya" },
    { name: "Pérou" },
    { name: "Philippines" },
    { name: "Canada" },
    { name: "Australie" },
    { name: "Nouvelle-Zélande" }
  ]);

  // 3. Seed Species
  console.log("🌱 Seeding species...");
  const species = await Specie.bulkCreate([
    { 
      name: "Chêne",
      description: "Arbre robuste et majestueux, symbole de force et de longévité. Idéal pour la reforestation en climat tempéré. Le chêne est également un habitat crucial pour de nombreuses espèces animales. Le bois de chêne est très prisé en menuiserie et construction. Un chêne mature peut absorber jusqu'à 48 kg de CO2 par an."
    },
    { 
      name: "Baobab",
      description: "Arbre emblématique de Madagascar, capable de stocker de grandes quantités d'eau dans son tronc. Essentiel pour les écosystèmes arides. Le baobab est souvent appelé 'l'arbre de vie' en raison de ses multiples usages, y compris la nourriture, le bois et les fibres. Il peut vivre plusieurs milliers d'années et joue un rôle clé dans la culture locale. Un baobab peut stocker jusqu'à 200 kg de CO2 par an."
    },
    { 
      name: "Acacia",
      description: "Arbre résistant à la sécheresse, parfait pour la lutte contre la désertification en Afrique. Fournit de l'ombre et améliore la fertilité du sol grâce à la fixation de l'azote. Les acacias sont également une source importante de nectar pour les abeilles, contribuant ainsi à la pollinisation. Le bois d'acacia est utilisé pour la fabrication de meubles et d'outils. Un acacia peut absorber jusqu'à 30 kg de CO2 par an."
    },
    { 
      name: "Eucalyptus",
      description: "Arbre à croissance rapide, excellent pour la production de bois et la restauration des sols. Il est également connu pour ses propriétés médicinales et son huile essentielle. Cependant, il est important de gérer les plantations d'eucalyptus de manière durable, car elles peuvent consommer beaucoup d'eau et affecter la biodiversité locale. Un eucalyptus mature peut absorber jusqu'à 40 kg de CO2 par an."
    },
    { 
      name: "Mangrove",
      description: "Écosystème crucial pour la protection côtière et la biodiversité marine tropicale. Les mangroves jouent un rôle clé dans la lutte contre l'érosion et servent d'habitat à de nombreuses espèces. Leur capacité à séquestrer le carbone est exceptionnelle, contribuant ainsi à la lutte contre le changement climatique. Un hectare de mangrove peut stocker jusqu'à 1 000 tonnes de CO2."
    },
    { 
      name: "Cèdre",
      description: "Conifère noble résistant aux intempéries, utilisé traditionnellement en construction. Son bois est durable et résistant aux insectes, ce qui en fait un choix privilégié pour les charpentes et les meubles. Le cèdre est également apprécié pour son parfum agréable et ses propriétés antifongiques. Un cèdre mature peut absorber jusqu'à 35 kg de CO2 par an."
    },
    { 
      name: "Teck",
      description: "Bois précieux tropical, très recherché pour sa résistance et sa beauté. Il est souvent utilisé dans la fabrication de meubles haut de gamme et de parquets. Le teck est également durable face aux conditions climatiques difficiles, ce qui en fait un choix idéal pour les constructions extérieures. Un teck mature peut absorber jusqu'à 45 kg de CO2 par an."
    },
    { 
      name: "Pin",
      description: "Conifère polyvalent, adapté à de nombreux climats et utilisations. Son bois est léger et résistant, ce qui en fait un choix populaire pour la construction et la fabrication de meubles. Un pin mature peut absorber jusqu'à 25 kg de CO2 par an."
    },
    { 
      name: "Sapin",
      description: "Conifère emblématique des régions froides, souvent utilisé comme arbre de Noël. Son bois est apprécié pour sa légèreté et sa facilité de travail. Un sapin mature peut absorber jusqu'à 30 kg de CO2 par an."
    },
    { 
      name: "Séquoia",
      description: "Arbre géant d'Amérique du Nord, symbole de grandeur et de longévité. Les séquoias sont parmi les plus grands et les plus anciens arbres du monde. Ils jouent un rôle crucial dans la séquestration du carbone, avec un seul arbre capable d'absorber jusqu'à 50 kg de CO2 par an."
    },
    { 
      name: "Acajou du Brésil",
      description: "Grand arbre de la forêt amazonienne, utilisé pour son bois précieux. Joue un rôle écologique majeur..."
    },
    { 
      name: "Acajou d'Amazonie",
      description: "Variante d'acajou présente dans la forêt amazonienne, importante pour la biodiversité..."
    },
  ]);

  // 4. Seed Campaigns
  console.log("🌱 Seeding campaigns...");
  const campaigns = await Campaign.bulkCreate([
    {
      name: "Reforestation Amazonie 2024",
      description: "Campagne de reforestation dans la forêt amazonienne pour lutter contre la déforestation et préserver la biodiversité.",
      begin_date: new Date("2024-01-15"),
      end_date: new Date("2026-01-31"),
      image: "https://cdn.futura-sciences.com/cdn-cgi/image/width=1920,quality=60,format=auto/sources/images/foret-amazonie.sequestration-puit-carbone-co2.jpg",
      country_id: countries.find(c => c.name === "Brésil").id
    },
    {
      name: "Sauvons les Baobabs de Madagascar",
      description: "Protection et plantation de baobabs endémiques de Madagascar, menacés par le changement climatique.",
      begin_date: new Date("2024-03-01"),
      end_date: new Date("2026-12-28"),
      image: "https://www.thetravelmagazine.net/wp-content/uploads/Sunset-at-All%C3%A9e-des-Baobabs.jpg",
      country_id: countries.find(c => c.name === "Madagascar").id
    },
    {
      name: "Forêts du Sénégal",
      description: "Lutte contre la désertification au Sénégal par la plantation d'acacias et d'autres espèces résistantes.",
      begin_date: new Date("2024-06-01"),
      end_date: new Date("2026-11-30"),
      image: "https://img.olympics.com/images/image/private/t_original_1392-auto/f_auto/primary/yuroaluxj1dm8g5byebt",
      country_id: countries.find(c => c.name === "Sénégal").id
    },
    {
      name: "Mangroves d'Indonésie",
      description: "Restauration des écosystèmes de mangroves pour protéger les côtes indonésiennes.",
      begin_date: "2024-04-01",
      end_date: "2026-03-31",
      image: "https://s7d1.scene7.com/is/image/wbcollab/mangrove_green_belt:1140x500?qlt=90&fmt=webp&resMode=sharp2",
      country_id: countries.find(c => c.name === "Indonésie").id
    },
    {
      name: "Reforestation Kenya",
      description: "Plantation d'arbres indigènes au Kenya pour restaurer les écosystèmes forestiers.",
      begin_date: new Date("2025-02-01"),
      end_date: new Date("2026-09-30"),
      image: "https://www.pamojatoursandtravel.us/wp-content/uploads/2025/05/Mt-Kenya-N.P-scaled.jpg",
      country_id: countries.find(c => c.name === "Kenya").id
    },
    {
      name: "Forêts Françaises",
      description: "Diversification des forêts françaises avec des espèces adaptées au changement climatique.",
      begin_date: new Date("2024-10-01"),
      end_date: new Date("2026-09-30"),
      image: "https://static.nationalgeographic.fr/files/styles/image_3200/public/1foret-landaise-fougere.webp?w=1600&h=1067&q=100",
      country_id: countries.find(c => c.name === "France").id
    },
    {
      name: "Reforestation des Philippines",
      description: "Lutte contre la déforestation aux Philippines par la plantation d'espèces locales.",
      begin_date: new Date("2024-05-01"),
      end_date: new Date("2026-04-30"),
      image: "https://www.echappees-philippines.com/uploads/sites/10/2024/04/faune-philippines.jpeg",
      country_id: countries.find(c => c.name === "Philippines").id
    },
    {
      name: "Forêts Canadiennes",
      description: "Reforestation des forêts boréales du Canada et campagne de protection et prévention.",
      begin_date: "2024-03-15",
      end_date: "2026-03-14",
      image: "https://imagescloud.s3.amazonaws.com/images/medias/blogue/itineraire-peche-galerie-2.jpg",
      country_id: countries.find(c => c.name === "Canada").id
    },
    {
      name: "Reforestation Australie",
      description: "Restauration des forêts dégradées en Australie suite aux divers incendies.",
      begin_date: "2025-07-01",
      end_date: "2026-06-30",
      image: "https://assets.evcdn.net/pim-assets-images/75329/5e4faf696dfb4.jpeg",
      country_id: countries.find(c => c.name === "Australie").id
    },
    {
      name: "Forêts de Nouvelle-Zélande",
      description: "Plantation d'arbres indigènes pour préserver la biodiversité unique de la Nouvelle-Zélande.",
      begin_date: "2026-08-01",
      end_date: "2027-07-31",
      image: "https://shoesyourpath.com/wp-content/uploads/2014/12/hamurana-springs-rotorua-nouvelle-zelande.jpg",
      country_id: countries.find(c => c.name === "Nouvelle-Zélande").id
    }
  ]);

  // 5. Seed Trees
  console.log("🌱 Seeding trees...");
  const trees = await Tree.bulkCreate([
    // Arbres pour l'Amazonie
    {
      name: "Acajou du Brésil",
      latin_name: "Swietenia macrophylla",
      price: 2500,
      quantity: 400,
      stock: 500,
      image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Cashew_Brazil_tree.jpg",
      specie_id: species.find(s => s.name === "Acajou du Brésil").id,
      campaign_id: campaigns.find(c => c.name === "Reforestation Amazonie 2024").id
    },
    {
      name: "Acajou d'Amazonie",
      latin_name: "Swietenia macrophylla",
      price: 3000,
      quantity: 145,
      stock: 300,
      image: "https://www.guidesulysse.com/imageswebp/destinations/iStock-1307617103.webp",
      specie_id: species.find(s => s.name === "Acajou d'Amazonie").id,
      campaign_id: campaigns.find(c => c.name === "Reforestation Amazonie 2024").id
    },
    // Arbres pour Madagascar
    {
      name: "Grand Baobab",
      latin_name: "Adansonia grandidieri",
      price: 5000,
      quantity: 100,
      stock: 100,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Adansonia_grandidieri04.jpg/1024px-Adansonia_grandidieri04.jpg",
      specie_id: species.find(s => s.name === "Baobab").id,
      campaign_id: campaigns.find(c => c.name === "Sauvons les Baobabs de Madagascar").id
    },
    {
      name: "Baobab de Fony",
      latin_name: "Adansonia rubrostipa",
      price: 4500,
      quantity: 72,
      stock: 80,
      image: "https://bugwoodcloud.org/images/3072x2048/5569030.jpg",
      specie_id: species.find(s => s.name === "Baobab").id,
      campaign_id: campaigns.find(c => c.name === "Sauvons les Baobabs de Madagascar").id
    },
    // Arbres pour le Sénégal
    {
      name: "Acacia du Sénégal",
      latin_name: "Acacia senegal",
      price: 1500,
      quantity: 100,
      stock: 1000,
      image: "https://seedsplants.eu/wp-content/uploads/2024/12/akacja_senegalska_roslina.jpg",
      specie_id: species.find(s => s.name === "Acacia").id,
      campaign_id: campaigns.find(c => c.name === "Forêts du Sénégal").id
    },
    {
      name: "Acacia albida",
      latin_name: "Faidherbia albida",
      price: 1800,
      quantity: 344,
      stock: 800,
      image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Sprawling_boughs_of_the_White_Acacia.jpg",
      specie_id: species.find(s => s.name === "Acacia").id,
      campaign_id: campaigns.find(c => c.name === "Forêts du Sénégal").id
    },
    // Arbres pour l'Indonésie
    {
      name: "Palétuvier rouge",
      latin_name: "Rhizophora mangle",
      price: 2000,
      quantity: 600,
      stock: 600,
      image : "https://www.aquariumbiarritz.com/wp-content/uploads/2025/06/paletuvier-rouge.jpg",
      specie_id: species.find(s => s.name === "Mangrove").id,
      campaign_id: campaigns.find(c => c.name === "Mangroves d'Indonésie").id
    },
    {
      name: "Palétuvier noir",
      latin_name: "Avicennia germinans",
      price: 2200,
      quantity: 200,
      stock: 400,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tall-stilted_Mangrove_%28Rhizophora_mucronata%29_%289734173658%29.jpg/1920px-Tall-stilted_Mangrove_%28Rhizophora_mucronata%29_%289734173658%29.jpg",
      specie_id: species.find(s => s.name === "Mangrove").id,
      campaign_id: campaigns.find(c => c.name === "Mangroves d'Indonésie").id
    },
    // Arbres pour le Kenya
    {
      name: "Eucalyptus du Kenya",
      latin_name: "Eucalyptus saligna",
      price: 1200,
      quantity: 1025,
      stock: 1200,
      image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Sydney_Blue_Gum_%28E.saligna%29.jpg",
      specie_id: species.find(s => s.name === "Eucalyptus").id,
      campaign_id: campaigns.find(c => c.name === "Reforestation Kenya").id
    },
    {
      name: "Acacia du Kenya",
      latin_name: "Acacia melanoxylon",
      price: 1400,
      quantity: 450,
      stock: 900,
      image: "https://www.monumentaltrees.com/db/12/600/12361.jpg",
      specie_id: species.find(s => s.name === "Acacia").id,
      campaign_id: campaigns.find(c => c.name === "Reforestation Kenya").id
    },
    // Arbres pour la France
    {
      name: "Chêne pédonculé",
      latin_name: "Quercus robur",
      price: 3500,
      quantity: 325,
      stock: 400,
      image: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Quercus_robur_JPG_%28d1%29.jpg",
      specie_id: species.find(s => s.name === "Chêne").id,
      campaign_id: campaigns.find(c => c.name === "Forêts Françaises").id
    },
    {
      name: "Pin sylvestre",
      latin_name: "Pinus sylvestris",
      price: 2800,
      quantity: 600,
      stock: 600,
      image: "https://upload.wikimedia.org/wikipedia/commons/5/52/Pinus_sylvestris_Nethybridge.jpg",
      specie_id: species.find(s => s.name === "Pin").id,
      campaign_id: campaigns.find(c => c.name === "Forêts Françaises").id
    },
    {
      name: "Sapin de Douglas",
      latin_name: "Pseudotsuga menziesii",
      price: 3200,
      quantity: 375,
      stock: 500,
      image: "https://www.guidesulysse.com/imageswebp/destinations/DouglasiStock_000016871246_Large.webp",
      specie_id: species.find(s => s.name === "Sapin").id,
      campaign_id: campaigns.find(c => c.name === "Forêts Françaises").id
    },
    // Arbres pour les Philippines
    {
      name: "Teck des Philippines",
      latin_name: "Tectona philippinensis",
      price: 4000,
      quantity: 180,
      stock: 300,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Philippine_Teak_%28Tectona_philippinensis%29--an_endangered_and_endemic_tree_02.jpg/800px-Philippine_Teak_%28Tectona_philippinensis%29--an_endangered_and_endemic_tree_02.jpg",
      specie_id: species.find(s => s.name === "Teck").id,
      campaign_id: campaigns.find(c => c.name === "Reforestation des Philippines").id
    },
    {
      name: "Acacia mangium",
      latin_name: "Acacia mangium",
      price: 1600,
      quantity: 700,
      stock: 700,
      image: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Tree_in_Kolkata_W_IMG_4582.jpg",
      specie_id: species.find(s => s.name === "Acacia").id,
      campaign_id: campaigns.find(c => c.name === "Reforestation des Philippines").id
    },
    // Arbres pour le Canada
    {
      name: "Érable à sucre",
      latin_name: "Acer saccharum",
      price: 3800,
      quantity: 275,
      stock: 450,
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Sugar_Maple-Acer_saccharum-Comfort_Maple_Conservation_Area-Town_of_Pelham-Ontario-OHAR5725-20221023_%281%29.jpg",
      specie_id: species.find(s => s.name === "Chêne").id,
      campaign_id: campaigns.find(c => c.name === "Forêts Canadiennes").id
    },
    {
      name: "Sapin baumier",
      latin_name: "Abies balsamea",
      price: 3400,
      quantity: 225,
      stock: 550,
      image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Abies_balsamea1.jpg",
      specie_id: species.find(s => s.name === "Sapin").id,
      campaign_id: campaigns.find(c => c.name === "Forêts Canadiennes").id
    },
    // Arbres pour l'Australie
    {
      name: "Eucalyptus arc-en-ciel",
      latin_name: "Eucalyptus deglupta",
      price: 2900,
      quantity: 520,
      stock: 650,
      image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Rainbow_Eucalyptus.jpg",
      specie_id: species.find(s => s.name === "Eucalyptus").id,
      campaign_id: campaigns.find(c => c.name === "Reforestation Australie").id
    },
  ]);

  // 6. Seed Users
  console.log("🌱 Seeding users...");
  const users = await User.bulkCreate([
    {
      firstname: "Admin",
      lastname: "GreenRoots",
      mail: "admin@greenroots.com",
      password: await argon2.hash("admin123!"),
      address_number: "123",
      address_streetname: "Rue de la Forêt",
      postal_code: "75001",
      city: "Paris",
      phone_number: "+33123456789",
      role_id: roles.find(r => r.name === "admin").id
    },
    {
      firstname: "Tony",
      lastname: "Saes",
      mail: "tony.saes@email.com",
      password: await argon2.hash("Tony123!"),
      address_number: "45",
      address_streetname: "Avenue des Arbres",
      postal_code: "69000",
      city: "Lyon",
      phone_number: "+33987654321",
      role_id: roles.find(r => r.name === "admin").id
    },
    {
      firstname: "Manuel",
      lastname: "Andreolle",
      mail: "manuel.andreolle@email.com",
      password: await argon2.hash("Manuel123!"),
      address_number: "78",
      address_streetname: "Boulevard Vert",
      postal_code: "13000",
      city: "Marseille",
      phone_number: "+33456789123",
      role_id: roles.find(r => r.name === "admin").id
    },
    {
      firstname: "Sebastien",
      lastname: "Arantes",
      mail: "sebastien.arantes@email.com",
      password: await argon2.hash("Sebastien123!"),
      address_number: "12",
      address_streetname: "Place de la Nature",
      postal_code: "33000",
      city: "Bordeaux",
      phone_number: "+33789123456",
      role_id: roles.find(r => r.name === "admin").id
    },
    {
      firstname: "Maxime",
      lastname: "Guibert",
      mail: "maxime.guibert@email.com",
      password: await argon2.hash("Maxime123!"),
      address_number: "56",
      address_streetname: "Rue de l'Environnement",
      postal_code: "59000",
      city: "Lille",
      phone_number: "+33321654987",
      role_id: roles.find(r => r.name === "admin").id
    },
    {
      firstname: "Anthony",
      lastname: "Joachim",
      mail: "anthony.joachim@email.com",
      password: await argon2.hash("Anthony123!"),
      address_number: "89",
      address_streetname: "Allée des Chênes",
      postal_code: "31000",
      city: "Toulouse",
      phone_number: "+33654987321",
      role_id: roles.find(r => r.name === "admin").id
    },
    {
      firstname: "Marie",
      lastname: "Dubois",
      mail: "marie.dubois@email.com",
      password: await argon2.hash("Marie123!"),
      address_number: "12",
      address_streetname: "Rue de la Paix",
      postal_code: "75002",
      city: "Paris",
      phone_number: "+33123456780",
      role_id: roles.find(r => r.name === "user").id
    },
    {
      firstname: "Pierre",
      lastname: "Martin",
      mail: "pierre.martin@email.com",
      password: await argon2.hash("Pierre123!"),
      address_number: "34",
      address_streetname: "Rue de la Liberté",
      postal_code: "75003",
      city: "Paris",
      phone_number: "+33123456789",
      role_id: roles.find(r => r.name === "user").id
    }
  ]);

  // 7. Seed Orders
  console.log("🌱 Seeding orders...");
  const orders = await Order.bulkCreate([
    {
      order_number: "GR-2024-001",
      total_price: 125000,
      user_id: users.find(u => u.mail === "marie.dubois@email.com").id
    },
    {
      order_number: "GR-2024-002",
      total_price: 84000,
      user_id: users.find(u => u.mail === "pierre.martin@email.com").id
    },
    {
      order_number: "GR-2024-003",
      total_price: 210000,
      user_id: users.find(u => u.mail === "tony.saes@email.com").id
    },
    {
      order_number: "GR-2024-004",
      total_price: 56000,
      user_id: users.find(u => u.mail === "anthony.joachim@email.com").id
    },
    {
      order_number: "GR-2024-005",
      total_price: 168000,
      user_id: users.find(u => u.mail === "marie.dubois@email.com").id
    }
  ]);

  // 8. Seed Order Lines
  console.log("🌱 Seeding order lines...");
  await OrderLine.bulkCreate([
    // Commande 1 - Marie Dubois
    {
      tree_name: "Chêne pédonculé",
      quantity: 10,
      unit_price: 3500,
      total_price: 35000,
      order_id: orders.find(o => o.order_number === "GR-2024-001").id,
      tree_id: trees.find(t => t.name === "Chêne pédonculé").id
    },
    {
      tree_name: "Acacia du Sénégal",
      quantity: 60,
      unit_price: 1500,
      total_price: 90000,
      order_id: orders.find(o => o.order_number === "GR-2024-001").id,
      tree_id: trees.find(t => t.name === "Acacia du Sénégal").id
    },
    // Commande 2 - Pierre Martin
    {
      tree_name: "Pin sylvestre",
      quantity: 20,
      unit_price: 2800,
      total_price: 56000,
      order_id: orders.find(o => o.order_number === "GR-2024-002").id,
      tree_id: trees.find(t => t.name === "Pin sylvestre").id
    },
    {
      tree_name: "Eucalyptus du Kenya",
      quantity: 20,
      unit_price: 1200,
      total_price: 24000,
      order_id: orders.find(o => o.order_number === "GR-2024-002").id,
      tree_id: trees.find(t => t.name === "Eucalyptus du Kenya").id
    },
    {
      tree_name: "Palétuvier rouge",
      quantity: 2,
      unit_price: 2000,
      total_price: 4000,
      order_id: orders.find(o => o.order_number === "GR-2024-002").id,
      tree_id: trees.find(t => t.name === "Palétuvier rouge").id
    },
    // Commande 3 - Tony Saes
    {
      tree_name: "Grand Baobab",
      quantity: 2,
      unit_price: 5000,
      total_price: 10000,
      order_id: orders.find(o => o.order_number === "GR-2024-003").id,
      tree_id: trees.find(t => t.name === "Grand Baobab").id
    },
    {
      tree_name: "Acajou du Brésil",
      quantity: 80,
      unit_price: 2500,
      total_price: 200000,
      order_id: orders.find(o => o.order_number === "GR-2024-003").id,
      tree_id: trees.find(t => t.name === "Acajou du Brésil").id
    },
    // Commande 4 - Anthony Joachim
    {
      tree_name: "Acacia du Kenya",
      quantity: 40,
      unit_price: 1400,
      total_price: 56000,
      order_id: orders.find(o => o.order_number === "GR-2024-004").id,
      tree_id: trees.find(t => t.name === "Acacia du Kenya").id
    },
    // Commande 5 - Marie Dubois (2ème commande)
    {
      tree_name: "Chêne pédonculé",
      quantity: 30,
      unit_price: 3000,
      total_price: 90000,
      order_id: orders.find(o => o.order_number === "GR-2024-005").id,
      tree_id: trees.find(t => t.name === "Chêne pédonculé").id
    },
    {
      tree_name: "Baobab de Fony",
      quantity: 15,
      unit_price: 4500,
      total_price: 67500,
      order_id: orders.find(o => o.order_number === "GR-2024-005").id,
      tree_id: trees.find(t => t.name === "Baobab de Fony").id
    },
    {
      tree_name: "Acacia albida",
      quantity: 5,
      unit_price: 1800,
      total_price: 9000,
      order_id: orders.find(o => o.order_number === "GR-2024-005").id,
      tree_id: trees.find(t => t.name === "Acacia albida").id
    },
    {
      tree_name: "Palétuvier noir",
      quantity: 1,
      unit_price: 2200,
      total_price: 2200,
      order_id: orders.find(o => o.order_number === "GR-2024-005").id,
      tree_id: trees.find(t => t.name === "Palétuvier noir").id
    }
  ]);

  // 9. Seed favorite trees (Many-to-Many relationship)
  console.log("🌱 Seeding favorite trees...");
  const marieUser = users.find(u => u.mail === "marie.dubois@email.com");
  const pierreUser = users.find(u => u.mail === "pierre.martin@email.com");
  const tonyUser = users.find(u => u.mail === "tony.saes@email.com");
  const anthonyUser = users.find(u => u.mail === "anthony.joachim@email.com");

  // Marie aime les baobabs et les chênes
  await trees.find(t => t.name === "Grand Baobab").addWishers([marieUser]);
  await trees.find(t => t.name === "Baobab de Fony").addWishers([marieUser]);
  await trees.find(t => t.name === "Chêne pédonculé").addWishers([marieUser]);

  // Pierre aime les arbres tropicaux
  await trees.find(t => t.name === "Palétuvier rouge").addWishers([pierreUser]);
  await trees.find(t => t.name === "Acajou du Brésil").addWishers([pierreUser]);
  await trees.find(t => t.name === "Acacia du Kenya").addWishers([pierreUser, anthonyUser]); // Anthony aussi

  // Tony aime les acacias
  await trees.find(t => t.name === "Acacia du Sénégal").addWishers([tonyUser]);
  await trees.find(t => t.name === "Acacia albida").addWishers([tonyUser]);
  await trees.find(t => t.name === "Acacia du Kenya").addWishers([tonyUser, anthonyUser]); // Anthony aussi

  // Anthony aime les conifères
  await trees.find(t => t.name === "Pin sylvestre").addWishers([anthonyUser]);

  console.log("✅ Database seeded successfully!");
  console.log(`📊 Seeded data summary:
    - ${roles.length} roles
    - ${countries.length} countries  
    - ${species.length} species
    - ${campaigns.length} campaigns
    - ${trees.length} trees
    - ${users.length} users
    - ${orders.length} orders
    - Multiple order lines and favorite trees relationships`);

  console.log("🎉 Seeding completed successfully");
  await sequelize.close();
} catch (error) {
  console.error("❌ Error seeding database:", error);
  throw error;
}

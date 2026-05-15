const rooms = [
  {
    id: "kitchen",
    title: "Kitchen",
    letter: "K",
    image: "assets/rooms/kitchen.jpg",
    accent: "#d99b47",
    soft: "#fff0d0",
    items: [
      ["refrigerator", "fridge"],
      ["oven", "oven"],
      ["sink", "sink"],
      ["faucet", "faucet"],
      ["cabinet", "cabinet"],
      ["kettle", "kettle"],
      ["pot", "pot"],
      ["frying pan", "pan"],
      ["knife", "knife"],
      ["cutting board", "board"],
      ["plate", "plate"],
      ["cup", "cup"],
      ["spoon", "spoon"],
      ["dining table", "table"],
      ["chair", "chair"],
      ["microwave", "microwave"],
      ["bowl", "bowl"],
      ["blender", "blender"],
      ["toaster", "toaster"],
      ["trash can", "trash"]
    ]
  },
  {
    id: "drawingroom",
    title: "Drawingroom",
    letter: "D",
    image: "assets/rooms/drawingroom.jpg",
    accent: "#6fa7ca",
    soft: "#e7f4fb",
    items: [
      ["photo", "photo"],
      ["plug", "plug"],
      ["radiator", "radiator"],
      ["remote control", "remote"],
      ["rug", "rug"],
      ["screen", "television"],
      ["shoe rack", "shoeRack"],
      ["smart television", "television"],
      ["socket", "socket"],
      ["soda", "soda"],
      ["sofa", "sofa"],
      ["stairs", "stairs"],
      ["teabag", "teabag"],
      ["telephone", "telephone"],
      ["throw pillow", "pillow"],
      ["tissue", "tissue"],
      ["trash can", "trash"],
      ["vase", "vase"],
      ["video game", "videoGame"],
      ["wall", "wall"],
      ["wallpaper", "wallpaper"],
      ["window seat", "windowSeat"],
      ["window", "window"]
    ]
  },
  {
    id: "bedroom",
    title: "Bedroom",
    letter: "B",
    image: "assets/rooms/bedroom.jpg",
    accent: "#cc7f82",
    soft: "#fde9ea",
    items: [
      ["bed", "bed"],
      ["pillow", "pillow"],
      ["blanket", "blanket"],
      ["wardrobe", "wardrobe"],
      ["mirror", "mirror"],
      ["lamp", "lamp"],
      ["nightstand", "nightstand"],
      ["dresser", "dresser"],
      ["clock", "clock"],
      ["curtain", "curtain"],
      ["window", "window"],
      ["carpet", "rug"],
      ["hanger", "hanger"],
      ["desk", "desk"],
      ["chair", "chair"],
      ["bookshelf", "bookshelf"],
      ["slippers", "slippers"],
      ["quilt", "quilt"]
    ]
  }
].map((room) => ({
  ...room,
  items: room.items.map(([name, icon]) => ({ name, icon }))
}));

const homeView = document.querySelector("#homeView");
const detailView = document.querySelector("#detailView");
const carouselStage = document.querySelector("#carouselStage");
const roomDots = document.querySelector("#roomDots");
const roomTitle = document.querySelector("#roomTitle");
const roomBadge = document.querySelector("#roomBadge");
const roomTabs = document.querySelector("#roomTabs");
const itemsGrid = document.querySelector("#itemsGrid");

let activeIndex = 0;
let activeRoomId = rooms[0].id;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderCarousel() {
  carouselStage.innerHTML = rooms
    .map((room, index) => {
      const offset = (index - activeIndex + rooms.length) % rooms.length;
      const position = offset === 0 ? "is-active" : offset === 1 ? "is-next" : "is-prev";

      return `
        <button class="room-card ${position}" type="button" data-room="${room.id}" aria-label="Open ${room.title}">
          <img src="${room.image}" alt="${room.title}" />
          <span class="room-card-label">
            <strong>${room.title}</strong>
            <span aria-hidden="true">${room.letter}</span>
          </span>
        </button>
      `;
    })
    .join("");

  carouselStage.querySelectorAll(".room-card").forEach((card) => {
    card.addEventListener("click", () => openRoom(card.dataset.room));
  });

  roomDots.innerHTML = rooms
    .map(
      (room, index) => `
        <button
          class="dot-button ${index === activeIndex ? "is-active" : ""}"
          type="button"
          data-index="${index}"
          aria-label="Show ${room.title}"
        ></button>
      `
    )
    .join("");

  roomDots.querySelectorAll(".dot-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeIndex = Number(button.dataset.index);
      renderCarousel();
    });
  });
}

function moveCarousel(step) {
  activeIndex = (activeIndex + step + rooms.length) % rooms.length;
  renderCarousel();
}

function openRoom(roomId) {
  const index = rooms.findIndex((room) => room.id === roomId);
  if (index === -1) return;

  activeIndex = index;
  activeRoomId = roomId;
  homeView.hidden = true;
  detailView.hidden = false;
  renderRoom(roomId);
  history.replaceState(null, "", `#${roomId}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backHome() {
  detailView.hidden = true;
  homeView.hidden = false;
  renderCarousel();
  document.title = "Home Vocabulary";
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

function renderRoom(roomId) {
  const room = rooms.find((entry) => entry.id === roomId);
  if (!room) return;

  activeRoomId = room.id;
  roomTitle.textContent = room.title;
  roomBadge.innerHTML = roomBadgeSvg(room);
  document.title = `${room.title} | Home Vocabulary`;

  roomTabs.innerHTML = rooms
    .map(
      (entry) => `
        <button
          class="tab-button ${entry.id === room.id ? "is-active" : ""}"
          type="button"
          data-room="${entry.id}"
          aria-label="${entry.title}"
          title="${entry.title}"
        >${entry.letter}</button>
      `
    )
    .join("");

  roomTabs.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      const nextRoom = button.dataset.room;
      const nextIndex = rooms.findIndex((entry) => entry.id === nextRoom);
      activeIndex = nextIndex;
      renderRoom(nextRoom);
      history.replaceState(null, "", `#${nextRoom}`);
    });
  });

  itemsGrid.innerHTML = room.items
    .map(
      (item, index) => `
        <figure class="item-card">
          <img src="${makeThumb(item, room, index)}" alt="${escapeHtml(item.name)}" loading="lazy" />
          <figcaption>${escapeHtml(item.name)}</figcaption>
        </figure>
      `
    )
    .join("");
}

function makeThumb(item, room, index) {
  const accent = room.accent;
  const soft = room.soft;
  const stroke = "#293548";
  const fill = colorMix(room.accent, "#ffffff", index % 3 === 0 ? 0.4 : 0.62);
  const background = index % 2 === 0 ? "#f7fbff" : "#fff8f2";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="${escapeHtml(item.name)}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="${soft}" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#243247" flood-opacity="0.12" />
        </filter>
      </defs>
      <rect width="240" height="240" rx="10" fill="url(#bg)" />
      <circle cx="200" cy="36" r="26" fill="${accent}" opacity="0.16" />
      <circle cx="42" cy="204" r="30" fill="${accent}" opacity="0.12" />
      <g transform="translate(0 15)" filter="url(#shadow)">
        ${iconSvg(item.icon, stroke, fill, accent)}
      </g>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function colorMix(hex, target, weight) {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  const mix = a.map((channel, index) => Math.round(channel * (1 - weight) + b[index] * weight));
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  return [0, 2, 4].map((start) => parseInt(normalized.slice(start, start + 2), 16));
}

function iconSvg(type, stroke, fill, accent) {
  const common = `fill="${fill}" stroke="${stroke}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"`;
  const light = `fill="#ffffff" stroke="${stroke}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"`;
  const accentFill = `fill="${accent}" opacity="0.72"`;

  switch (type) {
    case "fridge":
      return `<rect x="70" y="28" width="100" height="154" rx="10" ${common}/><path d="M70 82h100M91 55v18M91 108v38" stroke="${stroke}" stroke-width="6" stroke-linecap="round"/>`;
    case "oven":
      return `<rect x="55" y="58" width="130" height="104" rx="12" ${common}/><rect x="76" y="86" width="88" height="52" rx="7" ${light}/><circle cx="84" cy="76" r="5" fill="${stroke}"/><circle cx="112" cy="76" r="5" fill="${stroke}"/><circle cx="140" cy="76" r="5" fill="${stroke}"/>`;
    case "sink":
      return `<path d="M59 104h122l-15 48H74z" ${common}/><path d="M105 101V68c0-17 30-17 30 0v8" fill="none" stroke="${stroke}" stroke-width="6"/><path d="M134 76h24" stroke="${stroke}" stroke-width="6"/><circle cx="92" cy="122" r="5" fill="${stroke}"/><circle cx="120" cy="124" r="5" fill="${stroke}"/>`;
    case "faucet":
      return `<path d="M85 156V92c0-18 16-32 36-32h34v24h-34c-7 0-12 5-12 12v60" fill="none" stroke="${stroke}" stroke-width="8"/><path d="M147 84v24h35" fill="none" stroke="${stroke}" stroke-width="8"/><path d="M181 108c0 15-20 15-20 0" fill="none" stroke="${accent}" stroke-width="6"/>`;
    case "cabinet":
      return `<rect x="52" y="48" width="136" height="122" rx="8" ${common}/><path d="M120 48v122M52 92h136" stroke="${stroke}" stroke-width="6"/><circle cx="103" cy="128" r="4" fill="${stroke}"/><circle cx="137" cy="128" r="4" fill="${stroke}"/>`;
    case "kettle":
      return `<path d="M86 82h64c12 12 18 30 13 50-5 25-23 38-45 38s-40-13-45-38c-4-20 2-38 13-50z" ${common}/><path d="M91 82l-9-25h72l-8 25M154 102h15c24 2 24 38 0 40h-8" fill="none" stroke="${stroke}" stroke-width="6"/><path d="M78 103H56l20 25" fill="none" stroke="${stroke}" stroke-width="6"/>`;
    case "pot":
      return `<path d="M65 92h110l-12 70H77z" ${common}/><path d="M80 92c5-24 74-24 80 0M55 109H35M185 109h20" fill="none" stroke="${stroke}" stroke-width="6"/><path d="M103 64c-4-14 14-16 7-30M132 64c-4-14 14-16 7-30" fill="none" stroke="${accent}" stroke-width="5"/>`;
    case "pan":
      return `<ellipse cx="93" cy="128" rx="50" ry="30" ${common}/><path d="M139 119l61-32" fill="none" stroke="${stroke}" stroke-width="10"/><circle cx="80" cy="120" r="7" ${accentFill}/>`;
    case "knife":
      return `<path d="M68 142l83-83c22 24 20 57-9 85z" ${light}/><path d="M71 145l-24 24" stroke="${stroke}" stroke-width="12"/><path d="M96 119l37-37" stroke="${accent}" stroke-width="6"/>`;
    case "board":
      return `<rect x="59" y="46" width="122" height="142" rx="18" ${common}/><circle cx="120" cy="68" r="8" fill="#fff"/><path d="M88 105h64M88 128h64M88 151h44" stroke="${stroke}" stroke-width="6"/>`;
    case "plate":
      return `<circle cx="120" cy="116" r="62" ${common}/><circle cx="120" cy="116" r="36" fill="#ffffff" stroke="${stroke}" stroke-width="6"/><circle cx="120" cy="116" r="10" ${accentFill}/>`;
    case "cup":
      return `<path d="M74 75h82l-8 84H83z" ${common}/><path d="M155 96h18c22 0 22 42 0 42h-22" fill="none" stroke="${stroke}" stroke-width="6"/><path d="M93 56c-6-12 10-15 4-29M122 56c-6-12 10-15 4-29" fill="none" stroke="${accent}" stroke-width="5"/>`;
    case "spoon":
      return `<ellipse cx="101" cy="72" rx="27" ry="40" ${common}/><path d="M111 109l38 76" stroke="${stroke}" stroke-width="10"/><path d="M92 71c4 10 14 12 22 2" fill="none" stroke="#ffffff" stroke-width="5"/>`;
    case "table":
      return `<path d="M48 88h144v24H48z" ${common}/><path d="M74 112v66M166 112v66M66 178h28M146 178h28" stroke="${stroke}" stroke-width="8"/>`;
    case "chair":
      return `<path d="M78 68h84v62H78z" ${common}/><path d="M67 130h106v30H67z" ${common}/><path d="M82 160v28M158 160v28" stroke="${stroke}" stroke-width="8"/>`;
    case "microwave":
      return `<rect x="44" y="62" width="152" height="96" rx="10" ${common}/><rect x="64" y="82" width="86" height="56" rx="6" ${light}/><circle cx="171" cy="93" r="7" fill="${stroke}"/><path d="M166 119h15" stroke="${stroke}" stroke-width="6"/>`;
    case "bowl":
      return `<path d="M58 105h124c-7 42-28 64-62 64s-55-22-62-64z" ${common}/><path d="M76 105c8-24 80-24 88 0" fill="none" stroke="${stroke}" stroke-width="6"/><circle cx="96" cy="124" r="5" fill="#fff"/>`;
    case "blender":
      return `<path d="M85 47h68l-12 84H97z" ${common}/><path d="M97 131h44l14 47H83z" ${common}/><path d="M100 86l35 22M136 84l-38 28" stroke="${stroke}" stroke-width="5"/><path d="M153 69h20v38h-25" fill="none" stroke="${stroke}" stroke-width="6"/>`;
    case "toaster":
      return `<path d="M73 84h94c14 0 23 12 23 28v50H50v-50c0-16 9-28 23-28z" ${common}/><path d="M84 84l-5-32h34l2 32M127 84l5-32h34l-8 32" ${light}/><path d="M75 123h90" stroke="${stroke}" stroke-width="6"/><circle cx="166" cy="146" r="5" fill="${stroke}"/>`;
    case "trash":
      return `<path d="M74 83h92l-10 98H84z" ${common}/><path d="M65 83h110M91 83l8-26h42l8 26M102 108v44M120 108v44M138 108v44" fill="none" stroke="${stroke}" stroke-width="6"/>`;
    case "photo":
      return `<rect x="52" y="50" width="136" height="112" rx="8" ${common}/><path d="M72 135l35-35 24 24 18-18 19 29" fill="none" stroke="${stroke}" stroke-width="6"/><circle cx="149" cy="82" r="13" ${accentFill}/>`;
    case "plug":
      return `<path d="M75 126h52c18 0 32-14 32-32V67" fill="none" stroke="${stroke}" stroke-width="8"/><path d="M142 67h34M151 46v21M167 46v21M73 111H46v31h27z" ${common}/><path d="M46 126H25" stroke="${stroke}" stroke-width="8"/>`;
    case "radiator":
      return `<path d="M68 58h104v116H68z" ${light}/><path d="M88 58v116M110 58v116M132 58v116M154 58v116M58 85h124M58 147h124" stroke="${stroke}" stroke-width="6"/>`;
    case "remote":
      return `<rect x="88" y="34" width="64" height="152" rx="28" ${common}/><circle cx="120" cy="71" r="12" fill="#fff" stroke="${stroke}" stroke-width="5"/><path d="M105 104h30M105 128h30M105 152h30" stroke="${stroke}" stroke-width="6"/><circle cx="107" cy="88" r="4" fill="${accent}"/><circle cx="133" cy="88" r="4" fill="${accent}"/>`;
    case "rug":
      return `<rect x="45" y="67" width="150" height="100" rx="12" ${common}/><rect x="68" y="88" width="104" height="58" rx="8" fill="#fff" stroke="${stroke}" stroke-width="6"/><path d="M89 117h62M120 97v40M49 83h-18M49 151h-18M191 83h18M191 151h18" stroke="${stroke}" stroke-width="6"/>`;
    case "lamp":
      return `<path d="M91 72h58l19 48H72z" ${common}/><path d="M120 120v48M91 168h58" stroke="${stroke}" stroke-width="8"/><circle cx="120" cy="49" r="16" ${accentFill}/>`;
    case "television":
      return `<rect x="45" y="52" width="150" height="96" rx="10" ${common}/><path d="M92 178h56M120 148v30" stroke="${stroke}" stroke-width="8"/><path d="M69 80h102M69 103h76" stroke="#fff" stroke-width="7" opacity="0.9"/>`;
    case "shoeRack":
      return `<path d="M55 70h130M55 115h130M55 160h130M67 70v99M173 70v99" stroke="${stroke}" stroke-width="8"/><path d="M79 103c20-2 33 5 39 15H70c0-7 3-12 9-15zM130 148c20-2 33 5 39 15h-48c0-7 3-12 9-15z" ${common}/>`;
    case "socket":
      return `<rect x="68" y="52" width="104" height="128" rx="18" ${common}/><circle cx="105" cy="116" r="8" fill="${stroke}"/><circle cx="135" cy="116" r="8" fill="${stroke}"/><path d="M120 132v17" stroke="${stroke}" stroke-width="6"/>`;
    case "soda":
      return `<path d="M82 65h76l-13 120H95z" ${common}/><path d="M90 106h60" stroke="${stroke}" stroke-width="6"/><path d="M103 45h37l-10 20" fill="none" stroke="${stroke}" stroke-width="6"/><circle cx="113" cy="131" r="5" fill="#fff"/><circle cx="133" cy="147" r="5" fill="#fff"/>`;
    case "sofa":
      return `<path d="M61 103h118c17 0 29 12 29 29v34H32v-34c0-17 12-29 29-29z" ${common}/><path d="M66 103V80c0-14 10-24 24-24h60c14 0 24 10 24 24v23M62 166v19M178 166v19" fill="none" stroke="${stroke}" stroke-width="8"/><path d="M87 125h66" stroke="#fff" stroke-width="6"/>`;
    case "stairs":
      return `<path d="M46 168h148v-28h-37v-28h-37V84H83V56H46z" ${common}/><path d="M83 56v28h37v28h37v28h37" fill="none" stroke="${stroke}" stroke-width="6"/>`;
    case "teabag":
      return `<path d="M67 88h90l-10 75H79z" ${common}/><path d="M157 106h18c20 0 20 36 0 36h-22" fill="none" stroke="${stroke}" stroke-width="6"/><path d="M119 88c0-25 50-25 50 0v45" fill="none" stroke="${stroke}" stroke-width="5"/><rect x="157" y="133" width="28" height="34" rx="4" fill="#fff" stroke="${stroke}" stroke-width="5"/>`;
    case "telephone":
      return `<path d="M66 98c7-32 101-32 108 0l-28 17-10-21H104l-10 21z" ${common}/><rect x="79" y="112" width="82" height="62" rx="16" ${common}/><circle cx="120" cy="143" r="15" fill="#fff" stroke="${stroke}" stroke-width="6"/><path d="M97 58l-18-20M143 58l18-20" stroke="${accent}" stroke-width="6"/>`;
    case "pillow":
      return `<rect x="55" y="78" width="130" height="78" rx="26" ${common}/><path d="M77 99c19 13 68 13 86 0M76 136c22-12 66-12 88 0" fill="none" stroke="#fff" stroke-width="6"/>`;
    case "tissue":
      return `<path d="M58 106h124l-13 62H71z" ${common}/><path d="M95 107c-8-26 12-45 31-37 17 7 22 25 15 37z" ${light}/><path d="M83 128h74" stroke="${stroke}" stroke-width="6"/>`;
    case "vase":
      return `<path d="M94 82h52c-19 28-14 50 8 84H86c22-34 27-56 8-84z" ${common}/><path d="M112 82V47M128 82V45M120 80c-21-20-31-34-31-34M125 79c20-20 31-35 31-35" fill="none" stroke="${stroke}" stroke-width="5"/><circle cx="88" cy="45" r="11" ${accentFill}/><circle cx="157" cy="43" r="11" ${accentFill}/>`;
    case "videoGame":
      return `<path d="M70 100h100c21 0 38 17 38 38 0 19-13 32-29 32-14 0-22-12-29-24H91c-7 12-15 24-29 24-16 0-29-13-29-32 0-21 16-38 37-38z" ${common}/><path d="M76 126v28M62 140h28M151 132h1M174 148h1" stroke="${stroke}" stroke-width="8"/><circle cx="151" cy="132" r="4" fill="${stroke}"/><circle cx="174" cy="148" r="4" fill="${stroke}"/>`;
    case "wall":
      return `<rect x="52" y="48" width="136" height="126" rx="8" ${light}/><path d="M52 90h136M52 132h136M96 48v42M145 90v42M96 132v42" stroke="${stroke}" stroke-width="6"/><circle cx="167" cy="67" r="9" ${accentFill}/>`;
    case "wallpaper":
      return `<rect x="52" y="46" width="136" height="130" rx="8" ${common}/><path d="M77 70c18 17 18 33 0 50M120 70c18 17 18 33 0 50M163 70c18 17 18 33 0 50M77 124c18 17 18 33 0 50M120 124c18 17 18 33 0 50M163 124c18 17 18 33 0 50" fill="none" stroke="#fff" stroke-width="6"/>`;
    case "windowSeat":
      return `<rect x="58" y="44" width="124" height="86" rx="8" ${light}/><path d="M120 44v86M58 87h124" stroke="${stroke}" stroke-width="6"/><path d="M47 139h146v36H47z" ${common}/><path d="M80 139v-18M160 139v-18" stroke="${stroke}" stroke-width="6"/>`;
    case "window":
      return `<rect x="58" y="42" width="124" height="134" rx="8" ${light}/><path d="M120 42v134M58 108h124" stroke="${stroke}" stroke-width="6"/><path d="M82 78c14-20 34-24 56-8M82 142c15 12 34 15 56 5" stroke="${accent}" stroke-width="5"/>`;
    case "bed":
      return `<path d="M44 105h152v62H44z" ${common}/><path d="M44 86c0-13 10-23 23-23h130v104" fill="none" stroke="${stroke}" stroke-width="8"/><rect x="66" y="79" width="48" height="30" rx="10" ${light}/><path d="M44 167v18M196 167v18" stroke="${stroke}" stroke-width="8"/>`;
    case "blanket":
      return `<path d="M58 73h124v100H58z" ${common}/><path d="M84 73v100M120 73v100M156 73v100M58 105h124M58 137h124" stroke="#fff" stroke-width="6"/>`;
    case "wardrobe":
      return `<rect x="61" y="40" width="118" height="148" rx="8" ${common}/><path d="M120 40v148M101 111h-12M139 111h12" stroke="${stroke}" stroke-width="6"/><path d="M78 188h84" stroke="${stroke}" stroke-width="8"/>`;
    case "mirror":
      return `<ellipse cx="120" cy="91" rx="48" ry="63" ${light}/><path d="M120 154v32M93 186h54" stroke="${stroke}" stroke-width="8"/><path d="M99 73c15-16 31-18 45-6" stroke="${accent}" stroke-width="5"/>`;
    case "nightstand":
      return `<rect x="72" y="76" width="96" height="96" rx="8" ${common}/><path d="M72 110h96M72 140h96M104 93h32M104 126h32M104 157h32" stroke="${stroke}" stroke-width="6"/><path d="M88 172v16M152 172v16" stroke="${stroke}" stroke-width="8"/>`;
    case "dresser":
      return `<rect x="58" y="64" width="124" height="108" rx="8" ${common}/><path d="M58 100h124M58 136h124M101 82h38M101 118h38M101 154h38" stroke="${stroke}" stroke-width="6"/><path d="M74 172v15M166 172v15" stroke="${stroke}" stroke-width="8"/>`;
    case "clock":
      return `<circle cx="120" cy="113" r="60" ${common}/><path d="M120 78v39l30 20M86 53L65 31M154 53l21-22" stroke="${stroke}" stroke-width="7"/><circle cx="120" cy="117" r="5" fill="${stroke}"/>`;
    case "curtain":
      return `<path d="M61 48h118M79 55c-18 37-18 85 0 122M161 55c18 37 18 85 0 122" fill="none" stroke="${stroke}" stroke-width="8"/><path d="M80 55h80v122H80c22-42 22-80 0-122z" ${common}/><path d="M120 55v122" stroke="#fff" stroke-width="6"/>`;
    case "hanger":
      return `<path d="M120 79c0-25 29-24 29-3 0 14-29 16-29 37" fill="none" stroke="${stroke}" stroke-width="7"/><path d="M120 113L62 158h116z" ${common}/>`;
    case "desk":
      return `<path d="M50 91h140v26H50z" ${common}/><path d="M69 117v66M171 117v66M91 91V67h58v24" fill="none" stroke="${stroke}" stroke-width="8"/><rect x="100" y="50" width="40" height="28" rx="4" ${light}/>`;
    case "bookshelf":
      return `<rect x="58" y="42" width="124" height="142" rx="8" ${common}/><path d="M58 82h124M58 122h124M58 162h124" stroke="${stroke}" stroke-width="6"/><path d="M78 58v24M94 58v24M119 98v24M139 98v24M83 138v24M105 138v24M152 138v24" stroke="#fff" stroke-width="7"/>`;
    case "slippers":
      return `<path d="M66 138c13-37 32-62 58-75 25 28 14 65-16 88-13 10-34 7-42-13z" ${common}/><path d="M132 154c17-29 39-48 68-54 17 34-2 64-37 78-15 6-29-6-31-24z" ${common}/><path d="M88 126c10-15 23-25 39-31M153 145c12-11 26-18 43-21" stroke="#fff" stroke-width="6"/>`;
    case "quilt":
      return `<path d="M52 67h136v116H52z" ${common}/><path d="M86 67v116M120 67v116M154 67v116M52 96h136M52 125h136M52 154h136" stroke="#fff" stroke-width="6"/><circle cx="103" cy="111" r="7" fill="${accent}"/><circle cx="139" cy="142" r="7" fill="${accent}"/>`;
    default:
      return `<circle cx="120" cy="112" r="62" ${common}/><path d="M94 116h52M120 90v52" stroke="${stroke}" stroke-width="8"/>`;
  }
}

function roomBadgeSvg(room) {
  return `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="${room.soft}" />
      ${badgeIcon(room.id)}
    </svg>
  `;
}

function badgeIcon(roomId) {
  if (roomId === "kitchen") {
    return `<path d="M30 24h40v52H30z" fill="#ffffff" stroke="#293548" stroke-width="5"/><path d="M30 48h40M41 36v6M41 58v12" stroke="#293548" stroke-width="5" stroke-linecap="round"/>`;
  }

  if (roomId === "bedroom") {
    return `<path d="M21 57h58v20H21z" fill="#ffffff" stroke="#293548" stroke-width="5"/><path d="M21 47c0-8 6-14 14-14h44v44" fill="none" stroke="#293548" stroke-width="5"/><rect x="32" y="42" width="18" height="13" rx="4" fill="#ffffff" stroke="#293548" stroke-width="4"/>`;
  }

  return `<path d="M21 56h58c7 0 12 5 12 12v9H9v-9c0-7 5-12 12-12z" fill="#ffffff" stroke="#293548" stroke-width="5"/><path d="M28 56V42c0-7 5-12 12-12h20c7 0 12 5 12 12v14" fill="none" stroke="#293548" stroke-width="5"/><path d="M24 77v8M76 77v8" stroke="#293548" stroke-width="5" stroke-linecap="round"/>`;
}

document.querySelector("#prevBtn").addEventListener("click", () => moveCarousel(-1));
document.querySelector("#nextBtn").addEventListener("click", () => moveCarousel(1));
document.querySelector("#backBtn").addEventListener("click", backHome);

document.addEventListener("keydown", (event) => {
  if (!homeView.hidden && event.key === "ArrowLeft") moveCarousel(-1);
  if (!homeView.hidden && event.key === "ArrowRight") moveCarousel(1);
  if (!detailView.hidden && event.key === "Escape") backHome();
});

function boot() {
  const hashRoom = window.location.hash.replace("#", "");
  const room = rooms.find((entry) => entry.id === hashRoom);

  renderCarousel();

  if (room) {
    openRoom(room.id);
  }
}

boot();

// タロットカード画像 一括生成スクリプト
// 実行: node generate-cards.js
// 生成先: public/cards/0.jpg 〜 21.jpg（22枚）

const fs   = require("fs");
const path = require("path");

const STYLE =
  "tarot card illustration, art nouveau style by Alphonse Mucha, " +
  "dark mystical atmosphere, rich gold and deep purple midnight blue palette, " +
  "intricate ornamental border frame, no text no letters no words, " +
  "highly detailed professional artwork, dramatic lighting, ethereal glow";

const CARDS = [
  {
    id: 0, slug: "fool",
    prompt: "young carefree traveler about to step off a cliff edge into open sky, small white dog at feet, carrying a bindle stick with sack, colorful butterfly flying ahead, mountains in distance, pure joy and freedom",
  },
  {
    id: 1, slug: "magician",
    prompt: "powerful robed magician standing at stone altar with wand raised toward heaven, infinity lemniscate symbol glowing above head, four elemental objects on altar, red roses and white lilies surrounding",
  },
  {
    id: 2, slug: "high-priestess",
    prompt: "serene high priestess seated between two ornate pillars, silver crescent moon crown, midnight blue robe, holding ancient scroll in lap, sheer veil behind her, pomegranates, quiet wisdom",
  },
  {
    id: 3, slug: "empress",
    prompt: "majestic empress seated on lush throne in abundant garden, golden crown with twelve stars, flowing robe with pomegranates, golden wheat at feet, waterfall in background, goddess of nature and fertility",
  },
  {
    id: 4, slug: "emperor",
    prompt: "stern bearded emperor on stone throne with ram head armrests, red robe and golden armor, orb and scepter of authority, barren rocky mountains behind, absolute power and structure",
  },
  {
    id: 5, slug: "hierophant",
    prompt: "grand hierophant in ornate ceremonial robes and triple crown, two fingers raised in blessing, two devotees kneeling below, Gothic cathedral interior, crossed keys at feet, sacred tradition",
  },
  {
    id: 6, slug: "lovers",
    prompt: "man and woman standing in paradise garden beneath radiant archangel in clouds, golden divine light streaming down, serpent coiled in background, mountain in distance, divine union and choice",
  },
  {
    id: 7, slug: "chariot",
    prompt: "triumphant armored warrior standing in stone chariot, black and white sphinx creatures below, canopy of stars above, crescent moons on armored shoulders, laurel crown, conquest and will",
  },
  {
    id: 8, slug: "strength",
    prompt: "serene beautiful woman wearing flower garland crown gently closing jaws of a lion with bare hands, infinity symbol glowing above, lush green landscape, inner courage and compassion",
  },
  {
    id: 9, slug: "hermit",
    prompt: "ancient wise hermit standing alone on dark mountain peak, raising glowing lantern with star of David inside, long gray cloak and beard, wooden staff, profound solitude and inner light",
  },
  {
    id: 10, slug: "wheel-of-fortune",
    prompt: "great cosmic wheel floating in purple sky covered in mystical symbols, golden sphinx on top, serpent descending one side, jackal rising other side, four winged creatures at corners reading books",
  },
  {
    id: 11, slug: "justice",
    prompt: "noble robed woman seated on stone throne holding upright double-edged sword and balanced scales, red robe, golden crown, pillar and purple veil behind, perfect equilibrium and truth",
  },
  {
    id: 12, slug: "hanged-man",
    prompt: "man hanging peacefully upside down from a T-shaped wooden cross, one leg bent behind other knee, serene glowing halo of golden light around head, blue shirt and red leggings, enlightenment through surrender",
  },
  {
    id: 13, slug: "death",
    prompt: "skeletal knight in black armor on white horse carrying black flag with white rose, fallen king and bishop below, two towers in distance, sun rising between them, dawn of transformation and rebirth",
  },
  {
    id: 14, slug: "temperance",
    prompt: "graceful androgynous angel standing one foot on land one in still water, pouring glowing liquid between two golden cups, triangle within square on chest, irises blooming, sun rising on horizon, divine alchemy",
  },
  {
    id: 15, slug: "devil",
    prompt: "dark horned demon with bat wings enthroned on black pedestal, two small chained human figures below, inverted pentagram above, dark cave setting, chains as illusions of bondage, shadow and materialism",
  },
  {
    id: 16, slug: "tower",
    prompt: "tall stone tower with golden crown on top struck violently by lightning bolt from storm clouds, crown blown off, two figures falling through air surrounded by flames and lightning, dramatic destruction and revelation",
  },
  {
    id: 17, slug: "star",
    prompt: "naked woman kneeling peacefully by still dark pool, pouring water from two vessels into pool and earth, seven small stars and one large radiant star shining above, peaceful nocturnal landscape, hope and healing",
  },
  {
    id: 18, slug: "moon",
    prompt: "mysterious full moon with face high in night sky, wolf and dog howling from opposite sides, crayfish emerging from dark pool below, two stone towers flanking winding path into darkness, illusion and intuition",
  },
  {
    id: 19, slug: "sun",
    prompt: "radiant golden sun with human face beaming down rays of light, joyful young child riding white horse through sunflower garden, stone wall behind, pure vitality and happiness, warm golden light everywhere",
  },
  {
    id: 20, slug: "judgement",
    prompt: "majestic archangel blowing golden trumpet from above dramatic clouds, naked humans rising from open stone coffins with arms raised toward heaven, icy mountains in background, divine resurrection and awakening",
  },
  {
    id: 21, slug: "world",
    prompt: "triumphant figure dancing in center of large oval wreath of laurel and flowers, holding two wands, four winged creatures at each corner, completion and wholeness, cosmic dance of achievement",
  },
];

const OUTPUT_DIR = path.join(__dirname, "public", "cards");

async function downloadImage(url, filepath) {
  const res = await fetch(url, { signal: AbortSignal.timeout(90_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buf));
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let done = 0;
  for (const card of CARDS) {
    const filepath = path.join(OUTPUT_DIR, `${card.id}.jpg`);
    if (fs.existsSync(filepath)) {
      console.log(`  skip  [${card.id.toString().padStart(2)}] ${card.slug} (既存)`);
      done++;
      continue;
    }

    const fullPrompt = `${card.prompt}, ${STYLE}`;
    const url =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}` +
      `?width=512&height=820&nologo=true&model=flux&seed=${card.id * 137 + 42}`;

    process.stdout.write(`  生成中 [${card.id.toString().padStart(2)}] ${card.slug} ... `);
    try {
      await downloadImage(url, filepath);
      const kb = Math.round(fs.statSync(filepath).size / 1024);
      console.log(`✓ (${kb}KB)`);
      done++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n完了: ${done}/${CARDS.length} 枚`);
}

main().catch(console.error);

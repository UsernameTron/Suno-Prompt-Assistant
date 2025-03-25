/**
 * Musical instruments data for Suno AI prompt optimization
 * Organized by category with related keywords and descriptions
 */

const instruments = [
  // String Instruments
  {
    id: "guitar",
    name: "guitar",
    category: "string",
    variants: ["acoustic guitar", "electric guitar", "classical guitar", "steel guitar", "slide guitar"],
    keywords: ["strumming", "chord", "pick", "fretboard", "riff", "plucking", "fingerpicking"],
    description: "A stringed instrument with a flat-backed rounded body that narrows in the middle",
    examples: ["acoustic guitar picking", "distorted electric guitar riffs"]
  },
  {
    id: "bass",
    name: "bass",
    category: "string",
    variants: ["bass guitar", "double bass", "synth bass", "acoustic bass", "fretless bass"],
    keywords: ["low end", "rhythm section", "groove", "bassline", "deep", "foundation"],
    description: "A stringed instrument that produces low-pitched notes",
    examples: ["funky bass groove", "deep bass notes"]
  },
  {
    id: "violin",
    name: "violin",
    category: "string",
    variants: ["fiddle", "viola", "cello", "double bass", "string quartet"],
    keywords: ["bowing", "string section", "orchestral", "chamber", "classical", "fiddling"],
    description: "A wooden string instrument with four strings tuned in perfect fifths",
    examples: ["emotional violin solo", "lush string arrangements"]
  },
  {
    id: "harp",
    name: "harp",
    category: "string",
    variants: ["concert harp", "lever harp", "celtic harp", "electric harp"],
    keywords: ["plucking", "glissando", "angelic", "ethereal", "arpeggio", "orchestral"],
    description: "A tall, roughly triangular instrument with strings stretched between the neck and soundboard",
    examples: ["celtic harp arpeggios", "dreamy harp glissandos"]
  },
  
  // Keyboard Instruments
  {
    id: "piano",
    name: "piano",
    category: "keyboard",
    variants: ["grand piano", "upright piano", "electric piano", "honky-tonk piano", "prepared piano"],
    keywords: ["keys", "keyboard", "pedal", "chord", "classical", "hammers", "ivory"],
    description: "A large keyboard musical instrument with a wooden case enclosing a soundboard and metal strings",
    examples: ["elegant piano melodies", "emotional piano ballad"]
  },
  {
    id: "synthesizer",
    name: "synthesizer",
    category: "keyboard",
    variants: ["analog synth", "digital synth", "modular synth", "wavetable synth", "FM synth"],
    keywords: ["electronic", "preset", "patch", "filter", "oscillator", "lfo", "envelope"],
    description: "An electronic instrument that generates audio signals that may be converted to sound",
    examples: ["analog synth pads", "pulsing synth arpeggio"]
  },
  {
    id: "organ",
    name: "organ",
    category: "keyboard",
    variants: ["pipe organ", "hammond organ", "church organ", "reed organ", "electronic organ"],
    keywords: ["pipes", "stops", "pedals", "church", "drawbars", "leslie", "cathedral"],
    description: "A keyboard instrument of one or more pipe divisions, each played with its own keyboard",
    examples: ["church organ chords", "hammond organ with leslie speaker"]
  },
  
  // Wind Instruments
  {
    id: "saxophone",
    name: "saxophone",
    category: "wind",
    variants: ["alto sax", "tenor sax", "soprano sax", "baritone sax", "jazz saxophone"],
    keywords: ["jazz", "brass", "reed", "smooth", "solo", "honking", "wailing"],
    description: "A wind instrument with a single-reed mouthpiece, a curved tube, and finger keys",
    examples: ["smooth saxophone solo", "jazzy saxophone riffs"]
  },
  {
    id: "flute",
    name: "flute",
    category: "wind",
    variants: ["concert flute", "piccolo", "alto flute", "bass flute", "Native American flute"],
    keywords: ["woodwind", "airy", "breathy", "orchestral", "bright", "trilling", "light"],
    description: "A wind instrument made from a tube with holes that are stopped by the fingers",
    examples: ["lilting flute melody", "breathy flute textures"]
  },
  {
    id: "trumpet",
    name: "trumpet",
    category: "wind",
    variants: ["jazz trumpet", "piccolo trumpet", "flugelhorn", "cornet", "baroque trumpet"],
    keywords: ["brass", "horn", "fanfare", "jazz", "bright", "muted", "valve", "brassy"],
    description: "A brass instrument with a flared bell and a bright, penetrating tone",
    examples: ["bright trumpet fanfare", "muted jazz trumpet solo"]
  },
  
  // Percussion Instruments
  {
    id: "drums",
    name: "drums",
    category: "percussion",
    variants: ["drum kit", "acoustic drums", "electronic drums", "jazz drums", "rock drums"],
    keywords: ["percussive", "rhythm", "beat", "snare", "kick", "hi-hat", "cymbals", "tom"],
    description: "A set of percussion instruments played by a single performer",
    examples: ["driving drum beat", "complex jazz drumming"]
  },
  {
    id: "percussion",
    name: "percussion",
    category: "percussion",
    variants: ["congas", "bongos", "timpani", "xylophone", "marimba", "vibraphone", "tambourine"],
    keywords: ["rhythm", "beat", "hit", "strike", "shaker", "tribal", "orchestral"],
    description: "Musical instruments played by striking or shaking",
    examples: ["tribal percussion patterns", "orchestral timpani rolls"]
  },
  
  // Electronic Elements
  {
    id: "808",
    name: "808",
    category: "electronic",
    variants: ["TR-808", "808 kick", "808 bass", "808 drums", "trap 808"],
    keywords: ["trap", "hip hop", "sub bass", "electronic drums", "roland", "drum machine"],
    description: "Sound from the Roland TR-808 drum machine, especially its distinctive deep kick drum",
    examples: ["booming 808 bass", "heavy 808 kick drums"]
  },
  {
    id: "sampler",
    name: "sampler",
    category: "electronic",
    variants: ["sample pad", "MPC", "sampled vocals", "sample chops", "loop sampler"],
    keywords: ["sampling", "chopped", "loops", "crate digging", "vinyl samples", "hip hop"],
    description: "Electronic device that plays back recorded sounds when triggered",
    examples: ["chopped soul samples", "vinyl sample loops"]
  },
  
  // Vocal Elements
  {
    id: "vocals",
    name: "vocals",
    category: "vocal",
    variants: ["male vocals", "female vocals", "choir", "backing vocals", "lead vocals"],
    keywords: ["singing", "lyrics", "voice", "harmony", "melody", "singer", "chorus"],
    description: "Human voice used as a musical instrument",
    examples: ["powerful female vocals", "layered vocal harmonies"]
  },
  {
    id: "vocoder",
    name: "vocoder",
    category: "vocal",
    variants: ["talkbox", "auto-tune", "robotic vocals", "vocal effects", "pitch corrected vocals"],
    keywords: ["robotic", "electronic voice", "processed", "synthesized speech", "effect"],
    description: "Electronic device that processes human voice to create synthesized vocal sounds",
    examples: ["robotic vocoder effects", "daft punk style vocoder"]
  }
];

export default instruments;

/**
 * Helper functions for instrument processing
 */

export const getInstrumentByName = (name) => {
  const normalizedName = name.trim().toLowerCase();
  return instruments.find(instrument => 
    instrument.name.toLowerCase() === normalizedName ||
    instrument.variants.some(variant => variant.toLowerCase() === normalizedName)
  );
};

export const getInstrumentByKeyword = (keyword) => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  return instruments.find(instrument => 
    instrument.keywords.some(k => normalizedKeyword.includes(k.toLowerCase())) ||
    instrument.variants.some(v => normalizedKeyword.includes(v.toLowerCase())) ||
    normalizedKeyword.includes(instrument.name.toLowerCase())
  );
};

export const getInstrumentNames = () => {
  return instruments.map(instrument => instrument.name);
};

export const getInstrumentsByCategory = (category) => {
  return instruments.filter(instrument => instrument.category === category);
};

export const getAllInstrumentKeywords = () => {
  return instruments.flatMap(instrument => instrument.keywords);
};

export const getAllInstrumentVariants = () => {
  return instruments.flatMap(instrument => instrument.variants);
};
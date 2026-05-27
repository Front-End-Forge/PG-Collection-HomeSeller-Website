// frontend/src/mockData.js
export const sampleCategories = [
  { id: 'cat_1', name: '₹150 டாப்ஸ்', icon: '👚' },
  { id: 'cat_2', name: 'நைட்டிகள்', icon: '👗' },
  { id: 'cat_3', name: 'இன்னர்வேர்', icon: '🩲' },
  { id: 'cat_4', name: 'குழந்தை ஆடைகள்', icon: '👶' }
];

export const sampleProducts = [
  {
    id: 'PRD_001',
    title: 'Floral Summer Top',
    size: 'M',
    price: 150,
    originalPrice: 299,
    image: 'https://unsplash.com',
    status: 'Available'
  },
  {
    id: 'PRD_002',
    title: 'Cotton Printed Nightie',
    size: 'XL',
    price: 350,
    originalPrice: 499,
    image: 'https://unsplash.com',
    status: 'Available'
  },
  {
    id: 'PRD_003',
    title: 'Designer Gown (Aari Work)',
    size: 'L',
    price: 1800,
    originalPrice: 2500,
    image: 'https://unsplash.com',
    status: 'Available'
  },
  {
    id: 'PRD_004',
    title: 'Casual Short Top',
    size: 'S',
    price: 150,
    originalPrice: 300,
    image: 'https://unsplash.com',
    status: 'Sold_Out' // Test case for sold out display
  }
];

export const aariCourseDetails = {
  title: "ஆரி கிளாஸ் பயிற்சி",
  price: 3000,
  duration: "30 நாட்கள் (1 மாதம்)",
  syllabus: [
    "அடிப்படை ஆரி ஊசி கையாளுதல் மற்றும் கோர் நூல் நுட்பங்கள்",
    "மலர், மாம்பழம் மற்றும் தூய மயில் மோடிஃப் டிசைன் வடிவங்கள்",
    "கழுத்துப்பகுதி டிரேசிங் மற்றும் கனமான பார்டர் டிசைன் வேலைகள்",
    "திருமணம் பிளவுஸ் மற்றும் கஸ்டம் குர்தி எம்பிராய்டரி வேலைப்பாடு",
    "பிரைடல் ஹெவி-ஒர்க் ஃபிரேமிங் மற்றும் சர்பேஸ் பினிஷிங் கலைகள்",
    "பயிற்சி முடிவுக்கான அங்கீகரிக்கப்பட்ட அகாடமி சான்றிதழ்"
  ]
};

export const customGownPortfolio = [
  {
    id: "gown_1",
    title: "ஃபிளார்ட் சம்மர் லாங் பிராக்",
    desc: "மிக நேர்த்தியான கம்பர்ட் கஸ்டம் தையல் வேலைப்பாடு",
    type: "SIMPLE"
  },
  {
    id: "gown_2",
    title: "பிரீமியம் பிரைடல் கவுன்",
    desc: "கனமான கைவினை ஆரி கழுத்து எம்பிராய்டரி",
    type: "AARI_FUSED"
  },
  {
    id: "gown_3",
    title: "கேசுவல் வெஸ்டர்ன் ஷார்ட் டாப்",
    desc: "தினசரி பயன்பாட்டிற்கு ஏற்ற சரியான ஃபிட்டிங் தையல்",
    type: "SIMPLE"
  },
  {
    id: "gown_4",
    title: "இண்டோ-வெஸ்டர்ன் பிளேயர் பிராக்",
    desc: "நேர்த்தியான ஸ்லீவ் கஃப் ஆரி மோடிஃப் வரிகள்",
    type: "AARI_FUSED"
  }
];

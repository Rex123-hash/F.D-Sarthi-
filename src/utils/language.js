// ── FD SAATHI — Language & Numeral Utilities ──

export const LANGUAGES = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'Madhya Pradesh · UP · Bihar',
    folk: 'folk-pattern-hindi',
    script: 'Devanagari',
    numerals: ['०','१','२','३','४','५','६','७','८','९'],
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'Maharashtra · Vidarbha',
    folk: 'folk-pattern-marathi',
    script: 'Devanagari',
    numerals: ['०','१','२','३','४','५','६','७','८','९'],
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu · Puducherry',
    folk: 'folk-pattern-tamil',
    script: 'Tamil',
    numerals: ['0','1','2','3','4','5','6','7','8','9'],
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'Andhra Pradesh · Telangana',
    folk: 'folk-pattern-telugu',
    script: 'Telugu',
    numerals: ['0','1','2','3','4','5','6','7','8','9'],
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'West Bengal · Barak Valley',
    folk: 'folk-pattern-bengali',
    script: 'Bengali',
    numerals: ['০','১','২','৩','৪','৫','৬','৭','৮','৯'],
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'All Regions',
    folk: 'folk-pattern-english',
    script: 'Latin',
    numerals: ['0','1','2','3','4','5','6','7','8','9'],
  },
];

// Convert Arabic numerals to local script
export function toLocalNumeral(numStr, language) {
  const lang = LANGUAGES.find(l => l.code === language);
  if (!lang || lang.numerals[0] === '0') return numStr;
  return numStr.toString().replace(/[0-9]/g, d => lang.numerals[parseInt(d)]);
}

// Format: ५०,००० (50,000)
export function formatDualNumber(num, language) {
  const arabic = num.toLocaleString('en-IN');
  const lang = LANGUAGES.find(l => l.code === language);
  if (!lang || lang.numerals[0] === '0' || language === 'en') return arabic;
  const local = arabic.replace(/[0-9]/g, d => lang.numerals[parseInt(d)]);
  return `${local} (${arabic})`;
}

export function formatDualRate(rate, language) {
  if (rate == null || isNaN(rate)) return 'N/A';
  const lang = LANGUAGES.find(l => l.code === language);
  const arabic = Number(rate).toFixed(2);
  if (!lang || lang.numerals[0] === '0' || language === 'en') return `${arabic}%`;
  const local = arabic.replace(/[0-9]/g, d => lang.numerals[parseInt(d)]);
  return `${local}% (${arabic}%)`;
}

// Translations for UI labels
export const UI_STRINGS = {
  hi: {
    tagline: 'आपका भरोसेमंद FD सलाहकार',
    selectLanguage: 'अपनी भाषा चुनें',
    currentRates: 'आज की ब्याज दरें',
    askAdvisor: 'सलाहकार से पूछें',
    bank: 'बैंक',
    tenure: 'अवधि',
    rate: 'ब्याज दर',
    maturity: 'परिपक्वता राशि',
    recommended: 'अनुशंसित',
    safe: 'सुरक्षित',
    invest: 'निवेश करें',
    principal: 'मूल राशि',
    returns: 'लाभ',
    calculate: 'गणना करें',
    insured: 'DICGC बीमित',
    placeholder: 'FD के बारे में पूछें... जैसे "5 लाख में सबसे अच्छा FD कौन सा?"',
    greeting: 'नमस्ते! मैं FD Saathi हूँ। आपकी बचत को बेहतर बनाने में मदद करूँगा। आप कितना निवेश करना चाहते हैं?',
    loading: 'जवाब तैयार हो रहा है...',
  },
  mr: {
    tagline: 'तुमचा विश्वासू FD सल्लागार',
    selectLanguage: 'तुमची भाषा निवडा',
    currentRates: 'आजचे व्याज दर',
    askAdvisor: 'सल्लागाराला विचारा',
    bank: 'बँक',
    tenure: 'मुदत',
    rate: 'व्याज दर',
    maturity: 'परिपक्वता रक्कम',
    recommended: 'शिफारस केलेले',
    safe: 'सुरक्षित',
    invest: 'गुंतवणूक करा',
    principal: 'मूळ रक्कम',
    returns: 'परतावा',
    calculate: 'गणना करा',
    insured: 'DICGC विमाकृत',
    placeholder: 'FD बद्दल विचारा... जसे "5 लाखांसाठी सर्वोत्तम FD कोणती?"',
    greeting: 'नमस्कार! मी FD Saathi आहे. तुमची बचत वाढवण्यास मी मदत करीन. तुम्ही किती गुंतवणूक करू इच्छिता?',
    loading: 'उत्तर तयार होत आहे...',
  },
  ta: {
    tagline: 'உங்கள் நம்பகமான FD ஆலோசகர்',
    selectLanguage: 'உங்கள் மொழியை தேர்ந்தெடுக்கவும்',
    currentRates: 'இன்றைய வட்டி விகிதங்கள்',
    askAdvisor: 'ஆலோசகரிடம் கேளுங்கள்',
    bank: 'வங்கி',
    tenure: 'காலம்',
    rate: 'வட்டி விகிதம்',
    maturity: 'முதிர்வு தொகை',
    recommended: 'பரிந்துரைக்கப்பட்டது',
    safe: 'பாதுகாப்பான',
    invest: 'முதலீடு செய்',
    principal: 'அசல் தொகை',
    returns: 'வருவாய்',
    calculate: 'கணக்கிட',
    insured: 'DICGC காப்பீடு',
    placeholder: 'FD பற்றி கேளுங்கள்...',
    greeting: 'வணக்கம்! நான் FD Saathi. உங்கள் சேமிப்பை அதிகரிக்க உதவுகிறேன். நீங்கள் எவ்வளவு முதலீடு செய்ய விரும்புகிறீர்கள்?',
    loading: 'பதில் தயாரிக்கப்படுகிறது...',
  },
  te: {
    tagline: 'మీ విశ్వసనీయ FD సలహాదారు',
    selectLanguage: 'మీ భాషను ఎంచుకోండి',
    currentRates: 'నేటి వడ్డీ రేట్లు',
    askAdvisor: 'సలహాదారుని అడగండి',
    bank: 'బ్యాంక్',
    tenure: 'వ్యవధి',
    rate: 'వడ్డీ రేటు',
    maturity: 'మెచ్యూరిటీ మొత్తం',
    recommended: 'సిఫార్సు చేయబడింది',
    safe: 'సురక్షితం',
    invest: 'పెట్టుబడి పెట్టండి',
    principal: 'అసలు మొత్తం',
    returns: 'లాభం',
    calculate: 'లెక్కించండి',
    insured: 'DICGC బీమా',
    placeholder: 'FD గురించి అడగండి...',
    greeting: 'నమస్కారం! నేను FD Saathi. మీ పొదుపును పెంచడంలో సహాయపడతాను. మీరు ఎంత పెట్టుబడి పెట్టాలనుకుంటున్నారు?',
    loading: 'సమాధానం సిద్ధమవుతోంది...',
  },
  bn: {
    tagline: 'আপনার বিশ্বস্ত FD উপদেষ্টা',
    selectLanguage: 'আপনার ভাষা বেছে নিন',
    currentRates: 'আজকের সুদের হার',
    askAdvisor: 'উপদেষ্টাকে জিজ্ঞেস করুন',
    bank: 'ব্যাংক',
    tenure: 'মেয়াদ',
    rate: 'সুদের হার',
    maturity: 'মেয়াদপূর্তি পরিমাণ',
    recommended: 'সুপারিশকৃত',
    safe: 'নিরাপদ',
    invest: 'বিনিয়োগ করুন',
    principal: 'মূল পরিমাণ',
    returns: 'লাভ',
    calculate: 'হিসাব করুন',
    insured: 'DICGC বিমাকৃত',
    placeholder: 'FD সম্পর্কে জিজ্ঞেস করুন...',
    greeting: 'নমস্কার! আমি FD Saathi। আপনার সঞ্চয় বাড়াতে সাহায্য করব। আপনি কত বিনিয়োগ করতে চান?',
    loading: 'উত্তর প্রস্তুত হচ্ছে...',
  },
  en: {
    tagline: 'Your Trusted FD Advisor',
    selectLanguage: 'Choose Your Language',
    currentRates: "Today's Interest Rates",
    askAdvisor: 'Ask Your Advisor',
    bank: 'Bank',
    tenure: 'Tenure',
    rate: 'Interest Rate',
    maturity: 'Maturity Amount',
    recommended: 'Recommended',
    safe: 'Safe',
    invest: 'Invest Now',
    principal: 'Principal',
    returns: 'Returns',
    calculate: 'Calculate',
    insured: 'DICGC Insured',
    placeholder: 'Ask about FDs... e.g. "Best FD for ₹5 lakh for 1 year?"',
    greeting: "Namaste! I'm FD Saathi. I'll help you grow your savings. How much would you like to invest?",
    loading: 'Preparing response...',
  },
};

export function t(key, language) {
  const lang = UI_STRINGS[language] || UI_STRINGS.en;
  return lang[key] || UI_STRINGS.en[key] || key;
}

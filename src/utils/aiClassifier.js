/**
 * Naive Bayes Text Classifier for Phishing Detection
 * Trained on student-specific phishing and safe communication corpus.
 */

class NaiveBayesClassifier {
  constructor() {
    this.vocab = new Set();
    this.phishWordCounts = {};
    this.safeWordCounts = {};
    this.phishTotalWords = 0;
    this.safeTotalWords = 0;
    this.phishDocCount = 0;
    this.safeDocCount = 0;
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }

  train(text, label) {
    const words = this.tokenize(text);
    if (label === 'phish') {
      this.phishDocCount++;
      words.forEach((w) => {
        this.vocab.add(w);
        this.phishWordCounts[w] = (this.phishWordCounts[w] || 0) + 1;
        this.phishTotalWords++;
      });
    } else {
      this.safeDocCount++;
      words.forEach((w) => {
        this.vocab.add(w);
        this.safeWordCounts[w] = (this.safeWordCounts[w] || 0) + 1;
        this.safeTotalWords++;
      });
    }
  }

  predict(text) {
    const words = this.tokenize(text);
    const totalDocs = this.phishDocCount + this.safeDocCount;
    if (totalDocs === 0) return { probability: 0.5, label: 'safe' };

    let logPhish = Math.log(this.phishDocCount / totalDocs);
    let logSafe = Math.log(this.safeDocCount / totalDocs);
    const vocabSize = this.vocab.size;

    words.forEach((word) => {
      if (this.vocab.has(word)) {
        const pc = this.phishWordCounts[word] || 0;
        const sc = this.safeWordCounts[word] || 0;
        logPhish += Math.log((pc + 1) / (this.phishTotalWords + vocabSize));
        logSafe += Math.log((sc + 1) / (this.safeTotalWords + vocabSize));
      }
    });

    const maxLog = Math.max(logPhish, logSafe);
    const phishExp = Math.exp(logPhish - maxLog);
    const safeExp = Math.exp(logSafe - maxLog);
    const phishProb = phishExp / (phishExp + safeExp);

    return {
      probability: phishProb,
      label: phishProb > 0.5 ? 'phish' : 'safe',
    };
  }

  getStats() {
    return {
      totalDocs: this.phishDocCount + this.safeDocCount,
      vocabSize: this.vocab.size,
      phishDocs: this.phishDocCount,
      safeDocs: this.safeDocCount,
    };
  }
}

// Student-specific training corpus
const TRAINING_DATA = [
  // Phishing samples
  { label: 'phish', text: 'congratulations selected merit scholarship verify account details bank transfer fee processing deposit click link immediate release cash prize otp pin code confirm eligibility' },
  { label: 'phish', text: 'urgent notice overdue tuition fees course registration suspended immediately register login payment gateway transfer upi handle phonepe balance cancellation penalty' },
  { label: 'phish', text: 'placement cell mandatory training fee deposit confirm job vacancy drive offer letter background check register link pay deposit secure salary seat interview slot' },
  { label: 'phish', text: 'win free ipad giveaway quiz winner claim award click details card digits security code cvv login net banking otp code verify mobile' },
  { label: 'phish', text: 'official warning legal action billing suspended account verify net banking credentials card cvv pins aadhaar number share details immediately' },
  { label: 'phish', text: 'scholarship grant approved processing charge rupees transfer bank account details upi pin otp verification form click below link deadline today' },
  { label: 'phish', text: 'internship opportunity guaranteed stipend security deposit required pay advance registration fee selected candidate background verification charges' },
  // Safe samples
  { label: 'safe', text: 'dear student application merit scholarship portal now open submit documents dean student office details portal link free registration no fee charged' },
  { label: 'safe', text: 'semester fee payment gateway portal student erp safe login college bank transfers fee bills accounts officer notify details never share otp' },
  { label: 'safe', text: 'placement drive notification company seminar orientation schedule bring resume update formals eligibility lists details campus recruitment' },
  { label: 'safe', text: 'registration details hackathon college student council details trophies certificates stage cash award participation free event' },
  { label: 'safe', text: 'security advisory college board bank details otps net banking pin never shared requested email notification stay alert report suspicious' },
  { label: 'safe', text: 'reminder workshop technical festival registration open no charges participate learn faculty guidance industry experts' },
  { label: 'safe', text: 'exam schedule released check official portal download hall ticket student login credentials personal keep safe do not share' },
];

// Create, train, and export the classifier instance
const classifier = new NaiveBayesClassifier();
TRAINING_DATA.forEach((item) => classifier.train(item.text, item.label));

export default classifier;

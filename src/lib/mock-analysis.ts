import type { AnalysisResult } from "./analysis-types";

/**
 * Mock analysis system.
 * Used automatically when the AI/OCR service is unavailable, so the whole
 * upload → analyze → results flow can be demonstrated offline.
 * Picks a template from keywords in the file name, else rotates through them.
 */

const TEMPLATES: Record<string, AnalysisResult> = {
  card: {
    objectName: "Debit card",
    category: "Payment card",
    confidence: 94,
    summary:
      "A plastic bank card linked to a current or savings account. The front shows the bank name, a masked card number, the holder's name and an expiry date.",
    extractedText: ["NOVA BANK", "4029 •••• •••• 1884", "J. RIVERA", "VALID THRU 09/28", "DEBIT"],
    meanings: [
      { label: "4029 •••• 1884", explanation: "The card number. Only the last 4 digits are shown here for safety." },
      { label: "VALID THRU 09/28", explanation: "The card stops working after September 2028 and the bank will send a replacement." },
      { label: "Chip (gold square)", explanation: "Stores the card data securely for tap or insert payments." },
      { label: "DEBIT", explanation: "Money is taken directly from the linked bank account." },
    ],
    usage:
      "Tap or insert the card at a shop terminal and enter your PIN if asked. For online shopping, the number, expiry and the 3-digit CVV on the back are typed in.",
    instructions: ["Sign the back strip when the card arrives.", "Keep the PIN memorised, never written on the card.", "Check the expiry date before travelling."],
    warnings: ["Never share the card number, CVV, PIN or OTP with anyone.", "Report a lost or stolen card to the bank immediately."],
    sensitiveDataDetected: true,
    sensitiveDataNote: "A card number was visible in the image. It has been masked and is not stored.",
  },
  medicine: {
    objectName: "Medicine box",
    category: "Pharmaceutical packaging",
    confidence: 96,
    summary: "A cardboard carton for paracetamol tablets. The label shows the drug name, strength, quantity, dosage guidance, batch and expiry.",
    extractedText: ["PARACETAMOL 500 mg", "10 TABLETS", "Take 1 tablet every 6–8 hours as needed", "Do not exceed 4 tablets in 24 hours", "Batch: P4X9", "Exp: 08/2026", "Store below 25°C"],
    meanings: [
      { label: "500 mg", explanation: "The strength — each tablet contains 500 milligrams of the active ingredient." },
      { label: "Every 6–8 hours", explanation: "The minimum gap you must leave between doses." },
      { label: "Batch: P4X9", explanation: "A production code used to trace the pack if there is ever a recall." },
      { label: "Exp: 08/2026", explanation: "Do not use the medicine after August 2026." },
    ],
    usage: "A common pain reliever and fever reducer. Swallow the tablet whole with water, with or without food, following the dose on the box or your doctor's advice.",
    instructions: ["Read the leaflet inside the box before first use.", "Store in a cool, dry place away from sunlight.", "Keep the box to check the batch and expiry later."],
    warnings: ["Do not exceed the maximum daily dose.", "Keep out of reach of children.", "Ask a pharmacist before combining with other medicines."],
    sensitiveDataDetected: false,
    sensitiveDataNote: "",
  },
  ticket: {
    objectName: "Train ticket",
    category: "Travel document",
    confidence: 91,
    summary: "A printed rail ticket showing the journey, date, coach and seat, plus a scannable QR code for inspection.",
    extractedText: ["INDIAN RAILWAYS", "PNR 8402519633", "NDLS → BCT", "12951 RAJDHANI EXP", "DATE 14-10-2026", "COACH B4 · SEAT 27 LB", "FARE ₹2,145"],
    meanings: [
      { label: "PNR", explanation: "A 10-digit booking reference used to check your ticket status." },
      { label: "NDLS → BCT", explanation: "Station codes: New Delhi to Mumbai Central." },
      { label: "B4 · 27 LB", explanation: "Coach B4, seat 27, lower berth." },
      { label: "QR code", explanation: "Scanned by the ticket checker to verify the booking." },
    ],
    usage: "Show the ticket (printed or on your phone) with a photo ID to the ticket checker on board. Board the coach printed on the ticket.",
    instructions: ["Arrive at the platform 20 minutes before departure.", "Carry the same ID used while booking.", "Check the live coach position on the platform display."],
    warnings: ["The ticket is valid only for the printed date and train.", "Do not share the PNR publicly — it can reveal travel details."],
    sensitiveDataDetected: false,
    sensitiveDataNote: "",
  },
  bill: {
    objectName: "Electricity bill",
    category: "Utility statement",
    confidence: 93,
    summary: "A monthly electricity statement listing the consumer number, billing period, units used, the amount due and the due date.",
    extractedText: ["STATE POWER BOARD", "Consumer No: 10442 88 731", "Billing period: 01 Aug – 31 Aug", "Units consumed: 212 kWh", "Amount due: ₹1,486.00", "Due date: 18 Sep 2026", "Late fee after due date: ₹50"],
    meanings: [
      { label: "Consumer No", explanation: "Your unique account number with the power board — needed for any query." },
      { label: "212 kWh", explanation: "Units of electricity used this month (1 unit = 1 kilowatt-hour)." },
      { label: "Due date", explanation: "The last day to pay without a late fee." },
    ],
    usage: "Review the units and amount, then pay through the provider's approved channels before the due date. Keep it as proof of address and payment.",
    instructions: ["Compare units with last month to spot unusual usage.", "Keep the bill for at least a year for records."],
    warnings: ["Only pay through official channels listed on the bill.", "Never share OTPs with anyone claiming to be from the power board."],
    sensitiveDataDetected: false,
    sensitiveDataNote: "",
  },
  label: {
    objectName: "Appliance rating label",
    category: "Product label",
    confidence: 90,
    summary: "An energy-rating and specification sticker from a refrigerator, showing the star rating, yearly electricity use, model number and capacity.",
    extractedText: ["BEE STAR RATING ★★★★", "Annual Energy Consumption: 189 kWh/year", "Model: RF-260DSX", "Gross Volume: 260 L", "Voltage: 230 V ~ 50 Hz", "Label Period: 2025"],
    meanings: [
      { label: "★★★★", explanation: "Four stars out of five — the appliance is quite energy efficient." },
      { label: "189 kWh/year", explanation: "Roughly how much electricity it uses in a year under standard testing." },
      { label: "230 V ~ 50 Hz", explanation: "The mains power it needs — standard household supply in India." },
      { label: "Model: RF-260DSX", explanation: "Quote this when booking service or buying spare parts." },
    ],
    usage: "The label helps compare running costs between models. Keep the model number handy for warranty and service calls.",
    instructions: ["Plug into a properly earthed socket.", "Leave space behind the appliance for ventilation."],
    warnings: ["Do not use with a damaged power cord.", "Star ratings are only comparable within the same label period."],
    sensitiveDataDetected: false,
    sensitiveDataNote: "",
  },
  document: {
    objectName: "Courier delivery slip",
    category: "Document",
    confidence: 88,
    summary: "A shipping label from a parcel showing the tracking number, sender, receiver, weight and a barcode for scanning.",
    extractedText: ["BLUEDART EXPRESS", "AWB: 6942 1187 3350", "From: Warehouse 7, Bengaluru", "To: A. Sharma, Hyderabad 500081", "Weight: 1.2 kg", "COD: NO", "Handle with care"],
    meanings: [
      { label: "AWB", explanation: "Air Waybill — the tracking number you type on the courier's website." },
      { label: "COD: NO", explanation: "Cash on delivery is not required; the item is already paid for." },
      { label: "Barcode", explanation: "Scanned at each stop so the parcel's journey can be tracked." },
    ],
    usage: "Use the AWB number to track the parcel. Keep the slip until the item is checked, in case you need to return it.",
    instructions: ["Check the receiver's name and address before accepting.", "Photograph the slip before discarding the box."],
    warnings: ["Do not share the tracking number with strangers.", "Peel off the label before recycling the box to protect your address."],
    sensitiveDataDetected: false,
    sensitiveDataNote: "",
  },
};

const KEYWORDS: Array<[RegExp, keyof typeof TEMPLATES]> = [
  [/card|debit|credit|atm|bank/i, "card"],
  [/med|tablet|pill|drug|pharma|strip|syrup/i, "medicine"],
  [/ticket|boarding|pass|rail|train|flight|bus/i, "ticket"],
  [/bill|invoice|receipt|statement/i, "bill"],
  [/label|appliance|fridge|rating|sticker|spec/i, "label"],
  [/doc|slip|letter|form|courier|parcel/i, "document"],
];

let rotation = 0;

export function mockAnalyze(fileName: string): AnalysisResult {
  for (const [pattern, key] of KEYWORDS) {
    const hit = TEMPLATES[key];
    if (hit && pattern.test(fileName)) return hit;
  }
  const values = Object.values(TEMPLATES);
  const picked = values[rotation % values.length] ?? values[0]!;
  rotation += 1;
  return picked;
}

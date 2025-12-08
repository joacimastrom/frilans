import { Scenario } from "@/models/home-comparison";

const STORAGE_KEY = "homeComparison_v1";

/**
 * Simple string compression for URL sharing
 * Uses basic compression to reduce URL length
 */
function compressData(data: string): string {
  try {
    // Basic compression: replace common patterns
    return btoa(
      data
        .replace(/"startingAmount"/g, '"sA"')
        .replace(/"monthlyDeposit"/g, '"mD"')
        .replace(/"expectedYearlyGrowth"/g, '"eYG"')
        .replace(/"investmentAccountType"/g, '"iAT"')
        .replace(/"downPayment"/g, '"dP"')
        .replace(/"loanAmount"/g, '"lA"')
        .replace(/"yearlyInterestRate"/g, '"yIR"')
        .replace(/"monthlyAmortering"/g, '"mA"')
        .replace(/"monthlyCosts"/g, '"mC"')
        .replace(/"yearlyIncrease"/g, '"yI"')
        .replace(/"amorteringsbefrielse"/g, '"aB"')
        .replace(/"expectedSellingPrice"/g, '"eSP"')
        .replace(/"yearlyPriceGrowth"/g, '"yPG"')
        .replace(/"yearsUntilSale"/g, '"yUS"')
        .replace(/"mäklarkostnad"/g, '"mK"')
        .replace(/"investment"/g, '"i"')
        .replace(/"homeOwnership"/g, '"hO"')
        .replace(/"selling"/g, '"s"')
        .replace(/"isBaseline"/g, '"iB"')
        .replace(/"avgift"/g, '"av"')
        .replace(/"drift"/g, '"dr"')
        .replace(/"värme"/g, '"vä"')
        .replace(/"försäkring"/g, '"fö"')
        .replace(/"övrigt"/g, '"öv"')
    );
  } catch (error) {
    console.error("Error compressing data:", error);
    return btoa(data);
  }
}

/**
 * Decompress data from URL
 */
function decompressData(compressed: string): string {
  try {
    const base64Decoded = atob(compressed);
    // Reverse the compression replacements
    return base64Decoded
      .replace(/"sA"/g, '"startingAmount"')
      .replace(/"mD"/g, '"monthlyDeposit"')
      .replace(/"eYG"/g, '"expectedYearlyGrowth"')
      .replace(/"iAT"/g, '"investmentAccountType"')
      .replace(/"dP"/g, '"downPayment"')
      .replace(/"lA"/g, '"loanAmount"')
      .replace(/"yIR"/g, '"yearlyInterestRate"')
      .replace(/"mA"/g, '"monthlyAmortering"')
      .replace(/"mC"/g, '"monthlyCosts"')
      .replace(/"yI"/g, '"yearlyIncrease"')
      .replace(/"aB"/g, '"amorteringsbefrielse"')
      .replace(/"eSP"/g, '"expectedSellingPrice"')
      .replace(/"yPG"/g, '"yearlyPriceGrowth"')
      .replace(/"yUS"/g, '"yearsUntilSale"')
      .replace(/"mK"/g, '"mäklarkostnad"')
      .replace(/"i"/g, '"investment"')
      .replace(/"hO"/g, '"homeOwnership"')
      .replace(/"s"/g, '"selling"')
      .replace(/"iB"/g, '"isBaseline"')
      .replace(/"av"/g, '"avgift"')
      .replace(/"dr"/g, '"drift"')
      .replace(/"vä"/g, '"värme"')
      .replace(/"fö"/g, '"försäkring"')
      .replace(/"öv"/g, '"övrigt"');
  } catch (error) {
    console.error("Error decompressing data:", error);
    return atob(compressed);
  }
}

/**
 * Save scenarios to localStorage
 */
export function saveScenarios(scenarios: Scenario[]): void {
  try {
    const data = JSON.stringify(scenarios);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error("Error saving scenarios to localStorage:", error);
  }
}

/**
 * Load scenarios from localStorage
 */
export function loadScenarios(): Scenario[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    return JSON.parse(data) as Scenario[];
  } catch (error) {
    console.error("Error loading scenarios from localStorage:", error);
    return null;
  }
}

/**
 * Clear all scenarios from localStorage
 */
export function clearScenarios(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing scenarios from localStorage:", error);
  }
}

/**
 * Generate shareable URL with compressed scenario data
 */
export function generateShareableUrl(scenarios: Scenario[]): string {
  try {
    const data = JSON.stringify(scenarios);
    const compressed = compressData(data);
    const currentUrl = window.location.origin + window.location.pathname;
    return `${currentUrl}?data=${encodeURIComponent(compressed)}`;
  } catch (error) {
    console.error("Error generating shareable URL:", error);
    return window.location.href;
  }
}

/**
 * Load scenarios from URL parameters
 */
export function loadScenariosFromUrl(): Scenario[] | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const compressed = urlParams.get("data");

    if (!compressed) return null;

    const decompressed = decompressData(decodeURIComponent(compressed));
    return JSON.parse(decompressed) as Scenario[];
  } catch (error) {
    console.error("Error loading scenarios from URL:", error);
    return null;
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
}

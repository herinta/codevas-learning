import { LiveEvalResult } from "./types";

/**
 * Live flexible CSS/HTML goal evaluator for real-time validation without needing a submit button!
 */
export function evaluateLiveGoals(
  challengeId: string,
  cssCode: string
): LiveEvalResult {
  const normalized = cssCode.toLowerCase().replace(/\s+/g, " ");

  // ================= HTML ARCHITECTURE LEVELS 1-12 =================
  if (challengeId === "html-1-raw-content") {
    const hasH1 = /<h1[^>]*>[\s\S]*Profil Saya[\s\S]*<\/h1>/i.test(cssCode);
    return {
      passed: hasH1,
      goals: [{ label: "<h1>Profil Saya</h1>", passed: hasH1 }],
    };
  }

  if (challengeId === "html-2-paragraph") {
    const hasH1 = /<h1[^>]*>[\s\S]*<\/h1>/i.test(cssCode);
    const hasP = /<p[^>]*>[\s\S]+<\/p>/i.test(cssCode);
    return {
      passed: hasH1 && hasP,
      goals: [
        { label: "Judul <h1>Profil Saya</h1>", passed: hasH1 },
        { label: "Paragraf <p> deskripsi dirimu", passed: hasP },
      ],
    };
  }

  if (challengeId === "html-3-first-box") {
    const hasDiv = /<div[^>]*>[\s\S]*<h1[\s\S]*<p[\s\S]*<\/div>/i.test(cssCode);
    const hasBothTags = /<h1[^>]*>[\s\S]*<\/h1>/i.test(cssCode) && /<p[^>]*>[\s\S]*<\/p>/i.test(cssCode);
    const passed = hasDiv && hasBothTags;
    return {
      passed,
      goals: [
        { label: "<div> pembungkus (Parent container)", passed: hasDiv },
        { label: "Nesting: <h1> dan <p> di dalam <div>", passed: hasBothTags && hasDiv },
      ],
    };
  }

  if (challengeId === "html-4-siblings") {
    const divs = cssCode.match(/<div[^>]*>[\s\S]*?<\/div>/gi);
    const hasTwoDivs = Boolean(divs && divs.length >= 2);
    return {
      passed: hasTwoDivs,
      goals: [
        { label: "<div> pertama untuk blok atas", passed: Boolean(divs && divs.length >= 1) },
        { label: "<div> kedua sejajar (Sibling)", passed: hasTwoDivs },
      ],
    };
  }

  if (challengeId === "html-5-matryoshka") {
    const hasParentAndChildren = /<div[^>]*>[\s\S]*<div[^>]*>[\s\S]*?<\/div>[\s\S]*<div[^>]*>[\s\S]*?<\/div>[\s\S]*<\/div>/i.test(cssCode);
    return {
      passed: hasParentAndChildren,
      goals: [
        { label: "Satu <div> Parent pembungkus utama", passed: /<div[^>]*>[\s\S]*<\/div>/i.test(cssCode) },
        { label: "Dua <div> Child di dalam Parent (Nesting)", passed: hasParentAndChildren },
      ],
    };
  }

  if (challengeId === "html-6-image-element") {
    const hasImg = /<img\b[^>]*>/i.test(cssCode);
    const hasSrc = /<img\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>/i.test(cssCode);
    return {
      passed: hasImg && hasSrc,
      goals: [
        { label: "Tag <img> self-closing", passed: hasImg },
        { label: "Atribut src dengan link gambar", passed: hasSrc },
      ],
    };
  }

  if (challengeId === "html-7-action-button") {
    const hasButton = /<button[^>]*>[\s\S]*Follow[\s\S]*<\/button>/i.test(cssCode);
    return {
      passed: hasButton,
      goals: [{ label: "Tag <button> dengan teks 'Follow'", passed: hasButton }],
    };
  }

  if (challengeId === "html-8-link") {
    const hasLink = /<a\b[^>]*\bhref\s*=\s*["'][^"']+["'][^>]*>[\s\S]+<\/a>/i.test(cssCode);
    return {
      passed: hasLink,
      goals: [{ label: "Tag <a> dengan atribut href", passed: hasLink }],
    };
  }

  if (challengeId === "html-9-list-hierarchy") {
    const hasUl = /<ul[^>]*>[\s\S]*<\/ul>/i.test(cssCode);
    const hasLi = /<ul[^>]*>[\s\S]*<li[^>]*>[\s\S]*?<\/li>[\s\S]*<\/ul>/i.test(cssCode);
    return {
      passed: hasUl && hasLi,
      goals: [
        { label: "Pembungkus daftar <ul>", passed: hasUl },
        { label: "Item daftar <li> di dalam <ul>", passed: hasLi },
      ],
    };
  }

  if (challengeId === "html-10-semantic-touch") {
    const hasSection = /<section[^>]*>[\s\S]+<\/section>/i.test(cssCode);
    return {
      passed: hasSection,
      goals: [{ label: "Tag semantik <section> sebagai pembungkus", passed: hasSection }],
    };
  }

  if (challengeId === "html-11-form-wrapper") {
    const hasForm = /<form[^>]*>[\s\S]*<\/form>/i.test(cssCode);
    const hasInput = /<form[^>]*>[\s\S]*<input\b[^>]*>[\s\S]*<\/form>/i.test(cssCode);
    const hasButton = /<form[^>]*>[\s\S]*<button\b[^>]*>[\s\S]*<\/button>[\s\S]*<\/form>/i.test(cssCode);
    return {
      passed: hasForm && hasInput && hasButton,
      goals: [
        { label: "Wadah formulir <form>", passed: hasForm },
        { label: "Elemen input <input>", passed: hasInput },
        { label: "Tombol aksi <button>", passed: hasButton },
      ],
    };
  }

  if (challengeId === "html-12-boss-card") {
    const hasImg = /<img\b[^>]*>/i.test(cssCode);
    const hasInnerDiv = /<div[^>]*>[\s\S]*<div[^>]*>[\s\S]*<\/div>[\s\S]*<\/div>/i.test(cssCode);
    const hasHead = /<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/i.test(cssCode);
    const hasP = /<p[^>]*>[\s\S]*?<\/p>/i.test(cssCode);
    const hasBtn = /<button[^>]*>[\s\S]*?<\/button>/i.test(cssCode);
    const passed = hasImg && hasInnerDiv && hasHead && hasP && hasBtn;
    return {
      passed,
      goals: [
        { label: "<div> Parent utama Profile Card", passed: /<div[^>]*>[\s\S]*<\/div>/i.test(cssCode) },
        { label: "Tag <img /> Avatar foto", passed: hasImg },
        { label: "<div> Child pembungkus teks", passed: hasInnerDiv },
        { label: "Elemen <h2>, <p>, dan <button>", passed: hasHead && hasP && hasBtn },
      ],
    };
  }

  // ================= CSS BASICS (12 Levels) =================
  if (challengeId === "css-basics-1-background-color") {
    const passed = /background-color\s*:\s*(lightblue|#add8e6|rgb\(\s*173\s*,\s*216\s*,\s*230\s*\)|sky-?blue|#38bdf8|#60a5fa)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "background-color: lightblue;", passed }],
    };
  }

  if (challengeId === "css-basics-2-text-color") {
    const passed = /color\s*:\s*(#333|#333333|black|#000|#000000|rgb\(\s*51\s*,\s*51\s*,\s*51\s*\)|#1e293b|#0f172a)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "color: #333;", passed }],
    };
  }

  if (challengeId === "css-basics-3-font-size") {
    const passed = /font-size\s*:\s*(24px|1\.5rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-size: 24px;", passed }],
    };
  }

  if (challengeId === "css-basics-4-font-weight") {
    const passed = /font-weight\s*:\s*(bold|700|800|900)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-weight: bold;", passed }],
    };
  }

  if (challengeId === "css-basics-5-font-style") {
    const passed = /font-style\s*:\s*italic/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-style: italic;", passed }],
    };
  }

  if (challengeId === "css-basics-6-text-align") {
    const passed = /text-align\s*:\s*center/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "text-align: center;", passed }],
    };
  }

  if (challengeId === "css-basics-7-padding") {
    const passed = /padding\s*:\s*(20px|1\.25rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "padding: 20px;", passed }],
    };
  }

  if (challengeId === "css-basics-8-margin") {
    const passed = /margin\s*:\s*(15px|16px|1rem|20px)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "margin: 15px;", passed }],
    };
  }

  if (challengeId === "css-basics-9-border") {
    const passed = /border\s*:\s*2px\s+solid/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "border: 2px solid black;", passed }],
    };
  }

  if (challengeId === "css-basics-10-border-radius") {
    const passed = /border-radius\s*:\s*(12px|0\.75rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "border-radius: 12px;", passed }],
    };
  }

  if (challengeId === "css-basics-11-box-shadow") {
    const passed = /box-shadow\s*:\s*0px?\s+4px?\s+10px?/i.test(cssCode) || /box-shadow\s*:\s*[^;]+/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "box-shadow: 0px 4px 10px rgba(0,0,0,0.1);", passed }],
    };
  }

  if (challengeId === "css-basics-12-boss-fight") {
    const g1 = /background(-color)?\s*:\s*(#ef4444|red|#dc2626|#f87171)/i.test(cssCode);
    const g2 = /color\s*:\s*(white|#fff|#ffffff)/i.test(cssCode);
    const g3 = /padding\s*:\s*8px\s+16px/i.test(cssCode) || /padding\s*:\s*(8px|16px|12px|10px)/i.test(cssCode);
    const g4 = /border-radius\s*:\s*(999px|9999px|50px|50%|24px)/i.test(cssCode);
    return {
      passed: g1 && g2 && g3 && g4,
      goals: [
        { label: "background-color: #ef4444;", passed: g1 },
        { label: "color: white;", passed: g2 },
        { label: "padding: 8px 16px;", passed: g3 },
        { label: "border-radius: 999px;", passed: g4 },
      ],
    };
  }

  // ================= CSS FLEXBOX (12 Levels) =================
  if (challengeId === "flexbox-1-activation" || challengeId === "fb-1") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "display: flex;", passed: g1 }],
    };
  }

  if (challengeId === "flexbox-2-push-justify-end" || challengeId === "fb-2") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*(flex-end|end)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: flex-end;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-3-center-stage" || challengeId === "fb-3") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*center/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: center;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-4-split-space-between" || challengeId === "fb-4") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*space-between/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: space-between;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-5-social-distancing" || challengeId === "fb-5") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*(space-evenly|space-around)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: space-evenly;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-6-gravity-align-items" || challengeId === "fb-6") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /align-items\s*:\s*center/.test(normalized) || /place-items\s*:\s*center/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "align-items: center;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-7-floor-align-end" || challengeId === "fb-7") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /align-items\s*:\s*(flex-end|end)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "align-items: flex-end;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-8-column-direction" || challengeId === "fb-8") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /flex-direction\s*:\s*column\b/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "flex-direction: column;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-9-gap" || challengeId === "fb-9") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /gap\s*:\s*(20px|1\.25rem)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "gap: 20px;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-10-overflow-wrap" || challengeId === "fb-10") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /flex-wrap\s*:\s*wrap\b/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "flex-wrap: wrap;", passed: g2 },
      ],
    };
  }

  if (challengeId === "flexbox-11-perfect-center" || challengeId === "fb-11") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*center/.test(normalized) || /place-items\s*:\s*center/.test(normalized);
    const g3 = /align-items\s*:\s*center/.test(normalized) || /place-items\s*:\s*center/.test(normalized);
    return {
      passed: g1 && g2 && g3,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: center;", passed: g2 },
        { label: "align-items: center;", passed: g3 },
      ],
    };
  }

  if (challengeId === "flexbox-12-boss-modern-navbar" || challengeId === "fb-12") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    const g2 = /justify-content\s*:\s*space-between/.test(normalized);
    const g3 = /align-items\s*:\s*center/.test(normalized);
    return {
      passed: g1 && g2 && g3,
      goals: [
        { label: "display: flex;", passed: g1 },
        { label: "justify-content: space-between;", passed: g2 },
        { label: "align-items: center;", passed: g3 },
      ],
    };
  }

  // ================= CSS GRID (12 Levels) =================
  if (challengeId === "grid-1-blueprint" || challengeId === "gr-1" || challengeId === "grid-1-two-columns") {
    const g1 = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const g2 = /grid-template-columns\s*:\s*(1fr\s+1fr|repeat\(\s*2\s*,\s*1fr\s*\)|50%\s+50%)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: grid;", passed: g1 },
        { label: "grid-template-columns: 1fr 1fr;", passed: g2 },
      ],
    };
  }

  if (challengeId === "grid-2-triplets" || challengeId === "gr-2") {
    const g1 = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const g2 = /grid-template-columns\s*:\s*(repeat\(\s*3\s*,\s*1fr\s*\)|1fr\s+1fr\s+1fr)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: grid;", passed: g1 },
        { label: "grid-template-columns: repeat(3, 1fr);", passed: g2 },
      ],
    };
  }

  if (challengeId === "grid-3-asymmetry" || challengeId === "gr-3") {
    const g1 = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const g2 = /grid-template-columns\s*:\s*(250px\s+1fr|250px\s+auto)/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: grid;", passed: g1 },
        { label: "grid-template-columns: 250px 1fr;", passed: g2 },
      ],
    };
  }

  if (challengeId === "grid-4-alleyway" || challengeId === "gr-4") {
    const g1 = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const g2 = /gap\s*:\s*(24px|1\.5rem)/.test(normalized) || /grid-gap\s*:\s*24px/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: grid;", passed: g1 },
        { label: "gap: 24px;", passed: g2 },
      ],
    };
  }

  if (challengeId === "grid-5-header-expansion" || challengeId === "gr-5") {
    const g1 = /grid-column\s*:\s*(span\s*3|1\s*\/\s*(4|-1))/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "grid-column: span 3;", passed: g1 }],
    };
  }

  if (challengeId === "grid-6-tower-expansion" || challengeId === "gr-6") {
    const g1 = /grid-row\s*:\s*(span\s*2|1\s*\/\s*3)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "grid-row: span 2;", passed: g1 }],
    };
  }

  if (challengeId === "grid-7-absolute-placement" || challengeId === "gr-7") {
    const g1 = /grid-column\s*:\s*(1\s*\/\s*3|1\s*\/\s*span\s*2)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "grid-column: 1 / 3;", passed: g1 }],
    };
  }

  if (challengeId === "grid-8-grid-center" || challengeId === "gr-8") {
    const g1 = /display\s*:\s*(grid|inline-grid)/.test(normalized);
    const g2 =
      /place-items\s*:\s*center/.test(normalized) ||
      (/justify-items\s*:\s*center/.test(normalized) && /align-items\s*:\s*center/.test(normalized));
    return {
      passed: g1 && g2,
      goals: [
        { label: "display: grid;", passed: g1 },
        { label: "place-items: center;", passed: g2 },
      ],
    };
  }

  if (challengeId === "grid-9-responsive-magic" || challengeId === "gr-9") {
    const g1 = /grid-template-columns\s*:\s*repeat\(\s*(auto-fit|auto-fill)\s*,\s*minmax\(\s*200px\s*,\s*1fr\s*\)\)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));", passed: g1 }],
    };
  }

  if (challengeId === "grid-10-grid-areas" || challengeId === "gr-10") {
    const g1 = /grid-area\s*:\s*header\b/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "grid-area: header;", passed: g1 }],
    };
  }

  if (challengeId === "grid-11-inception" || challengeId === "gr-11") {
    const g1 = /display\s*:\s*(flex|inline-flex)/.test(normalized);
    return {
      passed: g1,
      goals: [{ label: "display: flex; (di dalam kartu)", passed: g1 }],
    };
  }

  if (challengeId === "grid-12-boss-bento-dashboard" || challengeId === "gr-12") {
    const g1 = /grid-template-columns\s*:\s*(repeat\(\s*4\s*,\s*1fr\s*\)|1fr\s+1fr\s+1fr\s+1fr)/.test(normalized);
    const g2 = /grid-column\s*:\s*span\s*2/.test(normalized) || /grid-row\s*:\s*span\s*2/.test(normalized);
    return {
      passed: g1 && g2,
      goals: [
        { label: "grid-template-columns: repeat(4, 1fr);", passed: g1 },
        { label: "grid-column: span 2; (pada .card-1)", passed: g2 },
      ],
    };
  }

  return { passed: false, goals: [] };
}

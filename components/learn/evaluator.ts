import { LiveEvalResult } from "./types";

/**
 * Live flexible CSS/HTML goal evaluator for real-time validation without needing a submit button!
 */
export function evaluateLiveGoals(
  challengeId: string,
  cssCode: string
): LiveEvalResult {
  const normalized = cssCode.toLowerCase().replace(/\s+/g, " ");

  // ================= HTML ARCHITECTURE (20 Levels Focused on Divs & Containers) =================
  if (challengeId === "html-1-raw-content" || challengeId === "html-1") {
    const hasH1 = /<h1[^>]*>[\s\S]*profil[\s\S]*<\/h1>/i.test(cssCode);
    const hasName = /<p[^>]*>[^<]*nama\s*:[^<]+<\/p>/i.test(cssCode);
    const hasAge = /<p[^>]*>[^<]*umur\s*:[^<]+<\/p>/i.test(cssCode);
    const passed = hasH1 && hasName && hasAge;
    return {
      passed,
      goals: [
        { label: "Judul <h1>Profil Developer</h1>", passed: hasH1 },
        { label: "Data <p> untuk Nama (misal: Nama: Alex)", passed: hasName },
        { label: "Data <p> untuk Umur (misal: Umur: 16)", passed: hasAge },
      ],
    };
  }

  if (challengeId === "html-2-first-box" || challengeId === "html-2") {
    const hasDiv = /<div[^>]*>[\s\S]*<\/div>/i.test(cssCode);
    const hasEnclosed = /<div[^>]*>[\s\S]*<h1[\s\S]*<p[\s\S]*<\/div>/i.test(cssCode);
    const passed = hasDiv && hasEnclosed;
    return {
      passed,
      goals: [
        { label: "Wadah pembungkus <div> ... </div>", passed: hasDiv },
        { label: "Nesting: seluruh elemen profil di dalam <div>", passed: hasEnclosed },
      ],
    };
  }

  if (challengeId === "html-3-named-container" || challengeId === "html-3") {
    const hasNamedDiv = /<div[^>]*class\s*=\s*["'][^"']*\bprofile-card\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasEnclosed = /<div[^>]*class\s*=\s*["'][^"']*\bprofile-card\b[^"']*["'][^>]*>[\s\S]*<h1[\s\S]*<\/div>/i.test(cssCode);
    const passed = hasNamedDiv && hasEnclosed;
    return {
      passed,
      goals: [
        { label: "Kontainer <div class=\"profile-card\">", passed: hasNamedDiv },
        { label: "Seluruh elemen profil tertutup rapi di dalam div", passed: hasEnclosed },
      ],
    };
  }

  if (challengeId === "html-4-siblings" || challengeId === "html-4") {
    const divs = cssCode.match(/<div[^>]*>[\s\S]*?<\/div>/gi);
    const hasTwoDivs = Boolean(divs && divs.length >= 2);
    const hasNotesBox =
      /<div[^>]*class\s*=\s*["'][^"']*\b(notes-card|activity-card|note-box|status-box)\b[^"']*["'][^>]*>/i.test(cssCode) ||
      (/<h3[^>]*>[\s\S]*<\/h3>/i.test(cssCode) && /<p[^>]*>[\s\S]*<\/p>/i.test(cssCode) && Boolean(divs && divs.length >= 2));
    const passed = hasTwoDivs && hasNotesBox;
    return {
      passed,
      goals: [
        { label: "Dua kontainer <div> sejajar (Siblings)", passed: hasTwoDivs },
        { label: "Kontainer kedua <div class=\"notes-card\"> berisi <h3> dan <p>", passed: hasNotesBox },
      ],
    };
  }

  if (challengeId === "html-5-triple-stack" || challengeId === "html-5") {
    const hasTopBar = /<div[^>]*class\s*=\s*["'][^"']*\btop-bar\b[^"']*["'][^>]*>[\s\S]*<\/div>/i.test(cssCode);
    const hasContentArea = /<div[^>]*class\s*=\s*["'][^"']*\bcontent-area\b[^"']*["'][^>]*>[\s\S]*<\/div>/i.test(cssCode);
    const hasBottomBar = /<div[^>]*class\s*=\s*["'][^"']*\bbottom-bar\b[^"']*["'][^>]*>[\s\S]*<\/div>/i.test(cssCode);
    const passed = hasTopBar && hasContentArea && hasBottomBar;
    return {
      passed,
      goals: [
        { label: "Zona atas <div class=\"top-bar\">", passed: hasTopBar },
        { label: "Zona konten <div class=\"content-area\">", passed: hasContentArea },
        { label: "Zona bawah <div class=\"bottom-bar\">", passed: hasBottomBar },
      ],
    };
  }

  if (challengeId === "html-6-matryoshka" || challengeId === "html-6") {
    const hasParent = /<div[^>]*class\s*=\s*["'][^"']*\bcard\b[^"']*["'][^>]*>[\s\S]*<\/div>/i.test(cssCode) || /<div[^>]*>[\s\S]*<\/div>/i.test(cssCode);
    const hasDualChildren = /<div[^>]*class\s*=\s*["'][^"']*\bavatar-box\b[^"']*["'][^>]*>/i.test(cssCode) && /<div[^>]*class\s*=\s*["'][^"']*\binfo-box\b[^"']*["'][^>]*>/i.test(cssCode);
    const passed = hasParent && hasDualChildren;
    return {
      passed,
      goals: [
        { label: "1 Parent <div class=\"card\"> pembungkus", passed: hasParent },
        { label: "2 Child bersarang: avatar-box & info-box", passed: hasDualChildren },
      ],
    };
  }

  if (challengeId === "html-7-avatar-frame" || challengeId === "html-7") {
    const hasFrame = /<div[^>]*class\s*=\s*["'][^"']*\bavatar-frame\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasImg = /<img\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>/i.test(cssCode) && /<img\b[^>]*\balt\s*=\s*["'][^"']*["'][^>]*>/i.test(cssCode);
    const passed = hasFrame && hasImg;
    return {
      passed,
      goals: [
        { label: "Bingkai media <div class=\"avatar-frame\">", passed: hasFrame },
        { label: "Tag <img> di dalam frame dengan src dan alt", passed: hasImg },
      ],
    };
  }

  if (challengeId === "html-8-card-anatomy" || challengeId === "html-8") {
    const hasHeader = /<div[^>]*class\s*=\s*["'][^"']*\bcard-header\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasBody = /<div[^>]*class\s*=\s*["'][^"']*\bcard-body\b[^"']*["'][^>]*>/i.test(cssCode);
    const passed = hasHeader && hasBody;
    return {
      passed,
      goals: [
        { label: "Anatomi atas <div class=\"card-header\">", passed: hasHeader },
        { label: "Anatomi konten <div class=\"card-body\">", passed: hasBody },
      ],
    };
  }

  if (challengeId === "html-9-action-row" || challengeId === "html-9") {
    const hasRow = /<div[^>]*class\s*=\s*["'][^"']*\baction-row\b[^"']*["'][^>]*>/i.test(cssCode);
    const buttons = cssCode.match(/<button[^>]*>[\s\S]*?<\/button>/gi);
    const hasButtons = Boolean(buttons && buttons.length >= 2);
    const passed = hasRow && hasButtons;
    return {
      passed,
      goals: [
        { label: "Baris pembungkus <div class=\"action-row\">", passed: hasRow },
        { label: "Minimal 2 tombol <button> di dalam action-row", passed: hasButtons },
      ],
    };
  }

  if (challengeId === "html-10-badge-overlay" || challengeId === "html-10") {
    const hasBadge = /<div[^>]*class\s*=\s*["'][^"']*\b(badge-role|badge-tag|badge-pill|badge-status|badge-pro|badge)\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasText = /<div[^>]*class\s*=\s*["'][^"']*\b(badge-role|badge-tag|badge-pill|badge-status|badge-pro|badge)\b[^"']*["'][^>]*>[^<]+<\/div>/i.test(cssCode);
    const passed = hasBadge && hasText;
    return {
      passed,
      goals: [
        { label: "Label tag <div class=\"badge-role\">", passed: hasBadge },
        { label: "Memuat teks label profesi (misal: Frontend Developer)", passed: hasText },
      ],
    };
  }

  if (challengeId === "html-11-stats-columns" || challengeId === "html-11") {
    const hasStatsRow = /<div[^>]*class\s*=\s*["'][^"']*\b(metrics-row|stats-row)\b[^"']*["'][^>]*>/i.test(cssCode);
    const statBoxes = cssCode.match(/<div[^>]*class\s*=\s*["'][^"']*\b(metric-box|stat-box)\b[^"']*["'][^>]*>/gi);
    const hasThreeStats = Boolean(statBoxes && statBoxes.length >= 3);
    const passed = hasStatsRow && hasThreeStats;
    return {
      passed,
      goals: [
        { label: "Baris metrik <div class=\"metrics-row\">", passed: hasStatsRow },
        { label: "3 Kotak metrik <div class=\"metric-box\">", passed: hasThreeStats },
      ],
    };
  }

  if (challengeId === "html-12-modular-card" || challengeId === "html-12") {
    const hasParent = /<div[^>]*class\s*=\s*["'][^"']*\bprofile-card\b[^"']*["'][^>]*>/i.test(cssCode) || /<div[^>]*class\s*=\s*["'][^"']*\bcard\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasHeader = /<div[^>]*class\s*=\s*["'][^"']*\bcard-header\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasBody = /<div[^>]*class\s*=\s*["'][^"']*\bcard-body\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasStats = /<div[^>]*class\s*=\s*["'][^"']*\b(metrics-row|stats-row)\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasFooter = /<div[^>]*class\s*=\s*["'][^"']*\b(card-footer|action-row)\b[^"']*["'][^>]*>/i.test(cssCode);
    const passed = hasParent && hasHeader && hasBody && hasStats && hasFooter;
    return {
      passed,
      goals: [
        { label: "Parent <div class=\"profile-card\">", passed: hasParent },
        { label: "<div class=\"card-header\"> (Avatar Frame & Badge Tag)", passed: hasHeader },
        { label: "<div class=\"card-body\"> (Biodata & Metrics Row)", passed: hasBody && hasStats },
        { label: "<div class=\"card-footer\"> (Action Row 2 Tombol)", passed: hasFooter },
      ],
    };
  }

  if (challengeId === "html-13-split-layout" || challengeId === "html-13") {
    const hasLayout = /<div[^>]*class\s*=\s*["'][^"']*\bapp-layout\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasSidebar = /<div[^>]*class\s*=\s*["'][^"']*\bsidebar\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasMain = /<div[^>]*class\s*=\s*["'][^"']*\bmain-content\b[^"']*["'][^>]*>/i.test(cssCode);
    const passed = hasLayout && hasSidebar && hasMain;
    return {
      passed,
      goals: [
        { label: "Pembungkus layar <div class=\"app-layout\">", passed: hasLayout },
        { label: "Panel bilah samping <div class=\"sidebar\">", passed: hasSidebar },
        { label: "Panel area kerja <div class=\"main-content\">", passed: hasMain },
      ],
    };
  }

  if (challengeId === "html-14-sidebar-nav" || challengeId === "html-14") {
    const hasBrand = /<div[^>]*class\s*=\s*["'][^"']*\bbrand-box\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasMenu = /<div[^>]*class\s*=\s*["'][^"']*\bmenu-box\b[^"']*["'][^>]*>/i.test(cssCode);
    const lis = cssCode.match(/<li[^>]*>[\s\S]*?<\/li>/gi);
    const hasThreeLis = Boolean(lis && lis.length >= 3);
    const passed = hasBrand && hasMenu && hasThreeLis;
    return {
      passed,
      goals: [
        { label: "Wadah logo/nama <div class=\"brand-box\">", passed: hasBrand },
        { label: "Wadah menu navigasi <div class=\"menu-box\">", passed: hasMenu },
        { label: "Daftar <ul> dengan minimal 3 <li> item", passed: hasThreeLis },
      ],
    };
  }

  if (challengeId === "html-15-content-cards" || challengeId === "html-15") {
    const hasBanner = /<div[^>]*class\s*=\s*["'][^"']*\bbanner-card\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasOverview = /<div[^>]*class\s*=\s*["'][^"']*\boverview-card\b[^"']*["'][^>]*>/i.test(cssCode);
    const passed = hasBanner && hasOverview;
    return {
      passed,
      goals: [
        { label: "Kartu selamat datang <div class=\"banner-card\">", passed: hasBanner },
        { label: "Kartu target koding <div class=\"overview-card\">", passed: hasOverview },
      ],
    };
  }

  if (challengeId === "html-16-form-group" || challengeId === "html-16") {
    const hasForm = /<form[^>]*>[\s\S]*<\/form>/i.test(cssCode);
    const groups = cssCode.match(/<div[^>]*class\s*=\s*["'][^"']*\bform-group\b[^"']*["'][^>]*>/gi);
    const hasTwoGroups = Boolean(groups && groups.length >= 2);
    const inputs = cssCode.match(/<input\b[^>]*>/gi);
    const hasInputs = Boolean(inputs && inputs.length >= 2);
    const hasButton = /<button[^>]*>[\s\S]*<\/button>/i.test(cssCode);
    const passed = hasForm && hasTwoGroups && hasInputs && hasButton;
    return {
      passed,
      goals: [
        { label: "Wadah formulir <form>", passed: hasForm },
        { label: "Minimal 2 pembungkus <div class=\"form-group\">", passed: hasTwoGroups },
        { label: "Masing-masing berisi <label> dan <input>", passed: hasInputs },
        { label: "Tombol submit <button>", passed: hasButton },
      ],
    };
  }

  if (challengeId === "html-17-modal-dialog" || challengeId === "html-17") {
    const hasOverlay = /<div[^>]*class\s*=\s*["'][^"']*\bmodal-overlay\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasBox = /<div[^>]*class\s*=\s*["'][^"']*\bmodal-box\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasContent = /<h3\b/i.test(cssCode) && /<button\b/i.test(cssCode);
    const passed = hasOverlay && hasBox && hasContent;
    return {
      passed,
      goals: [
        { label: "Box luar <div class=\"modal-overlay\">", passed: hasOverlay },
        { label: "Box popup tengah <div class=\"modal-box\">", passed: hasBox },
        { label: "Memuat judul <h3>, paragraf, dan tombol <button>", passed: hasContent },
      ],
    };
  }

  if (challengeId === "html-18-bento-grid" || challengeId === "html-18") {
    const hasBento = /<div[^>]*class\s*=\s*["'][^"']*\bbento-container\b[^"']*["'][^>]*>/i.test(cssCode);
    const items = cssCode.match(/<div[^>]*class\s*=\s*["'][^"']*\bbento-item\b[^"']*["'][^>]*>/gi);
    const hasFourItems = Boolean(items && items.length >= 4);
    const passed = hasBento && hasFourItems;
    return {
      passed,
      goals: [
        { label: "Wadah induk <div class=\"bento-container\">", passed: hasBento },
        { label: "Minimal 4 box modular <div class=\"bento-item\">", passed: hasFourItems },
      ],
    };
  }

  if (challengeId === "html-19-semantic-hybrid" || challengeId === "html-19") {
    const hasHeader = /<header[^>]*>[\s\S]*<div[^>]*class\s*=\s*["'][^"']*\bcontainer\b[^"']*["'][^>]*>[\s\S]*<\/div>[\s\S]*<\/header>/i.test(cssCode);
    const hasMain = /<main[^>]*>[\s\S]*<div[^>]*class\s*=\s*["'][^"']*\bcontainer\b[^"']*["'][^>]*>[\s\S]*<\/div>[\s\S]*<\/main>/i.test(cssCode);
    const hasFooter = /<footer[^>]*>[\s\S]*<div[^>]*class\s*=\s*["'][^"']*\bcontainer\b[^"']*["'][^>]*>[\s\S]*<\/div>[\s\S]*<\/footer>/i.test(cssCode);
    const passed = hasHeader && hasMain && hasFooter;
    return {
      passed,
      goals: [
        { label: "<header> membungkus <div class=\"container\">", passed: hasHeader },
        { label: "<main> membungkus <div class=\"container\">", passed: hasMain },
        { label: "<footer> membungkus <div class=\"container\">", passed: hasFooter },
      ],
    };
  }

  if (challengeId === "html-20-boss-dashboard" || challengeId === "html-20") {
    const hasLayout = /<div[^>]*class\s*=\s*["'][^"']*\bdashboard-layout\b[^"']*["'][^>]*>/i.test(cssCode);
    const hasSidebar = /<div[^>]*class\s*=\s*["'][^"']*\bsidebar\b[^"']*["'][^>]*>/i.test(cssCode) && /<ul\b/i.test(cssCode);
    const hasMain = /<div[^>]*class\s*=\s*["'][^"']*\bmain-panel\b[^"']*["'][^>]*>/i.test(cssCode);
    const bentoCards = cssCode.match(/<div[^>]*class\s*=\s*["'][^"']*\b(bento-item|card|stat-box)\b/gi);
    const hasCards = Boolean(bentoCards && bentoCards.length >= 3);
    const passed = hasLayout && hasSidebar && hasMain && hasCards;
    return {
      passed,
      goals: [
        { label: "Parent utama <div class=\"dashboard-layout\">", passed: hasLayout },
        { label: "Bilah samping <div class=\"sidebar\"> (brand & menu)", passed: hasSidebar },
        { label: "Area <div class=\"main-panel\"> dengan 3 bento cards", passed: hasMain && hasCards },
      ],
    };
  }

  // ================= CSS BASICS (Full 20 Levels) =================
  if (challengeId === "css-basics-1-background-color" || challengeId === "css-basics-1" || challengeId === "basics-1") {
    const passed = /background-color\s*:\s*(lightblue|#add8e6|rgb\(\s*173\s*,\s*216\s*,\s*230\s*\)|sky-?blue|#38bdf8|#60a5fa|#f1f5f9|#e0f2fe|#bae6fd)/i.test(cssCode) || /background\s*:\s*(lightblue|#add8e6|#38bdf8|#e0f2fe)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "background-color: lightblue;", passed }],
    };
  }

  if (challengeId === "css-basics-2-text-color" || challengeId === "css-basics-2" || challengeId === "basics-2") {
    const passed = /color\s*:\s*(#333|#333333|black|#000|#000000|rgb\(\s*51\s*,\s*51\s*,\s*51\s*\)|#1e293b|#0f172a)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "color: #0f172a; (atau #333)", passed }],
    };
  }

  if (challengeId === "css-basics-3-font-size" || challengeId === "css-basics-3" || challengeId === "basics-3") {
    const passed = /font-size\s*:\s*(24px|1\.5rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-size: 24px;", passed }],
    };
  }

  if (challengeId === "css-basics-4-font-weight" || challengeId === "css-basics-4" || challengeId === "basics-4") {
    const passed = /font-weight\s*:\s*(bold|700|800|900)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "font-weight: bold; (atau 700)", passed }],
    };
  }

  if (challengeId === "css-basics-5-text-align" || challengeId === "css-basics-5" || challengeId === "basics-5") {
    const passed = /text-align\s*:\s*center/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "text-align: center;", passed }],
    };
  }

  if (challengeId === "css-basics-6-line-height" || challengeId === "css-basics-6" || challengeId === "basics-6") {
    const passed = /line-height\s*:\s*(1\.6|1\.5|1\.7|24px|28px|160%)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "line-height: 1.6; (atau 1.5)", passed }],
    };
  }

  if (challengeId === "css-basics-7-padding" || challengeId === "css-basics-7" || challengeId === "basics-7") {
    const passed = /padding\s*:\s*(20px|1\.25rem|24px|16px)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "padding: 20px;", passed }],
    };
  }

  if (challengeId === "css-basics-8-margin" || challengeId === "css-basics-8" || challengeId === "basics-8") {
    const passed = /margin\s*:\s*(15px|16px|1rem|20px|24px)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "margin: 20px; (atau 16px)", passed }],
    };
  }

  if (challengeId === "css-basics-9-border" || challengeId === "css-basics-9" || challengeId === "basics-9") {
    const passed = /border\s*:\s*(2px|3px|1px|4px)\s+solid/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "border: 2px solid #0f172a;", passed }],
    };
  }

  if (challengeId === "css-basics-10-border-radius" || challengeId === "css-basics-10" || challengeId === "basics-10") {
    const passed = /border-radius\s*:\s*(16px|12px|1rem|20px|0\.75rem)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "border-radius: 16px; (atau 12px)", passed }],
    };
  }

  if (challengeId === "css-basics-11-dimensions" || challengeId === "css-basics-11" || challengeId === "basics-11") {
    const hasWidth = /width\s*:\s*(320px|280px|300px|100%|20rem)/i.test(cssCode);
    const hasHeight = /(min-height|height)\s*:\s*(160px|200px|150px|180px|auto)/i.test(cssCode);
    const passed = hasWidth || hasHeight;
    return {
      passed,
      goals: [
        { label: "width: 320px;", passed: hasWidth },
        { label: "min-height: 160px; (atau height)", passed: hasHeight },
      ],
    };
  }

  if (challengeId === "css-basics-12-box-sizing" || challengeId === "css-basics-12" || challengeId === "basics-12") {
    const passed = /box-sizing\s*:\s*border-box/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "box-sizing: border-box;", passed }],
    };
  }

  if (challengeId === "css-basics-13-capstone-card" || challengeId === "css-basics-13" || challengeId === "basics-13") {
    const gBg = /background(-color)?\s*:\s*(#fef08a|#fde047|#facc15|yellow|white|#fff)/i.test(cssCode);
    const gPad = /padding\s*:\s*(16px|20px|24px|1rem)/i.test(cssCode);
    const gBorder = /border\s*:\s*(2px|3px|4px)\s+solid/i.test(cssCode);
    const gRadius = /border-radius\s*:\s*(16px|12px|20px|1rem)/i.test(cssCode);
    const passed = gBg && gPad && gBorder && gRadius;
    return {
      passed,
      goals: [
        { label: "background-color: #fef08a;", passed: gBg },
        { label: "padding: 16px;", passed: gPad },
        { label: "border: 3px solid #0f172a;", passed: gBorder },
        { label: "border-radius: 16px;", passed: gRadius },
      ],
    };
  }

  if (challengeId === "css-basics-14-box-shadow" || challengeId === "css-basics-14" || challengeId === "basics-14") {
    const passed = /box-shadow\s*:\s*[^;]+/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "box-shadow: 4px 4px 0px #0f172a;", passed }],
    };
  }

  if (challengeId === "css-basics-15-opacity" || challengeId === "css-basics-15" || challengeId === "basics-15") {
    const passed = /opacity\s*:\s*(0\.75|0\.8|0\.7|0\.85|0\.9)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "opacity: 0.75; (atau 0.8)", passed }],
    };
  }

  if (challengeId === "css-basics-16-cursor-overflow" || challengeId === "css-basics-16" || challengeId === "basics-16") {
    const gCursor = /cursor\s*:\s*pointer/i.test(cssCode);
    const gOverflow = /overflow\s*:\s*hidden/i.test(cssCode);
    const passed = gCursor && gOverflow;
    return {
      passed,
      goals: [
        { label: "cursor: pointer;", passed: gCursor },
        { label: "overflow: hidden;", passed: gOverflow },
      ],
    };
  }

  if (challengeId === "css-basics-17-gradient" || challengeId === "css-basics-17" || challengeId === "basics-17") {
    const passed = /background(-image)?\s*:\s*linear-gradient\([^;]+\)/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "background: linear-gradient(135deg, ...);", passed }],
    };
  }

  if (challengeId === "css-basics-18-transform" || challengeId === "css-basics-18" || challengeId === "basics-18") {
    const passed = /transform\s*:\s*(translatey\(-?\d+px\)|scale\([^)]+\)|translate\([^)]+\))/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "transform: translateY(-4px); (atau scale)", passed }],
    };
  }

  if (challengeId === "css-basics-19-transitions" || challengeId === "css-basics-19" || challengeId === "basics-19") {
    const passed = /transition\s*:\s*[^;]+/i.test(cssCode);
    return {
      passed,
      goals: [{ label: "transition: all 0.2s ease-in-out;", passed }],
    };
  }

  if (challengeId === "css-basics-20-boss-card" || challengeId === "css-basics-20" || challengeId === "basics-20" || challengeId === "css-basics-12-boss-fight") {
    const gBg = /background(-color)?\s*:\s*(#fef08a|#ef4444|#fde047|#bae6fd|#fed7aa|yellow|red|white)/i.test(cssCode);
    const gBorder = /border\s*:\s*(2px|3px|4px)\s+solid/i.test(cssCode);
    const gRadius = /border-radius\s*:\s*(16px|20px|24px|999px|9999px|1rem)/i.test(cssCode);
    const gShadow = /box-shadow\s*:\s*[^;]+/i.test(cssCode);
    const passed = gBg && gBorder && gRadius && gShadow;
    return {
      passed,
      goals: [
        { label: "background-color: #fef08a;", passed: gBg },
        { label: "border: 3px solid #0f172a;", passed: gBorder },
        { label: "border-radius: 20px;", passed: gRadius },
        { label: "box-shadow: 6px 6px 0px #0f172a;", passed: gShadow },
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

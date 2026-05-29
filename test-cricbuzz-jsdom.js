import { JSDOM } from 'jsdom';

async function fetchHtml(url) {
  const res = await fetch(url);
  return res.text();
}

async function test() {
  try {
    const matchUrl = '/live-cricket-scores/155387/rr-vs-srh-eliminator-indian-premier-league-2026';
    const matchHtml = await fetchHtml('https://www.cricbuzz.com' + matchUrl);
    const matchDom = new JSDOM(matchHtml);
    const matchDoc = matchDom.window.document;

    const allEls = matchDoc.querySelectorAll('*');
    for (const el of allEls) {
      const text = el.textContent?.trim() || '';
      if (text.includes('243') && el.children.length === 0) {
        console.log(`Tag: ${el.tagName}, Class: "${el.className}", Text: "${text}"`);
      }
    }
  } catch (err) {
    console.error("Test error:", err);
  }
}

test();

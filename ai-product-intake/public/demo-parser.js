(function(root) {
function clean(value) { return String(value || '').trim().slice(0, 4000); }

function demoExtract(input) {
  const text = clean(input);
  const firstSentence = text.split(/[.!?]/)[0].trim();
  const isWorkshop = /workshop/i.test(text);
  const date = text.match(/\b(?:on|for)\s+((?:Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day(?:,?\s+\w+\s+\d{1,2})?|\w+\s+\d{1,2}(?:,?\s+\d{4})?)\b/i);
  const audience = text.match(/\bfor\s+([^,.]+?)(?=\s+(?:on|in|at|to|with)\b|[,.]|$)/i);
  const location = text.match(/\b(?:in|at)\s+([A-Z][\w\s-]+?)(?=\s+(?:on|for|with|to)\b|[,.]|$)/);
  const output = {
    title: isWorkshop ? 'Customer discovery workshop' : (firstSentence.replace(/^(plan|create|organize|build)\s+(an?|the)\s+/i, '').slice(0, 72) || 'New product request'),
    goal: /feedback/i.test(text) ? 'Collect actionable feedback and define next steps' : 'Clarify the request and agree on a useful outcome',
    audience: audience ? audience[1].trim() : '',
    date: date ? date[1].trim() : '',
    location: location ? location[1].trim() : '',
    format: isWorkshop ? 'Facilitated workshop' : (/online|remote|virtual/i.test(text) ? 'Remote session' : ''),
    deliverables: /summary|report/i.test(text) ? ['Summary report'] : [],
    tone: /friendly/i.test(text) ? 'Friendly' : (/formal/i.test(text) ? 'Formal' : ''),
    open_questions: []
  };
  for (const [key, question] of Object.entries({ audience: 'Who is the intended audience?', date: 'When should this happen?', location: 'Where will this happen?', format: 'What format should it use?' })) {
    if (!output[key]) output.open_questions.push(question);
  }
  return output;
}

const api = { clean, demoExtract };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
else root.FormaDemoParser = api;
})(typeof window !== 'undefined' ? window : globalThis);

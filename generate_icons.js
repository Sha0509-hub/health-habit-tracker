const fs = require('fs');
const path = require('path');

// Generate SVG string for AuraLife brand logo
function getSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#080c14"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size*0.4}" fill="none" stroke="#10b981" stroke-width="${size*0.06}"/>
    <path d="M${size*0.5} ${size*0.2}v${size*0.6}M${size*0.68} ${size*0.3}H${size*0.42}a${size*0.13} ${size*0.13} 0 0 0 0 ${size*0.26}h${size*0.18}a${size*0.13} ${size*0.13} 0 0 1 0 ${size*0.26}H${size*0.32}" fill="none" stroke="#ffffff" stroke-width="${size*0.06}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// Write SVG icons which modern PWAs support seamlessly
fs.writeFileSync(path.join(__dirname, 'icon-192.svg'), getSvg(192));
fs.writeFileSync(path.join(__dirname, 'icon-512.svg'), getSvg(512));

console.log('Generated SVG icons successfully!');

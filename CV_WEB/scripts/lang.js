const LANG_PATH = '../scripts/lang.json';
const LANG_SEQUENCE = ['en', 'ua', 'pl'];

// Detect saved or browser language
let currentLang = localStorage.getItem('lang') || detectBrowserLang();

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
	const langBtn = document.getElementById('lang-btn');
	if (!langBtn) return;

	loadLanguage(currentLang);

	langBtn.addEventListener('click', () => {
		const nextIndex = (LANG_SEQUENCE.indexOf(currentLang) + 1) % LANG_SEQUENCE.length;
		currentLang = LANG_SEQUENCE[nextIndex];
		localStorage.setItem('lang', currentLang);
		loadLanguage(currentLang);
	});
});

// Load translation JSON and apply
function loadLanguage(lang) {
	fetch(LANG_PATH)
		.then(res => res.json())
		.then(data => {
			if (!data[lang]) return;

			document.querySelectorAll('[data-i18n]').forEach(el => {
				const keys = el.getAttribute('data-i18n').split('.');
				let translation = data[lang];

				for (let key of keys) {
					if (translation[key]) {
						translation = translation[key];
					} else {
						translation = null;
						break;
					}
				}

				if (translation) {
					if (el.tagName === 'INPUT') {
						el.placeholder = translation;
					} else {
						el.textContent = translation;
					}
				}

			});

			const langBtn = document.getElementById('lang-btn');
			if (langBtn) {
				const langNames = {
					en: 'Language: EN',
					ua: 'Мова: UA',
					pl: 'Język: PL'
				};
				langBtn.textContent = langNames[lang] || 'Language';
			}

			const cvLink = document.getElementById('cv-link');
			if (cvLink) {
				const cvPath = data[lang].home.cv_file;
				if (cvPath) {
					cvLink.setAttribute('href', cvPath)
				}
			}
		})
		.catch(err => {
			console.error('Translation loading error:', err);
		});
}

// Detect language from browser
function detectBrowserLang() {
	const browserLang = navigator.language.slice(0, 2).toLowerCase();
	return LANG_SEQUENCE.includes(browserLang) ? browserLang : 'en';
}

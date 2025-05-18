import { navigate } from './util/router.js';
import { EXR_API_KEY } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav ul li a').forEach(link => {
    if (location.pathname.endsWith(link.getAttribute('href'))) {
       link.classList.add('current');
    }
  });

  if (window.annyang) {
    const commands = {
      'go home':        () => navigate('index.html'),
      'open converter': () => navigate('converter.html'),
      'about project':  () => navigate('about.html'),
      'help me':        () => navigate('help.html')
    };
    window.annyang.addCommands(commands);
    window.annyang.start();
  }
});

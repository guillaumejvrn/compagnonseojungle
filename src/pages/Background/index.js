console.log('This is the background page.');
console.log('Put the background scripts here.');

if (typeof window !== 'undefined') {
  // Utiliser window ici, car nous sommes dans un environnement de navigateur
  window.log('Ceci est un environnement de navigateur');
} else {
  // Le code à exécuter dans un environnement Node.js (comme un background script)
  console.log('Environnement de fond');
}

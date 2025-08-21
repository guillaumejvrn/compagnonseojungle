import { printLine } from './modules/print';
import React from 'react';
import { createRoot } from 'react-dom/client';
import PersoButton from './PersoButton';
import ViewDisplayData from './ViewDisplayData';
import axios from 'axios';
import ProspectionPopup from './ProspectionPopup';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");


//cree un tableau si le local storage est vide
if (localStorage.getItem('alreadyProspected') === null) {
  localStorage.setItem('alreadyProspected', JSON.stringify([]));
}

// ajoute le nom de domaine google.com dans le tableau
if (localStorage.getItem('alreadyProspected').includes('google.com') === false) {
  let alreadyProspected = JSON.parse(localStorage.getItem('alreadyProspected'));
  alreadyProspected.push('google.com');
  localStorage.setItem('alreadyProspected', JSON.stringify(alreadyProspected));
}



let data = {};
let temp = [];

const ALLDATA = JSON.parse(localStorage.getItem('ALLDATA'));
console.log('ALLDATAlocalstorage', ALLDATA);

const jwt = await getJwt();
console.log('JWT récupéré :', jwt);

const config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwt}`,
  },
};

function isExternalAndNotGoogle(url) {
  try {
    const parsedUrl = new URL(url);
    // Exclude non-HTTP/HTTPS protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    const linkHost = parsedUrl.hostname.toLowerCase();
    const currentHost = window.location.hostname.toLowerCase();

    const isGoogleLink =
      linkHost.endsWith('.google.com') || linkHost === 'google.com';

    return !isGoogleLink && linkHost !== currentHost;
  } catch (e) {
    return false; // Invalid URL
  }
}

// Fonction pour récupérer les liens externes de la page
function getExternalLinks() {
  const externalLinks = [];
  const links = document.querySelectorAll('a');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && isExternalAndNotGoogle(href)) {
      externalLinks.push(href);
    }
  });
  return { urls: externalLinks };
}

/*---------------------------------------------------------------------------------------------------*/

// Fonction pour récupérer le JWT stocké avec le chrome.storage.local
async function getJwt() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['jwt'], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.jwt);
      }
    });
  });
}

//fonction pour recuperer le id stocke avec le chrome.storage.local
// qui est dans le user puis id
async function getId() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['id'], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.id);
      }
    });
  });
}

/* recuperer les donnees quy sont stocke dans le local storage */

function getStoredDataInLocalStorage() {
  const storedData = localStorage.getItem('ALLDATA');
  if (!storedData) {
    console.log('No data found in localStorage.');
    return [];
  }

  const dataObject = JSON.parse(storedData);
  const domains = Object.keys(dataObject);
  console.log('Stored domains:', domains);
  return domains;
}

getStoredDataInLocalStorage();

/* recuperer les donnees quy sont stocke dans le local storage */

// Fonction pour simplifier les domaines des URLs
function simplifyDomains(urlsObject) {
  const simplifiedUrls = urlsObject.urls.map((url) => {
    try {
      // Prepend 'https://' if missing and check validity
      const processedUrl = url.startsWith('http') ? url : `https://${url}`;
      const urlObj = new URL(processedUrl);
      // Ensure the URL is HTTP/HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return null;
      }
      return `${urlObj.protocol}//${urlObj.hostname}/`;
    } catch (e) {
      console.error('Invalid URL:', url);
      return null;
    }
  });

  return { urls: simplifiedUrls.filter((url) => url !== null) };
}

function getParentNodeOfElement(element, level) {
  let parent = element;
  for (let i = 0; i < level; i++) {
    parent = parent.parentNode;
  }
  return parent;
}

function getParentImageOfElement(element) {
  try {
    return element.parentNode.firstChild.firstChild.firstChild;
  } catch (error) {
    return null;
  }
}

/*---------------------------------------------api test-------------------------------------------------------*/

async function apidatarequest() {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    };

    // Génère les domaines avec ET sans "www"
    const generateAllDomains = (urlsObject) => {
      const allDomains = new Set();

      urlsObject.urls.forEach((url) => {
        try {
          const urlObj = new URL(
            url.startsWith('http') ? url : `https://${url}`
          );
          const hostname = urlObj.hostname;

          // Ajoute les deux variantes
          allDomains.add(hostname); // Version originale
          allDomains.add(hostname.replace(/^www\./i, '')); // Version sans "www"
        } catch (e) {
          console.error('Invalid URL:', url);
        }
      });

      return { urls: [...allDomains].filter((domain) => domain) };
    };

    // Utilisation
    const api = generateAllDomains(simplifyDomains(getExternalLinks()));
    console.log("Données envoyées à l'API :", api);
    const dataArray = [];
    const dataUrls = await axios.post(
      'https://api.seo-jungle.com/support/extensions/checkurl',
      api,
      config
    );
    for (const item of dataUrls.data.data) {
      const majestic = await axios.get(
        `https://api.seo-jungle.com/support/statistic/majestic/${item.id}`,
        config
      );
      item.majestic = majestic.data.data;
      const semrush = await axios.get(
        `https://api.seo-jungle.com/support/statistic/semrush/${item.id}`,
        config
      );
      item.semrush = semrush.data.data;
      dataArray.push(item);
      console.log('item :', item);
    }
    console.log('DAYTDAZBYGNGYISYGCSDNOU :', dataArray);
    data = dataArray;
    localStorage.setItem('ALLDATA', JSON.stringify(dataArray));
    if (isAhrefsPage()){
      addButtonToExternalLinksToAhrefs();
      console.log('boutton depuis la pelle dapi');
    }
  } catch (error) {
    console.error('Erreur :', error);
  }

}

apidatarequest();

let isAlreadyProspected = [];
/*---------------------------------------------api test-------------------------------------------------------*/

console.log('external links', getExternalLinks());

// Vérifie si la page actuelle est un annuaire Google (par exemple, Google Maps ou Google My Business)
function isGoogleDirectoryPage() {
  const currentHost = window.location.hostname.toLowerCase();
  const currentPath = window.location.pathname.toLowerCase();

  // Vérifie que le domaine est Google et que l'URL contient des indices d'annuaire
  const isGoogleDirectory =
    currentHost.endsWith('.google.com') &&
    (currentPath.includes('/maps') || currentPath.includes('/search'));

  // Vérifie si le domaine est ahrefs.com
  const isAhrefs = currentHost === 'ahrefs.com';

  return isGoogleDirectory || isAhrefs;
}

// Fonction pour vérifier si un lien est externe et non vers Google

function getAllStoredDomains() {
  const storedData = localStorage.getItem('ALLDATA');
  if (!storedData) {
    console.log('No data found in localStorage.');
    return [];
  }

  const dataObject = JSON.parse(storedData);
  const domains = dataObject.map((item) => item.url);
  return domains;
}

function renderViewDisplayData(domain, propsData, majestic, semrush) {
  console.log('11111', propsData);
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'modal-overlay';
  document.body.appendChild(modalOverlay);
  const modalBox = document.createElement('div');
  modalBox.id = 'modal-box';
  modalOverlay.appendChild(modalBox);
  const root = createRoot(modalBox);
  console.log('Props data vbase:', propsData);
  root.render(
    <ViewDisplayData
      domain={domain}
      support={propsData}
      majestic={majestic}
      semrush={semrush}
    />
  );

  // Ajouter la classe show pour déclencher l'animation de glissement
  requestAnimationFrame(() => {
    modalOverlay.classList.add('show');
  });

  // Fermer la fenêtre modale en cliquant sur l'overlay
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(modalOverlay);
      }, 300); // Attendre la fin de l'animation
    }
  });

  // Fermer la fenêtre modale en cliquant en dehors de la boîte modale
  document.addEventListener(
    'click',
    (e) => {
      if (!modalBox.contains(e.target) && e.target !== modalBox) {
        modalOverlay.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(modalOverlay);
        }, 300); // Attendre la fin de l'animation
      }
    },
    { once: true }
  );
}

// lie un nom de domaine a un chiffre dans le filtered data dans un tableau
function domainLinkedToIdFilteredData(domain) {
  const storedData = localStorage.getItem('ALLDATA');
  if (!storedData) {
    console.log('No data found in localStorage.');
    return null;
  }
  const dataObject = JSON.parse(storedData);
  //parcourir le tableau pour trouver le domaine et renvoie le numero du tableau ou il y a le domaine
  for (let i = 0; i < dataObject.length; i++) {
    if (dataObject[i].url.includes(domain)) {
      return i;
    }
  }
  return null;
}

async function varprospection(domain) {
  const id = await getId(); // Assurez-vous d'attendre la résolution de la promesse
  return { userIds: [`${id}`], url: `${domain}` };
}

async function apiRequestProspection(domain) {
  try {
    const jwt = await getJwt();
    console.log('JWT récupéré :', jwt);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    };

    const data = await varprospection(domain); // Attendez la résolution de la promesse

    axios
      .post('https://api.seo-jungle.com/demand', data, config)
      .then((response) => {
        console.log("Réponse de l'API:", response.data);
        if (response.status === 200) {
          const res = response.data;

          const popupOverlay = document.createElement('div');
          popupOverlay.id = 'popup-overlay';
          document.body.appendChild(popupOverlay);

          const popupBox = document.createElement('div');
          popupBox.id = 'popup-box';
          popupOverlay.appendChild(popupBox);

          const root = createRoot(popupBox);

          console.log('Domaines déjà prospectés:', isAlreadyProspected);

          if (isAlreadyProspected.includes(domain)) {
            console.log('Le domaine est déjà prospecté.');
            root.render(<ProspectionPopup status={'IN_PROGRESS'} />);
          } else {
            const prospection = JSON.parse(localStorage.getItem('alreadyProspected'));
            if (prospection.includes(domain)) {
              console.log('Le domaine est déjà prospecté.');
              root.render(<ProspectionPopup status={'IN_PROGRESS'} />);
            } else {
              console.log("Le domaine n'est pas encore prospecté.");
              isAlreadyProspected.push(domain);
              root.render(<ProspectionPopup status={res.data.status} />);
            }
          }

          setTimeout(() => {
            popupOverlay.style.animation = 'slideOut 0.5s forwards';
            popupBox.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => {
              document.body.removeChild(popupOverlay);
            }, 500); // Attendre la fin de l'animation
          }, 5000);
        } else {
          console.error("Erreur lors de l'envoi de la demande de prospection.");
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de l'appel à l'API :",
          error.response || error
        );
      });
  } catch (error) {
    console.error('Erreur :', error);
  }
}


// Fonction pour ajouter un bouton à chaque lien externe sauf Google
function addButtonToExternalLinks() {
  // Vérifie si on est sur une page d'annuaire Google
  if (!isGoogleDirectoryPage()) {
    console.log("Non applicable : la page n'est pas un annuaire Google.");
    return;
  }

  document.querySelectorAll('.my-button').forEach((btn) => btn.remove());

  // Sélectionner toutes les balises <a> de la page
  const links = document.querySelectorAll('a');

  // Parcourir chaque lien <a>
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const ariaLabel = link.getAttribute('aria-label');
    const isMain = link.getAttribute('data-ved');

    if (
      getParentNodeOfElement(link, 6) !== null &&
      getParentNodeOfElement(link, 6).nodeName === 'TD'
    ) {
      return;
    }

    if (getParentImageOfElement(link) !== null) {
      console.log('This is an image.');
      return;
    }

    if (link.hasAttribute('data-ved')) {
      // Ignorer les liens avec aria-label="Applications Google"
      if (ariaLabel === 'Applications Google') {
        return;
      }

      // Vérifier si l'attribut href existe et si le lien est externe sans être Google
      if (href && isExternalAndNotGoogle(href)) {
        // Créer un bouton pour chaque lien externe
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        const button = document.createElement('div');
        buttonContainer.appendChild(button);
        const root = createRoot(button);

        const storeddomains = getAllStoredDomains();

        const closestLink = link.closest('a');
        // const buttondomain = closestLink ? new URL(closestLink.getAttribute('href')).hostname : null;
        const buttondomain = closestLink
          ? new URL(closestLink.getAttribute('href')).hostname.replace(
              /^www\./i,
              ''
            )
          : null;

        console.log('Button domain:', buttondomain);
        console.log('Stored domains:', storeddomains);

        if (
          storeddomains.includes(buttondomain) ||
          storeddomains.includes(`www.${buttondomain}`)
        ) {
          root.render(<PersoButton status={'Voir le site'} />);
        } else {
          const localstorgeprospected = JSON.parse(localStorage.getItem('alreadyProspected'));
          if (localstorgeprospected.includes(buttondomain)) {
            root.render(<PersoButton status={'En cours de prospection'} />);
          } else {
            root.render(<PersoButton status={'Demander à prospecter'} />);
          }
        }

        // Ajouter une classe CSS si nécessaire
        button.classList.add('my-button');

        // Ajouter un attribut data-domain avec le nom de domaine
        button.setAttribute('data-domain', new URL(href).hostname);

        button.onclick = async () => {
          // eslint-disable-next-line no-restricted-globals
          const targetButton = event.target.closest('.my-button'); // Trouver le bouton le plus proche de l'élément cliqué

          if (targetButton) {
            const domain =
              targetButton
                .getAttribute('data-domain')
                ?.replace(/^www\./i, '') || '';
            console.log('Domaine cliqué :', domain);
            console.log('DAta', data);

            if (
              storeddomains.includes(domain) ||
              storeddomains.includes(`www.${domain}`)
            ) {
            } else {
              apiRequestProspection(domain);
              if (localStorage.getItem('alreadyProspected').includes(domain) === false) {
                let alreadyProspected = JSON.parse(localStorage.getItem('alreadyProspected'));
                alreadyProspected.push(domain);
                localStorage.setItem('alreadyProspected', JSON.stringify(alreadyProspected));
                addButtonToExternalLinks();
              }
            }

            const data2 = data.filter((item) => item.url.includes(domain))[0];
            if (domain) {
              let dataSupport = data2;
              const dataMajestic = await axios.get(
                `https://api.seo-jungle.com/support/statistic/majestic/${data2.id}`,
                config
              );
              const dataSemrush = await axios.get(
                `https://api.seo-jungle.com/support/statistic/semrush/${data2.id}`,
                config
              );
              const majestic = dataMajestic.data.data;
              const semrush = dataSemrush.data.data;

              if (
                storeddomains.includes(domain) ||
                storeddomains.includes(`www.${domain}`)
              ) {
                renderViewDisplayData(domain, data2, majestic, semrush);
              }
            } else {
              console.log(
                "L'attribut data-domain n'est pas défini sur le bouton."
              );
            }
          }
        };
        // Insérer le bouton après le lien
        link.insertAdjacentElement('afterend', button);
      }
    }
  });
}

function isAhrefsPage() {
  const currentHost = window.location.hostname.toLowerCase();
  const currentPath = window.location.pathname.toLowerCase();

  // Vérifie que le domaine est ahrefs.com
  const isAhrefs =
    currentHost.endsWith('.ahrefs.com') &&
    currentPath.includes('/v2-site-explorer');
  return isAhrefs;
}

function isExternalLink(url) {
  try {
    const linkHost = new URL(url).hostname.toLowerCase();
    const currentHost = window.location.hostname.toLowerCase();
    return linkHost !== currentHost;
  } catch (e) {
    return false; // Si l'URL est invalide, on la considère comme interne
  }
}

function thereIsNewDomain() {
  const nomDeDomaine = simplifyDomains(getExternalLinks());

  console.log('pas besoin de requeter');
  if (
    JSON.stringify(temp) === JSON.stringify(simplifyDomains(getExternalLinks()))
  ) {
    return false;
  } else {
    temp = nomDeDomaine;
    return true;
  }
}


let isProcessing = false;

function addButtonToExternalLinksToAhrefs() {
  if (isProcessing) return;
  isProcessing = true;
  if (!isAhrefsPage()) {
    console.log('ca nest pas ahrefs');
    return;
  } else {
    console.log("c'est bien un site hrefs");
    if (thereIsNewDomain() === true) {
      console.log('NOUVEAU DOMAINE');
      apidatarequest();
    }
  }

  document.querySelectorAll('.button-container').forEach((btn) => btn.remove());

  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (link.parentNode.nodeName === 'TD' && href !== null && isExternalLink(href)) {
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');


      const button = document.createElement('a');
      button.classList.add('my-button');
      const root = createRoot(button);

      const closestLink = link.closest('a');
      const buttondomain = closestLink
        ? new URL(closestLink.getAttribute('href')).hostname.replace(
            /^www\./i,
            ''
          )
        : null;

      const storeddomains = getAllStoredDomains();

      console.log('Button domain:', buttondomain);
      console.log('Stored domains:', storeddomains);

      if (storeddomains.includes(buttondomain) || storeddomains.includes(`www.${buttondomain}`)
      ) {
        root.render(<PersoButton status={'Voir le site'} />);
      } else {
        const localstorgeprospected = JSON.parse(localStorage.getItem('alreadyProspected'));
        if (localstorgeprospected.includes(buttondomain)) {
          root.render(<PersoButton status={'En cours de prospection'} />);
        } else {
          root.render(<PersoButton status={'Demander à prospecter'} />);
        }
      }

      // Ajouter le bouton au conteneur
      buttonContainer.appendChild(button);

      button.setAttribute('data-domain', new URL(href).hostname);

      // Insérer le conteneur après le lien
      link.insertAdjacentElement('afterend', buttonContainer);

      button.onclick = async () => {
        // eslint-disable-next-line no-restricted-globals
        const targetButton = event.target.closest('.my-button'); // Trouver le bouton le plus proche de l'élément cliqué

        if (targetButton) {
          const domain =
            targetButton
              .getAttribute('data-domain')
              ?.replace(/^www\./i, '') || '';
          console.log('Domaine cliqué :', domain);
          console.log('DAta', data);

          if (
            storeddomains.includes(domain) ||
            storeddomains.includes(`www.${domain}`)
          ) {
          } else {
            apiRequestProspection(domain);
            // ajoute le nom de domaine dans le tableau
            if (localStorage.getItem('alreadyProspected').includes(domain) === false) {
              let alreadyProspected = JSON.parse(localStorage.getItem('alreadyProspected'));
              alreadyProspected.push(domain);
              localStorage.setItem('alreadyProspected', JSON.stringify(alreadyProspected));
              addButtonToExternalLinksToAhrefs();
            }
          }

          const data2 = data.filter((item) => item.url.includes(domain))[0];
          if (domain) {
            let dataSupport = data2;
            const dataMajestic = await axios.get(
              `https://api.seo-jungle.com/support/statistic/majestic/${data2.id}`,
              config
            );
            const dataSemrush = await axios.get(
              `https://api.seo-jungle.com/support/statistic/semrush/${data2.id}`,
              config
            );
            const majestic = dataMajestic.data.data;
            const semrush = dataSemrush.data.data;

            if (
              storeddomains.includes(domain) ||
              storeddomains.includes(`www.${domain}`)
            ) {
              renderViewDisplayData(domain, data2, majestic, semrush);
            }
          } else {
            console.log(
              "L'attribut data-domain n'est pas défini sur le bouton."
            );
          }
        }
      };
    }
  });
  isProcessing = false;
}



function detectChangeOnThePage() {
  let isHandlingChange = false;
  const IGNORE_CLASSES = ['button-container', 'my-button']; // Ajoutez vos classes de bouton

  const observer = new MutationObserver(async (mutations) => {
    if (isHandlingChange) return;

    const hasRealChanges = mutations.some(mutation => {
      return [...mutation.addedNodes].some(node => {
        if (node.nodeType !== 1) return false;
        return !IGNORE_CLASSES.some(c =>
          node.classList.contains(c) ||
          node.closest(`.${c}`)
        );
      });
    });

    if (hasRealChanges) {
      console.log('Changement utile détecté');
      isHandlingChange = true;

      try {
        // Attendre la résolution de la promesse de la fonction
        await new Promise((resolve) => {
          addButtonToExternalLinksToAhrefs();

          // Vérifier périodiquement si le traitement est terminé
          const checkCompletion = () => {
            if (!addButtonToExternalLinksToAhrefs.isProcessing) {
              resolve();
            } else {
              setTimeout(checkCompletion, 100);
            }
          };

          checkCompletion();
        });
      } catch (error) {
        console.error('Erreur lors du traitement:', error);
      }

      // Réactiver l'observation après un délai
      setTimeout(() => {
        isHandlingChange = false;
      }, 1000); // Ajustez ce délai selon le temps de réponse de l'API
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}


function isMajesticPage() {
  const currentHost = window.location.hostname.toLowerCase();
  const currentPath = window.location.pathname.toLowerCase();

  // Vérifie que le domaine est ahrefs.com
  const isMajestic =
    currentHost.endsWith('.majestic.com') &&
    currentPath.includes('/reports/site-explorer');
  return isMajestic;
}
function addButtonToExternalLinksToMajestic () {
  if (isMajesticPage() === null) {
    console.log('ca nest pas majestic');
    return;
  } else {
    console.log("c'est bien un site majestic");
  }
  if (thereIsNewDomain() === true) {
    console.log('NOUVEAU DOMAINE');
    apidatarequest();
  }


  document.querySelectorAll('.button-container').forEach((btn) => btn.remove());

  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === 'javascript:void(0);') {
      return;
    }
    if ((href && href.includes('.majestic.com')) || (href && href.includes('maj.to')) || (href && href.includes('.majesticseo.com'))){
      console.log("NOM DE DOMAINE INTERNE SUPPRIME");
      return;
    }
    if ((link.parentNode.parentNode.nodeName === 'TD' || link.parentNode.parentNode.parentNode.nodeName === 'TD' || link.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains('context-view-row-container')) && href !== null && isExternalLink(href)) {
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');

      const button = document.createElement('a');
      button.classList.add('my-button');
      const root = createRoot(button);

      const closestLink = link.closest('a');
      const buttondomain = closestLink
        ? new URL(closestLink.getAttribute('href')).hostname.replace(
          /^www\./i,
          ''
        )
        : null;

      const storeddomains = getAllStoredDomains();

      console.log('Button domain:', buttondomain);
      console.log('Stored domains:', storeddomains);

      if (storeddomains.includes(buttondomain) || storeddomains.includes(`www.${buttondomain}`)
      ) {
        root.render(<PersoButton status={'Voir le site'} />);
      } else {
        const localstorgeprospected = JSON.parse(localStorage.getItem('alreadyProspected'));
        if (localstorgeprospected.includes(buttondomain)) {
          root.render(<PersoButton status={'En cours de prospection'} />);
        } else {
          root.render(<PersoButton status={'Demander à prospecter'} />);
        }
      }

      buttonContainer.appendChild(button);
      button.setAttribute('data-domain', new URL(href).hostname);
      link.insertAdjacentElement('afterend', buttonContainer);

      button.onclick = async () => {
        // eslint-disable-next-line no-restricted-globals
        const targetButton = event.target.closest('.my-button');

        if (targetButton) {
          const domain =
            targetButton
              .getAttribute('data-domain')
              ?.replace(/^www\./i, '') || '';
          console.log('Domaine cliqué :', domain);
          console.log('DAta', data);

          if (
            storeddomains.includes(domain) ||
            storeddomains.includes(`www.${domain}`)
          ) {
          } else {
            apiRequestProspection(domain);
            if (localStorage.getItem('alreadyProspected').includes(domain) === false) {
              let alreadyProspected = JSON.parse(localStorage.getItem('alreadyProspected'));
              alreadyProspected.push(domain);
              localStorage.setItem('alreadyProspected', JSON.stringify(alreadyProspected));
              addButtonToExternalLinksToMajestic();
            }
          }

          const data2 = data.filter((item) => item.url.includes(domain))[0];
          if (domain) {
            let dataSupport = data2;
            const dataMajestic = await axios.get(
              `https://api.seo-jungle.com/support/statistic/majestic/${data2.id}`,
              config
            );
            const dataSemrush = await axios.get(
              `https://api.seo-jungle.com/support/statistic/semrush/${data2.id}`,
              config
            );
            const majestic = dataMajestic.data.data;
            const semrush = dataSemrush.data.data;

            if (
              storeddomains.includes(domain) ||
              storeddomains.includes(`www.${domain}`)
            ) {
              renderViewDisplayData(domain, data2, majestic, semrush);
            }
          } else {
            console.log(
              "L'attribut data-domain n'est pas défini sur le bouton."
            );
          }
        }
      }
    }

  });

}



window.addEventListener('load', () => {

  setTimeout(() => {
    addButtonToExternalLinks();
  }, 1000);

  setTimeout(() => {
    addButtonToExternalLinksToMajestic();
  }, 1000);

  // Pour Ahrefs
  if (isAhrefsPage()) {
    detectChangeOnThePage();
  }
});

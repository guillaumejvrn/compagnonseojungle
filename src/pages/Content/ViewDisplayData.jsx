import React from 'react';
import { Button, Collapse, Label, StarReview } from '@methodzlabs/seo-jungle-components';
import dynamic from 'next/dynamic';
import { useState } from "react";
import axios from 'axios';
//c'est quand meme utilise ce import ReactApexCharts from 'react-apexcharts';
import ReactApexCharts from 'react-apexcharts';


const ViewDisplayData = (props) => {
  const [data, setData] = React.useState(props.support);
  // console.log("PROPPSSSSSSSSS", props.support);
  const [donneesMajestic, setDonneesMajestic] = React.useState(props.majestic);
  const [donneesSemrush, setDonneesSemrush] = React.useState(props.semrush);
  const [donneesAvis, setDonneesAvis] = React.useState();
  const [donneesPlusEntreprise, setdonneesPlusEntreprise] = React.useState();

  const getRedactionType = (type) => {
    switch (type) {
      case "HUMAN":
        return "Rédacrion humaine"
      case "AI":
        return "Rédation par IA"
      case "MIXED":
        return "Rédaction mixte"
      default:
        return "Rédacrion par defaut"
    }
  }

  const getGoogleNews = (type) => {
    switch (type) {
      case true:
        return "yes"
      case false:
        return "no"
      default:
        return "defaut"
    }
  }

  const linkDuration = (type) => {
    switch (type) {
      case "FOREVER":
        return "Pour toujours"
      case "SIX_MONTHS":
        return "6 mois"
      case "TWELVE_MONTHS":
        return "1 an"
      case "TWENTY_FOUR_MONTHS":
        return "2 ans"
      default:
        return "defaut"
    }
  }

  const getCategory = (type) => {
    switch (type) {
      case "IMPOSED":
        return "Imposé"
      case "IMPOSED_CATEGORY":
        return "Catégorie imposée"
      case "NOT_IMPOSED":
        return "Non imposé"
      default:
        return "defaut"
    }
  }



  const closeModal = () => {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(modalOverlay);
      }, 300);
    }
  };

  const handleButtonClick = () => {
    window.open(`https://app.seo-jungle.com/fr/search/${data.id}`, '_blank');
  };
  const bouttonVoirAvis = () => {
    window.open(`https://app.seo-jungle.com/fr/review/seller/${data.organizationId}`, '_blank');
  }



  const [seriesTrustFlow, setSeriesTrustFlow] = useState([{ name: "TrustFlow", data: [] }]);
  const [seriesCitationFlow, setSeriesCitationFlow] = useState([{ name: "CitationFlow", data: [] }]);
  const [seriesTotalBacklinks, setSeriesTotalBacklinks] = useState([{ name: "TotalBacklinks", data: [] }]);
  const [seriesRefDomains, setSeriesRefDomains] = useState([{ name: "RefDomains", data: [] }]);
  const [seriesOrganicKeywords, setSeriesOrganicKeywords] = useState([{ name: "OrganicKeywords", data: [] }]);
  const [seriesOrganicTraffic, setSeriesOrganicTraffic] = useState([{ name: "OrganicTraffic", data: [] }]);


  // console.log('seriesTrustFlow', seriesTrustFlow);
  // console.log('seriesCitationFlow', seriesCitationFlow);
  // console.log('seriesTotalBacklinks', seriesTotalBacklinks);
  // console.log('seriesRefDomains', seriesRefDomains);
  // console.log('seriesOrganicKeywords', seriesOrganicKeywords);
  // console.log('seriesOrganicTraffic', seriesOrganicTraffic);


  const getDateFromSeries = (index, series) => {
    const dateString = series[0].data[index].x; // Date au format 'YYYYMM'
    const year = Number(dateString.substring(0, 4));
    const month = Number(dateString.substring(4, 6)) - 1; // Les mois en JavaScript commencent à 0
    const date = new Date(year, month);
    const formattedDate = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); // retourne la date formatée en mois et année
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };
  const getChartOptions = (series) => {
    return {
      chart: {
        type: "area",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.9,
          opacityTo: 0.3,
          stops: [0, 90, 100],
          gradientToColors: ["#21E273"],
        }
      },
      grid: {
        show: true,
        borderColor: "#151525",
        padding: {
          top: 12,
          right: 0,
          bottom: -15,
          left: 11
        },
      },
      yaxis: {
        min: 0,
        labels: {
          show: false,
        }
      },
      xaxis: {
        tooltip: {
          enabled: false,
        },
        showTicks: false,
        labels: {
          show: false,
        },
        type: "category",

        axisTicks: {
          show: false,
        },

        axisBorder: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      colors: ["#43FF43", "#21E273"],
      tooltip: {
        theme: "dark",
        redrawOnParentResize: true,
        y: {
          formatter: (val) => {
            return val.toLocaleString('fr-FR');
          }
        },
        x: {
          show: true,
          formatter: (val, opts) => {
            // opts.dataPointIndex contient l'index de la série
            const date = getDateFromSeries(opts.dataPointIndex, series);
            return date; // retourne la date associée à la valeur
          }
        },
      },
    };
  };

  const chartOptionsTrustFlow = getChartOptions(seriesTrustFlow);

  const languageMap = {
    'Français': 'fr',
    'French': 'fr',
    'Anglais': 'en',
    'English': 'en',
    'Espagnol': 'es',
    'Spanish': 'es',
    'Allemand': 'de',
    'German': 'de',
    'Italien': 'it',
    'Italian': 'it',
    'Chinois': 'zh',
    'Chinese': 'zh',
    'Japonais': 'ja',
    'Japanese': 'ja',
    'Russe': 'ru',
    'Russian': 'ru',
    'Arabe': 'ar',
    'Arabic': 'ar',
    'Portugais': 'pt',
    'Portuguese': 'pt',
    'Coréen': 'ko',
    'Korean': 'ko',
    'Néerlandais': 'nl',
    'Dutch': 'nl',
    'Grec': 'el',
    'Greek': 'el',
    'Hindi': 'hi',
    'Turc': 'tr',
    'Turkish': 'tr',
    'Suédois': 'sv',
    'Swedish': 'sv',
    'Danois': 'da',
    'Danish': 'da',
    'Finnois': 'fi',
    'Finnish': 'fi',
    'Polonais': 'pl',
    'Polish': 'pl',
    'Norvégien': 'no',
    'Norwegian': 'no',
    'Tchèque': 'cs',
    'Czech': 'cs',
    'Hongrois': 'hu',
    'Hungarian': 'hu',
    'Slovaque': 'sk',
    'Slovak': 'sk',
    'Roumain': 'ro',
    'Romanian': 'ro',
    'Thaï': 'th',
    'Thai': 'th',
    'Vietnamien': 'vi',
    'Vietnamese': 'vi',
    'Indonésien': 'id',
    'Indonesian': 'id',
    'Malais': 'ms',
    'Malay': 'ms',
    'Filipino': 'fil',
    'Philippin': 'fil',
    'Letton': 'lv',
    'Latvian': 'lv',
    'Lituanien': 'lt',
    'Lithuanian': 'lt',
    'Estonien': 'et',
    'Estonian': 'et',
    'Bulgare': 'bg',
    'Bulgarian': 'bg',
    'Croate': 'hr',
    'Croatian': 'hr',
    'Serbe': 'sr',
    'Serbian': 'sr',
    'Slovène': 'sl',
    'Slovenian': 'sl',
    'Catalan': 'ca',
    'Galicien': 'gl',
    'Galician': 'gl',
    'Basque': 'eu',
    'Persan': 'fa',
    'Persian': 'fa',
    'Urdu': 'ur',
    'Hébreu': 'he',
    'Hebrew': 'he',
    'Bengali': 'bn',
    'Swahili': 'sw',
    'Afrikaans': 'af',
    'Islandais': 'is',
    'Icelandic': 'is',
    'Irlandais': 'ga',
    'Irish': 'ga',
    'Gallois': 'cy',
    'Welsh': 'cy',
    'Tamoul': 'ta',
    'Tamil': 'ta',
    'Telugu': 'te',
    'Marathi': 'mr',
    'Pendjabi': 'pa',
    'Punjabi': 'pa',
    'Gujarati': 'gu',
    'Kannada': 'kn',
    'Malayalam': 'ml',
    'Odia': 'or',
    'Oriya': 'or',
    'Khmer': 'kh',
    'Cambodgien': 'kh',
    'Cambodian': 'kh',
    // Ajoutez d'autres mappages ici si nécessaire
  };

  React.useEffect(async () => {

    async function getJwt() {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['jwt'], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          }  else {
            resolve(result.jwt);
          }
        });
      });
    }


    async function apiAvisNombre() {
      const jwt = await getJwt();
      // console.log('JWT récupéré :', jwt);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      };
      await axios.get(`https://api.seo-jungle.com/review/count/${data.organizationId}/SELLER`, config).then((response) => {
          // console.log(response.data);
          setDonneesAvis(response.data);
        }
      ).catch((error) => {
        // console.log(error);
      });

      await axios.get(`https://api.seo-jungle.com/org/${data.organizationId}`, config).then((response) => {
          setdonneesPlusEntreprise(response.data);
        }
      ).catch((error) => {
        // console.log(error);
      });
    }
    apiAvisNombre();
    // console.log("donneesPlusEntreprise", donneesPlusEntreprise);

    if (!props.support) {
      // console.log('Pas de support');
      return;
    }else{
      // console.log('y a quelque chose dans le support');
    }

    const newSeriesTrustFlow = [{ name: "TrustFlow", data: [] }];
    const newSeriesCitationFlow = [{ name: "CitationFlow", data: [] }];
    const newSeriesTotalBacklinks = [{ name: "TotalBacklinks", data: [] }];
    const newSeriesRefDomains = [{ name: "RefDomains", data: [] }];
    const newSeriesOrganicKeywords = [{ name: "OrganicKeywords", data: [] }];
    const newSeriesOrganicTraffic = [{ name: "OrganicTraffic", data: [] }];


    // console.log('props.support.id', props.support.id);


    const support = props.support;
    const dateNow = new Date()
    support.semrush = donneesSemrush
    support.majestic = donneesMajestic


    // console.log('ZZZZZZZZZZZZZZZZZZupport', support);

    support?.majestic?.forEach((majestic) => {
      // console.log("pass there");
      newSeriesTrustFlow[0].data.push({ "x": majestic.date.substring(0, 7), "y": majestic.trustFlow });
      newSeriesCitationFlow[0].data.push({ "x": majestic.date.substring(0, 7), "y": majestic.citationFlow });
      newSeriesTotalBacklinks[0].data.push({ "x": majestic.date.substring(0, 7), "y": majestic.totalBacklinks });
      newSeriesRefDomains[0].data.push({ "x": majestic.date.substring(0, 7), "y": majestic.refDomains });
    });

    support?.semrush?.forEach((semrush => {
      newSeriesOrganicKeywords[0].data.push({ "x": semrush.date, "y": semrush.organicKeywords })
      newSeriesOrganicTraffic[0].data.push({ "x": semrush.date, "y": semrush.organicTraffic })
    }));

    setSeriesTrustFlow(newSeriesTrustFlow);
    setSeriesCitationFlow(newSeriesCitationFlow);
    setSeriesTotalBacklinks(newSeriesTotalBacklinks);
    setSeriesRefDomains(newSeriesRefDomains);
    setSeriesOrganicKeywords(newSeriesOrganicKeywords);
    setSeriesOrganicTraffic(newSeriesOrganicTraffic);

  }, [props.support]);

  const DynamicReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

  // console.log("---------------------------- test ");
  // console.log(seriesTrustFlow.length);
  // console.log(seriesTrustFlow[0].data.length);
  // console.log(seriesTrustFlow.length && seriesTrustFlow[0].data.length);

  return (
    <div>
      <div className="modal-header">
        <a id="closebutton" className="close-buttonA" onClick={closeModal}>
          Fermer
        </a>
        <img
          className="seojunglelogo"
          src="https://data.inpi.fr/image/marques/FR5086298"
        />
        <div></div>
      </div>
      <div className="titrearticle">
        <div className="typederedaction">
          {' '}
          {data ? data.url : 'Aucune donnée disponible'}
        </div>
      </div>
      <div className="avis">
        <div>
            <StarReview text={"étoiles"} iconSize={"lg"} defaultRating={donneesPlusEntreprise ? donneesPlusEntreprise.reviewScoreSeller : 'Aucune données'} showLabel={true}/>
        </div>
        <div onClick={bouttonVoirAvis} className="voiravis">
          Voir les avis({donneesAvis ? donneesAvis.data : 'Aucune donnée disponible'})
        </div>
      </div>
      <div className="panneau">
        <div className="panneaudegauche">
          <Collapse
            backgroundDark={true}
            title={'INFORMATIONS PRINCIPALES'}
            defaultCollapse={true}
          >
            <div className="displaypresentation">
              <div className="displaypresentation">
                {data ? data.presentation : 'Aucune donnée disponible'}
              </div>
            </div>
          </Collapse>
          <Collapse
            backgroundDark={true}
            title={'DESCRIPTION COMPLÈTE'}
            defaultCollapse={true}
          >
            <div className="displaypresentation">
              {data ? data.presentation : 'Aucune donnée disponible'}
            </div>
            <div className="line-container">
              <div className="lineDE"></div>
            </div>
            <div className="themetitle">THÈMES AUTORISÉS</div>
            {data && Array.isArray(data.themes) ? (
              data.themes.map((theme, index) => (
                <div key={index} className="theme-item">
                  {theme}
                </div>
              ))
            ) : (
              <div>Aucune donnée disponible</div>
            )}
            <div className="line-container">
              <div className="lineDE"></div>
            </div>
            <div className="themetitle">THÈMES REFUSÉS</div>
            {data && Array.isArray(data.prohibitedThemes) ? (
              data.prohibitedThemes.map((theme, index) => (
                <div key={index} className="theme-item">
                  {theme}
                </div>
              ))
            ) : (
              <div>Aucune donnée disponible</div>
            )}
            <div className="line-container">
              <div className="lineDE"></div>
            </div>
            <div className="themetitle">LANGUES</div>
            {data && Array.isArray(data.languages) ? (
              data.languages.map((lang, index) => (
                <Label
                  key={index}
                  prepend={
                    <img
                      style={{ marginTop: 4 }}
                      width={25}
                      src={`https://app.seo-jungle.com/flags/${
                        languageMap[lang] || lang.toLowerCase()
                      }.svg`}
                    />
                  }
                  color={'primary'}
                  variant={'square'}
                  title={lang}
                />
              ))
            ) : (
              <div>Aucune donnée disponible</div>
            )}
            <div className="line-container">
              <div className="lineDE"></div>
            </div>
          </Collapse>
          <Collapse
            backgroundDark={true}
            title={'NOS PRESTATIONS DÉTAILLÉES'}
            defaultCollapse={true}
          >
            <>
              <div className="datatable">
                <div className="datatableHeader">
                  <p></p>
                  <p>Prix</p>
                  <p>Type de rédaction</p>
                  <p>Nombre de mots</p>
                  <p>Prix pour 100 mots</p>
                  <p>Type de lien</p>
                  <p>Maximum de liens client</p>
                  <p>Maximum de liens exeterne</p>
                  <p>Mention sponsorisé</p>
                  <p>Google news</p>
                  <p>Durée du lien</p>
                  <p>Catégorie de l'article</p>
                </div>
                {data && Array.isArray(data.products)
                  ? data.products.map((product, index) => {
                      const prixMoyen = 1136;
                      let type = '';

                      switch (product?.type) {
                        case 'SPONSO_WITH_VALIDATION':
                          type = 'Sponsorisé avec validation';
                          break;
                        case 'SPONSO_WITHOUT_VALIDATION':
                          type = 'Sponsorisé sans validation';
                          break;
                        default:
                          type = 'Publi-rédactionnel';
                          break;
                      }

                      return (
                        <div className="datatableContent" key={product?.id}>
                          <p
                            className={
                              index == 0
                                ? 'first-child'
                                : index == product.length - 1
                                ? 'last-child'
                                : ''
                            }
                          >
                            {type}
                          </p>
                          <p style={{ fontWeight: 'bold', fontSize: 14 }}>
                            {product?.price} €
                          </p>
                          <p>{getRedactionType(product?.redactionType)}</p>
                          <p>
                            {product?.type !== 'PUBLI' ? product?.nbWords : '-'}
                          </p>
                          <p style={{ fontWeight: 'bold' }}>
                            {product?.margedPricePer100Words !== null
                              ? `${product?.margedPricePer100Words} €`
                              : 'Pas de surprix'}
                          </p>
                          <p>
                            {product?.linkType === 'Lien en "dofollow"'
                              ? 'Lien à suivre'
                              : 'linkDofollow'}
                          </p>
                          <p>{product?.nbMaxLinksClient}</p>
                          <p>{product?.nbMaxLinksExternal}</p>
                          <p>{product.sponso ? 'yes' : 'no'}</p>
                          <p>{getGoogleNews(product?.isGoogleNews)}</p>
                          <p>{linkDuration(product.validityDuration)}</p>
                          <p>{getCategory(product.category)}</p>
                        </div>
                      );
                    })
                  : null}
              </div>
            </>
          </Collapse>
          <Collapse
            backgroundDark={true}
            title={'INDICATEURS SEO'}
            defaultCollapse={true}
          >
            <div className="themetitle">TRUST FLOW</div>

            <div className="boitegraph">
              <div className="entetegraph">
                <div className="graphtitle">TRUST FLOW</div>
                <div className="valeurgraph">
                  {data ? data.trustFlow : 'Aucune donnée disponible'}
                </div>
              </div>
              <div className="graph">
                <DynamicReactApexChart
                  options={chartOptionsTrustFlow}
                  type={'area'}
                  height={'100%'}
                  width={'100%'}
                  key={'trustFlow'}
                  series={
                    seriesTrustFlow.length && seriesTrustFlow[0].data.length
                      ? seriesTrustFlow
                      : [
                          {
                            name: 'TrustFlow',
                            data: [],
                          },
                        ]
                  }
                />
              </div>
            </div>

            <div className="boitegraph">
              <div className="entetegraph">
                <div className="graphtitle">CITATION FLOW</div>
                <div className="valeurgraph">
                  {data ? data.citationFlow : 'Aucune donnée disponible'}
                </div>
              </div>
              <div className="graph">
                <DynamicReactApexChart
                  options={chartOptionsTrustFlow}
                  type={'area'}
                  height={'100%'}
                  width={'100%'}
                  key={'citationFlow'}
                  series={
                    seriesCitationFlow.length &&
                    seriesCitationFlow[0].data.length
                      ? seriesCitationFlow
                      : [
                          {
                            name: 'CitationFlow',
                            data: [],
                          },
                        ]
                  }
                />
              </div>
            </div>

            <div className="boitegraph">
              <div className="entetegraph">
                <div className="graphtitle">TOTAL BACKLINKS</div>
                <div className="valeurgraph">
                  {data ? data.totalBacklinks : 'Aucune donnée disponible'}
                </div>
              </div>

              <div className="graph">
                <DynamicReactApexChart
                  options={chartOptionsTrustFlow}
                  type={'area'}
                  height={'100%'}
                  width={'100%'}
                  key={'totalBacklinks'}
                  series={
                    seriesTotalBacklinks.length &&
                    seriesTotalBacklinks[0].data.length
                      ? seriesTotalBacklinks
                      : [
                          {
                            name: 'TotalBacklinks',
                            data: [],
                          },
                        ]
                  }
                />
              </div>
            </div>

            <div className="boitegraph">
              <div className="entetegraph">
                <div className="graphtitle">DOMAINE RÉFÉRENT</div>
                <div className="valeurgraph">
                  {data ? data.referringDomains : 'Aucune donnée disponible'}
                </div>
              </div>
              <div className="graph">
                <DynamicReactApexChart
                  options={chartOptionsTrustFlow}
                  type={'area'}
                  height={'100%'}
                  width={'100%'}
                  key={'totalBacklinks'}
                  series={
                    seriesRefDomains.length && seriesRefDomains[0].data.length
                      ? seriesRefDomains
                      : [
                          {
                            name: 'RefDomains',
                            data: [],
                          },
                        ]
                  }
                />
              </div>
            </div>

            <div className="boitegraph">
              <div className="entetegraph">
                <div className="graphtitle">ORGANIC KEYWORDS</div>
                <div className="valeurgraph">
                  {data ? data.organicKeywords : 'Aucune donnée disponible'}
                </div>
              </div>
              <div className="graph">
                <DynamicReactApexChart
                  options={chartOptionsTrustFlow}
                  type={'area'}
                  height={'100%'}
                  width={'100%'}
                  key={'organicKeywords'}
                  series={
                    seriesOrganicKeywords.length &&
                    seriesOrganicKeywords[0].data.length
                      ? seriesOrganicKeywords
                      : [
                          {
                            name: 'OrganicKeywords',
                            data: [],
                          },
                        ]
                  }
                />
              </div>
            </div>

            <div className="boitegraph">
              <div className="entetegraph">
                <div className="graphtitle">ORGANIC TRAFFIC</div>
                <div className="valeurgraph">
                  {data ? data.organicTraffic : 'Aucune donnée disponible'}
                </div>
              </div>
              <div className="graph">
                <DynamicReactApexChart
                  options={chartOptionsTrustFlow}
                  type={'area'}
                  height={'100%'}
                  width={'100%'}
                  key={'organicTraffic'}
                  series={
                    seriesOrganicTraffic.length &&
                    seriesOrganicTraffic[0].data.length
                      ? seriesOrganicTraffic
                      : [
                          {
                            name: 'OrganicTraffic',
                            data: [],
                          },
                        ]
                  }
                />
              </div>
            </div>
          </Collapse>
        </div>
        <div className="panneaudedroite">
          <Collapse
            defaultCollapse={true}
            title={'OFFRES DISPONIBLES'}
            backgroundDark={false}
          >
            <div className="prixarticleprix">
              <div className="boiteprixarticle">
                <div>
                  {data.products.map((product, index) => (
                    <div className="typederedactionarticle" key={index}>
                      {product.redactionType == 'SPONSO_WITH_VALIDATION'
                        ? "Article sponsorisé avec validation de l'acheteur"
                        : 'Publi-rédactionnel'}
                    </div>
                  ))}
                </div>
                <div>
                  {data.products.map((product, index) => (
                    <div className="dataelementsdisplay" key={index}>
                      {product.price} € HT
                    </div>
                  ))}
                </div>
                <div className="ptitI">
                  <div>ⓘ</div>
                </div>
              </div>
            </div>

            <div className="line-containerwhite">
              <div className="linewhite"></div>
            </div>
            <div className="allersurseojungle">
              <Button
                variant={'fill'}
                color={'secondary'}
                value={'Voir sur SEO JUNGLE'}
                size={'medium'}
                onClick={handleButtonClick}
              />
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default ViewDisplayData;
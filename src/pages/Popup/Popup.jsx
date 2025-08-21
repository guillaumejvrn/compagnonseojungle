import React, { useEffect } from 'react';
import './Popup.css';
import axios from 'axios';
import { Button, Form, Input, Tuto } from '@methodzlabs/seo-jungle-components'; // Pour un projet moderne (ES Module ou React)

const Popup = () => {
  const [isConnected, setIsConnected] = React.useState(false);




  /*--------------------------------sign with google------------------------------------------*/


  chrome.storage.local.get("jwtCookie").then((result) => {
    // console.log("Variable lue:", result.jwtCookie);
    const passJwt = result.jwtCookie;
    localStorage.setItem('JWT', passJwt);
  });



  /*--------------------------------sign with google------------------------------------------*/


  const onClickSSOGoogle = () => {
    const jwt = localStorage.getItem('JWT');
    if (jwt !== null && jwt !== "undefined") {
      setIsConnected(true);
    } else {
      window.open(`https://app.seo-jungle.com/fr/login`, '_blank');
    }
  }

  useEffect(() => {
    islogged();


  }, []);

  const islogged = () => {
    const jwt = localStorage.getItem('JWT');
    if (jwt !== null && jwt !== "undefined") {
      setIsConnected(true);
    }
  }

  const onSubmit = (data) => {
    // console.log(data);
    axios
      .post('https://api.seo-jungle.com/auth/signin', data)
      .then((res) => {
        // console.log(res);
        const token = res.data.data.jwt;
        const firstName = res.data.data.user.firstname;
        const id = res.data.data.user.id;
        localStorage.setItem('JWT', token);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('id', id);
        setIsConnected(true);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const resetPassword = () => {
    window.open('https://api.seo-jungle.com/fr/reset-password', '_blank', 'noopener,noreferrer');
  }

  const fetchData = () => {
    const token = localStorage.getItem('JWT');
    axios
      .get('https://api.seo-jungle.com/auth/signin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const logout = () => {
    localStorage.removeItem('JWT');
    setIsConnected(false);
  };

  const localstorageJWT  = localStorage.getItem('JWT');
  chrome.storage.local.set({ jwt: localstorageJWT }, () => {
    // console.log('JWT sauvegardé dans chrome.storage.local');
  });
  const localstorageID = localStorage.getItem('id');
  chrome.storage.local.set({ id: localstorageID }, () => {
    // console.log('id sauvegardé dans chrome.storage.local');
  });
  const localstorageFN = localStorage.getItem('firstName');
  chrome.storage.local.set({ firstName: localstorageFN }, () => {
    // console.log('firstName sauvegardé dans chrome.storage.local');
  });


  const firstname = localStorage.getItem('firstName');

  return (
    <div className="App">
      {isConnected ? (
        <div>
          <h1>Bienvenue, {firstname}!</h1>
          <h3>vous êtes connecté</h3>
            <Button
              variant={'fill'}
              color={'danger'}
              value={'Logout'}
              onClick={logout}
            />
        </div>
        ) : (
        <Form onSubmit={onSubmit}>
          <div className={"logo"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="47.15"
              height="30.96"
              viewBox="0 0 20.406 13.225"
            >
              <g id="Groupe_1036" transform="translate(0 0)">
                <path
                  id="Tracé_252"
                  d="M20.4,64.255a18.563,18.563,0,0,0-.559-3.637,13.84,13.84,0,0,0-1.144-3.06c-1.779-3.085-3.711-2.608-6.024-2.006A16.754,16.754,0,0,1,10.331,56h-.254a16.754,16.754,0,0,1-2.338-.451c-2.313-.577-4.245-1.078-6.024,2.031a12.679,12.679,0,0,0-1.144,3.06A18.564,18.564,0,0,0,.011,64.28,6.75,6.75,0,0,0,.367,67.14a1.917,1.917,0,0,0,1.22,1.129,2.516,2.516,0,0,0,1.627-.176A11.949,11.949,0,0,0,6.467,65.81,5.663,5.663,0,0,1,10.2,64.682,5.663,5.663,0,0,1,13.94,65.81a11.949,11.949,0,0,0,3.253,2.282,2.692,2.692,0,0,0,1.627.176,1.889,1.889,0,0,0,1.22-1.154A6.624,6.624,0,0,0,20.4,64.255Zm-1.22,2.508a1,1,0,0,1-.61.627,1.777,1.777,0,0,1-1.042-.125,10.366,10.366,0,0,1-2.948-2.082,6.4,6.4,0,0,0-4.372-1.43,6.762,6.762,0,0,0-4.4,1.379,10.562,10.562,0,0,1-2.948,2.082,1.6,1.6,0,0,1-1.042.125,1,1,0,0,1-.61-.627,5.856,5.856,0,0,1-.254-2.408,17.086,17.086,0,0,1,.534-3.461,11.868,11.868,0,0,1,1.068-2.834c1.4-2.483,3.025-2.082,4.956-1.58A15.088,15.088,0,0,0,10,56.907h.381a14.9,14.9,0,0,0,2.516-.477c1.932-.477,3.558-.9,4.956,1.58a11.469,11.469,0,0,1,1.068,2.834,18.748,18.748,0,0,1,.534,3.461A5.732,5.732,0,0,1,19.176,66.763Z"
                  transform="translate(0 -55.109)"
                  fill="#fff"
                ></path>
              </g>
              <g id="Groupe_1038" transform="translate(2.629 2.5)">
                <path
                  id="Tracé_253"
                  d="M46.609,96.737a1.553,1.553,0,0,0-.915-.426,1.419,1.419,0,0,0-.407-.878l-.025-.025a1.449,1.449,0,0,0-1.042-.426,1.511,1.511,0,0,0-1.042.426,1.45,1.45,0,0,0-.432.9,1.524,1.524,0,0,0-.915.4l-.025.025a1.411,1.411,0,0,0-.432,1.028,1.471,1.471,0,0,0,.432,1.028,1.425,1.425,0,0,0,.94.426,1.331,1.331,0,0,0,.432.9,1.449,1.449,0,0,0,1.042.426,1.478,1.478,0,0,0,1.474-1.329,1.363,1.363,0,0,0,.915-.426,1.411,1.411,0,0,0,.432-1.028A1.471,1.471,0,0,0,46.609,96.737Zm-.635,1.4a.521.521,0,0,1-.381.15h-.356a.479.479,0,0,0-.483.477v.326a.507.507,0,0,1-.153.376.558.558,0,0,1-.763,0,.507.507,0,0,1-.153-.376v-.351a.479.479,0,0,0-.483-.477h-.356a.521.521,0,0,1-.381-.15.509.509,0,0,1,0-.727l.025-.025a.612.612,0,0,1,.356-.125H43.2a.479.479,0,0,0,.483-.477v-.351a.507.507,0,0,1,.153-.376.558.558,0,0,1,.763,0l.025.025a.594.594,0,0,1,.127.351v.351a.479.479,0,0,0,.483.477h.356a.521.521,0,0,1,.381.15.54.54,0,0,1,0,.752Z"
                  transform="translate(-41.373 -94.981)"
                  fill="#fff"
                ></path>
              </g>
              <g id="Groupe_1040" transform="translate(13.736 2.625)">
                <ellipse
                  id="Ellipse_318"
                  cx="0.89"
                  cy="0.878"
                  rx="0.89"
                  ry="0.878"
                  transform="translate(0 0)"
                  fill="#fff"
                ></ellipse>
              </g>
              <g id="Groupe_1042" transform="translate(13.736 6.187)">
                <ellipse
                  id="Ellipse_319"
                  cx="0.89"
                  cy="0.878"
                  rx="0.89"
                  ry="0.878"
                  transform="translate(0 0)"
                  fill="#fff"
                ></ellipse>
              </g>
              <g id="Groupe_1044" transform="translate(11.931 4.406)">
                <ellipse
                  id="Ellipse_320"
                  cx="0.89"
                  cy="0.878"
                  rx="0.89"
                  ry="0.878"
                  transform="translate(0 0)"
                  fill="#fff"
                ></ellipse>
              </g>
              <g id="Groupe_1046" transform="translate(15.541 4.406)">
                <ellipse
                  id="Ellipse_321"
                  cx="0.89"
                  cy="0.878"
                  rx="0.89"
                  ry="0.878"
                  transform="translate(0 0)"
                  fill="#fff"
                ></ellipse>
              </g>
            </svg>
          </div>
          <h1 className="Login_appName__i5RX4">SEO <br></br>JUNGLE</h1>
          <Input
            label={'Adresse e-mail*'}
            name={'email'}
            type={'text'}
            rules={{ require: true }}
          />
          <Input
            label={'Mot de passe : '}
            name={'password'}
            type={'password'}
            rules={{ require: true }}
          />
          <a href="#" onClick={resetPassword} className="reset-password-link">Mot de passe oublié ?</a>
          <div className={"bouttondubas"}>
            <Button variant={'fill'} color={'secondary'} value={'Connexion'} />
            <Button variant={'fill'} color={'secondary'} value={'Sign with google'} onClick={onClickSSOGoogle} className="ssogoogle" />
          </div>

        </Form>

      )}


    </div>
  );
};

export default Popup;
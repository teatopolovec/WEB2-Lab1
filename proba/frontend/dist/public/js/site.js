let serverUri;
let auth0 = null;
const fetchAuthConfig = () => fetch("/auth_config.json");
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();    
  
  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    audience: config.audience
  });
};
const render = async () => {
  const response = await fetch("/render");
  const ser = await response.json();    
  return ser.render;
};

const m2m = async () => {
  const response = await fetch("/m2m.json");
  const config = await response.json(); 

  return fetch(`https://dev-q01cbhnbnhsork5v.us.auth0.com/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: config.client_id,
      client_secret: config.client_secret,
      audience: config.audience,
      grant_type: config.grant
    })
  })
};



window.onload = fetchBrojUlaznica;
async function fetchBrojUlaznica() {
  await configureClient();
  const isAuthenticated = await auth0.isAuthenticated();
  if (!isAuthenticated) {
    document.getElementById('header-container').style.display =  "none" ;
  } else {
    const user = await auth0.getUser();
    document.getElementById('username').textContent = user.email;
  }
  const x = await m2m(); 
  const i = await x.json();
  const token = i.access_token;
  try {
    const rez = await render(); 
    serverUri = rez ? rez : "http://127.0.0.1:4071";
    const response = await fetch(`${serverUri}/brojUlaznica`, {
        headers: {
        Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) { 
      const errorData = await response.json();
      throw new Error(errorData.error || 'Greška na serveru!');
    }
    const data = await response.json();
    document.getElementById('broj-ulaznica').textContent = `${data.broj}`;
  } catch (error) {
    document.getElementById('broj-ulaznica').textContent = `${error.message}`;
  }
}


async function generirajUlaznicu() {
  const staraSlika = document.getElementById('slika');
  if (staraSlika) {
      staraSlika.remove();
  }
  const staraPoruka = document.getElementById('poruka');
  if (staraPoruka) {
    staraPoruka.remove();
  }

  const vatin = document.getElementById('OIB').value;
  const firstName = document.getElementById('Ime').value;
  const lastName = document.getElementById('Prezime').value;
  const poruka = document.createElement('div');
  poruka.id = 'poruka';
  document.getElementById('naslov').insertAdjacentElement('afterend', poruka);
  
  if (vatin && firstName && lastName) {
    const podaci = { vatin, firstName, lastName };

    const x = await m2m(); 
    const i = await x.json();
    const token = i.access_token;
    fetch(`${serverUri}/generirajUlaznicu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(podaci),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.error || 'Greška na serveru!');
        });
      }
      return response.json();
    })
    .then(data => {
      poruka.innerHTML = '<p>Ulaznica je uspješno generirana!</p>';
      poruka.style.backgroundColor = 'rgb(188 253 191 / 69%)'; 
      poruka.style.color = '#006100';
      poruka.style.border = '1px solid #006100';
      document.getElementById('broj-ulaznica').textContent = parseInt(document.getElementById('broj-ulaznica').textContent) + 1;
      const slika = document.createElement('img');
      slika.id = 'slika'
      slika.src = data.qrcode;
      slika.alt = 'QRcode';
      slika.style.maxWidth = '100%';
      slika.style.height = 'auto';
      slika.style.margin = '40px';
      slika.style.minWidth = '15rem';
      document.getElementById('ulaznica-form').insertAdjacentElement('afterend', slika);
    })
    .catch(error => {
      poruka.innerHTML = `<p>${error.message}</p>`;
      poruka.style.backgroundColor = 'rgb(213 179 247)'; 
      poruka.style.color = 'rgb(96 0 192)';
      poruka.style.border = '1px solid rgb(96 0 192)';
    });
  } else {
    poruka.innerHTML = '<p>Ispunite sva polja!</p>';
    poruka.style.backgroundColor = 'rgb(213 179 247)'; 
    poruka.style.color = 'rgb(96 0 192)';
    poruka.style.border = '1px solid rgb(96 0 192)';
  }
};
document.getElementById('submitBtn').addEventListener('click', generirajUlaznicu);

const logout = async () => {
  await auth0.logout({
    returnTo: window.location.origin
  });
};
document.getElementById('logout-button').addEventListener("click", logout);
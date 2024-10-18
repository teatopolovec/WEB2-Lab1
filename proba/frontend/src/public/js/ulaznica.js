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

async function ucitaj() {
    await configureClient();
    const isAuthenticated = await auth0.isAuthenticated();
    if (!isAuthenticated) {
        window.location.href = `/login?id=${window.location.pathname.split('/').pop()}`;
    }
    const user = await auth0.getUser();
    document.getElementById('username').textContent = user.email;
    try {    
        const token = await auth0.getTokenSilently();  
        const rez = await render(); 
        serverUri = rez ? rez : "http://127.0.0.1:4071";
        const uuid = window.location.pathname.split('/').pop();
        fetch(`${serverUri}/ulaznica/${uuid}`, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.log(errorData)
                    throw new Error(errorData.error || 'Greška na serveru!');
                    });
                }
                return response.json();
            })
            .then(data => {
                const datum = new Date(data.created_at);
                const infoDiv = document.getElementById('info')
                infoDiv.style.display = 'block'
                document.getElementById('oib').textContent = data.oib || 'Nema podataka';
                document.getElementById('ime').textContent = data.first_name || 'Nema podataka';
                document.getElementById('prezime').textContent = data.last_name || 'Nema podataka';
                document.getElementById('generirano').textContent = `${datum.toLocaleString('hr-HR', { dateStyle: 'medium', timeStyle: 'short' })}` || 'Nema podataka';
            })
            .catch(error => {
                const infoDiv = document.getElementById('info');
                infoDiv.style.border = '5px solid red';
                infoDiv.style.color = 'red';
                infoDiv.style.borderStyle = 'dashed';
                infoDiv.textContent = error.message;
                infoDiv.style.display = 'block'
            });
    } catch (e) {
        const infoDiv = document.getElementById('info');
        infoDiv.style.border = '5px solid red';
        infoDiv.style.color = 'red';
        infoDiv.style.borderStyle = 'dashed';
        infoDiv.textContent = error.message;
        infoDiv.style.display = 'block'  
    }
};
window.onload = ucitaj;

const logout = async () => {
    await auth0.logout({
        returnTo: window.location.origin
    });
};
document.getElementById('logout-button').addEventListener("click", logout);

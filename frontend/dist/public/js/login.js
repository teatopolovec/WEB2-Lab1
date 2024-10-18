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

async function ucitaj() {
    await configureClient();
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        const result = await auth0.handleRedirectCallback();
        const appState = result.appState;
        const id = JSON.parse(appState.state).id; 
        window.history.replaceState({}, document.title, "/");
        window.location.href = `/${id}`;
    }
    const isAuthenticated = await auth0.isAuthenticated();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    if (!isAuthenticated) {
        await auth0.loginWithRedirect({
            redirect_uri: `${window.location.origin}${window.location.pathname}`,
            appState: { state: JSON.stringify({ id: `${id}` })}
        });
        return;
    }
};
window.onload = ucitaj;
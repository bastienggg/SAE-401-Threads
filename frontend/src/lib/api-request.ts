let API_URL = "http://localhost:8080/"; // URL de base de l'API (à définir)


const getRequest = async function <T>(uri: string, token?: string): Promise<T | false> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method: "GET",
    headers: headers,
  };

  try {
    const response = await fetch(API_URL + uri, options); 
    if (!response.ok) {
      console.error(
        `Erreur de requête : ${response.status} ${response.statusText}`,
      ); 
      return false; 
    }
    const obj = await response.json();
    return obj; 
  } catch (e) {
    console.error("Echec de la requête : ", e); 
    return false;
  }
};
const postRequest = async function <T>(uri: string, data: any, token?: string): Promise<T | null> {
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method: "POST",
    headers: headers,
    body: data instanceof FormData ? data : JSON.stringify(data),
  };

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(API_URL + uri, options);
    if (!response.ok) {
      console.error(`Request failed: ${response.status} ${response.statusText}`);
      return null; // Return null on failure
    }
    const obj = await response.json();
    return obj;
  } catch (e) {
    console.error("Echec de la requête : ", e);
    return null; // Return null on exception
  }
};

const patchRequest = async function <T>(uri: string, data: any, token?: string): Promise<T | false> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(API_URL + uri, options);
    if (!response.ok) {
      console.error(
        `Erreur de requête : ${response.status} ${response.statusText}`,
      );
      return false;
    }
    const obj = await response.json();
    return obj;
  } catch (e) {
    console.error("Echec de la requête : ", e);
    return false;
  }
};


const deleteRequest = async function <T>(uri: string, token?: string): Promise<T | false> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method: "DELETE",
    headers: headers,
  };

  try {
    const response = await fetch(API_URL + uri, options);
    if (!response.ok) {
      console.error(
        `Erreur de requête : ${response.status} ${response.statusText}`,
      );
      return false;
    }
    const obj = await response.json();
    return obj;
  } catch (e) {
    console.error("Echec de la requête : ", e);
    return false;
  }
};

export { getRequest, postRequest, patchRequest, deleteRequest };
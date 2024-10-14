export function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === cookieName) {
        return value;
      }
    }
    return null; // Return null if the cookie is not found
  }
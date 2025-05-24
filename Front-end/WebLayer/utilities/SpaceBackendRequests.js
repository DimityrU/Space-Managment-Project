export async function getData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
}
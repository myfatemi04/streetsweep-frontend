/**
 *
 * @returns {Promise<{
 * 	id: number,
 *  lat: number,
 *  lon: number,
 *  class_likelihoods: number[]
 * }[]>}
 */
export async function getSubmissions() {
  const request = await fetch("http://127.0.0.1:5000/submissions");
  const json = await request.json();

  return json;
}

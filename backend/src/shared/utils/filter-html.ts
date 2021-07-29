import cheerio from 'cheerio'
import { makeRequest } from './make-http-request';

export const filterHTML = async (html: string, url: string): Promise<string> => {
  const $ = cheerio.load(html);
  $('#atIdViewHeader').attr('style', 'display: none;');
  $('[aria-label="Site actions"]').attr('style', 'display: none;');
  const mainScript = $('#base-js');
  const mainScriptSrc = mainScript.attr().src;
  const loadedScript = await makeRequest(mainScriptSrc);
  const newScript = loadedScript.replace(`window.location.host.endsWith(".google.com")`, 'true');
  mainScript.removeAttr('src');
  mainScript.attr('href', mainScriptSrc);
  mainScript.attr('type', 'text/javascript');
  mainScript.text(newScript);
  return $.html();
}

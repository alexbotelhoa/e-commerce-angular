import cheerio from 'cheerio'
import { makeRequest } from './make-http-request';

export const filterHTML = async (html: string, url: string): Promise<string> => {
  const $ = cheerio.load(html);
  // gets the main script we need to edit
  const mainScript = $('#base-js');
  const mainScriptSrc = mainScript.attr().src;
  // fetch the raw javascript
  const loadedScript = await makeRequest(mainScriptSrc);
  // replace the host protection
  const newScript = loadedScript.replace(`window.location.host.endsWith(".google.com")`, 'true');
  // we switch the src attribute with the href attribute because the script makes use of either of those, 
  // and if it is not provided, it results in an exception that crashes the page. The href attribute allows us to set the src but not load it
  mainScript.removeAttr('src');
  mainScript.attr('href', mainScriptSrc);
  mainScript.attr('type', 'text/javascript');
  // since the script is not being loaded because of the href attribute instead of the src, we can insert the modified script inline
  mainScript.text(newScript);
  return $.html()
}

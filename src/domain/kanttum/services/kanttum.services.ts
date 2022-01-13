import axios from 'axios';

interface KanttumRequestPromise {
  urlRedirect: string;
}

interface KanttumResponseData {
  data: {
    attributes: {
      access_token: string,
    }
  }
}

export async function kanttumFactory(userName: string, userEmail: string): Promise<KanttumRequestPromise | undefined> {
  try {
    const authenticationEndpoint = `https://api.kanttum.com/public/integracao_ci/access-token`;
    const { data } = await axios.post<KanttumResponseData>(authenticationEndpoint, {
      data: {
        attributes: {
          name: userName,
          email: userEmail
        }
      }
    }, {
        headers: {
          'Accept': 'application/vnd.growth.v1',
          'Content-Type': 'application/vnd.api+json',
          'X-APP-ID': 'cyf5BL577ByYGkhdQ7kynLRL',
          'X-API-KEY': 'c8HZU45L1gVCM3B29QJYfL2F',
        },
        responseType: 'json',
    });

    const subdomain = 'cisp.dev';
    const accessToken = data.data.attributes.access_token;
    const redirect = '/processes/mentored';

    const urlFull = `https://${subdomain}.kanttum.com/sso?token=${accessToken}&redirect=${redirect}`;

    return {
      urlRedirect: urlFull
    };
  } catch (e) {
    console.log("responseError: ", e);
    return undefined;
  }
}

import * as crypto from "crypto";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

function sha(key: string, body: any, algorithm: string) {
  return crypto.createHmac(algorithm, key).update(body).digest("base64");
}

function rfc3986(str: any) {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/'/g, "%27");
}

function map(obj: any) {
  const arr = [];
  for (const key in obj) {
    const val = obj[key];
    if (Array.isArray(val))
      for (let i = 0; i < val.length; i++) arr.push([key, val[i]]);
    else if (typeof val === "object")
      for (const prop in val) arr.push([key + "[" + prop + "]", val[prop]]);
    else arr.push([key, val]);
  }
  return arr;
}

function compare(a: any, b: any) {
  return a > b ? 1 : a < b ? -1 : 0;
}

function generateBase(httpMethod: any, base_uri: any, params: any) {
  const normalized = map(params)
    .map(function (p) {
      return [rfc3986(p[0]), rfc3986(p[1] || "")];
    })
    .sort(function (a, b) {
      return compare(a[0], b[0]) || compare(a[1], b[1]);
    })
    .map(function (p) {
      return p.join("=");
    })
    .join("&");

  const base = [
    rfc3986(httpMethod ? httpMethod.toUpperCase() : "GET"),
    rfc3986(base_uri),
    rfc3986(normalized),
  ].join("&");

  return base;
}

export function hmacsign(
  httpMethod: string,
  base_uri: string,
  params: any,
  consumer_secret: string,
  token_secret?: string
): string {
  const base = generateBase(httpMethod, base_uri, params);
  const key = [consumer_secret || "", token_secret || ""]
    .map(rfc3986)
    .join("&");

  return sha(key, base, "sha1");
}

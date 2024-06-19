import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';

const locales = ['en', 'ja', 'es', 'ko', 'zh'];
const defaultLocale = 'en';
const pathsToIgnore = ['/images/', '/_next/', '/public/', '/ffmpeg/'];

function getLocale(request: NextRequest) {
  const preferredLanguages = new Negotiator(request).languages();

  for (let i = 0; i < preferredLanguages.length; i++) {
    const lang = preferredLanguages[i];
    if (locales.some((language) => language.includes(lang))) {
      return lang;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  const isPublicPath = pathsToIgnore.some((path) => pathname.startsWith(path));

  // Redirect if there is no locale
  if (pathnameIsMissingLocale && !isPublicPath) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en/products
    const newURL = `/${locale}${pathname}`;

    // replace any // with /
    // const normalizedURL = newURL.replace(/\/\/+/g, '/');

    return NextResponse.redirect(new URL(newURL, request.url));
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)'
  ]
};

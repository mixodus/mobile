import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  tokenName: string = 'idstar-token';
  // apiUrl: string = 'http://app.idstar.co.id/talents/';
  // apiUrl: string = "localhost:8080/idstar/api/profile?X-Api-Key=idstar123!&{{TOKEN}}";
  // apiUrl: string = 'http://localhost/idstar-web/';
  apiUrl: string = 'http://dev-talents-api.oneindonesia.id/';
  // apiUrl: string = 'http://prod-laravel.oneindonesia.id/';
  // apiUrl: string = 'http://ids-api.diodeiva.com/';
  // apiUrl: string = "http://192.168.0.8/idstar-web/";
  globalApiKey = 'idstar123!';
  paramLoginTime = 'idstar-logintime';
  paramExpirationTime: string = 'idstar-expiration';
  token: string;
  version: number = 5;
  maxFeeReferal: string = '1.500.000';
  jobSegmentValue = 'jobs';
  referralSegmentValue = 'referral';
  refreshFlag = {
    home: true,
    job: true,
    jobApp: true,
    job_detail: true,
    profile: true,
    workExp: true,
    education: true,
    project: true,
    referral: true,
    challenge: true,
    challenge_detail: true,
    leaderboard: true,
    level: true,
    friend_list: true,
    friend_request: true
  };
  restrictedBackUrl = '';
  previousPage = '';
  constructor() {}

  setBackRestrictedUrl(url) {
    this.restrictedBackUrl = url;
  }

  setPreviousPage(page) {
    console.log('page: ', page);
    this.previousPage = page;
  }

  getTokenName() {
    return this.tokenName;
  }

  getApiUrl() {
    return this.apiUrl;
  }

  getGlobalApiKey() {
    return this.globalApiKey;
  }

  getParamLoginTime() {
    return this.paramLoginTime;
  }

  getParamExpirationTime() {
    return this.paramExpirationTime;
  }

  map = {
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
    ' ': '&nbsp;',
    '¡': '&iexcl;',
    '¢': '&cent;',
    '£': '&pound;',
    '¤': '&curren;',
    '¥': '&yen;',
    '¦': '&brvbar;',
    '§': '&sect;',
    '¨': '&uml;',
    '©': '&copy;',
    ª: '&ordf;',
    '«': '&laquo;',
    '¬': '&not;',
    '®': '&reg;',
    '¯': '&macr;',
    '°': '&deg;',
    '±': '&plusmn;',
    '²': '&sup2;',
    '³': '&sup3;',
    '´': '&acute;',
    µ: '&micro;',
    '¶': '&para;',
    '·': '&middot;',
    '¸': '&cedil;',
    '¹': '&sup1;',
    º: '&ordm;',
    '»': '&raquo;',
    '¼': '&frac14;',
    '½': '&frac12;',
    '¾': '&frac34;',
    '¿': '&iquest;',
    À: '&Agrave;',
    Á: '&Aacute;',
    Â: '&Acirc;',
    Ã: '&Atilde;',
    Ä: '&Auml;',
    Å: '&Aring;',
    Æ: '&AElig;',
    Ç: '&Ccedil;',
    È: '&Egrave;',
    É: '&Eacute;',
    Ê: '&Ecirc;',
    Ë: '&Euml;',
    Ì: '&Igrave;',
    Í: '&Iacute;',
    Î: '&Icirc;',
    Ï: '&Iuml;',
    Ð: '&ETH;',
    Ñ: '&Ntilde;',
    Ò: '&Ograve;',
    Ó: '&Oacute;',
    Ô: '&Ocirc;',
    Õ: '&Otilde;',
    Ö: '&Ouml;',
    '×': '&times;',
    Ø: '&Oslash;',
    Ù: '&Ugrave;',
    Ú: '&Uacute;',
    Û: '&Ucirc;',
    Ü: '&Uuml;',
    Ý: '&Yacute;',
    Þ: '&THORN;',
    ß: '&szlig;',
    à: '&agrave;',
    á: '&aacute;',
    â: '&acirc;',
    ã: '&atilde;',
    ä: '&auml;',
    å: '&aring;',
    æ: '&aelig;',
    ç: '&ccedil;',
    è: '&egrave;',
    é: '&eacute;',
    ê: '&ecirc;',
    ë: '&euml;',
    ì: '&igrave;',
    í: '&iacute;',
    î: '&icirc;',
    ï: '&iuml;',
    ð: '&eth;',
    ñ: '&ntilde;',
    ò: '&ograve;',
    ó: '&oacute;',
    ô: '&ocirc;',
    õ: '&otilde;',
    ö: '&ouml;',
    '÷': '&divide;',
    ø: '&oslash;',
    ù: '&ugrave;',
    ú: '&uacute;',
    û: '&ucirc;',
    ü: '&uuml;',
    ý: '&yacute;',
    þ: '&thorn;',
    ÿ: '&yuml;',
    Œ: '&OElig;',
    œ: '&oelig;',
    Š: '&Scaron;',
    š: '&scaron;',
    Ÿ: '&Yuml;',
    ƒ: '&fnof;',
    ˆ: '&circ;',
    '˜': '&tilde;',
    Α: '&Alpha;',
    Β: '&Beta;',
    Γ: '&Gamma;',
    Δ: '&Delta;',
    Ε: '&Epsilon;',
    Ζ: '&Zeta;',
    Η: '&Eta;',
    Θ: '&Theta;',
    Ι: '&Iota;',
    Κ: '&Kappa;',
    Λ: '&Lambda;',
    Μ: '&Mu;',
    Ν: '&Nu;',
    Ξ: '&Xi;',
    Ο: '&Omicron;',
    Π: '&Pi;',
    Ρ: '&Rho;',
    Σ: '&Sigma;',
    Τ: '&Tau;',
    Υ: '&Upsilon;',
    Φ: '&Phi;',
    Χ: '&Chi;',
    Ψ: '&Psi;',
    Ω: '&Omega;',
    α: '&alpha;',
    β: '&beta;',
    γ: '&gamma;',
    δ: '&delta;',
    ε: '&epsilon;',
    ζ: '&zeta;',
    η: '&eta;',
    θ: '&theta;',
    ι: '&iota;',
    κ: '&kappa;',
    λ: '&lambda;',
    μ: '&mu;',
    ν: '&nu;',
    ξ: '&xi;',
    ο: '&omicron;',
    π: '&pi;',
    ρ: '&rho;',
    ς: '&sigmaf;',
    σ: '&sigma;',
    τ: '&tau;',
    υ: '&upsilon;',
    φ: '&phi;',
    χ: '&chi;',
    ψ: '&psi;',
    ω: '&omega;',
    ϑ: '&thetasym;',
    ϒ: '&Upsih;',
    ϖ: '&piv;',
    '–': '&ndash;',
    '—': '&mdash;',
    '‘': '&lsquo;',
    '’': '&rsquo;',
    '‚': '&sbquo;',
    '“': '&ldquo;',
    '”': '&rdquo;',
    '„': '&bdquo;',
    '†': '&dagger;',
    '‡': '&Dagger;',
    '•': '&bull;',
    '…': '&hellip;',
    '‰': '&permil;',
    '′': '&prime;',
    '″': '&Prime;',
    '‹': '&lsaquo;',
    '›': '&rsaquo;',
    '‾': '&oline;',
    '⁄': '&frasl;',
    '€': '&euro;',
    ℑ: '&image;',
    '℘': '&weierp;',
    ℜ: '&real;',
    '™': '&trade;',
    ℵ: '&alefsym;',
    '←': '&larr;',
    '↑': '&uarr;',
    '→': '&rarr;',
    '↓': '&darr;',
    '↔': '&harr;',
    '↵': '&crarr;',
    '⇐': '&lArr;',
    '⇑': '&UArr;',
    '⇒': '&rArr;',
    '⇓': '&dArr;',
    '⇔': '&hArr;',
    '∀': '&forall;',
    '∂': '&part;',
    '∃': '&exist;',
    '∅': '&empty;',
    '∇': '&nabla;',
    '∈': '&isin;',
    '∉': '&notin;',
    '∋': '&ni;',
    '∏': '&prod;',
    '∑': '&sum;',
    '−': '&minus;',
    '∗': '&lowast;',
    '√': '&radic;',
    '∝': '&prop;',
    '∞': '&infin;',
    '∠': '&ang;',
    '∧': '&and;',
    '∨': '&or;',
    '∩': '&cap;',
    '∪': '&cup;',
    '∫': '&int;',
    '∴': '&there4;',
    '∼': '&sim;',
    '≅': '&cong;',
    '≈': '&asymp;',
    '≠': '&ne;',
    '≡': '&equiv;',
    '≤': '&le;',
    '≥': '&ge;',
    '⊂': '&sub;',
    '⊃': '&sup;',
    '⊄': '&nsub;',
    '⊆': '&sube;',
    '⊇': '&supe;',
    '⊕': '&oplus;',
    '⊗': '&otimes;',
    '⊥': '&perp;',
    '⋅': '&sdot;',
    '⌈': '&lceil;',
    '⌉': '&rceil;',
    '⌊': '&lfloor;',
    '⌋': '&rfloor;',
    '⟨': '&lang;',
    '⟩': '&rang;',
    '◊': '&loz;',
    '♠': '&spades;',
    '♣': '&clubs;',
    '♥': '&hearts;',
    '♦': '&diams;',
  };

  decode(string) {
    var entityMap = this.map;
    for (var key in entityMap) {
      var entity = entityMap[key];
      var regex = new RegExp(entity, 'g');
      string = string.replace(regex, key);
    }
    string = string.replace(/&quot;/g, '"');
    string = string.replace(/&amp;/g, '&');
    return string;
  }

  provinceArr: Array<string> = [
    'Aceh (NAD)',
    'Bali',
    'Banten',
    'Bengkulu',
    'DI Yogyakarta',
    'DKI Jakarta',
    'Gorontalo',
    'Jambi',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'Kalimantan Barat',
    'Kalimantan Selatan',
    'Kalimantan Tengah',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Kepulauan Bangka Belitung',
    'Kepulauan Riau',
    'Lampung',
    'Maluku',
    'Maluku Utara',
    'Nusa Tenggara Barat (NTB)',
    'Nusa Tenggara Timur (NTT)',
    'Papua',
    'Papua Barat',
    'Riau',
    'Sulawesi Barat',
    'Sulawesi Selatan',
    'Sulawesi Tengah',
    'Sulawesi Tenggara',
    'Sulawesi Utara',
    'Sumatera Barat',
    'Sumatera Selatan',
    'Sumatera Utara',
  ];

  countriesArr = [
    {
      code: 'ID',
      name: 'Indonesia',
    },
  ];
}

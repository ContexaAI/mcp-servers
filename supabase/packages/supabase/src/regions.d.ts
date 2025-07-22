import { type UnionToTuple, type ValueOf } from './util.js';
export type AwsRegion = {
    code: string;
    displayName: string;
    location: Location;
};
export type Location = {
    lat: number;
    lng: number;
};
export declare const EARTH_RADIUS = 6371;
export declare const TRACE_URL = "https://www.cloudflare.com/cdn-cgi/trace";
export declare const COUNTRY_COORDINATES: {
    readonly AF: {
        readonly lat: 33;
        readonly lng: 65;
    };
    readonly AX: {
        readonly lat: 60.116667;
        readonly lng: 19.9;
    };
    readonly AL: {
        readonly lat: 41;
        readonly lng: 20;
    };
    readonly DZ: {
        readonly lat: 28;
        readonly lng: 3;
    };
    readonly AS: {
        readonly lat: -14.3333;
        readonly lng: -170;
    };
    readonly AD: {
        readonly lat: 42.5;
        readonly lng: 1.6;
    };
    readonly AO: {
        readonly lat: -12.5;
        readonly lng: 18.5;
    };
    readonly AI: {
        readonly lat: 18.25;
        readonly lng: -63.1667;
    };
    readonly AQ: {
        readonly lat: -90;
        readonly lng: 0;
    };
    readonly AG: {
        readonly lat: 17.05;
        readonly lng: -61.8;
    };
    readonly AR: {
        readonly lat: -34;
        readonly lng: -64;
    };
    readonly AM: {
        readonly lat: 40;
        readonly lng: 45;
    };
    readonly AW: {
        readonly lat: 12.5;
        readonly lng: -69.9667;
    };
    readonly AU: {
        readonly lat: -27;
        readonly lng: 133;
    };
    readonly AT: {
        readonly lat: 47.3333;
        readonly lng: 13.3333;
    };
    readonly AZ: {
        readonly lat: 40.5;
        readonly lng: 47.5;
    };
    readonly BS: {
        readonly lat: 24.25;
        readonly lng: -76;
    };
    readonly BH: {
        readonly lat: 26;
        readonly lng: 50.55;
    };
    readonly BD: {
        readonly lat: 24;
        readonly lng: 90;
    };
    readonly BB: {
        readonly lat: 13.1667;
        readonly lng: -59.5333;
    };
    readonly BY: {
        readonly lat: 53;
        readonly lng: 28;
    };
    readonly BE: {
        readonly lat: 50.8333;
        readonly lng: 4;
    };
    readonly BZ: {
        readonly lat: 17.25;
        readonly lng: -88.75;
    };
    readonly BJ: {
        readonly lat: 9.5;
        readonly lng: 2.25;
    };
    readonly BM: {
        readonly lat: 32.3333;
        readonly lng: -64.75;
    };
    readonly BT: {
        readonly lat: 27.5;
        readonly lng: 90.5;
    };
    readonly BO: {
        readonly lat: -17;
        readonly lng: -65;
    };
    readonly BQ: {
        readonly lat: 12.183333;
        readonly lng: -68.233333;
    };
    readonly BA: {
        readonly lat: 44;
        readonly lng: 18;
    };
    readonly BW: {
        readonly lat: -22;
        readonly lng: 24;
    };
    readonly BV: {
        readonly lat: -54.4333;
        readonly lng: 3.4;
    };
    readonly BR: {
        readonly lat: -10;
        readonly lng: -55;
    };
    readonly IO: {
        readonly lat: -6;
        readonly lng: 71.5;
    };
    readonly BN: {
        readonly lat: 4.5;
        readonly lng: 114.6667;
    };
    readonly BG: {
        readonly lat: 43;
        readonly lng: 25;
    };
    readonly BF: {
        readonly lat: 13;
        readonly lng: -2;
    };
    readonly MM: {
        readonly lat: 22;
        readonly lng: 98;
    };
    readonly BI: {
        readonly lat: -3.5;
        readonly lng: 30;
    };
    readonly KH: {
        readonly lat: 13;
        readonly lng: 105;
    };
    readonly CM: {
        readonly lat: 6;
        readonly lng: 12;
    };
    readonly CA: {
        readonly lat: 60;
        readonly lng: -95;
    };
    readonly CV: {
        readonly lat: 16;
        readonly lng: -24;
    };
    readonly KY: {
        readonly lat: 19.5;
        readonly lng: -80.5;
    };
    readonly CF: {
        readonly lat: 7;
        readonly lng: 21;
    };
    readonly TD: {
        readonly lat: 15;
        readonly lng: 19;
    };
    readonly CL: {
        readonly lat: -30;
        readonly lng: -71;
    };
    readonly CN: {
        readonly lat: 35;
        readonly lng: 105;
    };
    readonly CX: {
        readonly lat: -10.5;
        readonly lng: 105.6667;
    };
    readonly CC: {
        readonly lat: -12.5;
        readonly lng: 96.8333;
    };
    readonly CO: {
        readonly lat: 4;
        readonly lng: -72;
    };
    readonly KM: {
        readonly lat: -12.1667;
        readonly lng: 44.25;
    };
    readonly CD: {
        readonly lat: 0;
        readonly lng: 25;
    };
    readonly CG: {
        readonly lat: -1;
        readonly lng: 15;
    };
    readonly CK: {
        readonly lat: -21.2333;
        readonly lng: -159.7667;
    };
    readonly CR: {
        readonly lat: 10;
        readonly lng: -84;
    };
    readonly CI: {
        readonly lat: 8;
        readonly lng: -5;
    };
    readonly HR: {
        readonly lat: 45.1667;
        readonly lng: 15.5;
    };
    readonly CU: {
        readonly lat: 21.5;
        readonly lng: -80;
    };
    readonly CW: {
        readonly lat: 12.166667;
        readonly lng: -68.966667;
    };
    readonly CY: {
        readonly lat: 35;
        readonly lng: 33;
    };
    readonly CZ: {
        readonly lat: 49.75;
        readonly lng: 15.5;
    };
    readonly DK: {
        readonly lat: 56;
        readonly lng: 10;
    };
    readonly DJ: {
        readonly lat: 11.5;
        readonly lng: 43;
    };
    readonly DM: {
        readonly lat: 15.4167;
        readonly lng: -61.3333;
    };
    readonly DO: {
        readonly lat: 19;
        readonly lng: -70.6667;
    };
    readonly EC: {
        readonly lat: -2;
        readonly lng: -77.5;
    };
    readonly EG: {
        readonly lat: 27;
        readonly lng: 30;
    };
    readonly SV: {
        readonly lat: 13.8333;
        readonly lng: -88.9167;
    };
    readonly GQ: {
        readonly lat: 2;
        readonly lng: 10;
    };
    readonly ER: {
        readonly lat: 15;
        readonly lng: 39;
    };
    readonly EE: {
        readonly lat: 59;
        readonly lng: 26;
    };
    readonly ET: {
        readonly lat: 8;
        readonly lng: 38;
    };
    readonly FK: {
        readonly lat: -51.75;
        readonly lng: -59;
    };
    readonly FO: {
        readonly lat: 62;
        readonly lng: -7;
    };
    readonly FJ: {
        readonly lat: -18;
        readonly lng: 175;
    };
    readonly FI: {
        readonly lat: 64;
        readonly lng: 26;
    };
    readonly FR: {
        readonly lat: 46;
        readonly lng: 2;
    };
    readonly GF: {
        readonly lat: 4;
        readonly lng: -53;
    };
    readonly PF: {
        readonly lat: -15;
        readonly lng: -140;
    };
    readonly TF: {
        readonly lat: -43;
        readonly lng: 67;
    };
    readonly GA: {
        readonly lat: -1;
        readonly lng: 11.75;
    };
    readonly GM: {
        readonly lat: 13.4667;
        readonly lng: -16.5667;
    };
    readonly GE: {
        readonly lat: 42;
        readonly lng: 43.5;
    };
    readonly DE: {
        readonly lat: 51;
        readonly lng: 9;
    };
    readonly GH: {
        readonly lat: 8;
        readonly lng: -2;
    };
    readonly GI: {
        readonly lat: 36.1833;
        readonly lng: -5.3667;
    };
    readonly GR: {
        readonly lat: 39;
        readonly lng: 22;
    };
    readonly GL: {
        readonly lat: 72;
        readonly lng: -40;
    };
    readonly GD: {
        readonly lat: 12.1167;
        readonly lng: -61.6667;
    };
    readonly GP: {
        readonly lat: 16.25;
        readonly lng: -61.5833;
    };
    readonly GU: {
        readonly lat: 13.4667;
        readonly lng: 144.7833;
    };
    readonly GT: {
        readonly lat: 15.5;
        readonly lng: -90.25;
    };
    readonly GG: {
        readonly lat: 49.5;
        readonly lng: -2.56;
    };
    readonly GW: {
        readonly lat: 12;
        readonly lng: -15;
    };
    readonly GN: {
        readonly lat: 11;
        readonly lng: -10;
    };
    readonly GY: {
        readonly lat: 5;
        readonly lng: -59;
    };
    readonly HT: {
        readonly lat: 19;
        readonly lng: -72.4167;
    };
    readonly HM: {
        readonly lat: -53.1;
        readonly lng: 72.5167;
    };
    readonly VA: {
        readonly lat: 41.9;
        readonly lng: 12.45;
    };
    readonly HN: {
        readonly lat: 15;
        readonly lng: -86.5;
    };
    readonly HK: {
        readonly lat: 22.25;
        readonly lng: 114.1667;
    };
    readonly HU: {
        readonly lat: 47;
        readonly lng: 20;
    };
    readonly IS: {
        readonly lat: 65;
        readonly lng: -18;
    };
    readonly IN: {
        readonly lat: 20;
        readonly lng: 77;
    };
    readonly ID: {
        readonly lat: -5;
        readonly lng: 120;
    };
    readonly IR: {
        readonly lat: 32;
        readonly lng: 53;
    };
    readonly IQ: {
        readonly lat: 33;
        readonly lng: 44;
    };
    readonly IE: {
        readonly lat: 53;
        readonly lng: -8;
    };
    readonly IM: {
        readonly lat: 54.23;
        readonly lng: -4.55;
    };
    readonly IL: {
        readonly lat: 31.5;
        readonly lng: 34.75;
    };
    readonly IT: {
        readonly lat: 42.8333;
        readonly lng: 12.8333;
    };
    readonly JM: {
        readonly lat: 18.25;
        readonly lng: -77.5;
    };
    readonly JP: {
        readonly lat: 36;
        readonly lng: 138;
    };
    readonly JE: {
        readonly lat: 49.21;
        readonly lng: -2.13;
    };
    readonly JO: {
        readonly lat: 31;
        readonly lng: 36;
    };
    readonly KZ: {
        readonly lat: 48;
        readonly lng: 68;
    };
    readonly KE: {
        readonly lat: 1;
        readonly lng: 38;
    };
    readonly KI: {
        readonly lat: 1.4167;
        readonly lng: 173;
    };
    readonly KP: {
        readonly lat: 40;
        readonly lng: 127;
    };
    readonly KR: {
        readonly lat: 37;
        readonly lng: 127.5;
    };
    readonly XK: {
        readonly lat: 42.583333;
        readonly lng: 21;
    };
    readonly KW: {
        readonly lat: 29.3375;
        readonly lng: 47.6581;
    };
    readonly KG: {
        readonly lat: 41;
        readonly lng: 75;
    };
    readonly LA: {
        readonly lat: 18;
        readonly lng: 105;
    };
    readonly LV: {
        readonly lat: 57;
        readonly lng: 25;
    };
    readonly LB: {
        readonly lat: 33.8333;
        readonly lng: 35.8333;
    };
    readonly LS: {
        readonly lat: -29.5;
        readonly lng: 28.5;
    };
    readonly LR: {
        readonly lat: 6.5;
        readonly lng: -9.5;
    };
    readonly LY: {
        readonly lat: 25;
        readonly lng: 17;
    };
    readonly LI: {
        readonly lat: 47.1667;
        readonly lng: 9.5333;
    };
    readonly LT: {
        readonly lat: 56;
        readonly lng: 24;
    };
    readonly LU: {
        readonly lat: 49.75;
        readonly lng: 6.1667;
    };
    readonly MO: {
        readonly lat: 22.1667;
        readonly lng: 113.55;
    };
    readonly MK: {
        readonly lat: 41.8333;
        readonly lng: 22;
    };
    readonly MG: {
        readonly lat: -20;
        readonly lng: 47;
    };
    readonly MW: {
        readonly lat: -13.5;
        readonly lng: 34;
    };
    readonly MY: {
        readonly lat: 2.5;
        readonly lng: 112.5;
    };
    readonly MV: {
        readonly lat: 3.25;
        readonly lng: 73;
    };
    readonly ML: {
        readonly lat: 17;
        readonly lng: -4;
    };
    readonly MT: {
        readonly lat: 35.8333;
        readonly lng: 14.5833;
    };
    readonly MH: {
        readonly lat: 9;
        readonly lng: 168;
    };
    readonly MQ: {
        readonly lat: 14.6667;
        readonly lng: -61;
    };
    readonly MR: {
        readonly lat: 20;
        readonly lng: -12;
    };
    readonly MU: {
        readonly lat: -20.2833;
        readonly lng: 57.55;
    };
    readonly YT: {
        readonly lat: -12.8333;
        readonly lng: 45.1667;
    };
    readonly MX: {
        readonly lat: 23;
        readonly lng: -102;
    };
    readonly FM: {
        readonly lat: 6.9167;
        readonly lng: 158.25;
    };
    readonly MD: {
        readonly lat: 47;
        readonly lng: 29;
    };
    readonly MC: {
        readonly lat: 43.7333;
        readonly lng: 7.4;
    };
    readonly MN: {
        readonly lat: 46;
        readonly lng: 105;
    };
    readonly ME: {
        readonly lat: 42;
        readonly lng: 19;
    };
    readonly MS: {
        readonly lat: 16.75;
        readonly lng: -62.2;
    };
    readonly MA: {
        readonly lat: 32;
        readonly lng: -5;
    };
    readonly MZ: {
        readonly lat: -18.25;
        readonly lng: 35;
    };
    readonly NA: {
        readonly lat: -22;
        readonly lng: 17;
    };
    readonly NR: {
        readonly lat: -0.5333;
        readonly lng: 166.9167;
    };
    readonly NP: {
        readonly lat: 28;
        readonly lng: 84;
    };
    readonly AN: {
        readonly lat: 12.25;
        readonly lng: -68.75;
    };
    readonly NL: {
        readonly lat: 52.5;
        readonly lng: 5.75;
    };
    readonly NC: {
        readonly lat: -21.5;
        readonly lng: 165.5;
    };
    readonly NZ: {
        readonly lat: -41;
        readonly lng: 174;
    };
    readonly NI: {
        readonly lat: 13;
        readonly lng: -85;
    };
    readonly NE: {
        readonly lat: 16;
        readonly lng: 8;
    };
    readonly NG: {
        readonly lat: 10;
        readonly lng: 8;
    };
    readonly NU: {
        readonly lat: -19.0333;
        readonly lng: -169.8667;
    };
    readonly NF: {
        readonly lat: -29.0333;
        readonly lng: 167.95;
    };
    readonly MP: {
        readonly lat: 15.2;
        readonly lng: 145.75;
    };
    readonly NO: {
        readonly lat: 62;
        readonly lng: 10;
    };
    readonly OM: {
        readonly lat: 21;
        readonly lng: 57;
    };
    readonly PK: {
        readonly lat: 30;
        readonly lng: 70;
    };
    readonly PW: {
        readonly lat: 7.5;
        readonly lng: 134.5;
    };
    readonly PS: {
        readonly lat: 32;
        readonly lng: 35.25;
    };
    readonly PA: {
        readonly lat: 9;
        readonly lng: -80;
    };
    readonly PG: {
        readonly lat: -6;
        readonly lng: 147;
    };
    readonly PY: {
        readonly lat: -23;
        readonly lng: -58;
    };
    readonly PE: {
        readonly lat: -10;
        readonly lng: -76;
    };
    readonly PH: {
        readonly lat: 13;
        readonly lng: 122;
    };
    readonly PN: {
        readonly lat: -24.7;
        readonly lng: -127.4;
    };
    readonly PL: {
        readonly lat: 52;
        readonly lng: 20;
    };
    readonly PT: {
        readonly lat: 39.5;
        readonly lng: -8;
    };
    readonly PR: {
        readonly lat: 18.25;
        readonly lng: -66.5;
    };
    readonly QA: {
        readonly lat: 25.5;
        readonly lng: 51.25;
    };
    readonly RE: {
        readonly lat: -21.1;
        readonly lng: 55.6;
    };
    readonly RO: {
        readonly lat: 46;
        readonly lng: 25;
    };
    readonly RU: {
        readonly lat: 60;
        readonly lng: 100;
    };
    readonly RW: {
        readonly lat: -2;
        readonly lng: 30;
    };
    readonly BL: {
        readonly lat: 17.897728;
        readonly lng: -62.834244;
    };
    readonly SH: {
        readonly lat: -15.9333;
        readonly lng: -5.7;
    };
    readonly KN: {
        readonly lat: 17.3333;
        readonly lng: -62.75;
    };
    readonly LC: {
        readonly lat: 13.8833;
        readonly lng: -61.1333;
    };
    readonly MF: {
        readonly lat: 18.075278;
        readonly lng: -63.06;
    };
    readonly PM: {
        readonly lat: 46.8333;
        readonly lng: -56.3333;
    };
    readonly VC: {
        readonly lat: 13.25;
        readonly lng: -61.2;
    };
    readonly WS: {
        readonly lat: -13.5833;
        readonly lng: -172.3333;
    };
    readonly SM: {
        readonly lat: 43.7667;
        readonly lng: 12.4167;
    };
    readonly ST: {
        readonly lat: 1;
        readonly lng: 7;
    };
    readonly SA: {
        readonly lat: 25;
        readonly lng: 45;
    };
    readonly SN: {
        readonly lat: 14;
        readonly lng: -14;
    };
    readonly RS: {
        readonly lat: 44;
        readonly lng: 21;
    };
    readonly SC: {
        readonly lat: -4.5833;
        readonly lng: 55.6667;
    };
    readonly SL: {
        readonly lat: 8.5;
        readonly lng: -11.5;
    };
    readonly SG: {
        readonly lat: 1.3667;
        readonly lng: 103.8;
    };
    readonly SX: {
        readonly lat: 18.033333;
        readonly lng: -63.05;
    };
    readonly SK: {
        readonly lat: 48.6667;
        readonly lng: 19.5;
    };
    readonly SI: {
        readonly lat: 46;
        readonly lng: 15;
    };
    readonly SB: {
        readonly lat: -8;
        readonly lng: 159;
    };
    readonly SO: {
        readonly lat: 10;
        readonly lng: 49;
    };
    readonly ZA: {
        readonly lat: -29;
        readonly lng: 24;
    };
    readonly GS: {
        readonly lat: -54.5;
        readonly lng: -37;
    };
    readonly SS: {
        readonly lat: 8;
        readonly lng: 30;
    };
    readonly ES: {
        readonly lat: 40;
        readonly lng: -4;
    };
    readonly LK: {
        readonly lat: 7;
        readonly lng: 81;
    };
    readonly SD: {
        readonly lat: 15;
        readonly lng: 30;
    };
    readonly SR: {
        readonly lat: 4;
        readonly lng: -56;
    };
    readonly SJ: {
        readonly lat: 78;
        readonly lng: 20;
    };
    readonly SZ: {
        readonly lat: -26.5;
        readonly lng: 31.5;
    };
    readonly SE: {
        readonly lat: 62;
        readonly lng: 15;
    };
    readonly CH: {
        readonly lat: 47;
        readonly lng: 8;
    };
    readonly SY: {
        readonly lat: 35;
        readonly lng: 38;
    };
    readonly TW: {
        readonly lat: 23.5;
        readonly lng: 121;
    };
    readonly TJ: {
        readonly lat: 39;
        readonly lng: 71;
    };
    readonly TZ: {
        readonly lat: -6;
        readonly lng: 35;
    };
    readonly TH: {
        readonly lat: 15;
        readonly lng: 100;
    };
    readonly TL: {
        readonly lat: -8.55;
        readonly lng: 125.5167;
    };
    readonly TG: {
        readonly lat: 8;
        readonly lng: 1.1667;
    };
    readonly TK: {
        readonly lat: -9;
        readonly lng: -172;
    };
    readonly TO: {
        readonly lat: -20;
        readonly lng: -175;
    };
    readonly TT: {
        readonly lat: 11;
        readonly lng: -61;
    };
    readonly TN: {
        readonly lat: 34;
        readonly lng: 9;
    };
    readonly TR: {
        readonly lat: 39;
        readonly lng: 35;
    };
    readonly TM: {
        readonly lat: 40;
        readonly lng: 60;
    };
    readonly TC: {
        readonly lat: 21.75;
        readonly lng: -71.5833;
    };
    readonly TV: {
        readonly lat: -8;
        readonly lng: 178;
    };
    readonly UG: {
        readonly lat: 1;
        readonly lng: 32;
    };
    readonly UA: {
        readonly lat: 49;
        readonly lng: 32;
    };
    readonly AE: {
        readonly lat: 24;
        readonly lng: 54;
    };
    readonly GB: {
        readonly lat: 54;
        readonly lng: -2;
    };
    readonly UM: {
        readonly lat: 19.2833;
        readonly lng: 166.6;
    };
    readonly US: {
        readonly lat: 38;
        readonly lng: -97;
    };
    readonly UY: {
        readonly lat: -33;
        readonly lng: -56;
    };
    readonly UZ: {
        readonly lat: 41;
        readonly lng: 64;
    };
    readonly VU: {
        readonly lat: -16;
        readonly lng: 167;
    };
    readonly VE: {
        readonly lat: 8;
        readonly lng: -66;
    };
    readonly VN: {
        readonly lat: 16;
        readonly lng: 106;
    };
    readonly VG: {
        readonly lat: 18.5;
        readonly lng: -64.5;
    };
    readonly VI: {
        readonly lat: 18.3333;
        readonly lng: -64.8333;
    };
    readonly WF: {
        readonly lat: -13.3;
        readonly lng: -176.2;
    };
    readonly EH: {
        readonly lat: 24.5;
        readonly lng: -13;
    };
    readonly YE: {
        readonly lat: 15;
        readonly lng: 48;
    };
    readonly ZM: {
        readonly lat: -15;
        readonly lng: 30;
    };
    readonly ZW: {
        readonly lat: -20;
        readonly lng: 30;
    };
};
export declare const AWS_REGIONS: {
    readonly WEST_US: {
        readonly code: "us-west-1";
        readonly displayName: "West US (North California)";
        readonly location: {
            readonly lat: 37.774929;
            readonly lng: -122.419418;
        };
    };
    readonly EAST_US: {
        readonly code: "us-east-1";
        readonly displayName: "East US (North Virginia)";
        readonly location: {
            readonly lat: 37.926868;
            readonly lng: -78.024902;
        };
    };
    readonly EAST_US_2: {
        readonly code: "us-east-2";
        readonly displayName: "East US (Ohio)";
        readonly location: {
            readonly lat: 39.9612;
            readonly lng: -82.9988;
        };
    };
    readonly CENTRAL_CANADA: {
        readonly code: "ca-central-1";
        readonly displayName: "Canada (Central)";
        readonly location: {
            readonly lat: 56.130367;
            readonly lng: -106.346771;
        };
    };
    readonly WEST_EU: {
        readonly code: "eu-west-1";
        readonly displayName: "West EU (Ireland)";
        readonly location: {
            readonly lat: 53.3498;
            readonly lng: -6.2603;
        };
    };
    readonly WEST_EU_2: {
        readonly code: "eu-west-2";
        readonly displayName: "West Europe (London)";
        readonly location: {
            readonly lat: 51.507351;
            readonly lng: -0.127758;
        };
    };
    readonly WEST_EU_3: {
        readonly code: "eu-west-3";
        readonly displayName: "West EU (Paris)";
        readonly location: {
            readonly lat: 2.352222;
            readonly lng: 48.856613;
        };
    };
    readonly CENTRAL_EU: {
        readonly code: "eu-central-1";
        readonly displayName: "Central EU (Frankfurt)";
        readonly location: {
            readonly lat: 50.110924;
            readonly lng: 8.682127;
        };
    };
    readonly CENTRAL_EU_2: {
        readonly code: "eu-central-2";
        readonly displayName: "Central Europe (Zurich)";
        readonly location: {
            readonly lat: 47.3744489;
            readonly lng: 8.5410422;
        };
    };
    readonly NORTH_EU: {
        readonly code: "eu-north-1";
        readonly displayName: "North EU (Stockholm)";
        readonly location: {
            readonly lat: 59.3251172;
            readonly lng: 18.0710935;
        };
    };
    readonly SOUTH_ASIA: {
        readonly code: "ap-south-1";
        readonly displayName: "South Asia (Mumbai)";
        readonly location: {
            readonly lat: 18.9733536;
            readonly lng: 72.8281049;
        };
    };
    readonly SOUTHEAST_ASIA: {
        readonly code: "ap-southeast-1";
        readonly displayName: "Southeast Asia (Singapore)";
        readonly location: {
            readonly lat: 1.357107;
            readonly lng: 103.8194992;
        };
    };
    readonly NORTHEAST_ASIA: {
        readonly code: "ap-northeast-1";
        readonly displayName: "Northeast Asia (Tokyo)";
        readonly location: {
            readonly lat: 35.6895;
            readonly lng: 139.6917;
        };
    };
    readonly NORTHEAST_ASIA_2: {
        readonly code: "ap-northeast-2";
        readonly displayName: "Northeast Asia (Seoul)";
        readonly location: {
            readonly lat: 37.5665;
            readonly lng: 126.978;
        };
    };
    readonly OCEANIA: {
        readonly code: "ap-southeast-2";
        readonly displayName: "Oceania (Sydney)";
        readonly location: {
            readonly lat: -33.8688;
            readonly lng: 151.2093;
        };
    };
    readonly SOUTH_AMERICA: {
        readonly code: "sa-east-1";
        readonly displayName: "South America (São Paulo)";
        readonly location: {
            readonly lat: -1.2043218;
            readonly lng: -47.1583944;
        };
    };
};
export type RegionCodes = ValueOf<typeof AWS_REGIONS>['code'];
export declare const AWS_REGION_CODES: UnionToTuple<RegionCodes>;
export declare function getClosestAwsRegion(location: Location): {
    readonly code: "us-west-1";
    readonly displayName: "West US (North California)";
    readonly location: {
        readonly lat: 37.774929;
        readonly lng: -122.419418;
    };
} | {
    readonly code: "us-east-1";
    readonly displayName: "East US (North Virginia)";
    readonly location: {
        readonly lat: 37.926868;
        readonly lng: -78.024902;
    };
} | {
    readonly code: "us-east-2";
    readonly displayName: "East US (Ohio)";
    readonly location: {
        readonly lat: 39.9612;
        readonly lng: -82.9988;
    };
} | {
    readonly code: "ca-central-1";
    readonly displayName: "Canada (Central)";
    readonly location: {
        readonly lat: 56.130367;
        readonly lng: -106.346771;
    };
} | {
    readonly code: "eu-west-1";
    readonly displayName: "West EU (Ireland)";
    readonly location: {
        readonly lat: 53.3498;
        readonly lng: -6.2603;
    };
} | {
    readonly code: "eu-west-2";
    readonly displayName: "West Europe (London)";
    readonly location: {
        readonly lat: 51.507351;
        readonly lng: -0.127758;
    };
} | {
    readonly code: "eu-west-3";
    readonly displayName: "West EU (Paris)";
    readonly location: {
        readonly lat: 2.352222;
        readonly lng: 48.856613;
    };
} | {
    readonly code: "eu-central-1";
    readonly displayName: "Central EU (Frankfurt)";
    readonly location: {
        readonly lat: 50.110924;
        readonly lng: 8.682127;
    };
} | {
    readonly code: "eu-central-2";
    readonly displayName: "Central Europe (Zurich)";
    readonly location: {
        readonly lat: 47.3744489;
        readonly lng: 8.5410422;
    };
} | {
    readonly code: "eu-north-1";
    readonly displayName: "North EU (Stockholm)";
    readonly location: {
        readonly lat: 59.3251172;
        readonly lng: 18.0710935;
    };
} | {
    readonly code: "ap-south-1";
    readonly displayName: "South Asia (Mumbai)";
    readonly location: {
        readonly lat: 18.9733536;
        readonly lng: 72.8281049;
    };
} | {
    readonly code: "ap-southeast-1";
    readonly displayName: "Southeast Asia (Singapore)";
    readonly location: {
        readonly lat: 1.357107;
        readonly lng: 103.8194992;
    };
} | {
    readonly code: "ap-northeast-1";
    readonly displayName: "Northeast Asia (Tokyo)";
    readonly location: {
        readonly lat: 35.6895;
        readonly lng: 139.6917;
    };
} | {
    readonly code: "ap-northeast-2";
    readonly displayName: "Northeast Asia (Seoul)";
    readonly location: {
        readonly lat: 37.5665;
        readonly lng: 126.978;
    };
} | {
    readonly code: "ap-southeast-2";
    readonly displayName: "Oceania (Sydney)";
    readonly location: {
        readonly lat: -33.8688;
        readonly lng: 151.2093;
    };
} | {
    readonly code: "sa-east-1";
    readonly displayName: "South America (São Paulo)";
    readonly location: {
        readonly lat: -1.2043218;
        readonly lng: -47.1583944;
    };
};
export declare function getCountryCode(): Promise<string>;
export declare function getCountryCoordinates(countryCode: string): Location;
export declare function getDistance(a: Location, b: Location): number;
export declare function degreesToRadians(deg: number): number;
//# sourceMappingURL=regions.d.ts.map
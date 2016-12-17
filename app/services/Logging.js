import Keen from 'keen-tracking';

import { LoggingConfig, Env } from '../config';

export class Logging {
    constructor({ keenErrorConfig, keenAnalyticsConfig, logAnalyticsDev }) {
        if(Env.isProduction) {
            this.keenErrorClient = new Keen(keenErrorConfig);
            this.keenAnalyticsClient = new Keen(keenAnalyticsConfig);
            this._setupKeenDefaults();
        } else {
            this.logAnalytics = logAnalyticsDev;
        }
    }

    error(message, location) {
        if(Env.isProduction) {
            this.keenErrorClient.recordEvent('error', { message, location });
        } else {
            console.error(message);
        }
    }

    analytics(event, data) {
        if(Env.isProduction) {
            this.keenAnalyticsClient.recordEvent(event, data);
        } else if(this.logAnalytics) {
            console.log(event, data);
        }
    }

    _setupKeenDefaults() {
        [this.keenErrorClient, this.keenAnalyticsClient].forEach((client) => {
            client.extendEvents(() => {
                return {
                    page: {
                        url: document.location.href,
                        // info {} url parser addon
                    },
                    tech: {
                        browser: Keen.helpers.getBrowserProfile(),
                        window:  Keen.helpers.getWindowProfile(),
                        ua:      '${keen.user_agent}',
                        // info {} ua parser addon
                    },
                    time: Keen.helpers.getDatetimeIndex(),
                    keen: {
                        timestamp: new Date().toISOString(),
                        addons:    [{
                            name:   'keen:ua_parser',
                            input:  { ua_string: 'tech.ua' },
                            output: 'tech.info',
                        }, {
                            name:   'keen:url_parser',
                            input:  { url: 'page.url' },
                            output: 'page.info',
                        }],
                    },
                };
            });
        });
    }
}

export default new Logging(LoggingConfig);
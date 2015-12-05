angular.module('app.core')
    .filter('openross',
        function (ImageService) {
            'use strict';
            return function (src, weight, height, ratio, mode, offsetX, offsetY) {
                mode = mode || 'magic';

                if (ratio) {
                    height = parseInt(weight * ratio, 10);
                }
                height = !height ? weight : height;

                offsetX = offsetX !== undefined ? offsetX : 50;
                offsetY = offsetY !== undefined ? offsetY : 50;

                return ImageService.getOpenRossImage(src, weight, height, mode, offsetX, offsetY);
            };
        }
    )
    .filter('joinAttribute',
        function () {
            'use strict';
            return function (items, attr, separator) {
                separator = separator || ', ';

                var res = [];
                angular.forEach(items, function (item){
                    res.push(item[attr]);
                });
                return res.join(separator);
            };
        }
    )
    .filter('dateformat',
        function (moment) {
            'use strict';
            return function (value, format) {
                return moment(value).format('D MMMM YYYY');
            };
        }
    )
    .filter('dayformat',
        function (moment) {
            'use strict';
            return function (value, format) {
                return moment(value).format('dddd');
            };
        }
    )
    .filter('getFirstVideoID',
        function () {
            'use strict';
            return function (item) {
                if (item.videos) {
                    if (item.videos.length > 0) {
                        return item.videos[0].embed;
                    }
                }
                return '';
            };
        }
    )
    .filter('authorProfile',
        function (joinAttributeFilter) {
            'use strict';
            return function (item, key, fallback) {
                if (item.authors.length > 0) {
                    var author = item.authors[0];
                    // If we have a profile associated with an author
                    if (!_.isEmpty(author.profile)) {
                        // If we want to display more than one thing for that profile
                        if (key !== undefined && key.constructor === Array) {
                            var res = [];
                            angular.forEach(key, function (att) {
                                res.push(author.profile[att]);
                            });
                            return res.join(', ');
                        }

                        return author.profile[key];
                    }

                    fallback = fallback || 'display_name';

                    return joinAttributeFilter(item.authors, fallback);
                }

                return null;
            };
        }
    )
    .filter('taxonomyCategories',
        function ($sce) {
            'use strict';
            return function (items, className, separator, category) {
                className = className || '';
                separator = separator || ', ';

                var res = [],
                    candidate = items[0],
                    found = false;

                angular.forEach(items, function (item){
                    if ((!found && typeof item.parent != 'undefined') || (category && item.term_slug == category)) {
                        candidate = item;
                        found = true;
                    }
                });
                res.push('<a href="'+candidate.url+'" class="'+className+'">'+candidate.term_name+'</a>');

                return $sce.trustAsHtml(res.join(separator));
            };
        }
    )
    .filter('raw',
        function ($sce) {
            'use strict';
            return function (src) {
                return $sce.trustAsHtml(src);
            };
        }
    )
    .filter('raw_url',
        function ($sce) {
            'use strict';
            return function (src) {
                return $sce.trustAsResourceUrl(src);
            };
        }
    )
    .filter('number_format',
        function ($filter) {
            'use strict';
            return function (src) {
                return $filter('number')(src);
            };
        }
    )
    .filter('striptags',
        function () {
            'use strict';
            return function (src) {
                return src;
            };
        }
    )
    .filter('commentsWidget',
        function ($sce, commonWidgetFilter) {
            'use strict';
            return function (src, includeText, includeIcon) {
                return $sce.trustAsHtml(
                    commonWidgetFilter(
                        parseInt(src.comment_metrics.total_comments, 10),
                        includeText === undefined ? true : includeText,
                        includeIcon === undefined ? true : includeIcon,
                        'icon-comment',
                        'Comment',
                        'Comments'
                    )
                );
            };
        }
    )
    .filter('sharesWidget',
        function ($sce, commonWidgetFilter) {
            'use strict';
            return function (src, includeText, includeIcon) {
                return $sce.trustAsHtml(
                    commonWidgetFilter(
                        parseInt(src.social_metrics.total_shares, 10),
                        includeText === undefined ? true : includeText,
                        includeIcon === undefined ? true : includeIcon,
                        'icon-share',
                        'Share',
                        'Shares'
                    )
                );
            };
        }
    )
    .filter('commonWidget',
        function (number_formatFilter) {
            'use strict';
            return function (totals, includeText, includeIcon, icon, text, pluralText) {

                if (!includeText && !includeIcon) {
                    return (totals > 0) ? number_formatFilter(totals) : '';
                }

                var out = '';

                if (includeText) {
                    if (totals > 1) {
                        out = '<b>' + number_formatFilter(totals) + '</b> ' + pluralText;
                    } else {
                        out = totals == 1 ? '<b>1</b> ' + text : text;
                    }
                }

                return includeIcon ? '<i class="' + icon + '"></i> ' + out : out;
            };
        }
    )
    .filter('number_format',
        function () {
            'use strict';
            return function (number, decimals, dec_point, thousands_sep) {
                number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
                var n = !isFinite(+number) ? 0 : +number,
                    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                    s = '',
                    toFixedFix = function (n, prec) {
                        var k = Math.pow(10, prec);
                        return '' + Math.round(n * k) / k;
                    };
                // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
                if (s[0].length > 3) {
                    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
                }
                if ((s[1] || '').length < prec) {
                    s[1] = s[1] || '';
                    s[1] += new Array(prec - s[1].length + 1).join('0');
                }
                return s.join(dec);
            };
        }
    )
    .filter('geticon',
        function () {
            'use strict';
            return function (label, type, size) {
                size = size || 'md';

                return [
                    '/assets-access-layer/images',
                    type,
                    size,
                    label + '.png'
                ].join('/');
            };
        }
    )
;

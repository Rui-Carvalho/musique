angular.module('app.core')
    .service('DataService',
    function ($log, ArrayService) {
        'use strict';

        var arraySeparator = ',';

        /**
         * Build filters
         * @param filter
         * @returns {*}
         */
        this.createFilters = function (defaultFilters, filters) {
            return angular.extend(angular.copy(defaultFilters), filters);
        };

        /**
         * transform '{id: {}}' in '[{}]'
         * @param items
         * @param idField master id of data
         * @returns {Array}
         */
        this.normalise = function (items, removePrefix) {
            // nomralise if an object
            if (!angular.isArray(items)) {
                var data = [],
                    index = 0,
                    self = this;
                angular.forEach(items, function (value, key) {
                    // remove prefix
                    if (removePrefix) {
                        value = self.removePrefix(value);
                    }

                    // set selected to default
                    value.selected = false;
                    value.index = index++;
                    value.masterId = key;

                    data.push(value);
                });

                $log.debug('DataService:normalise', data);
                return data;
            } else {
                return items;
            }
        };

        /**
         * remove attribute prefix: article_id => id, profile_sub_title => sub_title
         * @param obj
         * @returns {{}}
         */
        this.removePrefix = function (obj) {
            var data = {},
                keySplit = null;

            angular.forEach(obj, function (value, key) {
                keySplit = key.split('_');

                var cnt = -1;
                if (keySplit.length > 2) {
                    cnt = -(keySplit.length - 1);
                }
                keySplit = keySplit.splice(cnt).join('_');
                data[keySplit] = value;
            });
            return data;
        };

        /**
         * Tranform request for $resource
         * @param  data
         * @return FormData
         */
        this.transformRequest = function (data) {
            if (data === undefined) {
                return data;
            }

            var fd = new FormData();

            angular.forEach(data, function (value, key) {
                if (value instanceof FileList) {
                    if (value.length === 1) {
                        fd.append(key, value[0]);
                    } else {
                        angular.forEach(value, function (file, index) {
                            fd.append(key + '_' + index, file);
                        });
                    }
                } else {
                    fd.append(key, value);
                }
            });

            return fd;
        };

        /**
         * Build from attributes
         * @param attrs
         * @param prefix
         * @returns {{}}
         */
        this.buildDataFromAttributes = function (attrs, prefix) {
            var res = {},
                parts = [];
            angular.forEach(attrs, function (val, key) {
                parts = key.split(prefix);
                if (parts.length === 2) {
                    if (parts[1] !== '') {
                        res[parts[1]] = val;
                    }
                }
            });
            return res;
        };

        /**
         * Filter an array of object by attribute and extract only a specific attribute
         * @param items
         * @param filterKey
         * @param extractKey
         * @returns {*}
         */
        this.filterExtract = function (items, filterKey, extractKey) {
            return items
                .filter(
                function (item) {
                    return item[filterKey];
                }
            )
                .map(
                function (item) {
                    return item[extractKey];
                }
            );
        };

        /**
         * Flatten array of objects by key
         * @param items
         * @param extractKey
         * @returns {*}
         */
        this.flatten = function (items, extractKey) {
            return items
                .map(
                function (item) {
                    return item[extractKey];
                }
            );
        };

        /**
         * Merge ES aggregations
         * @param items
         * @param aggregations [{key: 2, doc_count: 501, used: 1}]
         * @param originalKey
         * @param matchingKey
         */
        this.mergeAggregations = function (items, aggregationItems, originalKey, matchingKey) {
            originalKey = originalKey || 'id';
            matchingKey = matchingKey || 'key'; // es default

            // get active
            var active = ArrayService.extract(aggregationItems, matchingKey);

            // mapping and change activation
            items
                .map(
                function (item) {
                    item.enabled = ArrayService.inArray(active, item[originalKey]);
                    if (item.enabled) {
                        // get original object back and set count
                        item.count = ArrayService.select(aggregationItems, 'key', item[originalKey]).doc_count;
                    } else {
                        // reset count
                        item.count = 0;
                    }
                }
            );
        };

        /**
         * prepare data for GET
         * @param dataObject
         * @returns {{}}
         */
        this.sanitiseDataForQuerystring = function (dataObject) {
            var data = {},
                newVal = null;

            angular.forEach(dataObject, function (value, key) {
                if (angular.isArray(value)) {
                    if (value.length > 0) {
                        newVal =  ArrayService.extract(value, 'id').join(arraySeparator);
                    } else {
                        newVal = null;
                    }
                } else {
                    newVal = value;
                }

                if (newVal) {
                    data[key] = newVal;
                }
            });

            return data;
        };

        /**
         * Read querystring and rebuild original object
         */
        this.rebuildDataFromQuerystring = function (dataObject, filters, selectedKey) {
            selectedKey = selectedKey || 'status';

            var arrayData = null,
                selected = {},
                result = {}
                ;

            angular.forEach(dataObject, function (value, group) {
                // try to revert comma separated values
                arrayData = value.split(arraySeparator);

                // force to be an array
                if (!angular.isArray(arrayData)) {
                    arrayData = [arrayData];
                }

                angular.forEach(arrayData, function (itemId) {
                    if (filters.hasOwnProperty(group)) {
                        // try to use int if possible!!!
                        selected = ArrayService.select(
                            filters[group],
                            'id',
                            parseInt(itemId, 10) > 0 ? parseInt(itemId, 10) : itemId
                        );

                        if (selected) {
                            selected[selectedKey] = true;
                        }
                    }
                });
            });

            // rebuild object with selected only
            angular.forEach(filters, function (value, group) {
                result[group] = value.filter(
                    function (item) {
                        return item[selectedKey];
                    }
                );
            });

            return result;

        };

        // this is a temporary fix in order to patch APIs filters
        this.convertFilterQueryObject = function (filters) {
            var newFilters = this.createFilters(filters);
                _.assign(newFilters, newFilters.query);
                delete newFilters.query;

            return newFilters;
        };

        // clean up object
        this.compactObject = function (data) {
            return _.partialRight(_.pick, _.identity)(data);
        };

        // merge single rows to main data, use it for partial updates
        this.replace = function (items, item, key) {
            var index = -1;
            _.forEach(
                items,
                function (i, k) {
                    if (i[key] === item[key]) {
                        index = k;
                    }
                }
            );

            if (index > -1) {
                items[index] = item;
            }
        };

        this.findAndMerge = function (items, key, value, data) {
            _.map(
                items,
                function (item) {
                    if (item[key] === value) {
                        _.assign(item, data);
                    }
                    return item;
                }
            );
        };

        // add a unique ID
        this.addTrackBy = function (entity, key) {
            if (_.isArray(entity)) {
                _.map(
                    entity,
                    function (i) {
                        i.trackBy = i[key] + '_' + new Date().getTime();
                    }
                );
            } else {
                entity.trackBy = entity[key] + '_' + new Date().getTime();
            }

            return entity;
        };

    }
);

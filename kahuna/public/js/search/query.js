import angular from 'angular';
// FIXME: used to fade 'x' query clear button, but disabled as it ends
// up being enabled globally and severely degrades the performance of
// the lazy-table for results. Once there is a working way to disable
// animations locally, we should turn it back on here.
// import 'angular-animate';
import moment from 'moment';
import '../util/eq';
import '../components/gu-date-range/gu-date-range';
import template from './query.html!text';

import '../analytics/track';

import '../util/rx';

export var query = angular.module('kahuna.search.query', [
    // Note: temporarily disabled for performance reasons, see above
    // 'ngAnimate',
    'util.eq',
    'gu-dateRange',
    'analytics.track',
    'util.rx'
]);

query.controller('SearchQueryCtrl',
                 ['$scope', '$state', '$stateParams', 'onValChange', 'mediaApi', 'track', 'inject$',
                  'searchQuery',
                 function($scope, $state, $stateParams, onValChange , mediaApi, track, inject$,
                          searchQuery) {

    var ctrl = this;

    ctrl.ordering = {
        orderBy: $stateParams.orderBy
    };

    $scope.$watch(() => ctrl.ordering.orderBy, onValChange(newVal => {
        $state.go('search.results', {orderBy: newVal});
    }));

    // Boring - stops slashes being encoded in input - might be fixed with:
    // https://github.com/angular-ui/ui-router/issues/1759
    $scope.$watch(() => ctrl.filter.query, onValChange(newVal => {
        ctrl.filter.query = angular.isDefined(newVal) ? decodeURIComponent(newVal) : '';
    }));

    ctrl.filter = {
        uploadedByMe: false
    };

    ctrl.resetQueryAndFocus = resetQueryAndFocus;

    // Note that this correctly uses local datetime and returns
    // midnight for the local user
    var lastMidnight = moment().startOf('day').toISOString();

    var past24Hours = moment().subtract(24, 'hours').toISOString();
    var pastWeek = moment().subtract(7, 'days').toISOString();

    ctrl.sinceOptions = [
        {label: 'Anytime'},   // value: undefined
        {label: 'Today',         value: lastMidnight},
        {label: 'Past 24 hours', value: past24Hours},
        {label: 'Past week',     value: pastWeek}
    ];

    Object.keys($stateParams)
          .forEach(setAndWatchParam);

    // FIXME: This is here to stop circular injection of the model.
    // Avoiding: queryChange => set() => emit() => queryChange()
    inject$($scope, searchQuery.q$, ctrl.filter, 'query');

    // pass undefined to the state on empty to remove the QueryString
    function valOrUndefined(str) { return str || undefined; }

    function setAndWatchParam(key) {
        // query is handled by Rx
        // we also don't track changes to `query` as it would trigger on every keypress
        if (key !== 'query') {
            ctrl.filter[key] = $stateParams[key];

            $scope.$watch(() => $stateParams[key], onValChange(newVal => {
                // FIXME: broken for 'your uploads'
                // FIXME: + they triggers filter $watch and $state.go (breaks history)
                ctrl.filter[key] = valOrUndefined(newVal);

                track.success('Query change', { field: key, value: newVal });
            }));
        }
    }

    $scope.$watchCollection(() => ctrl.filter, onValChange(filter => {
        filter.uploadedBy = filter.uploadedByMe ? ctrl.user.email : undefined;
        $state.go('search.results', filter);
    }));

    // we can't user dynamic values in the ng:true-value see:
    // https://docs.angularjs.org/error/ngModel/constexpr
    mediaApi.getSession().then(session => {
        ctrl.user = session.user;
        ctrl.filter.uploadedByMe = ctrl.uploadedBy === ctrl.user.email;
    });

    function resetQueryAndFocus() {
        ctrl.filter.query = '';
        $scope.$broadcast('search:focus-query');
    }
}]);

query.directive('gridFocusOn', function() {
   return function(scope, elem, attr) {
      scope.$on(attr.gridFocusOn, () => {
          elem[0].focus();
      });
   };
});

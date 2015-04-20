cdbmanager.service("tables", ["SQLClient", function (SQLClient) {
    this.api = new SQLClient();

    this.current = null;

    this.getAll = function () {
        return this.api.send("select pg_class.oid as _oid, pg_class.relname, pg_class.reltuples from pg_class, pg_roles where pg_roles.oid = pg_class.relowner and pg_roles.rolname = current_user and pg_class.relkind = 'r';");
    };
}]);

cdbmanager.controller('tableSelectorCtrl', ["$scope", "tables", "endpoints", "nav", "columns", function ($scope, tables, endpoints, nav, columns) {
    $scope.nav = nav;

    $scope.showTable = function (table) {
        columns.getAll(table);
        $scope.nav.current = "tables.table.columns";
        tables.current = table;
    };

    // update table list when current endpoint changes
    $scope.$watch(function () {
        return endpoints.current;
    }, function () {
        $scope.tables = tables.getAll();
    }, true);
    $scope.$watch(function () {
        return tables.api.items;
    }, function (table_list) {
        $scope.tables = table_list;
    });

    // Watch current table
    $scope.$watch(function () {
        return tables.current;
    }, function (currentTable) {
        $scope.currentTable = currentTable;
    });
}]);

cdbmanager.controller('tablesCtrl', ["$scope", "tables", "endpoints", "nav", "columns", function ($scope, tables, endpoints, nav, columns) {
    $scope.nav = nav;
    $scope.headers = ['Name', 'Estimated row count'];
    $scope.actions = [
        {
            text: "Details",
            onClick: function (table) {
                columns.getAll(table);
                $scope.nav.current = "tables.table.columns";
                tables.current = table;
            }
        }
    ];

    // update table list when current endpoint changes
    $scope.$watch(function () {
        return endpoints.current;
    }, function () {
        $scope.tables = tables.getAll();
    }, true);
    $scope.$watch(function () {
        return tables.api.items;
    }, function (table_list) {
        $scope.tables = table_list;
    });
}]);

// TBD
cdbmanager.controller('tableCtrl', ["$scope", "nav", "columns", "tables", "endpoints", "indexes", "records", "constraints", "triggers", "settings", function ($scope, nav, columns, tables, endpoints, indexes, records, constraints, triggers, settings) {
    $scope.nav = nav;
    $scope.cdbrt = {  // Settings for the tables (same settings for all of them for now)
        rowsPerPage: settings.rowsPerPage
    };

    //
    $scope.$watch(function () {
        return columns.api.items;
    }, function (columns) {
        $scope.columns = columns;
    });

    //
    $scope.$watch(function () {
        return constraints.api.items;
    }, function (constraints) {
        $scope.constraints = constraints;
    });

    //
    $scope.$watch(function () {
        return triggers.api.items;
    }, function (triggers) {
        $scope.triggers = triggers;
    });

    //
    $scope.$watch(function () {
        return records.api.items;
    }, function (records) {
        $scope.records = records;
    });

    //
    $scope.$watch(function () {
        return indexes.api.items;
    }, function (indexes) {
        $scope.indexes = indexes;
    });

    $scope.$watch(function () {
        return nav.current;
    }, function (section) {
        if (section == "tables.table.columns") {
            $scope.columns = columns.getAll(tables.current);
        } else if (section == "tables.table.indexes") {
            $scope.columns = indexes.getAll(tables.current);
        } else if (section == "tables.table.records") {
            $scope.columns = records.getAll(tables.current);
        } else if (section == "tables.table.constraints") {
            $scope.constraints = constraints.getAll(tables.current);
        } else if (section == "tables.table.triggers") {
            $scope.triggers = triggers.getAll(tables.current);
        }
    });
}]);

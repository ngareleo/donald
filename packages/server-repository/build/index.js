// @bun
var __defProp = Object.defineProperty;
var __export = (target, all) => {
    for (var name in all)
        __defProp(target, name, {
            get: all[name],
            enumerable: true,
            configurable: true,
            set: (newValue) => (all[name] = () => newValue),
        });
};

// src/schema.ts
var exports_schema = {};
__export(exports_schema, {
    usersTable: () => usersTable,
    transactionsTable: () => transactionsTable,
    transactionTypeTable: () => transactionTypeTable,
    transactionTagsTable: () => transactionTagsTable,
    tagsTable: () => tagsTable,
});

// ../../node_modules/drizzle-orm/entity.js
var is = function (value, type) {
    if (!value || typeof value !== "object") {
        return false;
    }
    if (value instanceof type) {
        return true;
    }
    if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
        throw new Error(
            `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
        );
    }
    let cls = value.constructor;
    if (cls) {
        while (cls) {
            if (entityKind in cls && cls[entityKind] === type[entityKind]) {
                return true;
            }
            cls = Object.getPrototypeOf(cls);
        }
    }
    return false;
};
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");

// ../../node_modules/drizzle-orm/column.js
class Column {
    constructor(table, config) {
        this.table = table;
        this.config = config;
        this.name = config.name;
        this.notNull = config.notNull;
        this.default = config.default;
        this.defaultFn = config.defaultFn;
        this.hasDefault = config.hasDefault;
        this.primary = config.primaryKey;
        this.isUnique = config.isUnique;
        this.uniqueName = config.uniqueName;
        this.uniqueType = config.uniqueType;
        this.dataType = config.dataType;
        this.columnType = config.columnType;
    }
    static [entityKind] = "Column";
    name;
    primary;
    notNull;
    default;
    defaultFn;
    hasDefault;
    isUnique;
    uniqueName;
    uniqueType;
    dataType;
    columnType;
    enumValues = undefined;
    config;
    mapFromDriverValue(value) {
        return value;
    }
    mapToDriverValue(value) {
        return value;
    }
}

// ../../node_modules/drizzle-orm/subquery.js
var SubqueryConfig = Symbol.for("drizzle:SubqueryConfig");

class Subquery {
    static [entityKind] = "Subquery";
    [SubqueryConfig];
    constructor(sql, selection, alias, isWith = false) {
        this[SubqueryConfig] = {
            sql,
            selection,
            alias,
            isWith,
        };
    }
}

class WithSubquery extends Subquery {
    static [entityKind] = "WithSubquery";
}

// ../../node_modules/drizzle-orm/tracing-utils.js
var iife = function (fn, ...args) {
    return fn(...args);
};

// ../../node_modules/drizzle-orm/version.js
var version = "0.29.5";

// ../../node_modules/drizzle-orm/tracing.js
var otel;
var rawTracer;
var tracer = {
    startActiveSpan(name, fn) {
        if (!otel) {
            return fn();
        }
        if (!rawTracer) {
            rawTracer = otel.trace.getTracer("drizzle-orm", version);
        }
        return iife(
            (otel2, rawTracer2) =>
                rawTracer2.startActiveSpan(name, (span) => {
                    try {
                        return fn(span);
                    } catch (e) {
                        span.setStatus({
                            code: otel2.SpanStatusCode.ERROR,
                            message:
                                e instanceof Error
                                    ? e.message
                                    : "Unknown error",
                        });
                        throw e;
                    } finally {
                        span.end();
                    }
                }),
            otel,
            rawTracer
        );
    },
};

// ../../node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

// ../../node_modules/drizzle-orm/table.js
var isTable = function (table) {
    return (
        typeof table === "object" && table !== null && IsDrizzleTable in table
    );
};
var getTableName = function (table) {
    return table[TableName];
};
var TableName = Symbol.for("drizzle:Name");
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");

class Table {
    static [entityKind] = "Table";
    static Symbol = {
        Name: TableName,
        Schema,
        OriginalName,
        Columns,
        BaseName,
        IsAlias,
        ExtraConfigBuilder,
    };
    [TableName];
    [OriginalName];
    [Schema];
    [Columns];
    [BaseName];
    [IsAlias] = false;
    [ExtraConfigBuilder] = undefined;
    [IsDrizzleTable] = true;
    constructor(name, schema, baseName) {
        this[TableName] = this[OriginalName] = name;
        this[Schema] = schema;
        this[BaseName] = baseName;
    }
}

// ../../node_modules/drizzle-orm/sql/sql.js
var isSQLWrapper = function (value) {
    return (
        typeof value === "object" &&
        value !== null &&
        "getSQL" in value &&
        typeof value.getSQL === "function"
    );
};
var mergeQueries = function (queries) {
    const result = { sql: "", params: [] };
    for (const query of queries) {
        result.sql += query.sql;
        result.params.push(...query.params);
        if (query.typings?.length) {
            if (!result.typings) {
                result.typings = [];
            }
            result.typings.push(...query.typings);
        }
    }
    return result;
};
var isDriverValueEncoder = function (value) {
    return (
        typeof value === "object" &&
        value !== null &&
        "mapToDriverValue" in value &&
        typeof value.mapToDriverValue === "function"
    );
};
var sql = function (strings, ...params) {
    const queryChunks = [];
    if (params.length > 0 || (strings.length > 0 && strings[0] !== "")) {
        queryChunks.push(new StringChunk(strings[0]));
    }
    for (const [paramIndex, param2] of params.entries()) {
        queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
    }
    return new SQL(queryChunks);
};
var fillPlaceholders = function (params, values) {
    return params.map((p) => {
        if (is(p, Placeholder)) {
            if (!(p.name in values)) {
                throw new Error(
                    `No value for placeholder "${p.name}" was provided`
                );
            }
            return values[p.name];
        }
        return p;
    });
};
class StringChunk {
    static [entityKind] = "StringChunk";
    value;
    constructor(value) {
        this.value = Array.isArray(value) ? value : [value];
    }
    getSQL() {
        return new SQL([this]);
    }
}

class SQL {
    constructor(queryChunks) {
        this.queryChunks = queryChunks;
    }
    static [entityKind] = "SQL";
    decoder = noopDecoder;
    shouldInlineParams = false;
    append(query) {
        this.queryChunks.push(...query.queryChunks);
        return this;
    }
    toQuery(config) {
        return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
            const query = this.buildQueryFromSourceParams(
                this.queryChunks,
                config
            );
            span?.setAttributes({
                "drizzle.query.text": query.sql,
                "drizzle.query.params": JSON.stringify(query.params),
            });
            return query;
        });
    }
    buildQueryFromSourceParams(chunks, _config) {
        const config = Object.assign({}, _config, {
            inlineParams: _config.inlineParams || this.shouldInlineParams,
            paramStartIndex: _config.paramStartIndex || { value: 0 },
        });
        const {
            escapeName,
            escapeParam,
            prepareTyping,
            inlineParams,
            paramStartIndex,
        } = config;
        return mergeQueries(
            chunks.map((chunk) => {
                if (is(chunk, StringChunk)) {
                    return { sql: chunk.value.join(""), params: [] };
                }
                if (is(chunk, Name)) {
                    return { sql: escapeName(chunk.value), params: [] };
                }
                if (chunk === undefined) {
                    return { sql: "", params: [] };
                }
                if (Array.isArray(chunk)) {
                    const result = [new StringChunk("(")];
                    for (const [i, p] of chunk.entries()) {
                        result.push(p);
                        if (i < chunk.length - 1) {
                            result.push(new StringChunk(", "));
                        }
                    }
                    result.push(new StringChunk(")"));
                    return this.buildQueryFromSourceParams(result, config);
                }
                if (is(chunk, SQL)) {
                    return this.buildQueryFromSourceParams(chunk.queryChunks, {
                        ...config,
                        inlineParams: inlineParams || chunk.shouldInlineParams,
                    });
                }
                if (is(chunk, Table)) {
                    const schemaName = chunk[Table.Symbol.Schema];
                    const tableName = chunk[Table.Symbol.Name];
                    return {
                        sql:
                            schemaName === undefined
                                ? escapeName(tableName)
                                : escapeName(schemaName) +
                                  "." +
                                  escapeName(tableName),
                        params: [],
                    };
                }
                if (is(chunk, Column)) {
                    return {
                        sql:
                            escapeName(chunk.table[Table.Symbol.Name]) +
                            "." +
                            escapeName(chunk.name),
                        params: [],
                    };
                }
                if (is(chunk, View)) {
                    const schemaName = chunk[ViewBaseConfig].schema;
                    const viewName = chunk[ViewBaseConfig].name;
                    return {
                        sql:
                            schemaName === undefined
                                ? escapeName(viewName)
                                : escapeName(schemaName) +
                                  "." +
                                  escapeName(viewName),
                        params: [],
                    };
                }
                if (is(chunk, Param)) {
                    const mappedValue =
                        chunk.value === null
                            ? null
                            : chunk.encoder.mapToDriverValue(chunk.value);
                    if (is(mappedValue, SQL)) {
                        return this.buildQueryFromSourceParams(
                            [mappedValue],
                            config
                        );
                    }
                    if (inlineParams) {
                        return {
                            sql: this.mapInlineParam(mappedValue, config),
                            params: [],
                        };
                    }
                    let typings;
                    if (prepareTyping !== undefined) {
                        typings = [prepareTyping(chunk.encoder)];
                    }
                    return {
                        sql: escapeParam(paramStartIndex.value++, mappedValue),
                        params: [mappedValue],
                        typings,
                    };
                }
                if (is(chunk, Placeholder)) {
                    return {
                        sql: escapeParam(paramStartIndex.value++, chunk),
                        params: [chunk],
                    };
                }
                if (is(chunk, SQL.Aliased) && chunk.fieldAlias !== undefined) {
                    return { sql: escapeName(chunk.fieldAlias), params: [] };
                }
                if (is(chunk, Subquery)) {
                    if (chunk[SubqueryConfig].isWith) {
                        return {
                            sql: escapeName(chunk[SubqueryConfig].alias),
                            params: [],
                        };
                    }
                    return this.buildQueryFromSourceParams(
                        [
                            new StringChunk("("),
                            chunk[SubqueryConfig].sql,
                            new StringChunk(") "),
                            new Name(chunk[SubqueryConfig].alias),
                        ],
                        config
                    );
                }
                if (isSQLWrapper(chunk)) {
                    return this.buildQueryFromSourceParams(
                        [
                            new StringChunk("("),
                            chunk.getSQL(),
                            new StringChunk(")"),
                        ],
                        config
                    );
                }
                if (inlineParams) {
                    return {
                        sql: this.mapInlineParam(chunk, config),
                        params: [],
                    };
                }
                return {
                    sql: escapeParam(paramStartIndex.value++, chunk),
                    params: [chunk],
                };
            })
        );
    }
    mapInlineParam(chunk, { escapeString }) {
        if (chunk === null) {
            return "null";
        }
        if (typeof chunk === "number" || typeof chunk === "boolean") {
            return chunk.toString();
        }
        if (typeof chunk === "string") {
            return escapeString(chunk);
        }
        if (typeof chunk === "object") {
            const mappedValueAsString = chunk.toString();
            if (mappedValueAsString === "[object Object]") {
                return escapeString(JSON.stringify(chunk));
            }
            return escapeString(mappedValueAsString);
        }
        throw new Error("Unexpected param value: " + chunk);
    }
    getSQL() {
        return this;
    }
    as(alias) {
        if (alias === undefined) {
            return this;
        }
        return new SQL.Aliased(this, alias);
    }
    mapWith(decoder) {
        this.decoder =
            typeof decoder === "function"
                ? { mapFromDriverValue: decoder }
                : decoder;
        return this;
    }
    inlineParams() {
        this.shouldInlineParams = true;
        return this;
    }
}

class Name {
    constructor(value) {
        this.value = value;
    }
    static [entityKind] = "Name";
    brand;
    getSQL() {
        return new SQL([this]);
    }
}
var noopDecoder = {
    mapFromDriverValue: (value) => value,
};
var noopEncoder = {
    mapToDriverValue: (value) => value,
};
var noopMapper = {
    ...noopDecoder,
    ...noopEncoder,
};

class Param {
    constructor(value, encoder = noopEncoder) {
        this.value = value;
        this.encoder = encoder;
    }
    static [entityKind] = "Param";
    brand;
    getSQL() {
        return new SQL([this]);
    }
}
((sql2) => {
    function empty() {
        return new SQL([]);
    }
    sql2.empty = empty;
    function fromList(list) {
        return new SQL(list);
    }
    sql2.fromList = fromList;
    function raw(str) {
        return new SQL([new StringChunk(str)]);
    }
    sql2.raw = raw;
    function join(chunks, separator) {
        const result = [];
        for (const [i, chunk] of chunks.entries()) {
            if (i > 0 && separator !== undefined) {
                result.push(separator);
            }
            result.push(chunk);
        }
        return new SQL(result);
    }
    sql2.join = join;
    function identifier(value) {
        return new Name(value);
    }
    sql2.identifier = identifier;
    function placeholder2(name2) {
        return new Placeholder(name2);
    }
    sql2.placeholder = placeholder2;
    function param2(value, encoder) {
        return new Param(value, encoder);
    }
    sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
    class Aliased {
        constructor(sql2, fieldAlias) {
            this.sql = sql2;
            this.fieldAlias = fieldAlias;
        }
        static [entityKind] = "SQL.Aliased";
        isSelectionField = false;
        getSQL() {
            return this.sql;
        }
        clone() {
            return new Aliased(this.sql, this.fieldAlias);
        }
    }
    SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));

class Placeholder {
    constructor(name2) {
        this.name = name2;
    }
    static [entityKind] = "Placeholder";
    getSQL() {
        return new SQL([this]);
    }
}

class View {
    static [entityKind] = "View";
    [ViewBaseConfig];
    constructor({ name: name2, schema, selectedFields, query }) {
        this[ViewBaseConfig] = {
            name: name2,
            originalName: name2,
            schema,
            selectedFields,
            query,
            isExisting: !query,
            isAlias: false,
        };
    }
    getSQL() {
        return new SQL([this]);
    }
}
Column.prototype.getSQL = function () {
    return new SQL([this]);
};
Table.prototype.getSQL = function () {
    return new SQL([this]);
};
Subquery.prototype.getSQL = function () {
    return new SQL([this]);
};

// ../../node_modules/drizzle-orm/alias.js
var aliasedTable = function (table3, tableAlias) {
    return new Proxy(table3, new TableAliasProxyHandler(tableAlias, false));
};
var aliasedTableColumn = function (column3, tableAlias) {
    return new Proxy(
        column3,
        new ColumnAliasProxyHandler(
            new Proxy(
                column3.table,
                new TableAliasProxyHandler(tableAlias, false)
            )
        )
    );
};
var mapColumnsInAliasedSQLToAlias = function (query, alias) {
    return new SQL.Aliased(
        mapColumnsInSQLToAlias(query.sql, alias),
        query.fieldAlias
    );
};
var mapColumnsInSQLToAlias = function (query, alias) {
    return sql.join(
        query.queryChunks.map((c) => {
            if (is(c, Column)) {
                return aliasedTableColumn(c, alias);
            }
            if (is(c, SQL)) {
                return mapColumnsInSQLToAlias(c, alias);
            }
            if (is(c, SQL.Aliased)) {
                return mapColumnsInAliasedSQLToAlias(c, alias);
            }
            return c;
        })
    );
};

class ColumnAliasProxyHandler {
    constructor(table3) {
        this.table = table3;
    }
    static [entityKind] = "ColumnAliasProxyHandler";
    get(columnObj, prop) {
        if (prop === "table") {
            return this.table;
        }
        return columnObj[prop];
    }
}

class TableAliasProxyHandler {
    constructor(alias, replaceOriginalName) {
        this.alias = alias;
        this.replaceOriginalName = replaceOriginalName;
    }
    static [entityKind] = "TableAliasProxyHandler";
    get(target, prop) {
        if (prop === Table.Symbol.IsAlias) {
            return true;
        }
        if (prop === Table.Symbol.Name) {
            return this.alias;
        }
        if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
            return this.alias;
        }
        if (prop === ViewBaseConfig) {
            return {
                ...target[ViewBaseConfig],
                name: this.alias,
                isAlias: true,
            };
        }
        if (prop === Table.Symbol.Columns) {
            const columns = target[Table.Symbol.Columns];
            if (!columns) {
                return columns;
            }
            const proxiedColumns = {};
            Object.keys(columns).map((key) => {
                proxiedColumns[key] = new Proxy(
                    columns[key],
                    new ColumnAliasProxyHandler(new Proxy(target, this))
                );
            });
            return proxiedColumns;
        }
        const value = target[prop];
        if (is(value, Column)) {
            return new Proxy(
                value,
                new ColumnAliasProxyHandler(new Proxy(target, this))
            );
        }
        return value;
    }
}

// ../../node_modules/drizzle-orm/column-builder.js
class ColumnBuilder {
    static [entityKind] = "ColumnBuilder";
    config;
    constructor(name, dataType, columnType) {
        this.config = {
            name,
            notNull: false,
            default: undefined,
            hasDefault: false,
            primaryKey: false,
            isUnique: false,
            uniqueName: undefined,
            uniqueType: undefined,
            dataType,
            columnType,
        };
    }
    $type() {
        return this;
    }
    notNull() {
        this.config.notNull = true;
        return this;
    }
    default(value) {
        this.config.default = value;
        this.config.hasDefault = true;
        return this;
    }
    $defaultFn(fn) {
        this.config.defaultFn = fn;
        this.config.hasDefault = true;
        return this;
    }
    $default = this.$defaultFn;
    primaryKey() {
        this.config.primaryKey = true;
        this.config.notNull = true;
        return this;
    }
}

// ../../node_modules/drizzle-orm/pg-core/table.js
var pgTableWithSchema = function (
    name,
    columns,
    extraConfig,
    schema,
    baseName = name
) {
    const rawTable = new PgTable(name, schema, baseName);
    const builtColumns = Object.fromEntries(
        Object.entries(columns).map(([name2, colBuilderBase]) => {
            const colBuilder = colBuilderBase;
            const column3 = colBuilder.build(rawTable);
            rawTable[InlineForeignKeys].push(
                ...colBuilder.buildForeignKeys(column3, rawTable)
            );
            return [name2, column3];
        })
    );
    const table4 = Object.assign(rawTable, builtColumns);
    table4[Table.Symbol.Columns] = builtColumns;
    if (extraConfig) {
        table4[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
    }
    return table4;
};
var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");

class PgTable extends Table {
    static [entityKind] = "PgTable";
    static Symbol = Object.assign({}, Table.Symbol, {
        InlineForeignKeys,
    });
    [InlineForeignKeys] = [];
    [Table.Symbol.ExtraConfigBuilder] = undefined;
}
var pgTable = (name, columns, extraConfig) => {
    return pgTableWithSchema(name, columns, extraConfig, undefined);
};

// ../../node_modules/drizzle-orm/pg-core/foreign-keys.js
class ForeignKeyBuilder {
    static [entityKind] = "PgForeignKeyBuilder";
    reference;
    _onUpdate = "no action";
    _onDelete = "no action";
    constructor(config, actions) {
        this.reference = () => {
            const { name, columns, foreignColumns } = config();
            return {
                name,
                columns,
                foreignTable: foreignColumns[0].table,
                foreignColumns,
            };
        };
        if (actions) {
            this._onUpdate = actions.onUpdate;
            this._onDelete = actions.onDelete;
        }
    }
    onUpdate(action) {
        this._onUpdate = action === undefined ? "no action" : action;
        return this;
    }
    onDelete(action) {
        this._onDelete = action === undefined ? "no action" : action;
        return this;
    }
    build(table5) {
        return new ForeignKey(table5, this);
    }
}

class ForeignKey {
    constructor(table5, builder) {
        this.table = table5;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
    }
    static [entityKind] = "PgForeignKey";
    reference;
    onUpdate;
    onDelete;
    getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column3) => column3.name);
        const foreignColumnNames = foreignColumns.map(
            (column3) => column3.name
        );
        const chunks = [
            this.table[PgTable.Symbol.Name],
            ...columnNames,
            foreignColumns[0].table[PgTable.Symbol.Name],
            ...foreignColumnNames,
        ];
        return name ?? `${chunks.join("_")}_fk`;
    }
}

// ../../node_modules/drizzle-orm/pg-core/unique-constraint.js
var uniqueKeyName = function (table6, columns) {
    return `${table6[PgTable.Symbol.Name]}_${columns.join("_")}_unique`;
};

// ../../node_modules/drizzle-orm/pg-core/utils/array.js
var parsePgArrayValue = function (arrayString, startFrom, inQuotes) {
    for (let i = startFrom; i < arrayString.length; i++) {
        const char = arrayString[i];
        if (char === "\\") {
            i++;
            continue;
        }
        if (char === '"') {
            return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
        }
        if (inQuotes) {
            continue;
        }
        if (char === "," || char === "}") {
            return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
        }
    }
    return [
        arrayString.slice(startFrom).replace(/\\/g, ""),
        arrayString.length,
    ];
};
var parsePgNestedArray = function (arrayString, startFrom = 0) {
    const result = [];
    let i = startFrom;
    let lastCharIsComma = false;
    while (i < arrayString.length) {
        const char = arrayString[i];
        if (char === ",") {
            if (lastCharIsComma || i === startFrom) {
                result.push("");
            }
            lastCharIsComma = true;
            i++;
            continue;
        }
        lastCharIsComma = false;
        if (char === "\\") {
            i += 2;
            continue;
        }
        if (char === '"') {
            const [value2, startFrom2] = parsePgArrayValue(
                arrayString,
                i + 1,
                true
            );
            result.push(value2);
            i = startFrom2;
            continue;
        }
        if (char === "}") {
            return [result, i + 1];
        }
        if (char === "{") {
            const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
            result.push(value2);
            i = startFrom2;
            continue;
        }
        const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
        result.push(value);
        i = newStartFrom;
    }
    return [result, i];
};
var parsePgArray = function (arrayString) {
    const [result] = parsePgNestedArray(arrayString, 1);
    return result;
};
var makePgArray = function (array) {
    return `{${array
        .map((item) => {
            if (Array.isArray(item)) {
                return makePgArray(item);
            }
            if (typeof item === "string") {
                return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
            }
            return `${item}`;
        })
        .join(",")}}`;
};

// ../../node_modules/drizzle-orm/pg-core/columns/common.js
class PgColumnBuilder extends ColumnBuilder {
    foreignKeyConfigs = [];
    static [entityKind] = "PgColumnBuilder";
    array(size) {
        return new PgArrayBuilder(this.config.name, this, size);
    }
    references(ref, actions = {}) {
        this.foreignKeyConfigs.push({ ref, actions });
        return this;
    }
    unique(name, config) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        this.config.uniqueType = config?.nulls;
        return this;
    }
    buildForeignKeys(column4, table6) {
        return this.foreignKeyConfigs.map(({ ref, actions }) => {
            return iife(
                (ref2, actions2) => {
                    const builder = new ForeignKeyBuilder(() => {
                        const foreignColumn = ref2();
                        return {
                            columns: [column4],
                            foreignColumns: [foreignColumn],
                        };
                    });
                    if (actions2.onUpdate) {
                        builder.onUpdate(actions2.onUpdate);
                    }
                    if (actions2.onDelete) {
                        builder.onDelete(actions2.onDelete);
                    }
                    return builder.build(table6);
                },
                ref,
                actions
            );
        });
    }
}

class PgColumn extends Column {
    constructor(table6, config) {
        if (!config.uniqueName) {
            config.uniqueName = uniqueKeyName(table6, [config.name]);
        }
        super(table6, config);
        this.table = table6;
    }
    static [entityKind] = "PgColumn";
}

class PgArrayBuilder extends PgColumnBuilder {
    static [entityKind] = "PgArrayBuilder";
    constructor(name, baseBuilder, size) {
        super(name, "array", "PgArray");
        this.config.baseBuilder = baseBuilder;
        this.config.size = size;
    }
    build(table6) {
        const baseColumn = this.config.baseBuilder.build(table6);
        return new PgArray(table6, this.config, baseColumn);
    }
}

class PgArray extends PgColumn {
    constructor(table6, config, baseColumn, range) {
        super(table6, config);
        this.baseColumn = baseColumn;
        this.range = range;
        this.size = config.size;
    }
    size;
    static [entityKind] = "PgArray";
    getSQLType() {
        return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            value = parsePgArray(value);
        }
        return value.map((v) => this.baseColumn.mapFromDriverValue(v));
    }
    mapToDriverValue(value, isNestedArray = false) {
        const a = value.map((v) =>
            v === null
                ? null
                : is(this.baseColumn, PgArray)
                  ? this.baseColumn.mapToDriverValue(v, true)
                  : this.baseColumn.mapToDriverValue(v)
        );
        if (isNestedArray) return a;
        return makePgArray(a);
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/date.common.js
class PgDateColumnBaseBuilder extends PgColumnBuilder {
    static [entityKind] = "PgDateColumnBaseBuilder";
    defaultNow() {
        return this.default(sql`now()`);
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/date.js
class PgDate extends PgColumn {
    static [entityKind] = "PgDate";
    getSQLType() {
        return "date";
    }
    mapFromDriverValue(value) {
        return new Date(value);
    }
    mapToDriverValue(value) {
        return value.toISOString();
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/integer.js
var integer = function (name) {
    return new PgIntegerBuilder(name);
};

class PgIntegerBuilder extends PgColumnBuilder {
    static [entityKind] = "PgIntegerBuilder";
    constructor(name) {
        super(name, "number", "PgInteger");
    }
    build(table6) {
        return new PgInteger(table6, this.config);
    }
}

class PgInteger extends PgColumn {
    static [entityKind] = "PgInteger";
    getSQLType() {
        return "integer";
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            return Number.parseInt(value);
        }
        return value;
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/json.js
class PgJson extends PgColumn {
    static [entityKind] = "PgJson";
    constructor(table6, config) {
        super(table6, config);
    }
    getSQLType() {
        return "json";
    }
    mapToDriverValue(value) {
        return JSON.stringify(value);
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return value;
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/jsonb.js
class PgJsonb extends PgColumn {
    static [entityKind] = "PgJsonb";
    constructor(table6, config) {
        super(table6, config);
    }
    getSQLType() {
        return "jsonb";
    }
    mapToDriverValue(value) {
        return JSON.stringify(value);
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return value;
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/numeric.js
class PgNumeric extends PgColumn {
    static [entityKind] = "PgNumeric";
    precision;
    scale;
    constructor(table6, config) {
        super(table6, config);
        this.precision = config.precision;
        this.scale = config.scale;
    }
    getSQLType() {
        if (this.precision !== undefined && this.scale !== undefined) {
            return `numeric(${this.precision}, ${this.scale})`;
        } else if (this.precision === undefined) {
            return "numeric";
        } else {
            return `numeric(${this.precision})`;
        }
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/serial.js
var serial = function (name) {
    return new PgSerialBuilder(name);
};

class PgSerialBuilder extends PgColumnBuilder {
    static [entityKind] = "PgSerialBuilder";
    constructor(name) {
        super(name, "number", "PgSerial");
        this.config.hasDefault = true;
        this.config.notNull = true;
    }
    build(table6) {
        return new PgSerial(table6, this.config);
    }
}

class PgSerial extends PgColumn {
    static [entityKind] = "PgSerial";
    getSQLType() {
        return "serial";
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/text.js
var text = function (name, config = {}) {
    return new PgTextBuilder(name, config);
};

class PgTextBuilder extends PgColumnBuilder {
    static [entityKind] = "PgTextBuilder";
    constructor(name, config) {
        super(name, "string", "PgText");
        this.config.enumValues = config.enum;
    }
    build(table6) {
        return new PgText(table6, this.config);
    }
}

class PgText extends PgColumn {
    static [entityKind] = "PgText";
    enumValues = this.config.enumValues;
    getSQLType() {
        return "text";
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/time.js
class PgTime extends PgColumn {
    static [entityKind] = "PgTime";
    withTimezone;
    precision;
    constructor(table6, config) {
        super(table6, config);
        this.withTimezone = config.withTimezone;
        this.precision = config.precision;
    }
    getSQLType() {
        const precision =
            this.precision === undefined ? "" : `(${this.precision})`;
        return `time${precision}${this.withTimezone ? " with time zone" : ""}`;
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/timestamp.js
var timestamp = function (name, config = {}) {
    if (config.mode === "string") {
        return new PgTimestampStringBuilder(
            name,
            config.withTimezone ?? false,
            config.precision
        );
    }
    return new PgTimestampBuilder(
        name,
        config.withTimezone ?? false,
        config.precision
    );
};

class PgTimestampBuilder extends PgDateColumnBaseBuilder {
    static [entityKind] = "PgTimestampBuilder";
    constructor(name, withTimezone, precision) {
        super(name, "date", "PgTimestamp");
        this.config.withTimezone = withTimezone;
        this.config.precision = precision;
    }
    build(table6) {
        return new PgTimestamp(table6, this.config);
    }
}

class PgTimestamp extends PgColumn {
    static [entityKind] = "PgTimestamp";
    withTimezone;
    precision;
    constructor(table6, config) {
        super(table6, config);
        this.withTimezone = config.withTimezone;
        this.precision = config.precision;
    }
    getSQLType() {
        const precision =
            this.precision === undefined ? "" : ` (${this.precision})`;
        return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
    }
    mapFromDriverValue = (value) => {
        return new Date(this.withTimezone ? value : value + "+0000");
    };
    mapToDriverValue = (value) => {
        return this.withTimezone ? value.toUTCString() : value.toISOString();
    };
}

class PgTimestampStringBuilder extends PgDateColumnBaseBuilder {
    static [entityKind] = "PgTimestampStringBuilder";
    constructor(name, withTimezone, precision) {
        super(name, "string", "PgTimestampString");
        this.config.withTimezone = withTimezone;
        this.config.precision = precision;
    }
    build(table6) {
        return new PgTimestampString(table6, this.config);
    }
}

class PgTimestampString extends PgColumn {
    static [entityKind] = "PgTimestampString";
    withTimezone;
    precision;
    constructor(table6, config) {
        super(table6, config);
        this.withTimezone = config.withTimezone;
        this.precision = config.precision;
    }
    getSQLType() {
        const precision =
            this.precision === undefined ? "" : `(${this.precision})`;
        return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
    }
}

// ../../node_modules/drizzle-orm/pg-core/columns/uuid.js
class PgUUID extends PgColumn {
    static [entityKind] = "PgUUID";
    getSQLType() {
        return "uuid";
    }
}

// ../../node_modules/drizzle-orm/query-promise.js
class QueryPromise {
    static [entityKind] = "QueryPromise";
    [Symbol.toStringTag] = "QueryPromise";
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
    finally(onFinally) {
        return this.then(
            (value) => {
                onFinally?.();
                return value;
            },
            (reason) => {
                onFinally?.();
                throw reason;
            }
        );
    }
    then(onFulfilled, onRejected) {
        return this.execute().then(onFulfilled, onRejected);
    }
}

// ../../node_modules/drizzle-orm/utils.js
var mapResultRow = function (columns, row, joinsNotNullableMap) {
    const nullifyMap = {};
    const result = columns.reduce((result2, { path, field }, columnIndex) => {
        let decoder;
        if (is(field, Column)) {
            decoder = field;
        } else if (is(field, SQL)) {
            decoder = field.decoder;
        } else {
            decoder = field.sql.decoder;
        }
        let node = result2;
        for (const [pathChunkIndex, pathChunk] of path.entries()) {
            if (pathChunkIndex < path.length - 1) {
                if (!(pathChunk in node)) {
                    node[pathChunk] = {};
                }
                node = node[pathChunk];
            } else {
                const rawValue = row[columnIndex];
                const value = (node[pathChunk] =
                    rawValue === null
                        ? null
                        : decoder.mapFromDriverValue(rawValue));
                if (
                    joinsNotNullableMap &&
                    is(field, Column) &&
                    path.length === 2
                ) {
                    const objectName = path[0];
                    if (!(objectName in nullifyMap)) {
                        nullifyMap[objectName] =
                            value === null ? getTableName(field.table) : false;
                    } else if (
                        typeof nullifyMap[objectName] === "string" &&
                        nullifyMap[objectName] !== getTableName(field.table)
                    ) {
                        nullifyMap[objectName] = false;
                    }
                }
            }
        }
        return result2;
    }, {});
    if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
        for (const [objectName, tableName] of Object.entries(nullifyMap)) {
            if (
                typeof tableName === "string" &&
                !joinsNotNullableMap[tableName]
            ) {
                result[objectName] = null;
            }
        }
    }
    return result;
};
var orderSelectedFields = function (fields, pathPrefix) {
    return Object.entries(fields).reduce((result, [name, field]) => {
        if (typeof name !== "string") {
            return result;
        }
        const newPath = pathPrefix ? [...pathPrefix, name] : [name];
        if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) {
            result.push({ path: newPath, field });
        } else if (is(field, Table)) {
            result.push(
                ...orderSelectedFields(field[Table.Symbol.Columns], newPath)
            );
        } else {
            result.push(...orderSelectedFields(field, newPath));
        }
        return result;
    }, []);
};
var haveSameKeys = function (left, right) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
        return false;
    }
    for (const [index, key] of leftKeys.entries()) {
        if (key !== rightKeys[index]) {
            return false;
        }
    }
    return true;
};
var mapUpdateSet = function (table7, values) {
    const entries = Object.entries(values)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => {
            if (is(value, SQL)) {
                return [key, value];
            } else {
                return [
                    key,
                    new Param(value, table7[Table.Symbol.Columns][key]),
                ];
            }
        });
    if (entries.length === 0) {
        throw new Error("No values to set");
    }
    return Object.fromEntries(entries);
};
var applyMixins = function (baseClass, extendedClasses) {
    for (const extendedClass of extendedClasses) {
        for (const name of Object.getOwnPropertyNames(
            extendedClass.prototype
        )) {
            if (name === "constructor") continue;
            Object.defineProperty(
                baseClass.prototype,
                name,
                Object.getOwnPropertyDescriptor(
                    extendedClass.prototype,
                    name
                ) || Object.create(null)
            );
        }
    }
};
var getTableColumns = function (table7) {
    return table7[Table.Symbol.Columns];
};
var getTableLikeName = function (table7) {
    return is(table7, Subquery)
        ? table7[SubqueryConfig].alias
        : is(table7, View)
          ? table7[ViewBaseConfig].name
          : is(table7, SQL)
            ? undefined
            : table7[Table.Symbol.IsAlias]
              ? table7[Table.Symbol.Name]
              : table7[Table.Symbol.BaseName];
};

// ../../node_modules/drizzle-orm/pg-core/query-builders/delete.js
class PgDeleteBase extends QueryPromise {
    constructor(table8, session, dialect, withList) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { table: table8, withList };
    }
    static [entityKind] = "PgDelete";
    config;
    where(where) {
        this.config.where = where;
        return this;
    }
    returning(fields = this.config.table[Table.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
    }
    getSQL() {
        return this.dialect.buildDeleteQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(
            this.getSQL()
        );
        return rest;
    }
    _prepare(name) {
        return tracer.startActiveSpan("drizzle.prepareQuery", () => {
            return this.session.prepareQuery(
                this.dialect.sqlToQuery(this.getSQL()),
                this.config.returning,
                name
            );
        });
    }
    prepare(name) {
        return this._prepare(name);
    }
    execute = (placeholderValues) => {
        return tracer.startActiveSpan("drizzle.operation", () => {
            return this._prepare().execute(placeholderValues);
        });
    };
    $dynamic() {
        return this;
    }
}

// ../../node_modules/drizzle-orm/pg-core/query-builders/insert.js
class PgInsertBuilder {
    constructor(table9, session, dialect, withList) {
        this.table = table9;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
    }
    static [entityKind] = "PgInsertBuilder";
    values(values) {
        values = Array.isArray(values) ? values : [values];
        if (values.length === 0) {
            throw new Error("values() must be called with at least one value");
        }
        const mappedValues = values.map((entry) => {
            const result = {};
            const cols = this.table[Table.Symbol.Columns];
            for (const colKey of Object.keys(entry)) {
                const colValue = entry[colKey];
                result[colKey] = is(colValue, SQL)
                    ? colValue
                    : new Param(colValue, cols[colKey]);
            }
            return result;
        });
        return new PgInsertBase(
            this.table,
            mappedValues,
            this.session,
            this.dialect,
            this.withList
        );
    }
}

class PgInsertBase extends QueryPromise {
    constructor(table9, values, session, dialect, withList) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { table: table9, values, withList };
    }
    static [entityKind] = "PgInsert";
    config;
    returning(fields = this.config.table[Table.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
    }
    onConflictDoNothing(config = {}) {
        if (config.target === undefined) {
            this.config.onConflict = sql`do nothing`;
        } else {
            let targetColumn = "";
            targetColumn = Array.isArray(config.target)
                ? config.target
                      .map((it) => this.dialect.escapeName(it.name))
                      .join(",")
                : this.dialect.escapeName(config.target.name);
            const whereSql = config.where
                ? sql` where ${config.where}`
                : undefined;
            this.config.onConflict = sql`(${sql.raw(targetColumn)}) do nothing${whereSql}`;
        }
        return this;
    }
    onConflictDoUpdate(config) {
        const whereSql = config.where ? sql` where ${config.where}` : undefined;
        const setSql = this.dialect.buildUpdateSet(
            this.config.table,
            mapUpdateSet(this.config.table, config.set)
        );
        let targetColumn = "";
        targetColumn = Array.isArray(config.target)
            ? config.target
                  .map((it) => this.dialect.escapeName(it.name))
                  .join(",")
            : this.dialect.escapeName(config.target.name);
        this.config.onConflict = sql`(${sql.raw(targetColumn)}) do update set ${setSql}${whereSql}`;
        return this;
    }
    getSQL() {
        return this.dialect.buildInsertQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(
            this.getSQL()
        );
        return rest;
    }
    _prepare(name) {
        return tracer.startActiveSpan("drizzle.prepareQuery", () => {
            return this.session.prepareQuery(
                this.dialect.sqlToQuery(this.getSQL()),
                this.config.returning,
                name
            );
        });
    }
    prepare(name) {
        return this._prepare(name);
    }
    execute = (placeholderValues) => {
        return tracer.startActiveSpan("drizzle.operation", () => {
            return this._prepare().execute(placeholderValues);
        });
    };
    $dynamic() {
        return this;
    }
}

// ../../node_modules/drizzle-orm/errors.js
class DrizzleError extends Error {
    static [entityKind] = "DrizzleError";
    constructor({ message, cause }) {
        super(message);
        this.name = "DrizzleError";
        this.cause = cause;
    }
}

class TransactionRollbackError extends DrizzleError {
    static [entityKind] = "TransactionRollbackError";
    constructor() {
        super({ message: "Rollback" });
    }
}

// ../../node_modules/drizzle-orm/pg-core/primary-keys.js
class PrimaryKeyBuilder {
    static [entityKind] = "PgPrimaryKeyBuilder";
    columns;
    name;
    constructor(columns, name) {
        this.columns = columns;
        this.name = name;
    }
    build(table10) {
        return new PrimaryKey(table10, this.columns, this.name);
    }
}

class PrimaryKey {
    constructor(table10, columns, name) {
        this.table = table10;
        this.columns = columns;
        this.name = name;
    }
    static [entityKind] = "PgPrimaryKey";
    columns;
    name;
    getName() {
        return (
            this.name ??
            `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column5) => column5.name).join("_")}_pk`
        );
    }
}

// ../../node_modules/drizzle-orm/sql/expressions/conditions.js
var bindIfParam = function (value, column6) {
    if (
        isDriverValueEncoder(column6) &&
        !isSQLWrapper(value) &&
        !is(value, Param) &&
        !is(value, Placeholder) &&
        !is(value, Column) &&
        !is(value, Table) &&
        !is(value, View)
    ) {
        return new Param(value, column6);
    }
    return value;
};
var and = function (...unfilteredConditions) {
    const conditions = unfilteredConditions.filter((c) => c !== undefined);
    if (conditions.length === 0) {
        return;
    }
    if (conditions.length === 1) {
        return new SQL(conditions);
    }
    return new SQL([
        new StringChunk("("),
        sql.join(conditions, new StringChunk(" and ")),
        new StringChunk(")"),
    ]);
};
var or = function (...unfilteredConditions) {
    const conditions = unfilteredConditions.filter((c) => c !== undefined);
    if (conditions.length === 0) {
        return;
    }
    if (conditions.length === 1) {
        return new SQL(conditions);
    }
    return new SQL([
        new StringChunk("("),
        sql.join(conditions, new StringChunk(" or ")),
        new StringChunk(")"),
    ]);
};
var not = function (condition) {
    return sql`not ${condition}`;
};
var inArray = function (column6, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            throw new Error("inArray requires at least one value");
        }
        return sql`${column6} in ${values.map((v) => bindIfParam(v, column6))}`;
    }
    return sql`${column6} in ${bindIfParam(values, column6)}`;
};
var notInArray = function (column6, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            throw new Error("notInArray requires at least one value");
        }
        return sql`${column6} not in ${values.map((v) => bindIfParam(v, column6))}`;
    }
    return sql`${column6} not in ${bindIfParam(values, column6)}`;
};
var isNull = function (value) {
    return sql`${value} is null`;
};
var isNotNull = function (value) {
    return sql`${value} is not null`;
};
var exists = function (subquery3) {
    return sql`exists ${subquery3}`;
};
var notExists = function (subquery3) {
    return sql`not exists ${subquery3}`;
};
var between = function (column6, min, max) {
    return sql`${column6} between ${bindIfParam(min, column6)} and ${bindIfParam(max, column6)}`;
};
var notBetween = function (column6, min, max) {
    return sql`${column6} not between ${bindIfParam(min, column6)} and ${bindIfParam(max, column6)}`;
};
var like = function (column6, value) {
    return sql`${column6} like ${value}`;
};
var notLike = function (column6, value) {
    return sql`${column6} not like ${value}`;
};
var ilike = function (column6, value) {
    return sql`${column6} ilike ${value}`;
};
var notIlike = function (column6, value) {
    return sql`${column6} not ilike ${value}`;
};
var eq = (left, right) => {
    return sql`${left} = ${bindIfParam(right, left)}`;
};
var ne = (left, right) => {
    return sql`${left} <> ${bindIfParam(right, left)}`;
};
var gt = (left, right) => {
    return sql`${left} > ${bindIfParam(right, left)}`;
};
var gte = (left, right) => {
    return sql`${left} >= ${bindIfParam(right, left)}`;
};
var lt = (left, right) => {
    return sql`${left} < ${bindIfParam(right, left)}`;
};
var lte = (left, right) => {
    return sql`${left} <= ${bindIfParam(right, left)}`;
};

// ../../node_modules/drizzle-orm/sql/expressions/select.js
var asc = function (column6) {
    return sql`${column6} asc`;
};
var desc = function (column6) {
    return sql`${column6} desc`;
};

// ../../node_modules/drizzle-orm/relations.js
var getOperators = function () {
    return {
        and,
        between,
        eq,
        exists,
        gt,
        gte,
        ilike,
        inArray,
        isNull,
        isNotNull,
        like,
        lt,
        lte,
        ne,
        not,
        notBetween,
        notExists,
        notLike,
        notIlike,
        notInArray,
        or,
        sql,
    };
};
var getOrderByOperators = function () {
    return {
        sql,
        asc,
        desc,
    };
};
var extractTablesRelationalConfig = function (schema, configHelpers) {
    if (
        Object.keys(schema).length === 1 &&
        "default" in schema &&
        !is(schema["default"], Table)
    ) {
        schema = schema["default"];
    }
    const tableNamesMap = {};
    const relationsBuffer = {};
    const tablesConfig = {};
    for (const [key, value] of Object.entries(schema)) {
        if (isTable(value)) {
            const dbName = value[Table.Symbol.Name];
            const bufferedRelations = relationsBuffer[dbName];
            tableNamesMap[dbName] = key;
            tablesConfig[key] = {
                tsName: key,
                dbName: value[Table.Symbol.Name],
                schema: value[Table.Symbol.Schema],
                columns: value[Table.Symbol.Columns],
                relations: bufferedRelations?.relations ?? {},
                primaryKey: bufferedRelations?.primaryKey ?? [],
            };
            for (const column7 of Object.values(value[Table.Symbol.Columns])) {
                if (column7.primary) {
                    tablesConfig[key].primaryKey.push(column7);
                }
            }
            const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value);
            if (extraConfig) {
                for (const configEntry of Object.values(extraConfig)) {
                    if (is(configEntry, PrimaryKeyBuilder)) {
                        tablesConfig[key].primaryKey.push(
                            ...configEntry.columns
                        );
                    }
                }
            }
        } else if (is(value, Relations)) {
            const dbName = value.table[Table.Symbol.Name];
            const tableName = tableNamesMap[dbName];
            const relations2 = value.config(configHelpers(value.table));
            let primaryKey;
            for (const [relationName, relation] of Object.entries(relations2)) {
                if (tableName) {
                    const tableConfig = tablesConfig[tableName];
                    tableConfig.relations[relationName] = relation;
                    if (primaryKey) {
                        tableConfig.primaryKey.push(...primaryKey);
                    }
                } else {
                    if (!(dbName in relationsBuffer)) {
                        relationsBuffer[dbName] = {
                            relations: {},
                            primaryKey,
                        };
                    }
                    relationsBuffer[dbName].relations[relationName] = relation;
                }
            }
        }
    }
    return { tables: tablesConfig, tableNamesMap };
};
var createOne = function (sourceTable) {
    return function one(table12, config) {
        return new One(
            sourceTable,
            table12,
            config,
            config?.fields.reduce((res, f) => res && f.notNull, true) ?? false
        );
    };
};
var createMany = function (sourceTable) {
    return function many(referencedTable, config) {
        return new Many(sourceTable, referencedTable, config);
    };
};
var normalizeRelation = function (schema, tableNamesMap, relation) {
    if (is(relation, One) && relation.config) {
        return {
            fields: relation.config.fields,
            references: relation.config.references,
        };
    }
    const referencedTableTsName =
        tableNamesMap[relation.referencedTable[Table.Symbol.Name]];
    if (!referencedTableTsName) {
        throw new Error(
            `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
        );
    }
    const referencedTableConfig = schema[referencedTableTsName];
    if (!referencedTableConfig) {
        throw new Error(`Table "${referencedTableTsName}" not found in schema`);
    }
    const sourceTable = relation.sourceTable;
    const sourceTableTsName = tableNamesMap[sourceTable[Table.Symbol.Name]];
    if (!sourceTableTsName) {
        throw new Error(
            `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
        );
    }
    const reverseRelations = [];
    for (const referencedTableRelation of Object.values(
        referencedTableConfig.relations
    )) {
        if (
            (relation.relationName &&
                relation !== referencedTableRelation &&
                referencedTableRelation.relationName ===
                    relation.relationName) ||
            (!relation.relationName &&
                referencedTableRelation.referencedTable ===
                    relation.sourceTable)
        ) {
            reverseRelations.push(referencedTableRelation);
        }
    }
    if (reverseRelations.length > 1) {
        throw relation.relationName
            ? new Error(
                  `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
              )
            : new Error(
                  `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
              );
    }
    if (
        reverseRelations[0] &&
        is(reverseRelations[0], One) &&
        reverseRelations[0].config
    ) {
        return {
            fields: reverseRelations[0].config.references,
            references: reverseRelations[0].config.fields,
        };
    }
    throw new Error(
        `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
    );
};
var createTableRelationsHelpers = function (sourceTable) {
    return {
        one: createOne(sourceTable),
        many: createMany(sourceTable),
    };
};
var mapRelationalRow = function (
    tablesConfig,
    tableConfig,
    row,
    buildQueryResultSelection,
    mapColumnValue = (value) => value
) {
    const result = {};
    for (const [
        selectionItemIndex,
        selectionItem,
    ] of buildQueryResultSelection.entries()) {
        if (selectionItem.isJson) {
            const relation = tableConfig.relations[selectionItem.tsKey];
            const rawSubRows = row[selectionItemIndex];
            const subRows =
                typeof rawSubRows === "string"
                    ? JSON.parse(rawSubRows)
                    : rawSubRows;
            result[selectionItem.tsKey] = is(relation, One)
                ? subRows &&
                  mapRelationalRow(
                      tablesConfig,
                      tablesConfig[selectionItem.relationTableTsKey],
                      subRows,
                      selectionItem.selection,
                      mapColumnValue
                  )
                : subRows.map((subRow) =>
                      mapRelationalRow(
                          tablesConfig,
                          tablesConfig[selectionItem.relationTableTsKey],
                          subRow,
                          selectionItem.selection,
                          mapColumnValue
                      )
                  );
        } else {
            const value = mapColumnValue(row[selectionItemIndex]);
            const field = selectionItem.field;
            let decoder;
            if (is(field, Column)) {
                decoder = field;
            } else if (is(field, SQL)) {
                decoder = field.decoder;
            } else {
                decoder = field.sql.decoder;
            }
            result[selectionItem.tsKey] =
                value === null ? null : decoder.mapFromDriverValue(value);
        }
    }
    return result;
};

class Relation {
    constructor(sourceTable, referencedTable, relationName) {
        this.sourceTable = sourceTable;
        this.referencedTable = referencedTable;
        this.relationName = relationName;
        this.referencedTableName = referencedTable[Table.Symbol.Name];
    }
    static [entityKind] = "Relation";
    referencedTableName;
    fieldName;
}

class Relations {
    constructor(table12, config) {
        this.table = table12;
        this.config = config;
    }
    static [entityKind] = "Relations";
}

class One extends Relation {
    constructor(sourceTable, referencedTable, config, isNullable) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
        this.isNullable = isNullable;
    }
    static [entityKind] = "One";
    withFieldName(fieldName) {
        const relation = new One(
            this.sourceTable,
            this.referencedTable,
            this.config,
            this.isNullable
        );
        relation.fieldName = fieldName;
        return relation;
    }
}

class Many extends Relation {
    constructor(sourceTable, referencedTable, config) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
    }
    static [entityKind] = "Many";
    withFieldName(fieldName) {
        const relation = new Many(
            this.sourceTable,
            this.referencedTable,
            this.config
        );
        relation.fieldName = fieldName;
        return relation;
    }
}

// ../../node_modules/drizzle-orm/pg-core/view-base.js
class PgViewBase extends View {
    static [entityKind] = "PgViewBase";
}

// ../../node_modules/drizzle-orm/pg-core/dialect.js
class PgDialect {
    static [entityKind] = "PgDialect";
    async migrate(migrations, session, config) {
        const migrationsTable =
            typeof config === "string"
                ? "__drizzle_migrations"
                : config.migrationsTable ?? "__drizzle_migrations";
        const migrationsSchema =
            typeof config === "string"
                ? "drizzle"
                : config.migrationsSchema ?? "drizzle";
        const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at bigint
			)
		`;
        await session.execute(
            sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(migrationsSchema)}`
        );
        await session.execute(migrationTableCreate);
        const dbMigrations = await session.all(
            sql`select id, hash, created_at from ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} order by created_at desc limit 1`
        );
        const lastDbMigration = dbMigrations[0];
        await session.transaction(async (tx) => {
            for await (const migration of migrations) {
                if (
                    !lastDbMigration ||
                    Number(lastDbMigration.created_at) < migration.folderMillis
                ) {
                    for (const stmt of migration.sql) {
                        await tx.execute(sql.raw(stmt));
                    }
                    await tx.execute(
                        sql`insert into ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`
                    );
                }
            }
        });
    }
    escapeName(name) {
        return `"${name}"`;
    }
    escapeParam(num) {
        return `\$${num + 1}`;
    }
    escapeString(str) {
        return `'${str.replace(/'/g, "''")}'`;
    }
    buildWithCTE(queries) {
        if (!queries?.length) return;
        const withSqlChunks = [sql`with `];
        for (const [i, w] of queries.entries()) {
            withSqlChunks.push(
                sql`${sql.identifier(w[SubqueryConfig].alias)} as (${w[SubqueryConfig].sql})`
            );
            if (i < queries.length - 1) {
                withSqlChunks.push(sql`, `);
            }
        }
        withSqlChunks.push(sql` `);
        return sql.join(withSqlChunks);
    }
    buildDeleteQuery({ table: table14, where, returning, withList }) {
        const withSql = this.buildWithCTE(withList);
        const returningSql = returning
            ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}`
            : undefined;
        const whereSql = where ? sql` where ${where}` : undefined;
        return sql`${withSql}delete from ${table14}${whereSql}${returningSql}`;
    }
    buildUpdateSet(table14, set) {
        const setEntries = Object.entries(set);
        const setSize = setEntries.length;
        return sql.join(
            setEntries.flatMap(([colName, value], i) => {
                const col = table14[Table.Symbol.Columns][colName];
                const res = sql`${sql.identifier(col.name)} = ${value}`;
                if (i < setSize - 1) {
                    return [res, sql.raw(", ")];
                }
                return [res];
            })
        );
    }
    buildUpdateQuery({ table: table14, set, where, returning, withList }) {
        const withSql = this.buildWithCTE(withList);
        const setSql = this.buildUpdateSet(table14, set);
        const returningSql = returning
            ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}`
            : undefined;
        const whereSql = where ? sql` where ${where}` : undefined;
        return sql`${withSql}update ${table14} set ${setSql}${whereSql}${returningSql}`;
    }
    buildSelection(fields, { isSingleTable = false } = {}) {
        const columnsLen = fields.length;
        const chunks = fields.flatMap(({ field }, i) => {
            const chunk = [];
            if (is(field, SQL.Aliased) && field.isSelectionField) {
                chunk.push(sql.identifier(field.fieldAlias));
            } else if (is(field, SQL.Aliased) || is(field, SQL)) {
                const query = is(field, SQL.Aliased) ? field.sql : field;
                if (isSingleTable) {
                    chunk.push(
                        new SQL(
                            query.queryChunks.map((c) => {
                                if (is(c, PgColumn)) {
                                    return sql.identifier(c.name);
                                }
                                return c;
                            })
                        )
                    );
                } else {
                    chunk.push(query);
                }
                if (is(field, SQL.Aliased)) {
                    chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
                }
            } else if (is(field, Column)) {
                if (isSingleTable) {
                    chunk.push(sql.identifier(field.name));
                } else {
                    chunk.push(field);
                }
            }
            if (i < columnsLen - 1) {
                chunk.push(sql`, `);
            }
            return chunk;
        });
        return sql.join(chunks);
    }
    buildSelectQuery({
        withList,
        fields,
        fieldsFlat,
        where,
        having,
        table: table14,
        joins,
        orderBy,
        groupBy,
        limit,
        offset,
        lockingClause,
        distinct,
        setOperators,
    }) {
        const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
        for (const f of fieldsList) {
            if (
                is(f.field, Column) &&
                getTableName(f.field.table) !==
                    (is(table14, Subquery)
                        ? table14[SubqueryConfig].alias
                        : is(table14, PgViewBase)
                          ? table14[ViewBaseConfig].name
                          : is(table14, SQL)
                            ? undefined
                            : getTableName(table14)) &&
                !((table22) =>
                    joins?.some(
                        ({ alias: alias2 }) =>
                            alias2 ===
                            (table22[Table.Symbol.IsAlias]
                                ? getTableName(table22)
                                : table22[Table.Symbol.BaseName])
                    ))(f.field.table)
            ) {
                const tableName = getTableName(f.field.table);
                throw new Error(
                    `Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
                );
            }
        }
        const isSingleTable = !joins || joins.length === 0;
        const withSql = this.buildWithCTE(withList);
        let distinctSql;
        if (distinct) {
            distinctSql =
                distinct === true
                    ? sql` distinct`
                    : sql` distinct on (${sql.join(distinct.on, sql`, `)})`;
        }
        const selection = this.buildSelection(fieldsList, { isSingleTable });
        const tableSql = (() => {
            if (
                is(table14, Table) &&
                table14[Table.Symbol.OriginalName] !==
                    table14[Table.Symbol.Name]
            ) {
                let fullName = sql`${sql.identifier(table14[Table.Symbol.OriginalName])}`;
                if (table14[Table.Symbol.Schema]) {
                    fullName = sql`${sql.identifier(table14[Table.Symbol.Schema])}.${fullName}`;
                }
                return sql`${fullName} ${sql.identifier(table14[Table.Symbol.Name])}`;
            }
            return table14;
        })();
        const joinsArray = [];
        if (joins) {
            for (const [index, joinMeta] of joins.entries()) {
                if (index === 0) {
                    joinsArray.push(sql` `);
                }
                const table22 = joinMeta.table;
                const lateralSql = joinMeta.lateral ? sql` lateral` : undefined;
                if (is(table22, PgTable)) {
                    const tableName = table22[PgTable.Symbol.Name];
                    const tableSchema = table22[PgTable.Symbol.Schema];
                    const origTableName = table22[PgTable.Symbol.OriginalName];
                    const alias2 =
                        tableName === origTableName
                            ? undefined
                            : joinMeta.alias;
                    joinsArray.push(
                        sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : undefined}${sql.identifier(origTableName)}${alias2 && sql` ${sql.identifier(alias2)}`} on ${joinMeta.on}`
                    );
                } else if (is(table22, View)) {
                    const viewName = table22[ViewBaseConfig].name;
                    const viewSchema = table22[ViewBaseConfig].schema;
                    const origViewName = table22[ViewBaseConfig].originalName;
                    const alias2 =
                        viewName === origViewName ? undefined : joinMeta.alias;
                    joinsArray.push(
                        sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${viewSchema ? sql`${sql.identifier(viewSchema)}.` : undefined}${sql.identifier(origViewName)}${alias2 && sql` ${sql.identifier(alias2)}`} on ${joinMeta.on}`
                    );
                } else {
                    joinsArray.push(
                        sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${table22} on ${joinMeta.on}`
                    );
                }
                if (index < joins.length - 1) {
                    joinsArray.push(sql` `);
                }
            }
        }
        const joinsSql = sql.join(joinsArray);
        const whereSql = where ? sql` where ${where}` : undefined;
        const havingSql = having ? sql` having ${having}` : undefined;
        let orderBySql;
        if (orderBy && orderBy.length > 0) {
            orderBySql = sql` order by ${sql.join(orderBy, sql`, `)}`;
        }
        let groupBySql;
        if (groupBy && groupBy.length > 0) {
            groupBySql = sql` group by ${sql.join(groupBy, sql`, `)}`;
        }
        const limitSql = limit ? sql` limit ${limit}` : undefined;
        const offsetSql = offset ? sql` offset ${offset}` : undefined;
        const lockingClauseSql = sql.empty();
        if (lockingClause) {
            const clauseSql = sql` for ${sql.raw(lockingClause.strength)}`;
            if (lockingClause.config.of) {
                clauseSql.append(
                    sql` of ${sql.join(Array.isArray(lockingClause.config.of) ? lockingClause.config.of : [lockingClause.config.of], sql`, `)}`
                );
            }
            if (lockingClause.config.noWait) {
                clauseSql.append(sql` no wait`);
            } else if (lockingClause.config.skipLocked) {
                clauseSql.append(sql` skip locked`);
            }
            lockingClauseSql.append(clauseSql);
        }
        const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClauseSql}`;
        if (setOperators.length > 0) {
            return this.buildSetOperations(finalQuery, setOperators);
        }
        return finalQuery;
    }
    buildSetOperations(leftSelect, setOperators) {
        const [setOperator, ...rest] = setOperators;
        if (!setOperator) {
            throw new Error("Cannot pass undefined values to any set operator");
        }
        if (rest.length === 0) {
            return this.buildSetOperationQuery({ leftSelect, setOperator });
        }
        return this.buildSetOperations(
            this.buildSetOperationQuery({ leftSelect, setOperator }),
            rest
        );
    }
    buildSetOperationQuery({
        leftSelect,
        setOperator: { type, isAll, rightSelect, limit, orderBy, offset },
    }) {
        const leftChunk = sql`(${leftSelect.getSQL()}) `;
        const rightChunk = sql`(${rightSelect.getSQL()})`;
        let orderBySql;
        if (orderBy && orderBy.length > 0) {
            const orderByValues = [];
            for (const singleOrderBy of orderBy) {
                if (is(singleOrderBy, PgColumn)) {
                    orderByValues.push(sql.identifier(singleOrderBy.name));
                } else if (is(singleOrderBy, SQL)) {
                    for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
                        const chunk = singleOrderBy.queryChunks[i];
                        if (is(chunk, PgColumn)) {
                            singleOrderBy.queryChunks[i] = sql.identifier(
                                chunk.name
                            );
                        }
                    }
                    orderByValues.push(sql`${singleOrderBy}`);
                } else {
                    orderByValues.push(sql`${singleOrderBy}`);
                }
            }
            orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)} `;
        }
        const limitSql = limit ? sql` limit ${limit}` : undefined;
        const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
        const offsetSql = offset ? sql` offset ${offset}` : undefined;
        return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
    }
    buildInsertQuery({
        table: table14,
        values,
        onConflict,
        returning,
        withList,
    }) {
        const valuesSqlList = [];
        const columns2 = table14[Table.Symbol.Columns];
        const colEntries = Object.entries(columns2);
        const insertOrder = colEntries.map(([, column8]) =>
            sql.identifier(column8.name)
        );
        for (const [valueIndex, value] of values.entries()) {
            const valueList = [];
            for (const [fieldName, col] of colEntries) {
                const colValue = value[fieldName];
                if (
                    colValue === undefined ||
                    (is(colValue, Param) && colValue.value === undefined)
                ) {
                    if (col.defaultFn !== undefined) {
                        const defaultFnResult = col.defaultFn();
                        const defaultValue = is(defaultFnResult, SQL)
                            ? defaultFnResult
                            : sql.param(defaultFnResult, col);
                        valueList.push(defaultValue);
                    } else {
                        valueList.push(sql`default`);
                    }
                } else {
                    valueList.push(colValue);
                }
            }
            valuesSqlList.push(valueList);
            if (valueIndex < values.length - 1) {
                valuesSqlList.push(sql`, `);
            }
        }
        const withSql = this.buildWithCTE(withList);
        const valuesSql = sql.join(valuesSqlList);
        const returningSql = returning
            ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}`
            : undefined;
        const onConflictSql = onConflict
            ? sql` on conflict ${onConflict}`
            : undefined;
        return sql`${withSql}insert into ${table14} ${insertOrder} values ${valuesSql}${onConflictSql}${returningSql}`;
    }
    buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }) {
        const concurrentlySql = concurrently ? sql` concurrently` : undefined;
        const withNoDataSql = withNoData ? sql` with no data` : undefined;
        return sql`refresh materialized view${concurrentlySql} ${view}${withNoDataSql}`;
    }
    prepareTyping(encoder) {
        if (is(encoder, PgJsonb) || is(encoder, PgJson)) {
            return "json";
        } else if (is(encoder, PgNumeric)) {
            return "decimal";
        } else if (is(encoder, PgTime)) {
            return "time";
        } else if (is(encoder, PgTimestamp)) {
            return "timestamp";
        } else if (is(encoder, PgDate)) {
            return "date";
        } else if (is(encoder, PgUUID)) {
            return "uuid";
        } else {
            return "none";
        }
    }
    sqlToQuery(sql22) {
        return sql22.toQuery({
            escapeName: this.escapeName,
            escapeParam: this.escapeParam,
            escapeString: this.escapeString,
            prepareTyping: this.prepareTyping,
        });
    }
    buildRelationalQueryWithoutPK({
        fullSchema,
        schema,
        tableNamesMap,
        table: table14,
        tableConfig,
        queryConfig: config,
        tableAlias,
        nestedQueryRelation,
        joinOn,
    }) {
        let selection = [];
        let limit,
            offset,
            orderBy = [],
            where;
        const joins = [];
        if (config === true) {
            const selectionEntries = Object.entries(tableConfig.columns);
            selection = selectionEntries.map(([key, value]) => ({
                dbKey: value.name,
                tsKey: key,
                field: aliasedTableColumn(value, tableAlias),
                relationTableTsKey: undefined,
                isJson: false,
                selection: [],
            }));
        } else {
            const aliasedColumns = Object.fromEntries(
                Object.entries(tableConfig.columns).map(([key, value]) => [
                    key,
                    aliasedTableColumn(value, tableAlias),
                ])
            );
            if (config.where) {
                const whereSql =
                    typeof config.where === "function"
                        ? config.where(aliasedColumns, getOperators())
                        : config.where;
                where =
                    whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
            }
            const fieldsSelection = [];
            let selectedColumns = [];
            if (config.columns) {
                let isIncludeMode = false;
                for (const [field, value] of Object.entries(config.columns)) {
                    if (value === undefined) {
                        continue;
                    }
                    if (field in tableConfig.columns) {
                        if (!isIncludeMode && value === true) {
                            isIncludeMode = true;
                        }
                        selectedColumns.push(field);
                    }
                }
                if (selectedColumns.length > 0) {
                    selectedColumns = isIncludeMode
                        ? selectedColumns.filter(
                              (c) => config.columns?.[c] === true
                          )
                        : Object.keys(tableConfig.columns).filter(
                              (key) => !selectedColumns.includes(key)
                          );
                }
            } else {
                selectedColumns = Object.keys(tableConfig.columns);
            }
            for (const field of selectedColumns) {
                const column8 = tableConfig.columns[field];
                fieldsSelection.push({ tsKey: field, value: column8 });
            }
            let selectedRelations = [];
            if (config.with) {
                selectedRelations = Object.entries(config.with)
                    .filter((entry) => !!entry[1])
                    .map(([tsKey, queryConfig]) => ({
                        tsKey,
                        queryConfig,
                        relation: tableConfig.relations[tsKey],
                    }));
            }
            let extras;
            if (config.extras) {
                extras =
                    typeof config.extras === "function"
                        ? config.extras(aliasedColumns, { sql })
                        : config.extras;
                for (const [tsKey, value] of Object.entries(extras)) {
                    fieldsSelection.push({
                        tsKey,
                        value: mapColumnsInAliasedSQLToAlias(value, tableAlias),
                    });
                }
            }
            for (const { tsKey, value } of fieldsSelection) {
                selection.push({
                    dbKey: is(value, SQL.Aliased)
                        ? value.fieldAlias
                        : tableConfig.columns[tsKey].name,
                    tsKey,
                    field: is(value, Column)
                        ? aliasedTableColumn(value, tableAlias)
                        : value,
                    relationTableTsKey: undefined,
                    isJson: false,
                    selection: [],
                });
            }
            let orderByOrig =
                typeof config.orderBy === "function"
                    ? config.orderBy(aliasedColumns, getOrderByOperators())
                    : config.orderBy ?? [];
            if (!Array.isArray(orderByOrig)) {
                orderByOrig = [orderByOrig];
            }
            orderBy = orderByOrig.map((orderByValue) => {
                if (is(orderByValue, Column)) {
                    return aliasedTableColumn(orderByValue, tableAlias);
                }
                return mapColumnsInSQLToAlias(orderByValue, tableAlias);
            });
            limit = config.limit;
            offset = config.offset;
            for (const {
                tsKey: selectedRelationTsKey,
                queryConfig: selectedRelationConfigValue,
                relation,
            } of selectedRelations) {
                const normalizedRelation = normalizeRelation(
                    schema,
                    tableNamesMap,
                    relation
                );
                const relationTableName =
                    relation.referencedTable[Table.Symbol.Name];
                const relationTableTsName = tableNamesMap[relationTableName];
                const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
                const joinOn2 = and(
                    ...normalizedRelation.fields.map((field2, i) =>
                        eq(
                            aliasedTableColumn(
                                normalizedRelation.references[i],
                                relationTableAlias
                            ),
                            aliasedTableColumn(field2, tableAlias)
                        )
                    )
                );
                const builtRelation = this.buildRelationalQueryWithoutPK({
                    fullSchema,
                    schema,
                    tableNamesMap,
                    table: fullSchema[relationTableTsName],
                    tableConfig: schema[relationTableTsName],
                    queryConfig: is(relation, One)
                        ? selectedRelationConfigValue === true
                            ? { limit: 1 }
                            : { ...selectedRelationConfigValue, limit: 1 }
                        : selectedRelationConfigValue,
                    tableAlias: relationTableAlias,
                    joinOn: joinOn2,
                    nestedQueryRelation: relation,
                });
                const field =
                    sql`${sql.identifier(relationTableAlias)}.${sql.identifier("data")}`.as(
                        selectedRelationTsKey
                    );
                joins.push({
                    on: sql`true`,
                    table: new Subquery(
                        builtRelation.sql,
                        {},
                        relationTableAlias
                    ),
                    alias: relationTableAlias,
                    joinType: "left",
                    lateral: true,
                });
                selection.push({
                    dbKey: selectedRelationTsKey,
                    tsKey: selectedRelationTsKey,
                    field,
                    relationTableTsKey: relationTableTsName,
                    isJson: true,
                    selection: builtRelation.selection,
                });
            }
        }
        if (selection.length === 0) {
            throw new DrizzleError({
                message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")`,
            });
        }
        let result;
        where = and(joinOn, where);
        if (nestedQueryRelation) {
            let field = sql`json_build_array(${sql.join(
                selection.map(({ field: field2, tsKey, isJson }) =>
                    isJson
                        ? sql`${sql.identifier(`${tableAlias}_${tsKey}`)}.${sql.identifier("data")}`
                        : is(field2, SQL.Aliased)
                          ? field2.sql
                          : field2
                ),
                sql`, `
            )})`;
            if (is(nestedQueryRelation, Many)) {
                field = sql`coalesce(json_agg(${field}${orderBy.length > 0 ? sql` order by ${sql.join(orderBy, sql`, `)}` : undefined}), '[]'::json)`;
            }
            const nestedSelection = [
                {
                    dbKey: "data",
                    tsKey: "data",
                    field: field.as("data"),
                    isJson: true,
                    relationTableTsKey: tableConfig.tsName,
                    selection,
                },
            ];
            const needsSubquery =
                limit !== undefined ||
                offset !== undefined ||
                orderBy.length > 0;
            if (needsSubquery) {
                result = this.buildSelectQuery({
                    table: aliasedTable(table14, tableAlias),
                    fields: {},
                    fieldsFlat: [
                        {
                            path: [],
                            field: sql.raw("*"),
                        },
                    ],
                    where,
                    limit,
                    offset,
                    orderBy,
                    setOperators: [],
                });
                where = undefined;
                limit = undefined;
                offset = undefined;
                orderBy = [];
            } else {
                result = aliasedTable(table14, tableAlias);
            }
            result = this.buildSelectQuery({
                table: is(result, PgTable)
                    ? result
                    : new Subquery(result, {}, tableAlias),
                fields: {},
                fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
                    path: [],
                    field: is(field2, Column)
                        ? aliasedTableColumn(field2, tableAlias)
                        : field2,
                })),
                joins,
                where,
                limit,
                offset,
                orderBy,
                setOperators: [],
            });
        } else {
            result = this.buildSelectQuery({
                table: aliasedTable(table14, tableAlias),
                fields: {},
                fieldsFlat: selection.map(({ field }) => ({
                    path: [],
                    field: is(field, Column)
                        ? aliasedTableColumn(field, tableAlias)
                        : field,
                })),
                joins,
                where,
                limit,
                offset,
                orderBy,
                setOperators: [],
            });
        }
        return {
            tableTsKey: tableConfig.tsName,
            sql: result,
            selection,
        };
    }
}

// ../../node_modules/drizzle-orm/query-builders/query-builder.js
class TypedQueryBuilder {
    static [entityKind] = "TypedQueryBuilder";
    getSelectedFields() {
        return this._.selectedFields;
    }
}

// ../../node_modules/drizzle-orm/selection-proxy.js
class SelectionProxyHandler {
    static [entityKind] = "SelectionProxyHandler";
    config;
    constructor(config) {
        this.config = { ...config };
    }
    get(subquery5, prop) {
        if (prop === SubqueryConfig) {
            return {
                ...subquery5[SubqueryConfig],
                selection: new Proxy(subquery5[SubqueryConfig].selection, this),
            };
        }
        if (prop === ViewBaseConfig) {
            return {
                ...subquery5[ViewBaseConfig],
                selectedFields: new Proxy(
                    subquery5[ViewBaseConfig].selectedFields,
                    this
                ),
            };
        }
        if (typeof prop === "symbol") {
            return subquery5[prop];
        }
        const columns2 = is(subquery5, Subquery)
            ? subquery5[SubqueryConfig].selection
            : is(subquery5, View)
              ? subquery5[ViewBaseConfig].selectedFields
              : subquery5;
        const value = columns2[prop];
        if (is(value, SQL.Aliased)) {
            if (
                this.config.sqlAliasedBehavior === "sql" &&
                !value.isSelectionField
            ) {
                return value.sql;
            }
            const newValue = value.clone();
            newValue.isSelectionField = true;
            return newValue;
        }
        if (is(value, SQL)) {
            if (this.config.sqlBehavior === "sql") {
                return value;
            }
            throw new Error(
                `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
            );
        }
        if (is(value, Column)) {
            if (this.config.alias) {
                return new Proxy(
                    value,
                    new ColumnAliasProxyHandler(
                        new Proxy(
                            value.table,
                            new TableAliasProxyHandler(
                                this.config.alias,
                                this.config.replaceOriginalName ?? false
                            )
                        )
                    )
                );
            }
            return value;
        }
        if (typeof value !== "object" || value === null) {
            return value;
        }
        return new Proxy(value, new SelectionProxyHandler(this.config));
    }
}

// ../../node_modules/drizzle-orm/pg-core/query-builders/select.js
var createSetOperator = function (type, isAll) {
    return (leftSelect, rightSelect, ...restSelects) => {
        const setOperators = [rightSelect, ...restSelects].map((select) => ({
            type,
            isAll,
            rightSelect: select,
        }));
        for (const setOperator of setOperators) {
            if (
                !haveSameKeys(
                    leftSelect.getSelectedFields(),
                    setOperator.rightSelect.getSelectedFields()
                )
            ) {
                throw new Error(
                    "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
                );
            }
        }
        return leftSelect.addSetOperators(setOperators);
    };
};

class PgSelectBuilder {
    static [entityKind] = "PgSelectBuilder";
    fields;
    session;
    dialect;
    withList = [];
    distinct;
    constructor(config) {
        this.fields = config.fields;
        this.session = config.session;
        this.dialect = config.dialect;
        if (config.withList) {
            this.withList = config.withList;
        }
        this.distinct = config.distinct;
    }
    from(source) {
        const isPartialSelect = !!this.fields;
        let fields;
        if (this.fields) {
            fields = this.fields;
        } else if (is(source, Subquery)) {
            fields = Object.fromEntries(
                Object.keys(source[SubqueryConfig].selection).map((key) => [
                    key,
                    source[key],
                ])
            );
        } else if (is(source, PgViewBase)) {
            fields = source[ViewBaseConfig].selectedFields;
        } else if (is(source, SQL)) {
            fields = {};
        } else {
            fields = getTableColumns(source);
        }
        return new PgSelectBase({
            table: source,
            fields,
            isPartialSelect,
            session: this.session,
            dialect: this.dialect,
            withList: this.withList,
            distinct: this.distinct,
        });
    }
}

class PgSelectQueryBuilderBase extends TypedQueryBuilder {
    static [entityKind] = "PgSelectQueryBuilder";
    _;
    config;
    joinsNotNullableMap;
    tableName;
    isPartialSelect;
    session;
    dialect;
    constructor({
        table: table15,
        fields,
        isPartialSelect,
        session,
        dialect,
        withList,
        distinct,
    }) {
        super();
        this.config = {
            withList,
            table: table15,
            fields: { ...fields },
            distinct,
            setOperators: [],
        };
        this.isPartialSelect = isPartialSelect;
        this.session = session;
        this.dialect = dialect;
        this._ = {
            selectedFields: fields,
        };
        this.tableName = getTableLikeName(table15);
        this.joinsNotNullableMap =
            typeof this.tableName === "string"
                ? { [this.tableName]: true }
                : {};
    }
    createJoin(joinType) {
        return (table15, on) => {
            const baseTableName = this.tableName;
            const tableName = getTableLikeName(table15);
            if (
                typeof tableName === "string" &&
                this.config.joins?.some((join) => join.alias === tableName)
            ) {
                throw new Error(
                    `Alias "${tableName}" is already used in this query`
                );
            }
            if (!this.isPartialSelect) {
                if (
                    Object.keys(this.joinsNotNullableMap).length === 1 &&
                    typeof baseTableName === "string"
                ) {
                    this.config.fields = {
                        [baseTableName]: this.config.fields,
                    };
                }
                if (typeof tableName === "string" && !is(table15, SQL)) {
                    const selection = is(table15, Subquery)
                        ? table15[SubqueryConfig].selection
                        : is(table15, View)
                          ? table15[ViewBaseConfig].selectedFields
                          : table15[Table.Symbol.Columns];
                    this.config.fields[tableName] = selection;
                }
            }
            if (typeof on === "function") {
                on = on(
                    new Proxy(
                        this.config.fields,
                        new SelectionProxyHandler({
                            sqlAliasedBehavior: "sql",
                            sqlBehavior: "sql",
                        })
                    )
                );
            }
            if (!this.config.joins) {
                this.config.joins = [];
            }
            this.config.joins.push({
                on,
                table: table15,
                joinType,
                alias: tableName,
            });
            if (typeof tableName === "string") {
                switch (joinType) {
                    case "left": {
                        this.joinsNotNullableMap[tableName] = false;
                        break;
                    }
                    case "right": {
                        this.joinsNotNullableMap = Object.fromEntries(
                            Object.entries(this.joinsNotNullableMap).map(
                                ([key]) => [key, false]
                            )
                        );
                        this.joinsNotNullableMap[tableName] = true;
                        break;
                    }
                    case "inner": {
                        this.joinsNotNullableMap[tableName] = true;
                        break;
                    }
                    case "full": {
                        this.joinsNotNullableMap = Object.fromEntries(
                            Object.entries(this.joinsNotNullableMap).map(
                                ([key]) => [key, false]
                            )
                        );
                        this.joinsNotNullableMap[tableName] = false;
                        break;
                    }
                }
            }
            return this;
        };
    }
    leftJoin = this.createJoin("left");
    rightJoin = this.createJoin("right");
    innerJoin = this.createJoin("inner");
    fullJoin = this.createJoin("full");
    createSetOperator(type, isAll) {
        return (rightSelection) => {
            const rightSelect =
                typeof rightSelection === "function"
                    ? rightSelection(getPgSetOperators())
                    : rightSelection;
            if (
                !haveSameKeys(
                    this.getSelectedFields(),
                    rightSelect.getSelectedFields()
                )
            ) {
                throw new Error(
                    "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
                );
            }
            this.config.setOperators.push({ type, isAll, rightSelect });
            return this;
        };
    }
    union = this.createSetOperator("union", false);
    unionAll = this.createSetOperator("union", true);
    intersect = this.createSetOperator("intersect", false);
    intersectAll = this.createSetOperator("intersect", true);
    except = this.createSetOperator("except", false);
    exceptAll = this.createSetOperator("except", true);
    addSetOperators(setOperators) {
        this.config.setOperators.push(...setOperators);
        return this;
    }
    where(where) {
        if (typeof where === "function") {
            where = where(
                new Proxy(
                    this.config.fields,
                    new SelectionProxyHandler({
                        sqlAliasedBehavior: "sql",
                        sqlBehavior: "sql",
                    })
                )
            );
        }
        this.config.where = where;
        return this;
    }
    having(having) {
        if (typeof having === "function") {
            having = having(
                new Proxy(
                    this.config.fields,
                    new SelectionProxyHandler({
                        sqlAliasedBehavior: "sql",
                        sqlBehavior: "sql",
                    })
                )
            );
        }
        this.config.having = having;
        return this;
    }
    groupBy(...columns2) {
        if (typeof columns2[0] === "function") {
            const groupBy = columns2[0](
                new Proxy(
                    this.config.fields,
                    new SelectionProxyHandler({
                        sqlAliasedBehavior: "alias",
                        sqlBehavior: "sql",
                    })
                )
            );
            this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
        } else {
            this.config.groupBy = columns2;
        }
        return this;
    }
    orderBy(...columns2) {
        if (typeof columns2[0] === "function") {
            const orderBy = columns2[0](
                new Proxy(
                    this.config.fields,
                    new SelectionProxyHandler({
                        sqlAliasedBehavior: "alias",
                        sqlBehavior: "sql",
                    })
                )
            );
            const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
            if (this.config.setOperators.length > 0) {
                this.config.setOperators.at(-1).orderBy = orderByArray;
            } else {
                this.config.orderBy = orderByArray;
            }
        } else {
            const orderByArray = columns2;
            if (this.config.setOperators.length > 0) {
                this.config.setOperators.at(-1).orderBy = orderByArray;
            } else {
                this.config.orderBy = orderByArray;
            }
        }
        return this;
    }
    limit(limit) {
        if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).limit = limit;
        } else {
            this.config.limit = limit;
        }
        return this;
    }
    offset(offset) {
        if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).offset = offset;
        } else {
            this.config.offset = offset;
        }
        return this;
    }
    for(strength, config = {}) {
        this.config.lockingClause = { strength, config };
        return this;
    }
    getSQL() {
        return this.dialect.buildSelectQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(
            this.getSQL()
        );
        return rest;
    }
    as(alias3) {
        return new Proxy(
            new Subquery(this.getSQL(), this.config.fields, alias3),
            new SelectionProxyHandler({
                alias: alias3,
                sqlAliasedBehavior: "alias",
                sqlBehavior: "error",
            })
        );
    }
    getSelectedFields() {
        return new Proxy(
            this.config.fields,
            new SelectionProxyHandler({
                alias: this.tableName,
                sqlAliasedBehavior: "alias",
                sqlBehavior: "error",
            })
        );
    }
    $dynamic() {
        return this;
    }
}

class PgSelectBase extends PgSelectQueryBuilderBase {
    static [entityKind] = "PgSelect";
    _prepare(name) {
        const { session, config, dialect, joinsNotNullableMap } = this;
        if (!session) {
            throw new Error(
                "Cannot execute a query on a query builder. Please use a database instance instead."
            );
        }
        return tracer.startActiveSpan("drizzle.prepareQuery", () => {
            const fieldsList = orderSelectedFields(config.fields);
            const query = session.prepareQuery(
                dialect.sqlToQuery(this.getSQL()),
                fieldsList,
                name
            );
            query.joinsNotNullableMap = joinsNotNullableMap;
            return query;
        });
    }
    prepare(name) {
        return this._prepare(name);
    }
    execute = (placeholderValues) => {
        return tracer.startActiveSpan("drizzle.operation", () => {
            return this._prepare().execute(placeholderValues);
        });
    };
}
applyMixins(PgSelectBase, [QueryPromise]);
var getPgSetOperators = () => ({
    union,
    unionAll,
    intersect,
    intersectAll,
    except,
    exceptAll,
});
var union = createSetOperator("union", false);
var unionAll = createSetOperator("union", true);
var intersect = createSetOperator("intersect", false);
var intersectAll = createSetOperator("intersect", true);
var except = createSetOperator("except", false);
var exceptAll = createSetOperator("except", true);

// ../../node_modules/drizzle-orm/pg-core/query-builders/query-builder.js
class QueryBuilder {
    static [entityKind] = "PgQueryBuilder";
    dialect;
    $with(alias3) {
        const queryBuilder = this;
        return {
            as(qb) {
                if (typeof qb === "function") {
                    qb = qb(queryBuilder);
                }
                return new Proxy(
                    new WithSubquery(
                        qb.getSQL(),
                        qb.getSelectedFields(),
                        alias3,
                        true
                    ),
                    new SelectionProxyHandler({
                        alias: alias3,
                        sqlAliasedBehavior: "alias",
                        sqlBehavior: "error",
                    })
                );
            },
        };
    }
    with(...queries) {
        const self = this;
        function select2(fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: undefined,
                dialect: self.getDialect(),
                withList: queries,
            });
        }
        function selectDistinct(fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: undefined,
                dialect: self.getDialect(),
                distinct: true,
            });
        }
        function selectDistinctOn(on, fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: undefined,
                dialect: self.getDialect(),
                distinct: { on },
            });
        }
        return { select: select2, selectDistinct, selectDistinctOn };
    }
    select(fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: undefined,
            dialect: this.getDialect(),
        });
    }
    selectDistinct(fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: undefined,
            dialect: this.getDialect(),
            distinct: true,
        });
    }
    selectDistinctOn(on, fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: undefined,
            dialect: this.getDialect(),
            distinct: { on },
        });
    }
    getDialect() {
        if (!this.dialect) {
            this.dialect = new PgDialect();
        }
        return this.dialect;
    }
}

// ../../node_modules/drizzle-orm/pg-core/query-builders/refresh-materialized-view.js
class PgRefreshMaterializedView extends QueryPromise {
    constructor(view, session, dialect2) {
        super();
        this.session = session;
        this.dialect = dialect2;
        this.config = { view };
    }
    static [entityKind] = "PgRefreshMaterializedView";
    config;
    concurrently() {
        if (this.config.withNoData !== undefined) {
            throw new Error("Cannot use concurrently and withNoData together");
        }
        this.config.concurrently = true;
        return this;
    }
    withNoData() {
        if (this.config.concurrently !== undefined) {
            throw new Error("Cannot use concurrently and withNoData together");
        }
        this.config.withNoData = true;
        return this;
    }
    getSQL() {
        return this.dialect.buildRefreshMaterializedViewQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(
            this.getSQL()
        );
        return rest;
    }
    _prepare(name) {
        return tracer.startActiveSpan("drizzle.prepareQuery", () => {
            return this.session.prepareQuery(
                this.dialect.sqlToQuery(this.getSQL()),
                undefined,
                name
            );
        });
    }
    prepare(name) {
        return this._prepare(name);
    }
    execute = (placeholderValues) => {
        return tracer.startActiveSpan("drizzle.operation", () => {
            return this._prepare().execute(placeholderValues);
        });
    };
}

// ../../node_modules/drizzle-orm/pg-core/query-builders/update.js
class PgUpdateBuilder {
    constructor(table16, session, dialect2, withList) {
        this.table = table16;
        this.session = session;
        this.dialect = dialect2;
        this.withList = withList;
    }
    static [entityKind] = "PgUpdateBuilder";
    set(values) {
        return new PgUpdateBase(
            this.table,
            mapUpdateSet(this.table, values),
            this.session,
            this.dialect,
            this.withList
        );
    }
}

class PgUpdateBase extends QueryPromise {
    constructor(table16, set, session, dialect2, withList) {
        super();
        this.session = session;
        this.dialect = dialect2;
        this.config = { set, table: table16, withList };
    }
    static [entityKind] = "PgUpdate";
    config;
    where(where) {
        this.config.where = where;
        return this;
    }
    returning(fields = this.config.table[Table.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
    }
    getSQL() {
        return this.dialect.buildUpdateQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(
            this.getSQL()
        );
        return rest;
    }
    _prepare(name) {
        return this.session.prepareQuery(
            this.dialect.sqlToQuery(this.getSQL()),
            this.config.returning,
            name
        );
    }
    prepare(name) {
        return this._prepare(name);
    }
    execute = (placeholderValues) => {
        return this._prepare().execute(placeholderValues);
    };
    $dynamic() {
        return this;
    }
}

// ../../node_modules/drizzle-orm/pg-core/query-builders/query.js
class RelationalQueryBuilder {
    constructor(
        fullSchema,
        schema,
        tableNamesMap,
        table16,
        tableConfig,
        dialect2,
        session
    ) {
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table16;
        this.tableConfig = tableConfig;
        this.dialect = dialect2;
        this.session = session;
    }
    static [entityKind] = "PgRelationalQueryBuilder";
    findMany(config) {
        return new PgRelationalQuery(
            this.fullSchema,
            this.schema,
            this.tableNamesMap,
            this.table,
            this.tableConfig,
            this.dialect,
            this.session,
            config ? config : {},
            "many"
        );
    }
    findFirst(config) {
        return new PgRelationalQuery(
            this.fullSchema,
            this.schema,
            this.tableNamesMap,
            this.table,
            this.tableConfig,
            this.dialect,
            this.session,
            config ? { ...config, limit: 1 } : { limit: 1 },
            "first"
        );
    }
}

class PgRelationalQuery extends QueryPromise {
    constructor(
        fullSchema,
        schema,
        tableNamesMap,
        table16,
        tableConfig,
        dialect2,
        session,
        config,
        mode
    ) {
        super();
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table16;
        this.tableConfig = tableConfig;
        this.dialect = dialect2;
        this.session = session;
        this.config = config;
        this.mode = mode;
    }
    static [entityKind] = "PgRelationalQuery";
    _prepare(name) {
        return tracer.startActiveSpan("drizzle.prepareQuery", () => {
            const { query, builtQuery } = this._toSQL();
            return this.session.prepareQuery(
                builtQuery,
                undefined,
                name,
                (rawRows, mapColumnValue) => {
                    const rows = rawRows.map((row) =>
                        mapRelationalRow(
                            this.schema,
                            this.tableConfig,
                            row,
                            query.selection,
                            mapColumnValue
                        )
                    );
                    if (this.mode === "first") {
                        return rows[0];
                    }
                    return rows;
                }
            );
        });
    }
    prepare(name) {
        return this._prepare(name);
    }
    _getQuery() {
        return this.dialect.buildRelationalQueryWithoutPK({
            fullSchema: this.fullSchema,
            schema: this.schema,
            tableNamesMap: this.tableNamesMap,
            table: this.table,
            tableConfig: this.tableConfig,
            queryConfig: this.config,
            tableAlias: this.tableConfig.tsName,
        });
    }
    getSQL() {
        return this._getQuery().sql;
    }
    _toSQL() {
        const query = this._getQuery();
        const builtQuery = this.dialect.sqlToQuery(query.sql);
        return { query, builtQuery };
    }
    toSQL() {
        return this._toSQL().builtQuery;
    }
    execute() {
        return tracer.startActiveSpan("drizzle.operation", () => {
            return this._prepare().execute();
        });
    }
}

// ../../node_modules/drizzle-orm/pg-core/query-builders/raw.js
class PgRaw extends QueryPromise {
    constructor(execute, sql14, query, mapBatchResult) {
        super();
        this.execute = execute;
        this.sql = sql14;
        this.query = query;
        this.mapBatchResult = mapBatchResult;
    }
    static [entityKind] = "PgRaw";
    getSQL() {
        return this.sql;
    }
    getQuery() {
        return this.query;
    }
    mapResult(result, isFromBatch) {
        return isFromBatch ? this.mapBatchResult(result) : result;
    }
    _prepare() {
        return this;
    }
}

// ../../node_modules/drizzle-orm/pg-core/db.js
class PgDatabase {
    constructor(dialect2, session, schema) {
        this.dialect = dialect2;
        this.session = session;
        this._ = schema
            ? { schema: schema.schema, tableNamesMap: schema.tableNamesMap }
            : { schema: undefined, tableNamesMap: {} };
        this.query = {};
        if (this._.schema) {
            for (const [tableName, columns2] of Object.entries(this._.schema)) {
                this.query[tableName] = new RelationalQueryBuilder(
                    schema.fullSchema,
                    this._.schema,
                    this._.tableNamesMap,
                    schema.fullSchema[tableName],
                    columns2,
                    dialect2,
                    session
                );
            }
        }
    }
    static [entityKind] = "PgDatabase";
    query;
    $with(alias3) {
        return {
            as(qb) {
                if (typeof qb === "function") {
                    qb = qb(new QueryBuilder());
                }
                return new Proxy(
                    new WithSubquery(
                        qb.getSQL(),
                        qb.getSelectedFields(),
                        alias3,
                        true
                    ),
                    new SelectionProxyHandler({
                        alias: alias3,
                        sqlAliasedBehavior: "alias",
                        sqlBehavior: "error",
                    })
                );
            },
        };
    }
    with(...queries) {
        const self = this;
        function select2(fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: self.session,
                dialect: self.dialect,
                withList: queries,
            });
        }
        function selectDistinct(fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: self.session,
                dialect: self.dialect,
                withList: queries,
                distinct: true,
            });
        }
        function selectDistinctOn(on, fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: self.session,
                dialect: self.dialect,
                withList: queries,
                distinct: { on },
            });
        }
        function update(table16) {
            return new PgUpdateBuilder(
                table16,
                self.session,
                self.dialect,
                queries
            );
        }
        function insert(table16) {
            return new PgInsertBuilder(
                table16,
                self.session,
                self.dialect,
                queries
            );
        }
        function delete_(table16) {
            return new PgDeleteBase(
                table16,
                self.session,
                self.dialect,
                queries
            );
        }
        return {
            select: select2,
            selectDistinct,
            selectDistinctOn,
            update,
            insert,
            delete: delete_,
        };
    }
    select(fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: this.session,
            dialect: this.dialect,
        });
    }
    selectDistinct(fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: this.session,
            dialect: this.dialect,
            distinct: true,
        });
    }
    selectDistinctOn(on, fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: this.session,
            dialect: this.dialect,
            distinct: { on },
        });
    }
    update(table16) {
        return new PgUpdateBuilder(table16, this.session, this.dialect);
    }
    insert(table16) {
        return new PgInsertBuilder(table16, this.session, this.dialect);
    }
    delete(table16) {
        return new PgDeleteBase(table16, this.session, this.dialect);
    }
    refreshMaterializedView(view) {
        return new PgRefreshMaterializedView(view, this.session, this.dialect);
    }
    execute(query2) {
        const sql14 = query2.getSQL();
        const builtQuery = this.dialect.sqlToQuery(sql14);
        const prepared = this.session.prepareQuery(
            builtQuery,
            undefined,
            undefined
        );
        return new PgRaw(
            () => prepared.execute(),
            sql14,
            builtQuery,
            (result) => prepared.mapResult(result, false)
        );
    }
    transaction(transaction, config) {
        return this.session.transaction(transaction, config);
    }
}

// ../../node_modules/drizzle-orm/pg-core/session.js
class PgPreparedQuery {
    constructor(query2) {
        this.query = query2;
    }
    getQuery() {
        return this.query;
    }
    mapResult(response, _isFromBatch) {
        return response;
    }
    static [entityKind] = "PgPreparedQuery";
    joinsNotNullableMap;
}

class PgSession {
    constructor(dialect2) {
        this.dialect = dialect2;
    }
    static [entityKind] = "PgSession";
    execute(query2) {
        return tracer.startActiveSpan("drizzle.operation", () => {
            const prepared = tracer.startActiveSpan(
                "drizzle.prepareQuery",
                () => {
                    return this.prepareQuery(
                        this.dialect.sqlToQuery(query2),
                        undefined,
                        undefined
                    );
                }
            );
            return prepared.execute();
        });
    }
    all(query2) {
        return this.prepareQuery(
            this.dialect.sqlToQuery(query2),
            undefined,
            undefined
        ).all();
    }
}

class PgTransaction extends PgDatabase {
    constructor(dialect2, session, schema, nestedIndex = 0) {
        super(dialect2, session, schema);
        this.schema = schema;
        this.nestedIndex = nestedIndex;
    }
    static [entityKind] = "PgTransaction";
    rollback() {
        throw new TransactionRollbackError();
    }
    getTransactionConfigSQL(config) {
        const chunks = [];
        if (config.isolationLevel) {
            chunks.push(`isolation level ${config.isolationLevel}`);
        }
        if (config.accessMode) {
            chunks.push(config.accessMode);
        }
        if (typeof config.deferrable === "boolean") {
            chunks.push(config.deferrable ? "deferrable" : "not deferrable");
        }
        return sql.raw(chunks.join(" "));
    }
    setTransaction(config) {
        return this.session.execute(
            sql`set transaction ${this.getTransactionConfigSQL(config)}`
        );
    }
}

// src/schema.ts
var defaultFields = {
    id: serial("id").primaryKey(),
    dateAdded: timestamp("date_added").notNull().defaultNow(),
    lastModified: timestamp("last_modified").notNull().defaultNow(),
};
var transactionTypeTable = pgTable("transaction_type", {
    ...defaultFields,
    description: text("description").unique().notNull(),
    name: text("name").unique().notNull(),
});
var transactionsTable = pgTable("transaction", {
    ...defaultFields,
    agentNumber: text("agent_number"),
    balance: integer("balance"),
    dateTime: timestamp("date_time").notNull(),
    interest: integer("interest").default(0),
    location: text("location"),
    messageId: integer("source_message_id").notNull(),
    subject: text("subject").notNull(),
    subjectAccount: text("subject_account"),
    subjectPhoneNumber: text("subject_phone_number"),
    transactionAmount: integer("transaction_amount").notNull(),
    transactionCode: text("transaction_code").unique().notNull(),
    transactionCost: integer("transaction_cost").default(0),
    type: integer("type")
        .references(() => transactionTypeTable.id)
        .notNull(),
    userId: integer("user_id").references(() => usersTable.id),
});
var usersTable = pgTable("user", {
    ...defaultFields,
    email: text("email").unique().notNull(),
    password: text("password").unique().notNull(),
    phoneNumber: text("phone_number").unique(),
    username: text("username").unique().notNull(),
});
var tagsTable = pgTable("tags", {
    ...defaultFields,
    description: text("description"),
    name: text("name").notNull(),
    userId: integer("user_id").references(() => usersTable.id),
});
var transactionTagsTable = pgTable("transaction_tags_table", {
    ...defaultFields,
    tagId: integer("tag_id").references(() => tagsTable.id),
    transactionId: integer("transaction_id").references(
        () => transactionsTable.id
    ),
});
// ../../node_modules/postgres/src/index.js
import os from "os";
import fs from "fs";

// ../../node_modules/postgres/src/query.js
var cachedError = function (xs) {
    if (originCache.has(xs)) return originCache.get(xs);
    const x = Error.stackTraceLimit;
    Error.stackTraceLimit = 4;
    originCache.set(xs, new Error());
    Error.stackTraceLimit = x;
    return originCache.get(xs);
};
var originCache = new Map();
var originStackCache = new Map();
var originError = Symbol("OriginError");
var CLOSE = {};

class Query extends Promise {
    constructor(strings, args, handler, canceller, options = {}) {
        let resolve, reject;
        super((a, b) => {
            resolve = a;
            reject = b;
        });
        this.tagged = Array.isArray(strings.raw);
        this.strings = strings;
        this.args = args;
        this.handler = handler;
        this.canceller = canceller;
        this.options = options;
        this.state = null;
        this.statement = null;
        this.resolve = (x) => ((this.active = false), resolve(x));
        this.reject = (x) => ((this.active = false), reject(x));
        this.active = false;
        this.cancelled = null;
        this.executed = false;
        this.signature = "";
        this[originError] = this.handler.debug
            ? new Error()
            : this.tagged && cachedError(this.strings);
    }
    get origin() {
        return (
            (this.handler.debug
                ? this[originError].stack
                : this.tagged && originStackCache.has(this.strings)
                  ? originStackCache.get(this.strings)
                  : originStackCache
                        .set(this.strings, this[originError].stack)
                        .get(this.strings)) || ""
        );
    }
    static get [Symbol.species]() {
        return Promise;
    }
    cancel() {
        return (
            this.canceller && (this.canceller(this), (this.canceller = null))
        );
    }
    simple() {
        this.options.simple = true;
        this.options.prepare = false;
        return this;
    }
    async readable() {
        this.simple();
        this.streaming = true;
        return this;
    }
    async writable() {
        this.simple();
        this.streaming = true;
        return this;
    }
    cursor(rows = 1, fn) {
        this.options.simple = false;
        if (typeof rows === "function") {
            fn = rows;
            rows = 1;
        }
        this.cursorRows = rows;
        if (typeof fn === "function") return (this.cursorFn = fn), this;
        let prev;
        return {
            [Symbol.asyncIterator]: () => ({
                next: () => {
                    if (this.executed && !this.active) return { done: true };
                    prev && prev();
                    const promise = new Promise((resolve, reject) => {
                        this.cursorFn = (value) => {
                            resolve({ value, done: false });
                            return new Promise((r) => (prev = r));
                        };
                        this.resolve = () => (
                            (this.active = false), resolve({ done: true })
                        );
                        this.reject = (x) => ((this.active = false), reject(x));
                    });
                    this.execute();
                    return promise;
                },
                return() {
                    prev && prev(CLOSE);
                    return { done: true };
                },
            }),
        };
    }
    describe() {
        this.options.simple = false;
        this.onlyDescribe = this.options.prepare = true;
        return this;
    }
    stream() {
        throw new Error(".stream has been renamed to .forEach");
    }
    forEach(fn) {
        this.forEachFn = fn;
        this.handle();
        return this;
    }
    raw() {
        this.isRaw = true;
        return this;
    }
    values() {
        this.isRaw = "values";
        return this;
    }
    async handle() {
        !this.executed &&
            (this.executed = true) &&
            (await 1) &&
            this.handler(this);
    }
    execute() {
        this.handle();
        return this;
    }
    then() {
        this.handle();
        return super.then.apply(this, arguments);
    }
    catch() {
        this.handle();
        return super.catch.apply(this, arguments);
    }
    finally() {
        this.handle();
        return super.finally.apply(this, arguments);
    }
}

// ../../node_modules/postgres/src/errors.js
var connection = function (x, options, socket) {
    const { host, port } = socket || options;
    const error = Object.assign(
        new Error("write " + x + " " + (options.path || host + ":" + port)),
        {
            code: x,
            errno: x,
            address: options.path || host,
        },
        options.path ? {} : { port }
    );
    Error.captureStackTrace(error, connection);
    return error;
};
var postgres = function (x) {
    const error = new PostgresError(x);
    Error.captureStackTrace(error, postgres);
    return error;
};
var generic = function (code, message) {
    const error = Object.assign(new Error(code + ": " + message), { code });
    Error.captureStackTrace(error, generic);
    return error;
};
var notSupported = function (x) {
    const error = Object.assign(new Error(x + " (B) is not supported"), {
        code: "MESSAGE_NOT_SUPPORTED",
        name: x,
    });
    Error.captureStackTrace(error, notSupported);
    return error;
};

class PostgresError extends Error {
    constructor(x) {
        super(x.message);
        this.name = this.constructor.name;
        Object.assign(this, x);
    }
}
var Errors = {
    connection,
    postgres,
    generic,
    notSupported,
};

// ../../node_modules/postgres/src/types.js
function handleValue(x, parameters, types, options) {
    let value = x instanceof Parameter ? x.value : x;
    if (value === undefined) {
        x instanceof Parameter
            ? (x.value = options.transform.undefined)
            : (value = x = options.transform.undefined);
        if (value === undefined)
            throw Errors.generic(
                "UNDEFINED_VALUE",
                "Undefined values are not allowed"
            );
    }
    return (
        "$" +
        types.push(
            x instanceof Parameter
                ? (parameters.push(x.value),
                  x.array
                      ? x.array[x.type || inferType(x.value)] ||
                        x.type ||
                        firstIsString(x.value)
                      : x.type)
                : (parameters.push(x), inferType(x))
        )
    );
}
function stringify(q, string, value, parameters, types, options) {
    for (let i = 1; i < q.strings.length; i++) {
        string +=
            stringifyValue(string, value, parameters, types, options) +
            q.strings[i];
        value = q.args[i];
    }
    return string;
}
var stringifyValue = function (string, value, parameters, types, o) {
    return value instanceof Builder
        ? value.build(string, parameters, types, o)
        : value instanceof Query
          ? fragment(value, parameters, types, o)
          : value instanceof Identifier
            ? value.value
            : value && value[0] instanceof Query
              ? value.reduce(
                    (acc, x) => acc + " " + fragment(x, parameters, types, o),
                    ""
                )
              : handleValue(value, parameters, types, o);
};
var fragment = function (q, parameters, types, options) {
    q.fragment = true;
    return stringify(q, q.strings[0], q.args[0], parameters, types, options);
};
var valuesBuilder = function (first, parameters, types, columns2, options) {
    return first
        .map(
            (row) =>
                "(" +
                columns2
                    .map((column9) =>
                        stringifyValue(
                            "values",
                            row[column9],
                            parameters,
                            types,
                            options
                        )
                    )
                    .join(",") +
                ")"
        )
        .join(",");
};
var values = function (first, rest, parameters, types, options) {
    const multi = Array.isArray(first[0]);
    const columns2 = rest.length
        ? rest.flat()
        : Object.keys(multi ? first[0] : first);
    return valuesBuilder(
        multi ? first : [first],
        parameters,
        types,
        columns2,
        options
    );
};
var select2 = function (first, rest, parameters, types, options) {
    typeof first === "string" && (first = [first].concat(rest));
    if (Array.isArray(first)) return escapeIdentifiers(first, options);
    let value;
    const columns2 = rest.length ? rest.flat() : Object.keys(first);
    return columns2
        .map((x) => {
            value = first[x];
            return (
                (value instanceof Query
                    ? fragment(value, parameters, types, options)
                    : value instanceof Identifier
                      ? value.value
                      : handleValue(value, parameters, types, options)) +
                " as " +
                escapeIdentifier(
                    options.transform.column.to
                        ? options.transform.column.to(x)
                        : x
                )
            );
        })
        .join(",");
};
var notTagged = function () {
    throw Errors.generic(
        "NOT_TAGGED_CALL",
        "Query not called as a tagged template literal"
    );
};
var firstIsString = function (x) {
    if (Array.isArray(x)) return firstIsString(x[0]);
    return typeof x === "string" ? 1009 : 0;
};
var typeHandlers = function (types) {
    return Object.keys(types).reduce(
        (acc, k) => {
            types[k].from &&
                []
                    .concat(types[k].from)
                    .forEach((x) => (acc.parsers[x] = types[k].parse));
            if (types[k].serialize) {
                acc.serializers[types[k].to] = types[k].serialize;
                types[k].from &&
                    []
                        .concat(types[k].from)
                        .forEach(
                            (x) => (acc.serializers[x] = types[k].serialize)
                        );
            }
            return acc;
        },
        { parsers: {}, serializers: {} }
    );
};
var escapeIdentifiers = function (xs, { transform: { column: column9 } }) {
    return xs
        .map((x) => escapeIdentifier(column9.to ? column9.to(x) : x))
        .join(",");
};
var arrayEscape = function (x) {
    return x.replace(escapeBackslash, "\\\\").replace(escapeQuote, '\\"');
};
var arrayParserLoop = function (s, x, parser, typarray) {
    const xs = [];
    const delimiter = typarray === 1020 ? ";" : ",";
    for (; s.i < x.length; s.i++) {
        s.char = x[s.i];
        if (s.quoted) {
            if (s.char === "\\") {
                s.str += x[++s.i];
            } else if (s.char === '"') {
                xs.push(parser ? parser(s.str) : s.str);
                s.str = "";
                s.quoted = x[s.i + 1] === '"';
                s.last = s.i + 2;
            } else {
                s.str += s.char;
            }
        } else if (s.char === '"') {
            s.quoted = true;
        } else if (s.char === "{") {
            s.last = ++s.i;
            xs.push(arrayParserLoop(s, x, parser, typarray));
        } else if (s.char === "}") {
            s.quoted = false;
            s.last < s.i &&
                xs.push(
                    parser ? parser(x.slice(s.last, s.i)) : x.slice(s.last, s.i)
                );
            s.last = s.i + 1;
            break;
        } else if (s.char === delimiter && s.p !== "}" && s.p !== '"') {
            xs.push(
                parser ? parser(x.slice(s.last, s.i)) : x.slice(s.last, s.i)
            );
            s.last = s.i + 1;
        }
        s.p = s.char;
    }
    s.last < s.i &&
        xs.push(
            parser ? parser(x.slice(s.last, s.i + 1)) : x.slice(s.last, s.i + 1)
        );
    return xs;
};
var createJsonTransform = function (fn) {
    return function jsonTransform(x, column9) {
        return typeof x === "object" &&
            x !== null &&
            (column9.type === 114 || column9.type === 3802)
            ? Array.isArray(x)
                ? x.map((x2) => jsonTransform(x2, column9))
                : Object.entries(x).reduce(
                      (acc, [k, v]) =>
                          Object.assign(acc, {
                              [fn(k)]: jsonTransform(v, column9),
                          }),
                      {}
                  )
            : x;
    };
};
var types = {
    string: {
        to: 25,
        from: null,
        serialize: (x) => "" + x,
    },
    number: {
        to: 0,
        from: [21, 23, 26, 700, 701],
        serialize: (x) => "" + x,
        parse: (x) => +x,
    },
    json: {
        to: 114,
        from: [114, 3802],
        serialize: (x) => JSON.stringify(x),
        parse: (x) => JSON.parse(x),
    },
    boolean: {
        to: 16,
        from: 16,
        serialize: (x) => (x === true ? "t" : "f"),
        parse: (x) => x === "t",
    },
    date: {
        to: 1184,
        from: [1082, 1114, 1184],
        serialize: (x) => (x instanceof Date ? x : new Date(x)).toISOString(),
        parse: (x) => new Date(x),
    },
    bytea: {
        to: 17,
        from: 17,
        serialize: (x) => "\\x" + Buffer.from(x).toString("hex"),
        parse: (x) => Buffer.from(x.slice(2), "hex"),
    },
};

class NotTagged {
    then() {
        notTagged();
    }
    catch() {
        notTagged();
    }
    finally() {
        notTagged();
    }
}

class Identifier extends NotTagged {
    constructor(value) {
        super();
        this.value = escapeIdentifier(value);
    }
}

class Parameter extends NotTagged {
    constructor(value, type, array2) {
        super();
        this.value = value;
        this.type = type;
        this.array = array2;
    }
}

class Builder extends NotTagged {
    constructor(first, rest) {
        super();
        this.first = first;
        this.rest = rest;
    }
    build(before, parameters, types2, options) {
        const keyword = builders
            .map(([x, fn]) => ({ fn, i: before.search(x) }))
            .sort((a, b) => a.i - b.i)
            .pop();
        return keyword.i === -1
            ? escapeIdentifiers(this.first, options)
            : keyword.fn(this.first, this.rest, parameters, types2, options);
    }
}
var defaultHandlers = typeHandlers(types);
var builders = Object.entries({
    values,
    in: (...xs) => {
        const x = values(...xs);
        return x === "()" ? "(null)" : x;
    },
    select: select2,
    as: select2,
    returning: select2,
    "\\(": select2,
    update(first, rest, parameters, types2, options) {
        return (rest.length ? rest.flat() : Object.keys(first)).map(
            (x) =>
                escapeIdentifier(
                    options.transform.column.to
                        ? options.transform.column.to(x)
                        : x
                ) +
                "=" +
                stringifyValue("values", first[x], parameters, types2, options)
        );
    },
    insert(first, rest, parameters, types2, options) {
        const columns2 = rest.length
            ? rest.flat()
            : Object.keys(Array.isArray(first) ? first[0] : first);
        return (
            "(" +
            escapeIdentifiers(columns2, options) +
            ")values" +
            valuesBuilder(
                Array.isArray(first) ? first : [first],
                parameters,
                types2,
                columns2,
                options
            )
        );
    },
}).map(([x, fn]) => [
    new RegExp("((?:^|[\\s(])" + x + "(?:$|[\\s(]))(?![\\s\\S]*\\1)", "i"),
    fn,
]);
var serializers = defaultHandlers.serializers;
var parsers = defaultHandlers.parsers;
var mergeUserTypes = function (types2) {
    const user = typeHandlers(types2 || {});
    return {
        serializers: Object.assign({}, serializers, user.serializers),
        parsers: Object.assign({}, parsers, user.parsers),
    };
};
var escapeIdentifier = function escape(str) {
    return '"' + str.replace(/"/g, '""').replace(/\./g, '"."') + '"';
};
var inferType = function inferType2(x) {
    return x instanceof Parameter
        ? x.type
        : x instanceof Date
          ? 1184
          : x instanceof Uint8Array
            ? 17
            : x === true || x === false
              ? 16
              : typeof x === "bigint"
                ? 20
                : Array.isArray(x)
                  ? inferType2(x[0])
                  : 0;
};
var escapeBackslash = /\\/g;
var escapeQuote = /"/g;
var arraySerializer = function arraySerializer2(
    xs,
    serializer,
    options,
    typarray
) {
    if (Array.isArray(xs) === false) return xs;
    if (!xs.length) return "{}";
    const first = xs[0];
    const delimiter = typarray === 1020 ? ";" : ",";
    if (Array.isArray(first) && !first.type)
        return (
            "{" +
            xs
                .map((x) => arraySerializer2(x, serializer, options, typarray))
                .join(delimiter) +
            "}"
        );
    return (
        "{" +
        xs
            .map((x) => {
                if (x === undefined) {
                    x = options.transform.undefined;
                    if (x === undefined)
                        throw Errors.generic(
                            "UNDEFINED_VALUE",
                            "Undefined values are not allowed"
                        );
                }
                return x === null
                    ? "null"
                    : '"' +
                          arrayEscape(
                              serializer
                                  ? serializer(x.type ? x.value : x)
                                  : "" + x
                          ) +
                          '"';
            })
            .join(delimiter) +
        "}"
    );
};
var arrayParserState = {
    i: 0,
    char: null,
    str: "",
    quoted: false,
    last: 0,
};
var arrayParser = function arrayParser2(x, parser, typarray) {
    arrayParserState.i = arrayParserState.last = 0;
    return arrayParserLoop(arrayParserState, x, parser, typarray);
};
var toCamel = (x) => {
    let str = x[0];
    for (let i = 1; i < x.length; i++)
        str += x[i] === "_" ? x[++i].toUpperCase() : x[i];
    return str;
};
var toPascal = (x) => {
    let str = x[0].toUpperCase();
    for (let i = 1; i < x.length; i++)
        str += x[i] === "_" ? x[++i].toUpperCase() : x[i];
    return str;
};
var toKebab = (x) => x.replace(/_/g, "-");
var fromCamel = (x) => x.replace(/([A-Z])/g, "_$1").toLowerCase();
var fromPascal = (x) =>
    (x.slice(0, 1) + x.slice(1).replace(/([A-Z])/g, "_$1")).toLowerCase();
var fromKebab = (x) => x.replace(/-/g, "_");
toCamel.column = { from: toCamel };
toCamel.value = { from: createJsonTransform(toCamel) };
fromCamel.column = { to: fromCamel };
var camel = { ...toCamel };
camel.column.to = fromCamel;
toPascal.column = { from: toPascal };
toPascal.value = { from: createJsonTransform(toPascal) };
fromPascal.column = { to: fromPascal };
var pascal = { ...toPascal };
pascal.column.to = fromPascal;
toKebab.column = { from: toKebab };
toKebab.value = { from: createJsonTransform(toKebab) };
fromKebab.column = { to: fromKebab };
var kebab = { ...toKebab };
kebab.column.to = fromKebab;

// ../../node_modules/postgres/src/connection.js
import net from "net";
import tls from "tls";
import crypto from "crypto";
import Stream from "stream";
import { performance } from "perf_hooks";

// ../../node_modules/postgres/src/result.js
class Result extends Array {
    constructor() {
        super();
        Object.defineProperties(this, {
            count: { value: null, writable: true },
            state: { value: null, writable: true },
            command: { value: null, writable: true },
            columns: { value: null, writable: true },
            statement: { value: null, writable: true },
        });
    }
    static get [Symbol.species]() {
        return Array;
    }
}

// ../../node_modules/postgres/src/queue.js
var Queue = function (initial = []) {
    let xs = initial.slice();
    let index = 0;
    return {
        get length() {
            return xs.length - index;
        },
        remove: (x) => {
            const index2 = xs.indexOf(x);
            return index2 === -1 ? null : (xs.splice(index2, 1), x);
        },
        push: (x) => (xs.push(x), x),
        shift: () => {
            const out = xs[index++];
            if (index === xs.length) {
                index = 0;
                xs = [];
            } else {
                xs[index - 1] = undefined;
            }
            return out;
        },
    };
};
var queue_default = Queue;

// ../../node_modules/postgres/src/bytes.js
var fit = function (x) {
    if (buffer.length - b.i < x) {
        const prev = buffer,
            length = prev.length;
        buffer = Buffer.allocUnsafe(length + (length >> 1) + x);
        prev.copy(buffer);
    }
};
var reset = function () {
    b.i = 0;
    return b;
};
var size = 256;
var buffer = Buffer.allocUnsafe(size);
var messages = "BCcDdEFfHPpQSX".split("").reduce((acc, x) => {
    const v = x.charCodeAt(0);
    acc[x] = () => {
        buffer[0] = v;
        b.i = 5;
        return b;
    };
    return acc;
}, {});
var b = Object.assign(reset, messages, {
    N: String.fromCharCode(0),
    i: 0,
    inc(x) {
        b.i += x;
        return b;
    },
    str(x) {
        const length = Buffer.byteLength(x);
        fit(length);
        b.i += buffer.write(x, b.i, length, "utf8");
        return b;
    },
    i16(x) {
        fit(2);
        buffer.writeUInt16BE(x, b.i);
        b.i += 2;
        return b;
    },
    i32(x, i) {
        if (i || i === 0) {
            buffer.writeUInt32BE(x, i);
            return b;
        }
        fit(4);
        buffer.writeUInt32BE(x, b.i);
        b.i += 4;
        return b;
    },
    z(x) {
        fit(x);
        buffer.fill(0, b.i, b.i + x);
        b.i += x;
        return b;
    },
    raw(x) {
        buffer = Buffer.concat([buffer.subarray(0, b.i), x]);
        b.i = buffer.length;
        return b;
    },
    end(at = 1) {
        buffer.writeUInt32BE(b.i - at, at);
        const out = buffer.subarray(0, b.i);
        b.i = 0;
        buffer = Buffer.allocUnsafe(size);
        return out;
    },
});
var bytes_default = b;

// ../../node_modules/postgres/src/connection.js
var Connection = function (
    options,
    queues = {},
    { onopen = noop, onend = noop, onclose = noop } = {}
) {
    const {
        ssl,
        max,
        user,
        host,
        port,
        database,
        parsers: parsers2,
        transform,
        onnotice,
        onnotify,
        onparameter,
        max_pipeline,
        keep_alive,
        backoff,
        target_session_attrs,
    } = options;
    const sent = queue_default(),
        id = uid++,
        backend = { pid: null, secret: null },
        idleTimer = timer(end, options.idle_timeout),
        lifeTimer = timer(end, options.max_lifetime),
        connectTimer = timer(connectTimedOut, options.connect_timeout);
    let socket = null,
        cancelMessage,
        result2 = new Result(),
        incoming = Buffer.alloc(0),
        needsTypes = options.fetch_types,
        backendParameters = {},
        statements = {},
        statementId = Math.random().toString(36).slice(2),
        statementCount = 1,
        closedDate = 0,
        remaining = 0,
        hostIndex = 0,
        retries = 0,
        length = 0,
        delay = 0,
        rows = 0,
        serverSignature = null,
        nextWriteTimer = null,
        terminated = false,
        incomings = null,
        results = null,
        initial = null,
        ending = null,
        stream = null,
        chunk = null,
        ended = null,
        nonce = null,
        query4 = null,
        final = null;
    const connection2 = {
        queue: queues.closed,
        idleTimer,
        connect(query5) {
            initial = query5 || true;
            reconnect();
        },
        terminate,
        execute,
        cancel,
        end,
        count: 0,
        id,
    };
    queues.closed && queues.closed.push(connection2);
    return connection2;
    async function createSocket() {
        let x;
        try {
            x = options.socket
                ? await Promise.resolve(options.socket(options))
                : new net.Socket();
        } catch (e) {
            error(e);
            return;
        }
        x.on("error", error);
        x.on("close", closed);
        x.on("drain", drain);
        return x;
    }
    async function cancel({ pid, secret }, resolve, reject) {
        try {
            cancelMessage = bytes_default()
                .i32(16)
                .i32(80877102)
                .i32(pid)
                .i32(secret)
                .end(16);
            await connect();
            socket.once("error", reject);
            socket.once("close", resolve);
        } catch (error2) {
            reject(error2);
        }
    }
    function execute(q) {
        if (terminated)
            return queryError(
                q,
                Errors.connection("CONNECTION_DESTROYED", options)
            );
        if (q.cancelled) return;
        try {
            q.state = backend;
            query4 ? sent.push(q) : ((query4 = q), (query4.active = true));
            build(q);
            return (
                write(toBuffer(q)) &&
                !q.describeFirst &&
                !q.cursorFn &&
                sent.length < max_pipeline &&
                (!q.options.onexecute || q.options.onexecute(connection2))
            );
        } catch (error2) {
            sent.length === 0 && write(Sync);
            errored(error2);
            return true;
        }
    }
    function toBuffer(q) {
        if (q.parameters.length >= 65534)
            throw Errors.generic(
                "MAX_PARAMETERS_EXCEEDED",
                "Max number of parameters (65534) exceeded"
            );
        return q.options.simple
            ? bytes_default()
                  .Q()
                  .str(q.statement.string + bytes_default.N)
                  .end()
            : q.describeFirst
              ? Buffer.concat([describe(q), Flush])
              : q.prepare
                ? q.prepared
                    ? prepared(q)
                    : Buffer.concat([describe(q), prepared(q)])
                : unnamed(q);
    }
    function describe(q) {
        return Buffer.concat([
            Parse(
                q.statement.string,
                q.parameters,
                q.statement.types,
                q.statement.name
            ),
            Describe("S", q.statement.name),
        ]);
    }
    function prepared(q) {
        return Buffer.concat([
            Bind(
                q.parameters,
                q.statement.types,
                q.statement.name,
                q.cursorName
            ),
            q.cursorFn ? Execute("", q.cursorRows) : ExecuteUnnamed,
        ]);
    }
    function unnamed(q) {
        return Buffer.concat([
            Parse(q.statement.string, q.parameters, q.statement.types),
            DescribeUnnamed,
            prepared(q),
        ]);
    }
    function build(q) {
        const parameters = [],
            types3 = [];
        const string = stringify(
            q,
            q.strings[0],
            q.args[0],
            parameters,
            types3,
            options
        );
        !q.tagged &&
            q.args.forEach((x) => handleValue(x, parameters, types3, options));
        q.prepare =
            options.prepare &&
            ("prepare" in q.options ? q.options.prepare : true);
        q.string = string;
        q.signature = q.prepare && types3 + string;
        q.onlyDescribe && delete statements[q.signature];
        q.parameters = q.parameters || parameters;
        q.prepared = q.prepare && q.signature in statements;
        q.describeFirst = q.onlyDescribe || (parameters.length && !q.prepared);
        q.statement = q.prepared
            ? statements[q.signature]
            : {
                  string,
                  types: types3,
                  name: q.prepare ? statementId + statementCount++ : "",
              };
        typeof options.debug === "function" &&
            options.debug(id, string, parameters, types3);
    }
    function write(x, fn) {
        chunk = chunk ? Buffer.concat([chunk, x]) : Buffer.from(x);
        if (fn || chunk.length >= 1024) return nextWrite(fn);
        nextWriteTimer === null && (nextWriteTimer = setImmediate(nextWrite));
        return true;
    }
    function nextWrite(fn) {
        const x = socket.write(chunk, fn);
        nextWriteTimer !== null && clearImmediate(nextWriteTimer);
        chunk = nextWriteTimer = null;
        return x;
    }
    function connectTimedOut() {
        errored(Errors.connection("CONNECT_TIMEOUT", options, socket));
        socket.destroy();
    }
    async function secure() {
        write(SSLRequest);
        const canSSL = await new Promise((r) =>
            socket.once("data", (x) => r(x[0] === 83))
        );
        if (!canSSL && ssl === "prefer") return connected();
        socket.removeAllListeners();
        socket = tls.connect({
            socket,
            servername: net.isIP(socket.host) ? undefined : socket.host,
            ...(ssl === "require" || ssl === "allow" || ssl === "prefer"
                ? { rejectUnauthorized: false }
                : ssl === "verify-full"
                  ? {}
                  : typeof ssl === "object"
                    ? ssl
                    : {}),
        });
        socket.on("secureConnect", connected);
        socket.on("error", error);
        socket.on("close", closed);
        socket.on("drain", drain);
    }
    function drain() {
        !query4 && onopen(connection2);
    }
    function data(x) {
        if (incomings) {
            incomings.push(x);
            remaining -= x.length;
            if (remaining >= 0) return;
        }
        incoming = incomings
            ? Buffer.concat(incomings, length - remaining)
            : incoming.length === 0
              ? x
              : Buffer.concat([incoming, x], incoming.length + x.length);
        while (incoming.length > 4) {
            length = incoming.readUInt32BE(1);
            if (length >= incoming.length) {
                remaining = length - incoming.length;
                incomings = [incoming];
                break;
            }
            try {
                handle(incoming.subarray(0, length + 1));
            } catch (e) {
                query4 &&
                    (query4.cursorFn || query4.describeFirst) &&
                    write(Sync);
                errored(e);
            }
            incoming = incoming.subarray(length + 1);
            remaining = 0;
            incomings = null;
        }
    }
    async function connect() {
        terminated = false;
        backendParameters = {};
        socket || (socket = await createSocket());
        if (!socket) return;
        connectTimer.start();
        if (options.socket) return ssl ? secure() : connected();
        socket.on("connect", ssl ? secure : connected);
        if (options.path) return socket.connect(options.path);
        socket.ssl = ssl;
        socket.connect(port[hostIndex], host[hostIndex]);
        socket.host = host[hostIndex];
        socket.port = port[hostIndex];
        hostIndex = (hostIndex + 1) % port.length;
    }
    function reconnect() {
        setTimeout(
            connect,
            closedDate ? closedDate + delay - performance.now() : 0
        );
    }
    function connected() {
        try {
            statements = {};
            needsTypes = options.fetch_types;
            statementId = Math.random().toString(36).slice(2);
            statementCount = 1;
            lifeTimer.start();
            socket.on("data", data);
            keep_alive &&
                socket.setKeepAlive &&
                socket.setKeepAlive(true, 1000 * keep_alive);
            const s = StartupMessage();
            write(s);
        } catch (err) {
            error(err);
        }
    }
    function error(err) {
        if (
            connection2.queue === queues.connecting &&
            options.host[retries + 1]
        )
            return;
        errored(err);
        while (sent.length) queryError(sent.shift(), err);
    }
    function errored(err) {
        stream && (stream.destroy(err), (stream = null));
        query4 && queryError(query4, err);
        initial && (queryError(initial, err), (initial = null));
    }
    function queryError(query5, err) {
        Object.defineProperties(err, {
            stack: {
                value: err.stack + query5.origin.replace(/.*\n/, "\n"),
                enumerable: options.debug,
            },
            query: { value: query5.string, enumerable: options.debug },
            parameters: { value: query5.parameters, enumerable: options.debug },
            args: { value: query5.args, enumerable: options.debug },
            types: {
                value: query5.statement && query5.statement.types,
                enumerable: options.debug,
            },
        });
        query5.reject(err);
    }
    function end() {
        return (
            ending ||
            (!connection2.reserved && onend(connection2),
            !connection2.reserved && !initial && !query4 && sent.length === 0
                ? (terminate(),
                  new Promise((r) =>
                      socket && socket.readyState !== "closed"
                          ? socket.once("close", r)
                          : r()
                  ))
                : (ending = new Promise((r) => (ended = r))))
        );
    }
    function terminate() {
        terminated = true;
        if (stream || query4 || initial || sent.length)
            error(Errors.connection("CONNECTION_DESTROYED", options));
        clearImmediate(nextWriteTimer);
        if (socket) {
            socket.removeListener("data", data);
            socket.removeListener("connect", connected);
            socket.readyState === "open" &&
                socket.end(bytes_default().X().end());
        }
        ended && (ended(), (ending = ended = null));
    }
    async function closed(hadError) {
        incoming = Buffer.alloc(0);
        remaining = 0;
        incomings = null;
        clearImmediate(nextWriteTimer);
        socket.removeListener("data", data);
        socket.removeListener("connect", connected);
        idleTimer.cancel();
        lifeTimer.cancel();
        connectTimer.cancel();
        socket.removeAllListeners();
        socket = null;
        if (initial) return reconnect();
        !hadError &&
            (query4 || sent.length) &&
            error(Errors.connection("CONNECTION_CLOSED", options, socket));
        closedDate = performance.now();
        hadError && options.shared.retries++;
        delay =
            (typeof backoff === "function"
                ? backoff(options.shared.retries)
                : backoff) * 1000;
        onclose(
            connection2,
            Errors.connection("CONNECTION_CLOSED", options, socket)
        );
    }
    function handle(xs, x = xs[0]) {
        (x === 68
            ? DataRow
            : x === 100
              ? CopyData
              : x === 65
                ? NotificationResponse
                : x === 83
                  ? ParameterStatus
                  : x === 90
                    ? ReadyForQuery
                    : x === 67
                      ? CommandComplete
                      : x === 50
                        ? BindComplete
                        : x === 49
                          ? ParseComplete
                          : x === 116
                            ? ParameterDescription
                            : x === 84
                              ? RowDescription
                              : x === 82
                                ? Authentication
                                : x === 110
                                  ? NoData
                                  : x === 75
                                    ? BackendKeyData
                                    : x === 69
                                      ? ErrorResponse
                                      : x === 115
                                        ? PortalSuspended
                                        : x === 51
                                          ? CloseComplete
                                          : x === 71
                                            ? CopyInResponse
                                            : x === 78
                                              ? NoticeResponse
                                              : x === 72
                                                ? CopyOutResponse
                                                : x === 99
                                                  ? CopyDone
                                                  : x === 73
                                                    ? EmptyQueryResponse
                                                    : x === 86
                                                      ? FunctionCallResponse
                                                      : x === 118
                                                        ? NegotiateProtocolVersion
                                                        : x === 87
                                                          ? CopyBothResponse
                                                          : UnknownMessage)(xs);
    }
    function DataRow(x) {
        let index = 7;
        let length2;
        let column9;
        let value;
        const row = query4.isRaw
            ? new Array(query4.statement.columns.length)
            : {};
        for (let i = 0; i < query4.statement.columns.length; i++) {
            column9 = query4.statement.columns[i];
            length2 = x.readInt32BE(index);
            index += 4;
            value =
                length2 === -1
                    ? null
                    : query4.isRaw === true
                      ? x.subarray(index, (index += length2))
                      : column9.parser === undefined
                        ? x.toString("utf8", index, (index += length2))
                        : column9.parser.array === true
                          ? column9.parser(
                                x.toString(
                                    "utf8",
                                    index + 1,
                                    (index += length2)
                                )
                            )
                          : column9.parser(
                                x.toString("utf8", index, (index += length2))
                            );
            query4.isRaw
                ? (row[i] =
                      query4.isRaw === true
                          ? value
                          : transform.value.from
                            ? transform.value.from(value, column9)
                            : value)
                : (row[column9.name] = transform.value.from
                      ? transform.value.from(value, column9)
                      : value);
        }
        query4.forEachFn
            ? query4.forEachFn(
                  transform.row.from ? transform.row.from(row) : row,
                  result2
              )
            : (result2[rows++] = transform.row.from
                  ? transform.row.from(row)
                  : row);
    }
    function ParameterStatus(x) {
        const [k, v] = x
            .toString("utf8", 5, x.length - 1)
            .split(bytes_default.N);
        backendParameters[k] = v;
        if (options.parameters[k] !== v) {
            options.parameters[k] = v;
            onparameter && onparameter(k, v);
        }
    }
    function ReadyForQuery(x) {
        query4 && query4.options.simple && query4.resolve(results || result2);
        query4 = results = null;
        result2 = new Result();
        connectTimer.cancel();
        if (initial) {
            if (target_session_attrs) {
                if (
                    !backendParameters.in_hot_standby ||
                    !backendParameters.default_transaction_read_only
                )
                    return fetchState();
                else if (tryNext(target_session_attrs, backendParameters))
                    return terminate();
            }
            if (needsTypes) {
                initial === true && (initial = null);
                return fetchArrayTypes();
            }
            initial !== true && execute(initial);
            options.shared.retries = retries = 0;
            initial = null;
            return;
        }
        while (
            sent.length &&
            (query4 = sent.shift()) &&
            ((query4.active = true), query4.cancelled)
        )
            Connection(options).cancel(
                query4.state,
                query4.cancelled.resolve,
                query4.cancelled.reject
            );
        if (query4) return;
        connection2.reserved
            ? !connection2.reserved.release && x[5] === 73
                ? ending
                    ? terminate()
                    : ((connection2.reserved = null), onopen(connection2))
                : connection2.reserved()
            : ending
              ? terminate()
              : onopen(connection2);
    }
    function CommandComplete(x) {
        rows = 0;
        for (let i = x.length - 1; i > 0; i--) {
            if (x[i] === 32 && x[i + 1] < 58 && result2.count === null)
                result2.count = +x.toString("utf8", i + 1, x.length - 1);
            if (x[i - 1] >= 65) {
                result2.command = x.toString("utf8", 5, i);
                result2.state = backend;
                break;
            }
        }
        final && (final(), (final = null));
        if (result2.command === "BEGIN" && max !== 1 && !connection2.reserved)
            return errored(
                Errors.generic(
                    "UNSAFE_TRANSACTION",
                    "Only use sql.begin, sql.reserved or max: 1"
                )
            );
        if (query4.options.simple) return BindComplete();
        if (query4.cursorFn) {
            result2.count && query4.cursorFn(result2);
            write(Sync);
        }
        query4.resolve(result2);
    }
    function ParseComplete() {
        query4.parsing = false;
    }
    function BindComplete() {
        !result2.statement && (result2.statement = query4.statement);
        result2.columns = query4.statement.columns;
    }
    function ParameterDescription(x) {
        const length2 = x.readUInt16BE(5);
        for (let i = 0; i < length2; ++i)
            !query4.statement.types[i] &&
                (query4.statement.types[i] = x.readUInt32BE(7 + i * 4));
        query4.prepare && (statements[query4.signature] = query4.statement);
        query4.describeFirst &&
            !query4.onlyDescribe &&
            (write(prepared(query4)), (query4.describeFirst = false));
    }
    function RowDescription(x) {
        if (result2.command) {
            results = results || [result2];
            results.push((result2 = new Result()));
            result2.count = null;
            query4.statement.columns = null;
        }
        const length2 = x.readUInt16BE(5);
        let index = 7;
        let start;
        query4.statement.columns = Array(length2);
        for (let i = 0; i < length2; ++i) {
            start = index;
            while (x[index++] !== 0);
            const table16 = x.readUInt32BE(index);
            const number = x.readUInt16BE(index + 4);
            const type = x.readUInt32BE(index + 6);
            query4.statement.columns[i] = {
                name: transform.column.from
                    ? transform.column.from(
                          x.toString("utf8", start, index - 1)
                      )
                    : x.toString("utf8", start, index - 1),
                parser: parsers2[type],
                table: table16,
                number,
                type,
            };
            index += 18;
        }
        result2.statement = query4.statement;
        if (query4.onlyDescribe)
            return query4.resolve(query4.statement), write(Sync);
    }
    async function Authentication(x, type = x.readUInt32BE(5)) {
        (type === 3
            ? AuthenticationCleartextPassword
            : type === 5
              ? AuthenticationMD5Password
              : type === 10
                ? SASL
                : type === 11
                  ? SASLContinue
                  : type === 12
                    ? SASLFinal
                    : type !== 0
                      ? UnknownAuth
                      : noop)(x, type);
    }
    async function AuthenticationCleartextPassword() {
        const payload = await Pass();
        write(bytes_default().p().str(payload).z(1).end());
    }
    async function AuthenticationMD5Password(x) {
        const payload =
            "md5" +
            (await md5(
                Buffer.concat([
                    Buffer.from(await md5((await Pass()) + user)),
                    x.subarray(9),
                ])
            ));
        write(bytes_default().p().str(payload).z(1).end());
    }
    async function SASL() {
        nonce = (await crypto.randomBytes(18)).toString("base64");
        bytes_default()
            .p()
            .str("SCRAM-SHA-256" + bytes_default.N);
        const i = bytes_default.i;
        write(
            bytes_default
                .inc(4)
                .str("n,,n=*,r=" + nonce)
                .i32(bytes_default.i - i - 4, i)
                .end()
        );
    }
    async function SASLContinue(x) {
        const res = x
            .toString("utf8", 9)
            .split(",")
            .reduce((acc, x2) => ((acc[x2[0]] = x2.slice(2)), acc), {});
        const saltedPassword = await crypto.pbkdf2Sync(
            await Pass(),
            Buffer.from(res.s, "base64"),
            parseInt(res.i),
            32,
            "sha256"
        );
        const clientKey = await hmac(saltedPassword, "Client Key");
        const auth =
            "n=*,r=" +
            nonce +
            "," +
            "r=" +
            res.r +
            ",s=" +
            res.s +
            ",i=" +
            res.i +
            ",c=biws,r=" +
            res.r;
        serverSignature = (
            await hmac(await hmac(saltedPassword, "Server Key"), auth)
        ).toString("base64");
        const payload =
            "c=biws,r=" +
            res.r +
            ",p=" +
            xor(
                clientKey,
                Buffer.from(await hmac(await sha256(clientKey), auth))
            ).toString("base64");
        write(bytes_default().p().str(payload).end());
    }
    function SASLFinal(x) {
        if (
            x.toString("utf8", 9).split(bytes_default.N, 1)[0].slice(2) ===
            serverSignature
        )
            return;
        errored(
            Errors.generic(
                "SASL_SIGNATURE_MISMATCH",
                "The server did not return the correct signature"
            )
        );
        socket.destroy();
    }
    function Pass() {
        return Promise.resolve(
            typeof options.pass === "function" ? options.pass() : options.pass
        );
    }
    function NoData() {
        result2.statement = query4.statement;
        result2.statement.columns = [];
        if (query4.onlyDescribe)
            return query4.resolve(query4.statement), write(Sync);
    }
    function BackendKeyData(x) {
        backend.pid = x.readUInt32BE(5);
        backend.secret = x.readUInt32BE(9);
    }
    async function fetchArrayTypes() {
        needsTypes = false;
        const types3 = await new Query(
            [
                `
      select b.oid, b.typarray
      from pg_catalog.pg_type a
      left join pg_catalog.pg_type b on b.oid = a.typelem
      where a.typcategory = 'A'
      group by b.oid, b.typarray
      order by b.oid
    `,
            ],
            [],
            execute
        );
        types3.forEach(({ oid, typarray }) => addArrayType(oid, typarray));
    }
    function addArrayType(oid, typarray) {
        if (!!options.parsers[typarray] && !!options.serializers[typarray])
            return;
        const parser = options.parsers[oid];
        options.shared.typeArrayMap[oid] = typarray;
        options.parsers[typarray] = (xs) => arrayParser(xs, parser, typarray);
        options.parsers[typarray].array = true;
        options.serializers[typarray] = (xs) =>
            arraySerializer(xs, options.serializers[oid], options, typarray);
    }
    function tryNext(x, xs) {
        return (
            (x === "read-write" && xs.default_transaction_read_only === "on") ||
            (x === "read-only" && xs.default_transaction_read_only === "off") ||
            (x === "primary" && xs.in_hot_standby === "on") ||
            (x === "standby" && xs.in_hot_standby === "off") ||
            (x === "prefer-standby" &&
                xs.in_hot_standby === "off" &&
                options.host[retries])
        );
    }
    function fetchState() {
        const query5 = new Query(
            [
                `
      show transaction_read_only;
      select pg_catalog.pg_is_in_recovery()
    `,
            ],
            [],
            execute,
            null,
            { simple: true }
        );
        query5.resolve = ([[a], [b2]]) => {
            backendParameters.default_transaction_read_only =
                a.transaction_read_only;
            backendParameters.in_hot_standby = b2.pg_is_in_recovery
                ? "on"
                : "off";
        };
        query5.execute();
    }
    function ErrorResponse(x) {
        query4 && (query4.cursorFn || query4.describeFirst) && write(Sync);
        const error2 = Errors.postgres(parseError(x));
        query4 && query4.retried
            ? errored(query4.retried)
            : query4 && query4.prepared && retryRoutines.has(error2.routine)
              ? retry(query4, error2)
              : errored(error2);
    }
    function retry(q, error2) {
        delete statements[q.signature];
        q.retried = error2;
        execute(q);
    }
    function NotificationResponse(x) {
        if (!onnotify) return;
        let index = 9;
        while (x[index++] !== 0);
        onnotify(
            x.toString("utf8", 9, index - 1),
            x.toString("utf8", index, x.length - 1)
        );
    }
    async function PortalSuspended() {
        try {
            const x = await Promise.resolve(query4.cursorFn(result2));
            rows = 0;
            x === CLOSE
                ? write(Close(query4.portal))
                : ((result2 = new Result()),
                  write(Execute("", query4.cursorRows)));
        } catch (err) {
            write(Sync);
            query4.reject(err);
        }
    }
    function CloseComplete() {
        result2.count && query4.cursorFn(result2);
        query4.resolve(result2);
    }
    function CopyInResponse() {
        stream = new Stream.Writable({
            autoDestroy: true,
            write(chunk2, encoding, callback) {
                socket.write(bytes_default().d().raw(chunk2).end(), callback);
            },
            destroy(error2, callback) {
                callback(error2);
                socket.write(
                    bytes_default()
                        .f()
                        .str(error2 + bytes_default.N)
                        .end()
                );
                stream = null;
            },
            final(callback) {
                socket.write(bytes_default().c().end());
                final = callback;
            },
        });
        query4.resolve(stream);
    }
    function CopyOutResponse() {
        stream = new Stream.Readable({
            read() {
                socket.resume();
            },
        });
        query4.resolve(stream);
    }
    function CopyBothResponse() {
        stream = new Stream.Duplex({
            autoDestroy: true,
            read() {
                socket.resume();
            },
            write(chunk2, encoding, callback) {
                socket.write(bytes_default().d().raw(chunk2).end(), callback);
            },
            destroy(error2, callback) {
                callback(error2);
                socket.write(
                    bytes_default()
                        .f()
                        .str(error2 + bytes_default.N)
                        .end()
                );
                stream = null;
            },
            final(callback) {
                socket.write(bytes_default().c().end());
                final = callback;
            },
        });
        query4.resolve(stream);
    }
    function CopyData(x) {
        stream && (stream.push(x.subarray(5)) || socket.pause());
    }
    function CopyDone() {
        stream && stream.push(null);
        stream = null;
    }
    function NoticeResponse(x) {
        onnotice ? onnotice(parseError(x)) : console.log(parseError(x));
    }
    function EmptyQueryResponse() {}
    function FunctionCallResponse() {
        errored(Errors.notSupported("FunctionCallResponse"));
    }
    function NegotiateProtocolVersion() {
        errored(Errors.notSupported("NegotiateProtocolVersion"));
    }
    function UnknownMessage(x) {
        console.error("Postgres.js : Unknown Message:", x[0]);
    }
    function UnknownAuth(x, type) {
        console.error("Postgres.js : Unknown Auth:", type);
    }
    function Bind(parameters, types3, statement = "", portal = "") {
        let prev, type;
        bytes_default()
            .B()
            .str(portal + bytes_default.N)
            .str(statement + bytes_default.N)
            .i16(0)
            .i16(parameters.length);
        parameters.forEach((x, i) => {
            if (x === null) return bytes_default.i32(4294967295);
            type = types3[i];
            parameters[i] = x =
                type in options.serializers
                    ? options.serializers[type](x)
                    : "" + x;
            prev = bytes_default.i;
            bytes_default
                .inc(4)
                .str(x)
                .i32(bytes_default.i - prev - 4, prev);
        });
        bytes_default.i16(0);
        return bytes_default.end();
    }
    function Parse(str, parameters, types3, name = "") {
        bytes_default()
            .P()
            .str(name + bytes_default.N)
            .str(str + bytes_default.N)
            .i16(parameters.length);
        parameters.forEach((x, i) => bytes_default.i32(types3[i] || 0));
        return bytes_default.end();
    }
    function Describe(x, name = "") {
        return bytes_default()
            .D()
            .str(x)
            .str(name + bytes_default.N)
            .end();
    }
    function Execute(portal = "", rows2 = 0) {
        return Buffer.concat([
            bytes_default()
                .E()
                .str(portal + bytes_default.N)
                .i32(rows2)
                .end(),
            Flush,
        ]);
    }
    function Close(portal = "") {
        return Buffer.concat([
            bytes_default()
                .C()
                .str("P")
                .str(portal + bytes_default.N)
                .end(),
            bytes_default().S().end(),
        ]);
    }
    function StartupMessage() {
        return (
            cancelMessage ||
            bytes_default()
                .inc(4)
                .i16(3)
                .z(2)
                .str(
                    Object.entries(
                        Object.assign(
                            {
                                user,
                                database,
                                client_encoding: "UTF8",
                            },
                            options.connection
                        )
                    )
                        .filter(([, v]) => v)
                        .map(([k, v]) => k + bytes_default.N + v)
                        .join(bytes_default.N)
                )
                .z(2)
                .end(0)
        );
    }
};
var parseError = function (x) {
    const error = {};
    let start = 5;
    for (let i = 5; i < x.length - 1; i++) {
        if (x[i] === 0) {
            error[errorFields[x[start]]] = x.toString("utf8", start + 1, i);
            start = i + 1;
        }
    }
    return error;
};
var md5 = function (x) {
    return crypto.createHash("md5").update(x).digest("hex");
};
var hmac = function (key, x) {
    return crypto.createHmac("sha256", key).update(x).digest();
};
var sha256 = function (x) {
    return crypto.createHash("sha256").update(x).digest();
};
var xor = function (a, b2) {
    const length = Math.max(a.length, b2.length);
    const buffer2 = Buffer.allocUnsafe(length);
    for (let i = 0; i < length; i++) buffer2[i] = a[i] ^ b2[i];
    return buffer2;
};
var timer = function (fn, seconds) {
    seconds = typeof seconds === "function" ? seconds() : seconds;
    if (!seconds) return { cancel: noop, start: noop };
    let timer2;
    return {
        cancel() {
            timer2 && (clearTimeout(timer2), (timer2 = null));
        },
        start() {
            timer2 && clearTimeout(timer2);
            timer2 = setTimeout(done, seconds * 1000, arguments);
        },
    };
    function done(args) {
        fn.apply(null, args);
        timer2 = null;
    }
};
var connection_default = Connection;
var uid = 1;
var Sync = bytes_default().S().end();
var Flush = bytes_default().H().end();
var SSLRequest = bytes_default().i32(8).i32(80877103).end(8);
var ExecuteUnnamed = Buffer.concat([
    bytes_default().E().str(bytes_default.N).i32(0).end(),
    Sync,
]);
var DescribeUnnamed = bytes_default().D().str("S").str(bytes_default.N).end();
var noop = () => {};
var retryRoutines = new Set([
    "FetchPreparedStatement",
    "RevalidateCachedQuery",
    "transformAssignedExpr",
]);
var errorFields = {
    83: "severity_local",
    86: "severity",
    67: "code",
    77: "message",
    68: "detail",
    72: "hint",
    80: "position",
    112: "internal_position",
    113: "internal_query",
    87: "where",
    115: "schema_name",
    116: "table_name",
    99: "column_name",
    100: "data type_name",
    110: "constraint_name",
    70: "file",
    76: "line",
    82: "routine",
};

// ../../node_modules/postgres/src/subscribe.js
var Time = function (x) {
    return new Date(Date.UTC(2000, 0, 1) + Number(x / BigInt(1000)));
};
var parse = function (x, state, parsers2, handle, transform) {
    const char = (acc, [k, v]) => ((acc[k.charCodeAt(0)] = v), acc);
    Object.entries({
        R: (x2) => {
            let i = 1;
            const r = (state[x2.readUInt32BE(i)] = {
                schema:
                    x2.toString("utf8", (i += 4), (i = x2.indexOf(0, i))) ||
                    "pg_catalog",
                table: x2.toString("utf8", i + 1, (i = x2.indexOf(0, i + 1))),
                columns: Array(x2.readUInt16BE((i += 2))),
                keys: [],
            });
            i += 2;
            let columnIndex = 0,
                column9;
            while (i < x2.length) {
                column9 = r.columns[columnIndex++] = {
                    key: x2[i++],
                    name: transform.column.from
                        ? transform.column.from(
                              x2.toString("utf8", i, (i = x2.indexOf(0, i)))
                          )
                        : x2.toString("utf8", i, (i = x2.indexOf(0, i))),
                    type: x2.readUInt32BE((i += 1)),
                    parser: parsers2[x2.readUInt32BE(i)],
                    atttypmod: x2.readUInt32BE((i += 4)),
                };
                column9.key && r.keys.push(column9);
                i += 4;
            }
        },
        Y: () => {},
        O: () => {},
        B: (x2) => {
            state.date = Time(x2.readBigInt64BE(9));
            state.lsn = x2.subarray(1, 9);
        },
        I: (x2) => {
            let i = 1;
            const relation = state[x2.readUInt32BE(i)];
            const { row } = tuples(x2, relation.columns, (i += 7), transform);
            handle(row, {
                command: "insert",
                relation,
            });
        },
        D: (x2) => {
            let i = 1;
            const relation = state[x2.readUInt32BE(i)];
            i += 4;
            const key = x2[i] === 75;
            handle(
                key || x2[i] === 79
                    ? tuples(x2, relation.columns, (i += 3), transform).row
                    : null,
                {
                    command: "delete",
                    relation,
                    key,
                }
            );
        },
        U: (x2) => {
            let i = 1;
            const relation = state[x2.readUInt32BE(i)];
            i += 4;
            const key = x2[i] === 75;
            const xs =
                key || x2[i] === 79
                    ? tuples(x2, relation.columns, (i += 3), transform)
                    : null;
            xs && (i = xs.i);
            const { row } = tuples(x2, relation.columns, i + 3, transform);
            handle(row, {
                command: "update",
                relation,
                key,
                old: xs && xs.row,
            });
        },
        T: () => {},
        C: () => {},
    })
        .reduce(char, {})
        [x[0]](x);
};
var tuples = function (x, columns2, xi, transform) {
    let type, column9, value;
    const row = transform.raw ? new Array(columns2.length) : {};
    for (let i = 0; i < columns2.length; i++) {
        type = x[xi++];
        column9 = columns2[i];
        value =
            type === 110
                ? null
                : type === 117
                  ? undefined
                  : column9.parser === undefined
                    ? x.toString("utf8", xi + 4, (xi += 4 + x.readUInt32BE(xi)))
                    : column9.parser.array === true
                      ? column9.parser(
                            x.toString(
                                "utf8",
                                xi + 5,
                                (xi += 4 + x.readUInt32BE(xi))
                            )
                        )
                      : column9.parser(
                            x.toString(
                                "utf8",
                                xi + 4,
                                (xi += 4 + x.readUInt32BE(xi))
                            )
                        );
        transform.raw
            ? (row[i] =
                  transform.raw === true
                      ? value
                      : transform.value.from
                        ? transform.value.from(value, column9)
                        : value)
            : (row[column9.name] = transform.value.from
                  ? transform.value.from(value, column9)
                  : value);
    }
    return { i: xi, row: transform.row.from ? transform.row.from(row) : row };
};
var parseEvent = function (x) {
    const xs =
        x.match(/^(\*|insert|update|delete)?:?([^.]+?\.?[^=]+)?=?(.+)?/i) || [];
    if (!xs) throw new Error("Malformed subscribe pattern: " + x);
    const [, command, path, key] = xs;
    return (
        (command || "*") +
        (path
            ? ":" + (path.indexOf(".") === -1 ? "public." + path : path)
            : "") +
        (key ? "=" + key : "")
    );
};
var noop2 = () => {};
function Subscribe(postgres2, options) {
    const subscribers = new Map(),
        slot = "postgresjs_" + Math.random().toString(36).slice(2),
        state = {};
    let connection2,
        stream,
        ended = false;
    const sql15 = (subscribe.sql = postgres2({
        ...options,
        transform: { column: {}, value: {}, row: {} },
        max: 1,
        fetch_types: false,
        idle_timeout: null,
        max_lifetime: null,
        connection: {
            ...options.connection,
            replication: "database",
        },
        onclose: async function () {
            if (ended) return;
            stream = null;
            state.pid = state.secret = undefined;
            connected(await init(sql15, slot, options.publications));
            subscribers.forEach((event) =>
                event.forEach(({ onsubscribe }) => onsubscribe())
            );
        },
        no_subscribe: true,
    }));
    const { end, close } = sql15;
    sql15.end = async () => {
        ended = true;
        stream &&
            (await new Promise((r) => (stream.once("close", r), stream.end())));
        return end();
    };
    sql15.close = async () => {
        stream &&
            (await new Promise((r) => (stream.once("close", r), stream.end())));
        return close();
    };
    return subscribe;
    async function subscribe(event, fn, onsubscribe = noop2, onerror = noop2) {
        event = parseEvent(event);
        if (!connection2) connection2 = init(sql15, slot, options.publications);
        const subscriber = { fn, onsubscribe };
        const fns = subscribers.has(event)
            ? subscribers.get(event).add(subscriber)
            : subscribers.set(event, new Set([subscriber])).get(event);
        const unsubscribe = () => {
            fns.delete(subscriber);
            fns.size === 0 && subscribers.delete(event);
        };
        return connection2.then((x) => {
            connected(x);
            onsubscribe();
            stream && stream.on("error", onerror);
            return { unsubscribe, state, sql: sql15 };
        });
    }
    function connected(x) {
        stream = x.stream;
        state.pid = x.state.pid;
        state.secret = x.state.secret;
    }
    async function init(sql16, slot2, publications) {
        if (!publications) throw new Error("Missing publication names");
        const xs = await sql16.unsafe(
            `CREATE_REPLICATION_SLOT ${slot2} TEMPORARY LOGICAL pgoutput NOEXPORT_SNAPSHOT`
        );
        const [x] = xs;
        const stream2 = await sql16
            .unsafe(
                `START_REPLICATION SLOT ${slot2} LOGICAL ${x.consistent_point} (proto_version '1', publication_names '${publications}')`
            )
            .writable();
        const state2 = {
            lsn: Buffer.concat(
                x.consistent_point
                    .split("/")
                    .map((x2) =>
                        Buffer.from(("00000000" + x2).slice(-8), "hex")
                    )
            ),
        };
        stream2.on("data", data);
        stream2.on("error", error);
        stream2.on("close", sql16.close);
        return { stream: stream2, state: xs.state };
        function error(e) {
            console.error(
                "Unexpected error during logical streaming - reconnecting",
                e
            );
        }
        function data(x2) {
            if (x2[0] === 119) {
                parse(
                    x2.subarray(25),
                    state2,
                    sql16.options.parsers,
                    handle,
                    options.transform
                );
            } else if (x2[0] === 107 && x2[17]) {
                state2.lsn = x2.subarray(1, 9);
                pong();
            }
        }
        function handle(a, b2) {
            const path = b2.relation.schema + "." + b2.relation.table;
            call("*", a, b2);
            call("*:" + path, a, b2);
            b2.relation.keys.length &&
                call(
                    "*:" +
                        path +
                        "=" +
                        b2.relation.keys.map((x2) => a[x2.name]),
                    a,
                    b2
                );
            call(b2.command, a, b2);
            call(b2.command + ":" + path, a, b2);
            b2.relation.keys.length &&
                call(
                    b2.command +
                        ":" +
                        path +
                        "=" +
                        b2.relation.keys.map((x2) => a[x2.name]),
                    a,
                    b2
                );
        }
        function pong() {
            const x2 = Buffer.alloc(34);
            x2[0] = "r".charCodeAt(0);
            x2.fill(state2.lsn, 1);
            x2.writeBigInt64BE(
                BigInt(Date.now() - Date.UTC(2000, 0, 1)) * BigInt(1000),
                25
            );
            stream2.write(x2);
        }
    }
    function call(x, a, b2) {
        subscribers.has(x) &&
            subscribers.get(x).forEach(({ fn }) => fn(a, b2, x));
    }
}

// ../../node_modules/postgres/src/large.js
import Stream2 from "stream";
function largeObject(sql15, oid, mode = 131072 | 262144) {
    return new Promise(async (resolve, reject) => {
        await sql15
            .begin(async (sql16) => {
                let finish;
                !oid && ([{ oid }] = await sql16`select lo_creat(-1) as oid`);
                const [{ fd }] =
                    await sql16`select lo_open(${oid}, ${mode}) as fd`;
                const lo = {
                    writable,
                    readable,
                    close: () => sql16`select lo_close(${fd})`.then(finish),
                    tell: () => sql16`select lo_tell64(${fd})`,
                    read: (x) => sql16`select loread(${fd}, ${x}) as data`,
                    write: (x) => sql16`select lowrite(${fd}, ${x})`,
                    truncate: (x) => sql16`select lo_truncate64(${fd}, ${x})`,
                    seek: (x, whence = 0) =>
                        sql16`select lo_lseek64(${fd}, ${x}, ${whence})`,
                    size: () => sql16`
          select
            lo_lseek64(${fd}, location, 0) as position,
            seek.size
          from (
            select
              lo_lseek64($1, 0, 2) as size,
              tell.location
            from (select lo_tell64($1) as location) tell
          ) seek
        `,
                };
                resolve(lo);
                return new Promise(async (r) => (finish = r));
                async function readable({
                    highWaterMark = 2048 * 8,
                    start = 0,
                    end = Infinity,
                } = {}) {
                    let max = end - start;
                    start && (await lo.seek(start));
                    return new Stream2.Readable({
                        highWaterMark,
                        async read(size2) {
                            const l = size2 > max ? size2 - max : size2;
                            max -= size2;
                            const [{ data }] = await lo.read(l);
                            this.push(data);
                            if (data.length < size2) this.push(null);
                        },
                    });
                }
                async function writable({
                    highWaterMark = 2048 * 8,
                    start = 0,
                } = {}) {
                    start && (await lo.seek(start));
                    return new Stream2.Writable({
                        highWaterMark,
                        write(chunk, encoding, callback) {
                            lo.write(chunk).then(() => callback(), callback);
                        },
                    });
                }
            })
            .catch(reject);
    });
}

// ../../node_modules/postgres/src/index.js
var Postgres = function (a, b2) {
    const options = parseOptions(a, b2),
        subscribe2 =
            options.no_subscribe || Subscribe(Postgres, { ...options });
    let ending = false;
    const queries = queue_default(),
        connecting = queue_default(),
        reserved = queue_default(),
        closed = queue_default(),
        ended = queue_default(),
        open = queue_default(),
        busy = queue_default(),
        full = queue_default(),
        queues = { connecting, reserved, closed, ended, open, busy, full };
    const connections = [...Array(options.max)].map(() =>
        connection_default(options, queues, { onopen, onend, onclose })
    );
    const sql15 = Sql(handler);
    Object.assign(sql15, {
        get parameters() {
            return options.parameters;
        },
        largeObject: largeObject.bind(null, sql15),
        subscribe: subscribe2,
        CLOSE,
        END: CLOSE,
        PostgresError,
        options,
        reserve,
        listen,
        begin,
        close,
        end,
    });
    return sql15;
    function Sql(handler2) {
        handler2.debug = options.debug;
        Object.entries(options.types).reduce((acc, [name, type]) => {
            acc[name] = (x) => new Parameter(x, type.to);
            return acc;
        }, typed);
        Object.assign(sql16, {
            types: typed,
            typed,
            unsafe,
            notify,
            array: array2,
            json,
            file,
        });
        return sql16;
        function typed(value, type) {
            return new Parameter(value, type);
        }
        function sql16(strings, ...args) {
            const query5 =
                strings && Array.isArray(strings.raw)
                    ? new Query(strings, args, handler2, cancel)
                    : typeof strings === "string" && !args.length
                      ? new Identifier(
                            options.transform.column.to
                                ? options.transform.column.to(strings)
                                : strings
                        )
                      : new Builder(strings, args);
            return query5;
        }
        function unsafe(string, args = [], options2 = {}) {
            arguments.length === 2 &&
                !Array.isArray(args) &&
                ((options2 = args), (args = []));
            const query5 = new Query([string], args, handler2, cancel, {
                prepare: false,
                ...options2,
                simple:
                    "simple" in options2 ? options2.simple : args.length === 0,
            });
            return query5;
        }
        function file(path, args = [], options2 = {}) {
            arguments.length === 2 &&
                !Array.isArray(args) &&
                ((options2 = args), (args = []));
            const query5 = new Query(
                [],
                args,
                (query6) => {
                    fs.readFile(path, "utf8", (err, string) => {
                        if (err) return query6.reject(err);
                        query6.strings = [string];
                        handler2(query6);
                    });
                },
                cancel,
                {
                    ...options2,
                    simple:
                        "simple" in options2
                            ? options2.simple
                            : args.length === 0,
                }
            );
            return query5;
        }
    }
    async function listen(name, fn, onlisten) {
        const listener = { fn, onlisten };
        const sql16 =
            listen.sql ||
            (listen.sql = Postgres({
                ...options,
                max: 1,
                idle_timeout: null,
                max_lifetime: null,
                fetch_types: false,
                onclose() {
                    Object.entries(listen.channels).forEach(
                        ([name2, { listeners }]) => {
                            delete listen.channels[name2];
                            Promise.all(
                                listeners.map((l) =>
                                    listen(name2, l.fn, l.onlisten).catch(
                                        () => {}
                                    )
                                )
                            );
                        }
                    );
                },
                onnotify(c, x) {
                    c in listen.channels &&
                        listen.channels[c].listeners.forEach((l) => l.fn(x));
                },
            }));
        const channels = listen.channels || (listen.channels = {}),
            exists2 = name in channels;
        if (exists2) {
            channels[name].listeners.push(listener);
            const result3 = await channels[name].result;
            listener.onlisten && listener.onlisten();
            return { state: result3.state, unlisten };
        }
        channels[name] = {
            result: sql16`listen ${sql16.unsafe('"' + name.replace(/"/g, '""') + '"')}`,
            listeners: [listener],
        };
        const result2 = await channels[name].result;
        listener.onlisten && listener.onlisten();
        return { state: result2.state, unlisten };
        async function unlisten() {
            if (name in channels === false) return;
            channels[name].listeners = channels[name].listeners.filter(
                (x) => x !== listener
            );
            if (channels[name].listeners.length) return;
            delete channels[name];
            return sql16`unlisten ${sql16.unsafe('"' + name.replace(/"/g, '""') + '"')}`;
        }
    }
    async function notify(channel, payload) {
        return await sql15`select pg_notify(${channel}, ${"" + payload})`;
    }
    async function reserve() {
        const queue3 = queue_default();
        const c = open.length
            ? open.shift()
            : await new Promise((r) => {
                  queries.push({ reserve: r });
                  closed.length && connect(closed.shift());
              });
        move(c, reserved);
        c.reserved = () =>
            queue3.length ? c.execute(queue3.shift()) : move(c, reserved);
        c.reserved.release = true;
        const sql16 = Sql(handler2);
        sql16.release = () => {
            c.reserved = null;
            onopen(c);
        };
        return sql16;
        function handler2(q) {
            c.queue === full ? queue3.push(q) : c.execute(q) || move(c, full);
        }
    }
    async function begin(options2, fn) {
        !fn && ((fn = options2), (options2 = ""));
        const queries2 = queue_default();
        let savepoints = 0,
            connection3,
            prepare = null;
        try {
            await sql15
                .unsafe("begin " + options2.replace(/[^a-z ]/gi, ""), [], {
                    onexecute,
                })
                .execute();
            return await Promise.race([
                scope(connection3, fn),
                new Promise((_, reject) => (connection3.onclose = reject)),
            ]);
        } catch (error) {
            throw error;
        }
        async function scope(c, fn2, name) {
            const sql16 = Sql(handler2);
            sql16.savepoint = savepoint;
            sql16.prepare = (x) => (prepare = x.replace(/[^a-z0-9$-_. ]/gi));
            let uncaughtError, result2;
            name && (await sql16`savepoint ${sql16(name)}`);
            try {
                result2 = await new Promise((resolve, reject) => {
                    const x = fn2(sql16);
                    Promise.resolve(Array.isArray(x) ? Promise.all(x) : x).then(
                        resolve,
                        reject
                    );
                });
                if (uncaughtError) throw uncaughtError;
            } catch (e) {
                await (name
                    ? sql16`rollback to ${sql16(name)}`
                    : sql16`rollback`);
                throw (
                    (e instanceof PostgresError &&
                        e.code === "25P02" &&
                        uncaughtError) ||
                    e
                );
            }
            if (!name) {
                prepare
                    ? await sql16`prepare transaction '${sql16.unsafe(prepare)}'`
                    : await sql16`commit`;
            }
            return result2;
            function savepoint(name2, fn3) {
                if (name2 && Array.isArray(name2.raw))
                    return savepoint((sql17) => sql17.apply(sql17, arguments));
                arguments.length === 1 && ((fn3 = name2), (name2 = null));
                return scope(
                    c,
                    fn3,
                    "s" + savepoints++ + (name2 ? "_" + name2 : "")
                );
            }
            function handler2(q) {
                q.catch((e) => uncaughtError || (uncaughtError = e));
                c.queue === full
                    ? queries2.push(q)
                    : c.execute(q) || move(c, full);
            }
        }
        function onexecute(c) {
            connection3 = c;
            move(c, reserved);
            c.reserved = () =>
                queries2.length
                    ? c.execute(queries2.shift())
                    : move(c, reserved);
        }
    }
    function move(c, queue3) {
        c.queue.remove(c);
        queue3.push(c);
        c.queue = queue3;
        queue3 === open ? c.idleTimer.start() : c.idleTimer.cancel();
        return c;
    }
    function json(x) {
        return new Parameter(x, 3802);
    }
    function array2(x, type) {
        if (!Array.isArray(x)) return array2(Array.from(arguments));
        return new Parameter(
            x,
            type || (x.length ? inferType(x) || 25 : 0),
            options.shared.typeArrayMap
        );
    }
    function handler(query5) {
        if (ending)
            return query5.reject(
                Errors.connection("CONNECTION_ENDED", options, options)
            );
        if (open.length) return go(open.shift(), query5);
        if (closed.length) return connect(closed.shift(), query5);
        busy.length ? go(busy.shift(), query5) : queries.push(query5);
    }
    function go(c, query5) {
        return c.execute(query5) ? move(c, busy) : move(c, full);
    }
    function cancel(query5) {
        return new Promise((resolve, reject) => {
            query5.state
                ? query5.active
                    ? connection_default(options).cancel(
                          query5.state,
                          resolve,
                          reject
                      )
                    : (query5.cancelled = { resolve, reject })
                : (queries.remove(query5),
                  (query5.cancelled = true),
                  query5.reject(
                      Errors.generic(
                          "57014",
                          "canceling statement due to user request"
                      )
                  ),
                  resolve());
        });
    }
    async function end({ timeout = null } = {}) {
        if (ending) return ending;
        await 1;
        let timer2;
        return (ending = Promise.race([
            new Promise(
                (r) =>
                    timeout !== null &&
                    (timer2 = setTimeout(destroy, timeout * 1000, r))
            ),
            Promise.all(
                connections
                    .map((c) => c.end())
                    .concat(
                        listen.sql ? listen.sql.end({ timeout: 0 }) : [],
                        subscribe2.sql ? subscribe2.sql.end({ timeout: 0 }) : []
                    )
            ),
        ]).then(() => clearTimeout(timer2)));
    }
    async function close() {
        await Promise.all(connections.map((c) => c.end()));
    }
    async function destroy(resolve) {
        await Promise.all(connections.map((c) => c.terminate()));
        while (queries.length)
            queries
                .shift()
                .reject(Errors.connection("CONNECTION_DESTROYED", options));
        resolve();
    }
    function connect(c, query5) {
        move(c, connecting);
        c.connect(query5);
        return c;
    }
    function onend(c) {
        move(c, ended);
    }
    function onopen(c) {
        if (queries.length === 0) return move(c, open);
        let max = Math.ceil(queries.length / (connecting.length + 1)),
            ready = true;
        while (ready && queries.length && max-- > 0) {
            const query5 = queries.shift();
            if (query5.reserve) return query5.reserve(c);
            ready = c.execute(query5);
        }
        ready ? move(c, busy) : move(c, full);
    }
    function onclose(c, e) {
        move(c, closed);
        c.reserved = null;
        c.onclose && (c.onclose(e), (c.onclose = null));
        options.onclose && options.onclose(c.id);
        queries.length && connect(c, queries.shift());
    }
};
var parseOptions = function (a, b2) {
    if (a && a.shared) return a;
    const env = process.env,
        o = (!a || typeof a === "string" ? b2 : a) || {},
        { url, multihost } = parseUrl(a),
        query5 = [...url.searchParams].reduce(
            (a2, [b3, c]) => ((a2[b3] = c), a2),
            {}
        ),
        host =
            o.hostname ||
            o.host ||
            multihost ||
            url.hostname ||
            env.PGHOST ||
            "localhost",
        port = o.port || url.port || env.PGPORT || 5432,
        user =
            o.user ||
            o.username ||
            url.username ||
            env.PGUSERNAME ||
            env.PGUSER ||
            osUsername();
    o.no_prepare && (o.prepare = false);
    query5.sslmode && ((query5.ssl = query5.sslmode), delete query5.sslmode);
    "timeout" in o &&
        (console.log(
            "The timeout option is deprecated, use idle_timeout instead"
        ),
        (o.idle_timeout = o.timeout));
    query5.sslrootcert === "system" && (query5.ssl = "verify-full");
    const ints = [
        "idle_timeout",
        "connect_timeout",
        "max_lifetime",
        "max_pipeline",
        "backoff",
        "keep_alive",
    ];
    const defaults = {
        max: 10,
        ssl: false,
        idle_timeout: null,
        connect_timeout: 30,
        max_lifetime,
        max_pipeline: 100,
        backoff,
        keep_alive: 60,
        prepare: true,
        debug: false,
        fetch_types: true,
        publications: "alltables",
        target_session_attrs: null,
    };
    return {
        host: Array.isArray(host)
            ? host
            : host.split(",").map((x) => x.split(":")[0]),
        port: Array.isArray(port)
            ? port
            : host.split(",").map((x) => parseInt(x.split(":")[1] || port)),
        path: o.path || (host.indexOf("/") > -1 && host + "/.s.PGSQL." + port),
        database:
            o.database ||
            o.db ||
            (url.pathname || "").slice(1) ||
            env.PGDATABASE ||
            user,
        user,
        pass: o.pass || o.password || url.password || env.PGPASSWORD || "",
        ...Object.entries(defaults).reduce((acc, [k, d]) => {
            const value =
                k in o
                    ? o[k]
                    : k in query5
                      ? query5[k] === "disable" || query5[k] === "false"
                          ? false
                          : query5[k]
                      : env["PG" + k.toUpperCase()] || d;
            acc[k] =
                typeof value === "string" && ints.includes(k) ? +value : value;
            return acc;
        }, {}),
        connection: {
            application_name: "postgres.js",
            ...o.connection,
            ...Object.entries(query5).reduce(
                (acc, [k, v]) => (k in defaults || (acc[k] = v), acc),
                {}
            ),
        },
        types: o.types || {},
        target_session_attrs: tsa(o, url, env),
        onnotice: o.onnotice,
        onnotify: o.onnotify,
        onclose: o.onclose,
        onparameter: o.onparameter,
        socket: o.socket,
        transform: parseTransform(o.transform || { undefined: undefined }),
        parameters: {},
        shared: { retries: 0, typeArrayMap: {} },
        ...mergeUserTypes(o.types),
    };
};
var tsa = function (o, url, env) {
    const x =
        o.target_session_attrs ||
        url.searchParams.get("target_session_attrs") ||
        env.PGTARGETSESSIONATTRS;
    if (
        !x ||
        [
            "read-write",
            "read-only",
            "primary",
            "standby",
            "prefer-standby",
        ].includes(x)
    )
        return x;
    throw new Error("target_session_attrs " + x + " is not supported");
};
var backoff = function (retries) {
    return (0.5 + Math.random() / 2) * Math.min(3 ** retries / 100, 20);
};
var max_lifetime = function () {
    return 60 * (30 + Math.random() * 30);
};
var parseTransform = function (x) {
    return {
        undefined: x.undefined,
        column: {
            from:
                typeof x.column === "function"
                    ? x.column
                    : x.column && x.column.from,
            to: x.column && x.column.to,
        },
        value: {
            from:
                typeof x.value === "function"
                    ? x.value
                    : x.value && x.value.from,
            to: x.value && x.value.to,
        },
        row: {
            from: typeof x.row === "function" ? x.row : x.row && x.row.from,
            to: x.row && x.row.to,
        },
    };
};
var parseUrl = function (url) {
    if (!url || typeof url !== "string")
        return { url: { searchParams: new Map() } };
    let host = url;
    host = host.slice(host.indexOf("://") + 3).split(/[?/]/)[0];
    host = decodeURIComponent(host.slice(host.indexOf("@") + 1));
    const urlObj = new URL(url.replace(host, host.split(",")[0]));
    return {
        url: {
            username: decodeURIComponent(urlObj.username),
            password: decodeURIComponent(urlObj.password),
            host: urlObj.host,
            hostname: urlObj.hostname,
            port: urlObj.port,
            pathname: urlObj.pathname,
            searchParams: urlObj.searchParams,
        },
        multihost: host.indexOf(",") > -1 && host,
    };
};
var osUsername = function () {
    try {
        return os.userInfo().username;
    } catch (_) {
        return process.env.USERNAME || "leo";
    }
};
Object.assign(Postgres, {
    PostgresError,
    toPascal,
    pascal,
    toCamel,
    camel,
    toKebab,
    kebab,
    fromPascal,
    fromCamel,
    fromKebab,
    BigInt: {
        to: 20,
        from: [20],
        parse: (x) => BigInt(x),
        serialize: (x) => x.toString(),
    },
});
var src_default = Postgres;

// ../../node_modules/@neondatabase/serverless/index.mjs
var Ge = function (r) {
    let e = 1779033703,
        t = 3144134277,
        n = 1013904242,
        i = 2773480762,
        s = 1359893119,
        o = 2600822924,
        u = 528734635,
        c = 1541459225,
        h = 0,
        l = 0,
        y = [
            1116352408, 1899447441, 3049323471, 3921009573, 961987163,
            1508970993, 2453635748, 2870763221, 3624381080, 310598401,
            607225278, 1426881987, 1925078388, 2162078206, 2614888103,
            3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983,
            1249150122, 1555081692, 1996064986, 2554220882, 2821834349,
            2952996808, 3210313671, 3336571891, 3584528711, 113926993,
            338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700,
            1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
            3259730800, 3345764771, 3516065817, 3600352804, 4094571909,
            275423344, 430227734, 506948616, 659060556, 883997877, 958139571,
            1322822218, 1537002063, 1747873779, 1955562222, 2024104815,
            2227730452, 2361852424, 2428436474, 2756734187, 3204031479,
            3329325298,
        ],
        x = a((A, w) => (A >>> w) | (A << (32 - w)), "rrot"),
        C = new Uint32Array(64),
        B = new Uint8Array(64),
        W = a(() => {
            for (let R = 0, G = 0; R < 16; R++, G += 4)
                C[R] =
                    (B[G] << 24) |
                    (B[G + 1] << 16) |
                    (B[G + 2] << 8) |
                    B[G + 3];
            for (let R = 16; R < 64; R++) {
                let G = x(C[R - 15], 7) ^ x(C[R - 15], 18) ^ (C[R - 15] >>> 3),
                    he = x(C[R - 2], 17) ^ x(C[R - 2], 19) ^ (C[R - 2] >>> 10);
                C[R] = (C[R - 16] + G + C[R - 7] + he) | 0;
            }
            let A = e,
                w = t,
                P = n,
                V = i,
                k = s,
                j = o,
                ce = u,
                ee = c;
            for (let R = 0; R < 64; R++) {
                let G = x(k, 6) ^ x(k, 11) ^ x(k, 25),
                    he = (k & j) ^ (~k & ce),
                    ye = (ee + G + he + y[R] + C[R]) | 0,
                    ve = x(A, 2) ^ x(A, 13) ^ x(A, 22),
                    me = (A & w) ^ (A & P) ^ (w & P),
                    se = (ve + me) | 0;
                (ee = ce),
                    (ce = j),
                    (j = k),
                    (k = (V + ye) | 0),
                    (V = P),
                    (P = w),
                    (w = A),
                    (A = (ye + se) | 0);
            }
            (e = (e + A) | 0),
                (t = (t + w) | 0),
                (n = (n + P) | 0),
                (i = (i + V) | 0),
                (s = (s + k) | 0),
                (o = (o + j) | 0),
                (u = (u + ce) | 0),
                (c = (c + ee) | 0),
                (l = 0);
        }, "process"),
        X = a((A) => {
            typeof A == "string" && (A = new TextEncoder().encode(A));
            for (let w = 0; w < A.length; w++) (B[l++] = A[w]), l === 64 && W();
            h += A.length;
        }, "add"),
        de = a(() => {
            if (((B[l++] = 128), l == 64 && W(), l + 8 > 64)) {
                for (; l < 64; ) B[l++] = 0;
                W();
            }
            for (; l < 58; ) B[l++] = 0;
            let A = h * 8;
            (B[l++] = (A / 1099511627776) & 255),
                (B[l++] = (A / 4294967296) & 255),
                (B[l++] = A >>> 24),
                (B[l++] = (A >>> 16) & 255),
                (B[l++] = (A >>> 8) & 255),
                (B[l++] = A & 255),
                W();
            let w = new Uint8Array(32);
            return (
                (w[0] = e >>> 24),
                (w[1] = (e >>> 16) & 255),
                (w[2] = (e >>> 8) & 255),
                (w[3] = e & 255),
                (w[4] = t >>> 24),
                (w[5] = (t >>> 16) & 255),
                (w[6] = (t >>> 8) & 255),
                (w[7] = t & 255),
                (w[8] = n >>> 24),
                (w[9] = (n >>> 16) & 255),
                (w[10] = (n >>> 8) & 255),
                (w[11] = n & 255),
                (w[12] = i >>> 24),
                (w[13] = (i >>> 16) & 255),
                (w[14] = (i >>> 8) & 255),
                (w[15] = i & 255),
                (w[16] = s >>> 24),
                (w[17] = (s >>> 16) & 255),
                (w[18] = (s >>> 8) & 255),
                (w[19] = s & 255),
                (w[20] = o >>> 24),
                (w[21] = (o >>> 16) & 255),
                (w[22] = (o >>> 8) & 255),
                (w[23] = o & 255),
                (w[24] = u >>> 24),
                (w[25] = (u >>> 16) & 255),
                (w[26] = (u >>> 8) & 255),
                (w[27] = u & 255),
                (w[28] = c >>> 24),
                (w[29] = (c >>> 16) & 255),
                (w[30] = (c >>> 8) & 255),
                (w[31] = c & 255),
                w
            );
        }, "digest");
    return r === undefined ? { add: X, digest: de } : (X(r), de());
};
var $o = function (r) {
    return g.getRandomValues(d.alloc(r));
};
var Vo = function (r) {
    if (r === "sha256")
        return {
            update: a(function (e) {
                return {
                    digest: a(function () {
                        return d.from(Ge(e));
                    }, "digest"),
                };
            }, "update"),
        };
    if (r === "md5")
        return {
            update: a(function (e) {
                return {
                    digest: a(function () {
                        return typeof e == "string"
                            ? $e.hashStr(e)
                            : $e.hashByteArray(e);
                    }, "digest"),
                };
            }, "update"),
        };
    throw new Error(`Hash type '${r}' not supported`);
};
var Ko = function (r, e) {
    if (r !== "sha256")
        throw new Error(`Only sha256 is supported (requested: '${r}')`);
    return {
        update: a(function (t) {
            return {
                digest: a(function () {
                    typeof e == "string" && (e = new TextEncoder().encode(e)),
                        typeof t == "string" &&
                            (t = new TextEncoder().encode(t));
                    let n = e.length;
                    if (n > 64) e = Ge(e);
                    else if (n < 64) {
                        let c = new Uint8Array(64);
                        c.set(e), (e = c);
                    }
                    let i = new Uint8Array(64),
                        s = new Uint8Array(64);
                    for (let c = 0; c < 64; c++)
                        (i[c] = 54 ^ e[c]), (s[c] = 92 ^ e[c]);
                    let o = new Uint8Array(t.length + 64);
                    o.set(i, 0), o.set(t, 64);
                    let u = new Uint8Array(96);
                    return u.set(s, 0), u.set(Ge(o), 64), d.from(Ge(u));
                }, "digest"),
            };
        }, "update"),
    };
};
var su = function (...r) {
    return r.join("/");
};
var ou = function (r, e) {
    e(new Error("No filesystem"));
};
var lr = function (r, e = false) {
    let { protocol: t } = new URL(r),
        n = "http:" + r.substring(t.length),
        {
            username: i,
            password: s,
            host: o,
            hostname: u,
            port: c,
            pathname: h,
            search: l,
            searchParams: y,
            hash: x,
        } = new URL(n);
    (s = decodeURIComponent(s)),
        (i = decodeURIComponent(i)),
        (h = decodeURIComponent(h));
    let C = i + ":" + s,
        B = e ? Object.fromEntries(y.entries()) : l;
    return {
        href: r,
        protocol: t,
        auth: C,
        username: i,
        password: s,
        host: o,
        hostname: u,
        port: c,
        pathname: h,
        search: l,
        query: B,
        hash: x,
    };
};
var Ru = function (r) {
    return 0;
};
var hc = function ({ socket: r, servername: e }) {
    return r.startTls(e), r;
};
var zs = function (
    r,
    {
        arrayMode: e,
        fullResults: t,
        fetchOptions: n,
        isolationLevel: i,
        readOnly: s,
        deferrable: o,
        queryCallback: u,
        resultCallback: c,
    } = {}
) {
    if (!r)
        throw new Error(
            "No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?"
        );
    let h;
    try {
        h = lr(r);
    } catch {
        throw new Error(
            "Database connection string provided to `neon()` is not a valid URL. Connection string: " +
                String(r)
        );
    }
    let {
        protocol: l,
        username: y,
        password: x,
        hostname: C,
        port: B,
        pathname: W,
    } = h;
    if ((l !== "postgres:" && l !== "postgresql:") || !y || !x || !C || !W)
        throw new Error(
            "Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value"
        );
    function X(A, ...w) {
        let P, V;
        if (typeof A == "string") (P = A), (V = w[1]), (w = w[0] ?? []);
        else {
            P = "";
            for (let j = 0; j < A.length; j++)
                (P += A[j]), j < w.length && (P += "$" + (j + 1));
        }
        w = w.map((j) => (0, Ks.prepareValue)(j));
        let k = {
            query: P,
            params: w,
        };
        return u && u(k), qc(de, k, V);
    }
    a(X, "resolve"),
        (X.transaction = async (A, w) => {
            if ((typeof A == "function" && (A = A(X)), !Array.isArray(A)))
                throw new Error($s);
            A.forEach((k) => {
                if (k[Symbol.toStringTag] !== "NeonQueryPromise")
                    throw new Error($s);
            });
            let P = A.map((k) => k.parameterizedQuery),
                V = A.map((k) => k.opts ?? {});
            return de(P, V, w);
        });
    async function de(A, w, P) {
        let { fetchEndpoint: V, fetchFunction: k } = Ae,
            j = typeof V == "function" ? V(C, B) : V,
            ce = Array.isArray(A) ? { queries: A } : A,
            ee = n ?? {},
            R = e ?? false,
            G = t ?? false,
            he = i,
            ye = s,
            ve = o;
        P !== undefined &&
            (P.fetchOptions !== undefined &&
                (ee = { ...ee, ...P.fetchOptions }),
            P.arrayMode !== undefined && (R = P.arrayMode),
            P.fullResults !== undefined && (G = P.fullResults),
            P.isolationLevel !== undefined && (he = P.isolationLevel),
            P.readOnly !== undefined && (ye = P.readOnly),
            P.deferrable !== undefined && (ve = P.deferrable)),
            w !== undefined &&
                !Array.isArray(w) &&
                w.fetchOptions !== undefined &&
                (ee = { ...ee, ...w.fetchOptions });
        let me = {
            "Neon-Connection-String": r,
            "Neon-Raw-Text-Output": "true",
            "Neon-Array-Mode": "true",
        };
        Array.isArray(A) &&
            (he !== undefined && (me["Neon-Batch-Isolation-Level"] = he),
            ye !== undefined && (me["Neon-Batch-Read-Only"] = String(ye)),
            ve !== undefined && (me["Neon-Batch-Deferrable"] = String(ve)));
        let se;
        try {
            se = await (k ?? fetch)(j, {
                method: "POST",
                body: JSON.stringify(ce),
                headers: me,
                ...ee,
            });
        } catch (oe) {
            let O = new Ce(`Error connecting to database: ${oe.message}`);
            throw ((O.sourceError = oe), O);
        }
        if (se.ok) {
            let oe = await se.json();
            if (Array.isArray(A)) {
                let O = oe.results;
                if (!Array.isArray(O))
                    throw new Ce(
                        "Neon internal error: unexpected result format"
                    );
                return O.map((K, le) => {
                    let _n = w[le] ?? {},
                        Js = _n.arrayMode ?? R,
                        Xs = _n.fullResults ?? G;
                    return Vs(K, {
                        arrayMode: Js,
                        fullResults: Xs,
                        parameterizedQuery: A[le],
                        resultCallback: c,
                    });
                });
            } else {
                let O = w ?? {},
                    K = O.arrayMode ?? R,
                    le = O.fullResults ?? G;
                return Vs(oe, {
                    arrayMode: K,
                    fullResults: le,
                    parameterizedQuery: A,
                    resultCallback: c,
                });
            }
        } else {
            let { status: oe } = se;
            if (oe === 400) {
                let O = await se.json(),
                    K = new Ce(O.message);
                for (let le of Nc) K[le] = O[le] ?? undefined;
                throw K;
            } else {
                let O = await se.text();
                throw new Ce(`Server error (HTTP status ${oe}): ${O}`);
            }
        }
    }
    return a(de, "execute"), X;
};
var qc = function (r, e, t) {
    return {
        [Symbol.toStringTag]: "NeonQueryPromise",
        parameterizedQuery: e,
        opts: t,
        then: a((n, i) => r(e, t).then(n, i), "then"),
        catch: a((n) => r(e, t).catch(n), "catch"),
        finally: a((n) => r(e, t).finally(n), "finally"),
    };
};
var Vs = function (
    r,
    { arrayMode: e, fullResults: t, parameterizedQuery: n, resultCallback: i }
) {
    let s = r.fields.map((c) => c.name),
        o = r.fields.map((c) => xe.types.getTypeParser(c.dataTypeID)),
        u =
            e === true
                ? r.rows.map((c) =>
                      c.map((h, l) => (h === null ? null : o[l](h)))
                  )
                : r.rows.map((c) =>
                      Object.fromEntries(
                          c.map((h, l) => [s[l], h === null ? null : o[l](h)])
                      )
                  );
    return (
        i && i(n, r, u, { arrayMode: e, fullResults: t }),
        t ? ((r.viaNeonFetch = true), (r.rowAsArray = e), (r.rows = u), r) : u
    );
};
var Qc = function (r, e) {
    if (e)
        return {
            callback: e,
            result: undefined,
        };
    let t,
        n,
        i = a(function (o, u) {
            o ? t(o) : n(u);
        }, "cb"),
        s = new r(function (o, u) {
            (n = o), (t = u);
        });
    return { callback: i, result: s };
};
var eo = Object.create;
var Ie = Object.defineProperty;
var to = Object.getOwnPropertyDescriptor;
var ro = Object.getOwnPropertyNames;
var no = Object.getPrototypeOf;
var io = Object.prototype.hasOwnProperty;
var so = (r, e, t) =>
    e in r
        ? Ie(r, e, {
              enumerable: true,
              configurable: true,
              writable: true,
              value: t,
          })
        : (r[e] = t);
var a = (r, e) => Ie(r, "name", { value: e, configurable: true });
var z = (r, e) => () => (r && (e = r((r = 0))), e);
var T = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports);
var ie = (r, e) => {
    for (var t in e) Ie(r, t, { get: e[t], enumerable: true });
};
var An = (r, e, t, n) => {
    if ((e && typeof e == "object") || typeof e == "function")
        for (let i of ro(e))
            !io.call(r, i) &&
                i !== t &&
                Ie(r, i, {
                    get: () => e[i],
                    enumerable: !(n = to(e, i)) || n.enumerable,
                });
    return r;
};
var Qe = (r, e, t) => (
    (t = r != null ? eo(no(r)) : {}),
    An(
        e || !r || !r.__esModule
            ? Ie(t, "default", {
                  value: r,
                  enumerable: true,
              })
            : t,
        r
    )
);
var N = (r) => An(Ie({}, "__esModule", { value: true }), r);
var _ = (r, e, t) => so(r, typeof e != "symbol" ? e + "" : e, t);
var Tn = T((nt) => {
    p();
    nt.byteLength = ao;
    nt.toByteArray = co;
    nt.fromByteArray = fo;
    var ae = [],
        te = [],
        oo = typeof Uint8Array < "u" ? Uint8Array : Array,
        It = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (Ee = 0, Cn = It.length; Ee < Cn; ++Ee)
        (ae[Ee] = It[Ee]), (te[It.charCodeAt(Ee)] = Ee);
    var Ee, Cn;
    te[45] = 62;
    te[95] = 63;
    function In(r) {
        var e = r.length;
        if (e % 4 > 0)
            throw new Error("Invalid string. Length must be a multiple of 4");
        var t = r.indexOf("=");
        t === -1 && (t = e);
        var n = t === e ? 0 : 4 - (t % 4);
        return [t, n];
    }
    a(In, "getLens");
    function ao(r) {
        var e = In(r),
            t = e[0],
            n = e[1];
        return ((t + n) * 3) / 4 - n;
    }
    a(ao, "byteLength");
    function uo(r, e, t) {
        return ((e + t) * 3) / 4 - t;
    }
    a(uo, "_byteLength");
    function co(r) {
        var e,
            t = In(r),
            n = t[0],
            i = t[1],
            s = new oo(uo(r, n, i)),
            o = 0,
            u = i > 0 ? n - 4 : n,
            c;
        for (c = 0; c < u; c += 4)
            (e =
                (te[r.charCodeAt(c)] << 18) |
                (te[r.charCodeAt(c + 1)] << 12) |
                (te[r.charCodeAt(c + 2)] << 6) |
                te[r.charCodeAt(c + 3)]),
                (s[o++] = (e >> 16) & 255),
                (s[o++] = (e >> 8) & 255),
                (s[o++] = e & 255);
        return (
            i === 2 &&
                ((e =
                    (te[r.charCodeAt(c)] << 2) |
                    (te[r.charCodeAt(c + 1)] >> 4)),
                (s[o++] = e & 255)),
            i === 1 &&
                ((e =
                    (te[r.charCodeAt(c)] << 10) |
                    (te[r.charCodeAt(c + 1)] << 4) |
                    (te[r.charCodeAt(c + 2)] >> 2)),
                (s[o++] = (e >> 8) & 255),
                (s[o++] = e & 255)),
            s
        );
    }
    a(co, "toByteArray");
    function ho(r) {
        return (
            ae[(r >> 18) & 63] +
            ae[(r >> 12) & 63] +
            ae[(r >> 6) & 63] +
            ae[r & 63]
        );
    }
    a(ho, "tripletToBase64");
    function lo(r, e, t) {
        for (var n, i = [], s = e; s < t; s += 3)
            (n =
                ((r[s] << 16) & 16711680) +
                ((r[s + 1] << 8) & 65280) +
                (r[s + 2] & 255)),
                i.push(ho(n));
        return i.join("");
    }
    a(lo, "encodeChunk");
    function fo(r) {
        for (
            var e, t = r.length, n = t % 3, i = [], s = 16383, o = 0, u = t - n;
            o < u;
            o += s
        )
            i.push(lo(r, o, o + s > u ? u : o + s));
        return (
            n === 1
                ? ((e = r[t - 1]),
                  i.push(ae[e >> 2] + ae[(e << 4) & 63] + "=="))
                : n === 2 &&
                  ((e = (r[t - 2] << 8) + r[t - 1]),
                  i.push(
                      ae[e >> 10] + ae[(e >> 4) & 63] + ae[(e << 2) & 63] + "="
                  )),
            i.join("")
        );
    }
    a(fo, "fromByteArray");
});
var Pn = T((Tt) => {
    p();
    Tt.read = function (r, e, t, n, i) {
        var s,
            o,
            u = i * 8 - n - 1,
            c = (1 << u) - 1,
            h = c >> 1,
            l = -7,
            y = t ? i - 1 : 0,
            x = t ? -1 : 1,
            C = r[e + y];
        for (
            y += x, s = C & ((1 << -l) - 1), C >>= -l, l += u;
            l > 0;
            s = s * 256 + r[e + y], y += x, l -= 8
        );
        for (
            o = s & ((1 << -l) - 1), s >>= -l, l += n;
            l > 0;
            o = o * 256 + r[e + y], y += x, l -= 8
        );
        if (s === 0) s = 1 - h;
        else {
            if (s === c) return o ? NaN : (C ? -1 : 1) * (1 / 0);
            (o = o + Math.pow(2, n)), (s = s - h);
        }
        return (C ? -1 : 1) * o * Math.pow(2, s - n);
    };
    Tt.write = function (r, e, t, n, i, s) {
        var o,
            u,
            c,
            h = s * 8 - i - 1,
            l = (1 << h) - 1,
            y = l >> 1,
            x = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
            C = n ? 0 : s - 1,
            B = n ? 1 : -1,
            W = e < 0 || (e === 0 && 1 / e < 0) ? 1 : 0;
        for (
            e = Math.abs(e),
                isNaN(e) || e === 1 / 0
                    ? ((u = isNaN(e) ? 1 : 0), (o = l))
                    : ((o = Math.floor(Math.log(e) / Math.LN2)),
                      e * (c = Math.pow(2, -o)) < 1 && (o--, (c *= 2)),
                      o + y >= 1 ? (e += x / c) : (e += x * Math.pow(2, 1 - y)),
                      e * c >= 2 && (o++, (c /= 2)),
                      o + y >= l
                          ? ((u = 0), (o = l))
                          : o + y >= 1
                            ? ((u = (e * c - 1) * Math.pow(2, i)), (o = o + y))
                            : ((u = e * Math.pow(2, y - 1) * Math.pow(2, i)),
                              (o = 0)));
            i >= 8;
            r[t + C] = u & 255, C += B, u /= 256, i -= 8
        );
        for (
            o = (o << i) | u, h += i;
            h > 0;
            r[t + C] = o & 255, C += B, o /= 256, h -= 8
        );
        r[t + C - B] |= W * 128;
    };
});
var $n = T((Le) => {
    p();
    var Pt = Tn(),
        Pe = Pn(),
        Bn =
            typeof Symbol == "function" && typeof Symbol.for == "function"
                ? Symbol.for("nodejs.util.inspect.custom")
                : null;
    Le.Buffer = f;
    Le.SlowBuffer = bo;
    Le.INSPECT_MAX_BYTES = 50;
    var it = 2147483647;
    Le.kMaxLength = it;
    f.TYPED_ARRAY_SUPPORT = po();
    !f.TYPED_ARRAY_SUPPORT &&
        typeof console < "u" &&
        typeof console.error == "function" &&
        console.error(
            "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
    function po() {
        try {
            let r = new Uint8Array(1),
                e = {
                    foo: a(function () {
                        return 42;
                    }, "foo"),
                };
            return (
                Object.setPrototypeOf(e, Uint8Array.prototype),
                Object.setPrototypeOf(r, e),
                r.foo() === 42
            );
        } catch {
            return false;
        }
    }
    a(po, "typedArraySupport");
    Object.defineProperty(f.prototype, "parent", {
        enumerable: true,
        get: a(function () {
            if (f.isBuffer(this)) return this.buffer;
        }, "get"),
    });
    Object.defineProperty(f.prototype, "offset", {
        enumerable: true,
        get: a(function () {
            if (f.isBuffer(this)) return this.byteOffset;
        }, "get"),
    });
    function fe(r) {
        if (r > it)
            throw new RangeError(
                'The value "' + r + '" is invalid for option "size"'
            );
        let e = new Uint8Array(r);
        return Object.setPrototypeOf(e, f.prototype), e;
    }
    a(fe, "createBuffer");
    function f(r, e, t) {
        if (typeof r == "number") {
            if (typeof e == "string")
                throw new TypeError(
                    'The "string" argument must be of type string. Received type number'
                );
            return Ft(r);
        }
        return Mn(r, e, t);
    }
    a(f, "Buffer");
    f.poolSize = 8192;
    function Mn(r, e, t) {
        if (typeof r == "string") return mo(r, e);
        if (ArrayBuffer.isView(r)) return go(r);
        if (r == null)
            throw new TypeError(
                "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
                    typeof r
            );
        if (
            ue(r, ArrayBuffer) ||
            (r && ue(r.buffer, ArrayBuffer)) ||
            (typeof SharedArrayBuffer < "u" &&
                (ue(r, SharedArrayBuffer) ||
                    (r && ue(r.buffer, SharedArrayBuffer))))
        )
            return Lt(r, e, t);
        if (typeof r == "number")
            throw new TypeError(
                'The "value" argument must not be of type number. Received type number'
            );
        let n = r.valueOf && r.valueOf();
        if (n != null && n !== r) return f.from(n, e, t);
        let i = wo(r);
        if (i) return i;
        if (
            typeof Symbol < "u" &&
            Symbol.toPrimitive != null &&
            typeof r[Symbol.toPrimitive] == "function"
        )
            return f.from(r[Symbol.toPrimitive]("string"), e, t);
        throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
                typeof r
        );
    }
    a(Mn, "from");
    f.from = function (r, e, t) {
        return Mn(r, e, t);
    };
    Object.setPrototypeOf(f.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(f, Uint8Array);
    function Dn(r) {
        if (typeof r != "number")
            throw new TypeError('"size" argument must be of type number');
        if (r < 0)
            throw new RangeError(
                'The value "' + r + '" is invalid for option "size"'
            );
    }
    a(Dn, "assertSize");
    function yo(r, e, t) {
        return (
            Dn(r),
            r <= 0
                ? fe(r)
                : e !== undefined
                  ? typeof t == "string"
                      ? fe(r).fill(e, t)
                      : fe(r).fill(e)
                  : fe(r)
        );
    }
    a(yo, "alloc");
    f.alloc = function (r, e, t) {
        return yo(r, e, t);
    };
    function Ft(r) {
        return Dn(r), fe(r < 0 ? 0 : Mt(r) | 0);
    }
    a(Ft, "allocUnsafe");
    f.allocUnsafe = function (r) {
        return Ft(r);
    };
    f.allocUnsafeSlow = function (r) {
        return Ft(r);
    };
    function mo(r, e) {
        if (
            ((typeof e != "string" || e === "") && (e = "utf8"),
            !f.isEncoding(e))
        )
            throw new TypeError("Unknown encoding: " + e);
        let t = kn(r, e) | 0,
            n = fe(t),
            i = n.write(r, e);
        return i !== t && (n = n.slice(0, i)), n;
    }
    a(mo, "fromString");
    function Bt(r) {
        let e = r.length < 0 ? 0 : Mt(r.length) | 0,
            t = fe(e);
        for (let n = 0; n < e; n += 1) t[n] = r[n] & 255;
        return t;
    }
    a(Bt, "fromArrayLike");
    function go(r) {
        if (ue(r, Uint8Array)) {
            let e = new Uint8Array(r);
            return Lt(e.buffer, e.byteOffset, e.byteLength);
        }
        return Bt(r);
    }
    a(go, "fromArrayView");
    function Lt(r, e, t) {
        if (e < 0 || r.byteLength < e)
            throw new RangeError('"offset" is outside of buffer bounds');
        if (r.byteLength < e + (t || 0))
            throw new RangeError('"length" is outside of buffer bounds');
        let n;
        return (
            e === undefined && t === undefined
                ? (n = new Uint8Array(r))
                : t === undefined
                  ? (n = new Uint8Array(r, e))
                  : (n = new Uint8Array(r, e, t)),
            Object.setPrototypeOf(n, f.prototype),
            n
        );
    }
    a(Lt, "fromArrayBuffer");
    function wo(r) {
        if (f.isBuffer(r)) {
            let e = Mt(r.length) | 0,
                t = fe(e);
            return t.length === 0 || r.copy(t, 0, 0, e), t;
        }
        if (r.length !== undefined)
            return typeof r.length != "number" || kt(r.length) ? fe(0) : Bt(r);
        if (r.type === "Buffer" && Array.isArray(r.data)) return Bt(r.data);
    }
    a(wo, "fromObject");
    function Mt(r) {
        if (r >= it)
            throw new RangeError(
                "Attempt to allocate Buffer larger than maximum size: 0x" +
                    it.toString(16) +
                    " bytes"
            );
        return r | 0;
    }
    a(Mt, "checked");
    function bo(r) {
        return +r != r && (r = 0), f.alloc(+r);
    }
    a(bo, "SlowBuffer");
    f.isBuffer = a(function (e) {
        return e != null && e._isBuffer === true && e !== f.prototype;
    }, "isBuffer");
    f.compare = a(function (e, t) {
        if (
            (ue(e, Uint8Array) && (e = f.from(e, e.offset, e.byteLength)),
            ue(t, Uint8Array) && (t = f.from(t, t.offset, t.byteLength)),
            !f.isBuffer(e) || !f.isBuffer(t))
        )
            throw new TypeError(
                'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
            );
        if (e === t) return 0;
        let n = e.length,
            i = t.length;
        for (let s = 0, o = Math.min(n, i); s < o; ++s)
            if (e[s] !== t[s]) {
                (n = e[s]), (i = t[s]);
                break;
            }
        return n < i ? -1 : i < n ? 1 : 0;
    }, "compare");
    f.isEncoding = a(function (e) {
        switch (String(e).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return true;
            default:
                return false;
        }
    }, "isEncoding");
    f.concat = a(function (e, t) {
        if (!Array.isArray(e))
            throw new TypeError('"list" argument must be an Array of Buffers');
        if (e.length === 0) return f.alloc(0);
        let n;
        if (t === undefined)
            for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
        let i = f.allocUnsafe(t),
            s = 0;
        for (n = 0; n < e.length; ++n) {
            let o = e[n];
            if (ue(o, Uint8Array))
                s + o.length > i.length
                    ? (f.isBuffer(o) || (o = f.from(o)), o.copy(i, s))
                    : Uint8Array.prototype.set.call(i, o, s);
            else if (f.isBuffer(o)) o.copy(i, s);
            else
                throw new TypeError(
                    '"list" argument must be an Array of Buffers'
                );
            s += o.length;
        }
        return i;
    }, "concat");
    function kn(r, e) {
        if (f.isBuffer(r)) return r.length;
        if (ArrayBuffer.isView(r) || ue(r, ArrayBuffer)) return r.byteLength;
        if (typeof r != "string")
            throw new TypeError(
                'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
                    typeof r
            );
        let t = r.length,
            n = arguments.length > 2 && arguments[2] === true;
        if (!n && t === 0) return 0;
        let i = false;
        for (;;)
            switch (e) {
                case "ascii":
                case "latin1":
                case "binary":
                    return t;
                case "utf8":
                case "utf-8":
                    return Rt(r).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return t * 2;
                case "hex":
                    return t >>> 1;
                case "base64":
                    return Gn(r).length;
                default:
                    if (i) return n ? -1 : Rt(r).length;
                    (e = ("" + e).toLowerCase()), (i = true);
            }
    }
    a(kn, "byteLength");
    f.byteLength = kn;
    function So(r, e, t) {
        let n = false;
        if (
            ((e === undefined || e < 0) && (e = 0),
            e > this.length ||
                ((t === undefined || t > this.length) && (t = this.length),
                t <= 0) ||
                ((t >>>= 0), (e >>>= 0), t <= e))
        )
            return "";
        for (r || (r = "utf8"); ; )
            switch (r) {
                case "hex":
                    return Bo(this, e, t);
                case "utf8":
                case "utf-8":
                    return On(this, e, t);
                case "ascii":
                    return To(this, e, t);
                case "latin1":
                case "binary":
                    return Po(this, e, t);
                case "base64":
                    return Co(this, e, t);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return Lo(this, e, t);
                default:
                    if (n) throw new TypeError("Unknown encoding: " + r);
                    (r = (r + "").toLowerCase()), (n = true);
            }
    }
    a(So, "slowToString");
    f.prototype._isBuffer = true;
    function _e(r, e, t) {
        let n = r[e];
        (r[e] = r[t]), (r[t] = n);
    }
    a(_e, "swap");
    f.prototype.swap16 = a(function () {
        let e = this.length;
        if (e % 2 !== 0)
            throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let t = 0; t < e; t += 2) _e(this, t, t + 1);
        return this;
    }, "swap16");
    f.prototype.swap32 = a(function () {
        let e = this.length;
        if (e % 4 !== 0)
            throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let t = 0; t < e; t += 4)
            _e(this, t, t + 3), _e(this, t + 1, t + 2);
        return this;
    }, "swap32");
    f.prototype.swap64 = a(function () {
        let e = this.length;
        if (e % 8 !== 0)
            throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let t = 0; t < e; t += 8)
            _e(this, t, t + 7),
                _e(this, t + 1, t + 6),
                _e(this, t + 2, t + 5),
                _e(this, t + 3, t + 4);
        return this;
    }, "swap64");
    f.prototype.toString = a(function () {
        let e = this.length;
        return e === 0
            ? ""
            : arguments.length === 0
              ? On(this, 0, e)
              : So.apply(this, arguments);
    }, "toString");
    f.prototype.toLocaleString = f.prototype.toString;
    f.prototype.equals = a(function (e) {
        if (!f.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
        return this === e ? true : f.compare(this, e) === 0;
    }, "equals");
    f.prototype.inspect = a(function () {
        let e = "",
            t = Le.INSPECT_MAX_BYTES;
        return (
            (e = this.toString("hex", 0, t)
                .replace(/(.{2})/g, "$1 ")
                .trim()),
            this.length > t && (e += " ... "),
            "<Buffer " + e + ">"
        );
    }, "inspect");
    Bn && (f.prototype[Bn] = f.prototype.inspect);
    f.prototype.compare = a(function (e, t, n, i, s) {
        if (
            (ue(e, Uint8Array) && (e = f.from(e, e.offset, e.byteLength)),
            !f.isBuffer(e))
        )
            throw new TypeError(
                'The "target" argument must be one of type Buffer or Uint8Array. Received type ' +
                    typeof e
            );
        if (
            (t === undefined && (t = 0),
            n === undefined && (n = e ? e.length : 0),
            i === undefined && (i = 0),
            s === undefined && (s = this.length),
            t < 0 || n > e.length || i < 0 || s > this.length)
        )
            throw new RangeError("out of range index");
        if (i >= s && t >= n) return 0;
        if (i >= s) return -1;
        if (t >= n) return 1;
        if (((t >>>= 0), (n >>>= 0), (i >>>= 0), (s >>>= 0), this === e))
            return 0;
        let o = s - i,
            u = n - t,
            c = Math.min(o, u),
            h = this.slice(i, s),
            l = e.slice(t, n);
        for (let y = 0; y < c; ++y)
            if (h[y] !== l[y]) {
                (o = h[y]), (u = l[y]);
                break;
            }
        return o < u ? -1 : u < o ? 1 : 0;
    }, "compare");
    function Un(r, e, t, n, i) {
        if (r.length === 0) return -1;
        if (
            (typeof t == "string"
                ? ((n = t), (t = 0))
                : t > 2147483647
                  ? (t = 2147483647)
                  : t < -2147483648 && (t = -2147483648),
            (t = +t),
            kt(t) && (t = i ? 0 : r.length - 1),
            t < 0 && (t = r.length + t),
            t >= r.length)
        ) {
            if (i) return -1;
            t = r.length - 1;
        } else if (t < 0)
            if (i) t = 0;
            else return -1;
        if ((typeof e == "string" && (e = f.from(e, n)), f.isBuffer(e)))
            return e.length === 0 ? -1 : Ln(r, e, t, n, i);
        if (typeof e == "number")
            return (
                (e = e & 255),
                typeof Uint8Array.prototype.indexOf == "function"
                    ? i
                        ? Uint8Array.prototype.indexOf.call(r, e, t)
                        : Uint8Array.prototype.lastIndexOf.call(r, e, t)
                    : Ln(r, [e], t, n, i)
            );
        throw new TypeError("val must be string, number or Buffer");
    }
    a(Un, "bidirectionalIndexOf");
    function Ln(r, e, t, n, i) {
        let s = 1,
            o = r.length,
            u = e.length;
        if (
            n !== undefined &&
            ((n = String(n).toLowerCase()),
            n === "ucs2" ||
                n === "ucs-2" ||
                n === "utf16le" ||
                n === "utf-16le")
        ) {
            if (r.length < 2 || e.length < 2) return -1;
            (s = 2), (o /= 2), (u /= 2), (t /= 2);
        }
        function c(l, y) {
            return s === 1 ? l[y] : l.readUInt16BE(y * s);
        }
        a(c, "read");
        let h;
        if (i) {
            let l = -1;
            for (h = t; h < o; h++)
                if (c(r, h) === c(e, l === -1 ? 0 : h - l)) {
                    if ((l === -1 && (l = h), h - l + 1 === u)) return l * s;
                } else l !== -1 && (h -= h - l), (l = -1);
        } else
            for (t + u > o && (t = o - u), h = t; h >= 0; h--) {
                let l = true;
                for (let y = 0; y < u; y++)
                    if (c(r, h + y) !== c(e, y)) {
                        l = false;
                        break;
                    }
                if (l) return h;
            }
        return -1;
    }
    a(Ln, "arrayIndexOf");
    f.prototype.includes = a(function (e, t, n) {
        return this.indexOf(e, t, n) !== -1;
    }, "includes");
    f.prototype.indexOf = a(function (e, t, n) {
        return Un(this, e, t, n, true);
    }, "indexOf");
    f.prototype.lastIndexOf = a(function (e, t, n) {
        return Un(this, e, t, n, false);
    }, "lastIndexOf");
    function xo(r, e, t, n) {
        t = Number(t) || 0;
        let i = r.length - t;
        n ? ((n = Number(n)), n > i && (n = i)) : (n = i);
        let s = e.length;
        n > s / 2 && (n = s / 2);
        let o;
        for (o = 0; o < n; ++o) {
            let u = parseInt(e.substr(o * 2, 2), 16);
            if (kt(u)) return o;
            r[t + o] = u;
        }
        return o;
    }
    a(xo, "hexWrite");
    function vo(r, e, t, n) {
        return st(Rt(e, r.length - t), r, t, n);
    }
    a(vo, "utf8Write");
    function Eo(r, e, t, n) {
        return st(Do(e), r, t, n);
    }
    a(Eo, "asciiWrite");
    function _o(r, e, t, n) {
        return st(Gn(e), r, t, n);
    }
    a(_o, "base64Write");
    function Ao(r, e, t, n) {
        return st(ko(e, r.length - t), r, t, n);
    }
    a(Ao, "ucs2Write");
    f.prototype.write = a(function (e, t, n, i) {
        if (t === undefined) (i = "utf8"), (n = this.length), (t = 0);
        else if (n === undefined && typeof t == "string")
            (i = t), (n = this.length), (t = 0);
        else if (isFinite(t))
            (t = t >>> 0),
                isFinite(n)
                    ? ((n = n >>> 0), i === undefined && (i = "utf8"))
                    : ((i = n), (n = undefined));
        else
            throw new Error(
                "Buffer.write(string, encoding, offset[, length]) is no longer supported"
            );
        let s = this.length - t;
        if (
            ((n === undefined || n > s) && (n = s),
            (e.length > 0 && (n < 0 || t < 0)) || t > this.length)
        )
            throw new RangeError("Attempt to write outside buffer bounds");
        i || (i = "utf8");
        let o = false;
        for (;;)
            switch (i) {
                case "hex":
                    return xo(this, e, t, n);
                case "utf8":
                case "utf-8":
                    return vo(this, e, t, n);
                case "ascii":
                case "latin1":
                case "binary":
                    return Eo(this, e, t, n);
                case "base64":
                    return _o(this, e, t, n);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return Ao(this, e, t, n);
                default:
                    if (o) throw new TypeError("Unknown encoding: " + i);
                    (i = ("" + i).toLowerCase()), (o = true);
            }
    }, "write");
    f.prototype.toJSON = a(function () {
        return {
            type: "Buffer",
            data: Array.prototype.slice.call(this._arr || this, 0),
        };
    }, "toJSON");
    function Co(r, e, t) {
        return e === 0 && t === r.length
            ? Pt.fromByteArray(r)
            : Pt.fromByteArray(r.slice(e, t));
    }
    a(Co, "base64Slice");
    function On(r, e, t) {
        t = Math.min(r.length, t);
        let n = [],
            i = e;
        for (; i < t; ) {
            let s = r[i],
                o = null,
                u = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
            if (i + u <= t) {
                let c, h, l, y;
                switch (u) {
                    case 1:
                        s < 128 && (o = s);
                        break;
                    case 2:
                        (c = r[i + 1]),
                            (c & 192) === 128 &&
                                ((y = ((s & 31) << 6) | (c & 63)),
                                y > 127 && (o = y));
                        break;
                    case 3:
                        (c = r[i + 1]),
                            (h = r[i + 2]),
                            (c & 192) === 128 &&
                                (h & 192) === 128 &&
                                ((y =
                                    ((s & 15) << 12) |
                                    ((c & 63) << 6) |
                                    (h & 63)),
                                y > 2047 &&
                                    (y < 55296 || y > 57343) &&
                                    (o = y));
                        break;
                    case 4:
                        (c = r[i + 1]),
                            (h = r[i + 2]),
                            (l = r[i + 3]),
                            (c & 192) === 128 &&
                                (h & 192) === 128 &&
                                (l & 192) === 128 &&
                                ((y =
                                    ((s & 15) << 18) |
                                    ((c & 63) << 12) |
                                    ((h & 63) << 6) |
                                    (l & 63)),
                                y > 65535 && y < 1114112 && (o = y));
                }
            }
            o === null
                ? ((o = 65533), (u = 1))
                : o > 65535 &&
                  ((o -= 65536),
                  n.push(((o >>> 10) & 1023) | 55296),
                  (o = 56320 | (o & 1023))),
                n.push(o),
                (i += u);
        }
        return Io(n);
    }
    a(On, "utf8Slice");
    var Rn = 4096;
    function Io(r) {
        let e = r.length;
        if (e <= Rn) return String.fromCharCode.apply(String, r);
        let t = "",
            n = 0;
        for (; n < e; )
            t += String.fromCharCode.apply(String, r.slice(n, (n += Rn)));
        return t;
    }
    a(Io, "decodeCodePointsArray");
    function To(r, e, t) {
        let n = "";
        t = Math.min(r.length, t);
        for (let i = e; i < t; ++i) n += String.fromCharCode(r[i] & 127);
        return n;
    }
    a(To, "asciiSlice");
    function Po(r, e, t) {
        let n = "";
        t = Math.min(r.length, t);
        for (let i = e; i < t; ++i) n += String.fromCharCode(r[i]);
        return n;
    }
    a(Po, "latin1Slice");
    function Bo(r, e, t) {
        let n = r.length;
        (!e || e < 0) && (e = 0), (!t || t < 0 || t > n) && (t = n);
        let i = "";
        for (let s = e; s < t; ++s) i += Uo[r[s]];
        return i;
    }
    a(Bo, "hexSlice");
    function Lo(r, e, t) {
        let n = r.slice(e, t),
            i = "";
        for (let s = 0; s < n.length - 1; s += 2)
            i += String.fromCharCode(n[s] + n[s + 1] * 256);
        return i;
    }
    a(Lo, "utf16leSlice");
    f.prototype.slice = a(function (e, t) {
        let n = this.length;
        (e = ~~e),
            (t = t === undefined ? n : ~~t),
            e < 0 ? ((e += n), e < 0 && (e = 0)) : e > n && (e = n),
            t < 0 ? ((t += n), t < 0 && (t = 0)) : t > n && (t = n),
            t < e && (t = e);
        let i = this.subarray(e, t);
        return Object.setPrototypeOf(i, f.prototype), i;
    }, "slice");
    function q(r, e, t) {
        if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
        if (r + e > t)
            throw new RangeError("Trying to access beyond buffer length");
    }
    a(q, "checkOffset");
    f.prototype.readUintLE = f.prototype.readUIntLE = a(function (e, t, n) {
        (e = e >>> 0), (t = t >>> 0), n || q(e, t, this.length);
        let i = this[e],
            s = 1,
            o = 0;
        for (; ++o < t && (s *= 256); ) i += this[e + o] * s;
        return i;
    }, "readUIntLE");
    f.prototype.readUintBE = f.prototype.readUIntBE = a(function (e, t, n) {
        (e = e >>> 0), (t = t >>> 0), n || q(e, t, this.length);
        let i = this[e + --t],
            s = 1;
        for (; t > 0 && (s *= 256); ) i += this[e + --t] * s;
        return i;
    }, "readUIntBE");
    f.prototype.readUint8 = f.prototype.readUInt8 = a(function (e, t) {
        return (e = e >>> 0), t || q(e, 1, this.length), this[e];
    }, "readUInt8");
    f.prototype.readUint16LE = f.prototype.readUInt16LE = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 2, this.length),
            this[e] | (this[e + 1] << 8)
        );
    }, "readUInt16LE");
    f.prototype.readUint16BE = f.prototype.readUInt16BE = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 2, this.length),
            (this[e] << 8) | this[e + 1]
        );
    }, "readUInt16BE");
    f.prototype.readUint32LE = f.prototype.readUInt32LE = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 4, this.length),
            (this[e] | (this[e + 1] << 8) | (this[e + 2] << 16)) +
                this[e + 3] * 16777216
        );
    }, "readUInt32LE");
    f.prototype.readUint32BE = f.prototype.readUInt32BE = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 4, this.length),
            this[e] * 16777216 +
                ((this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3])
        );
    }, "readUInt32BE");
    f.prototype.readBigUInt64LE = ge(
        a(function (e) {
            (e = e >>> 0), Be(e, "offset");
            let t = this[e],
                n = this[e + 7];
            (t === undefined || n === undefined) && We(e, this.length - 8);
            let i =
                    t +
                    this[++e] * 2 ** 8 +
                    this[++e] * 2 ** 16 +
                    this[++e] * 2 ** 24,
                s =
                    this[++e] +
                    this[++e] * 2 ** 8 +
                    this[++e] * 2 ** 16 +
                    n * 2 ** 24;
            return BigInt(i) + (BigInt(s) << BigInt(32));
        }, "readBigUInt64LE")
    );
    f.prototype.readBigUInt64BE = ge(
        a(function (e) {
            (e = e >>> 0), Be(e, "offset");
            let t = this[e],
                n = this[e + 7];
            (t === undefined || n === undefined) && We(e, this.length - 8);
            let i =
                    t * 2 ** 24 +
                    this[++e] * 2 ** 16 +
                    this[++e] * 2 ** 8 +
                    this[++e],
                s =
                    this[++e] * 2 ** 24 +
                    this[++e] * 2 ** 16 +
                    this[++e] * 2 ** 8 +
                    n;
            return (BigInt(i) << BigInt(32)) + BigInt(s);
        }, "readBigUInt64BE")
    );
    f.prototype.readIntLE = a(function (e, t, n) {
        (e = e >>> 0), (t = t >>> 0), n || q(e, t, this.length);
        let i = this[e],
            s = 1,
            o = 0;
        for (; ++o < t && (s *= 256); ) i += this[e + o] * s;
        return (s *= 128), i >= s && (i -= Math.pow(2, 8 * t)), i;
    }, "readIntLE");
    f.prototype.readIntBE = a(function (e, t, n) {
        (e = e >>> 0), (t = t >>> 0), n || q(e, t, this.length);
        let i = t,
            s = 1,
            o = this[e + --i];
        for (; i > 0 && (s *= 256); ) o += this[e + --i] * s;
        return (s *= 128), o >= s && (o -= Math.pow(2, 8 * t)), o;
    }, "readIntBE");
    f.prototype.readInt8 = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 1, this.length),
            this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e]
        );
    }, "readInt8");
    f.prototype.readInt16LE = a(function (e, t) {
        (e = e >>> 0), t || q(e, 2, this.length);
        let n = this[e] | (this[e + 1] << 8);
        return n & 32768 ? n | 4294901760 : n;
    }, "readInt16LE");
    f.prototype.readInt16BE = a(function (e, t) {
        (e = e >>> 0), t || q(e, 2, this.length);
        let n = this[e + 1] | (this[e] << 8);
        return n & 32768 ? n | 4294901760 : n;
    }, "readInt16BE");
    f.prototype.readInt32LE = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 4, this.length),
            this[e] |
                (this[e + 1] << 8) |
                (this[e + 2] << 16) |
                (this[e + 3] << 24)
        );
    }, "readInt32LE");
    f.prototype.readInt32BE = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 4, this.length),
            (this[e] << 24) |
                (this[e + 1] << 16) |
                (this[e + 2] << 8) |
                this[e + 3]
        );
    }, "readInt32BE");
    f.prototype.readBigInt64LE = ge(
        a(function (e) {
            (e = e >>> 0), Be(e, "offset");
            let t = this[e],
                n = this[e + 7];
            (t === undefined || n === undefined) && We(e, this.length - 8);
            let i =
                this[e + 4] +
                this[e + 5] * 2 ** 8 +
                this[e + 6] * 2 ** 16 +
                (n << 24);
            return (
                (BigInt(i) << BigInt(32)) +
                BigInt(
                    t +
                        this[++e] * 2 ** 8 +
                        this[++e] * 2 ** 16 +
                        this[++e] * 2 ** 24
                )
            );
        }, "readBigInt64LE")
    );
    f.prototype.readBigInt64BE = ge(
        a(function (e) {
            (e = e >>> 0), Be(e, "offset");
            let t = this[e],
                n = this[e + 7];
            (t === undefined || n === undefined) && We(e, this.length - 8);
            let i =
                (t << 24) +
                this[++e] * 2 ** 16 +
                this[++e] * 2 ** 8 +
                this[++e];
            return (
                (BigInt(i) << BigInt(32)) +
                BigInt(
                    this[++e] * 2 ** 24 +
                        this[++e] * 2 ** 16 +
                        this[++e] * 2 ** 8 +
                        n
                )
            );
        }, "readBigInt64BE")
    );
    f.prototype.readFloatLE = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 4, this.length),
            Pe.read(this, e, true, 23, 4)
        );
    }, "readFloatLE");
    f.prototype.readFloatBE = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 4, this.length),
            Pe.read(this, e, false, 23, 4)
        );
    }, "readFloatBE");
    f.prototype.readDoubleLE = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 8, this.length),
            Pe.read(this, e, true, 52, 8)
        );
    }, "readDoubleLE");
    f.prototype.readDoubleBE = a(function (e, t) {
        return (
            (e = e >>> 0),
            t || q(e, 8, this.length),
            Pe.read(this, e, false, 52, 8)
        );
    }, "readDoubleBE");
    function Y(r, e, t, n, i, s) {
        if (!f.isBuffer(r))
            throw new TypeError('"buffer" argument must be a Buffer instance');
        if (e > i || e < s)
            throw new RangeError('"value" argument is out of bounds');
        if (t + n > r.length) throw new RangeError("Index out of range");
    }
    a(Y, "checkInt");
    f.prototype.writeUintLE = f.prototype.writeUIntLE = a(function (
        e,
        t,
        n,
        i
    ) {
        if (((e = +e), (t = t >>> 0), (n = n >>> 0), !i)) {
            let u = Math.pow(2, 8 * n) - 1;
            Y(this, e, t, n, u, 0);
        }
        let s = 1,
            o = 0;
        for (this[t] = e & 255; ++o < n && (s *= 256); )
            this[t + o] = (e / s) & 255;
        return t + n;
    }, "writeUIntLE");
    f.prototype.writeUintBE = f.prototype.writeUIntBE = a(function (
        e,
        t,
        n,
        i
    ) {
        if (((e = +e), (t = t >>> 0), (n = n >>> 0), !i)) {
            let u = Math.pow(2, 8 * n) - 1;
            Y(this, e, t, n, u, 0);
        }
        let s = n - 1,
            o = 1;
        for (this[t + s] = e & 255; --s >= 0 && (o *= 256); )
            this[t + s] = (e / o) & 255;
        return t + n;
    }, "writeUIntBE");
    f.prototype.writeUint8 = f.prototype.writeUInt8 = a(function (e, t, n) {
        return (
            (e = +e),
            (t = t >>> 0),
            n || Y(this, e, t, 1, 255, 0),
            (this[t] = e & 255),
            t + 1
        );
    }, "writeUInt8");
    f.prototype.writeUint16LE = f.prototype.writeUInt16LE = a(function (
        e,
        t,
        n
    ) {
        return (
            (e = +e),
            (t = t >>> 0),
            n || Y(this, e, t, 2, 65535, 0),
            (this[t] = e & 255),
            (this[t + 1] = e >>> 8),
            t + 2
        );
    }, "writeUInt16LE");
    f.prototype.writeUint16BE = f.prototype.writeUInt16BE = a(function (
        e,
        t,
        n
    ) {
        return (
            (e = +e),
            (t = t >>> 0),
            n || Y(this, e, t, 2, 65535, 0),
            (this[t] = e >>> 8),
            (this[t + 1] = e & 255),
            t + 2
        );
    }, "writeUInt16BE");
    f.prototype.writeUint32LE = f.prototype.writeUInt32LE = a(function (
        e,
        t,
        n
    ) {
        return (
            (e = +e),
            (t = t >>> 0),
            n || Y(this, e, t, 4, 4294967295, 0),
            (this[t + 3] = e >>> 24),
            (this[t + 2] = e >>> 16),
            (this[t + 1] = e >>> 8),
            (this[t] = e & 255),
            t + 4
        );
    }, "writeUInt32LE");
    f.prototype.writeUint32BE = f.prototype.writeUInt32BE = a(function (
        e,
        t,
        n
    ) {
        return (
            (e = +e),
            (t = t >>> 0),
            n || Y(this, e, t, 4, 4294967295, 0),
            (this[t] = e >>> 24),
            (this[t + 1] = e >>> 16),
            (this[t + 2] = e >>> 8),
            (this[t + 3] = e & 255),
            t + 4
        );
    }, "writeUInt32BE");
    function Nn(r, e, t, n, i) {
        Hn(e, n, i, r, t, 7);
        let s = Number(e & BigInt(4294967295));
        (r[t++] = s),
            (s = s >> 8),
            (r[t++] = s),
            (s = s >> 8),
            (r[t++] = s),
            (s = s >> 8),
            (r[t++] = s);
        let o = Number((e >> BigInt(32)) & BigInt(4294967295));
        return (
            (r[t++] = o),
            (o = o >> 8),
            (r[t++] = o),
            (o = o >> 8),
            (r[t++] = o),
            (o = o >> 8),
            (r[t++] = o),
            t
        );
    }
    a(Nn, "wrtBigUInt64LE");
    function qn(r, e, t, n, i) {
        Hn(e, n, i, r, t, 7);
        let s = Number(e & BigInt(4294967295));
        (r[t + 7] = s),
            (s = s >> 8),
            (r[t + 6] = s),
            (s = s >> 8),
            (r[t + 5] = s),
            (s = s >> 8),
            (r[t + 4] = s);
        let o = Number((e >> BigInt(32)) & BigInt(4294967295));
        return (
            (r[t + 3] = o),
            (o = o >> 8),
            (r[t + 2] = o),
            (o = o >> 8),
            (r[t + 1] = o),
            (o = o >> 8),
            (r[t] = o),
            t + 8
        );
    }
    a(qn, "wrtBigUInt64BE");
    f.prototype.writeBigUInt64LE = ge(
        a(function (e, t = 0) {
            return Nn(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
        }, "writeBigUInt64LE")
    );
    f.prototype.writeBigUInt64BE = ge(
        a(function (e, t = 0) {
            return qn(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
        }, "writeBigUInt64BE")
    );
    f.prototype.writeIntLE = a(function (e, t, n, i) {
        if (((e = +e), (t = t >>> 0), !i)) {
            let c = Math.pow(2, 8 * n - 1);
            Y(this, e, t, n, c - 1, -c);
        }
        let s = 0,
            o = 1,
            u = 0;
        for (this[t] = e & 255; ++s < n && (o *= 256); )
            e < 0 && u === 0 && this[t + s - 1] !== 0 && (u = 1),
                (this[t + s] = (((e / o) >> 0) - u) & 255);
        return t + n;
    }, "writeIntLE");
    f.prototype.writeIntBE = a(function (e, t, n, i) {
        if (((e = +e), (t = t >>> 0), !i)) {
            let c = Math.pow(2, 8 * n - 1);
            Y(this, e, t, n, c - 1, -c);
        }
        let s = n - 1,
            o = 1,
            u = 0;
        for (this[t + s] = e & 255; --s >= 0 && (o *= 256); )
            e < 0 && u === 0 && this[t + s + 1] !== 0 && (u = 1),
                (this[t + s] = (((e / o) >> 0) - u) & 255);
        return t + n;
    }, "writeIntBE");
    f.prototype.writeInt8 = a(function (e, t, n) {
        return (
            (e = +e),
            (t = t >>> 0),
            n || Y(this, e, t, 1, 127, -128),
            e < 0 && (e = 255 + e + 1),
            (this[t] = e & 255),
            t + 1
        );
    }, "writeInt8");
    f.prototype.writeInt16LE = a(function (e, t, n) {
        return (
            (e = +e),
            (t = t >>> 0),
            n || Y(this, e, t, 2, 32767, -32768),
            (this[t] = e & 255),
            (this[t + 1] = e >>> 8),
            t + 2
        );
    }, "writeInt16LE");
    f.prototype.writeInt16BE = a(function (e, t, n) {
        return (
            (e = +e),
            (t = t >>> 0),
            n || Y(this, e, t, 2, 32767, -32768),
            (this[t] = e >>> 8),
            (this[t + 1] = e & 255),
            t + 2
        );
    }, "writeInt16BE");
    f.prototype.writeInt32LE = a(function (e, t, n) {
        return (
            (e = +e),
            (t = t >>> 0),
            n || Y(this, e, t, 4, 2147483647, -2147483648),
            (this[t] = e & 255),
            (this[t + 1] = e >>> 8),
            (this[t + 2] = e >>> 16),
            (this[t + 3] = e >>> 24),
            t + 4
        );
    }, "writeInt32LE");
    f.prototype.writeInt32BE = a(function (e, t, n) {
        return (
            (e = +e),
            (t = t >>> 0),
            n || Y(this, e, t, 4, 2147483647, -2147483648),
            e < 0 && (e = 4294967295 + e + 1),
            (this[t] = e >>> 24),
            (this[t + 1] = e >>> 16),
            (this[t + 2] = e >>> 8),
            (this[t + 3] = e & 255),
            t + 4
        );
    }, "writeInt32BE");
    f.prototype.writeBigInt64LE = ge(
        a(function (e, t = 0) {
            return Nn(
                this,
                e,
                t,
                -BigInt("0x8000000000000000"),
                BigInt("0x7fffffffffffffff")
            );
        }, "writeBigInt64LE")
    );
    f.prototype.writeBigInt64BE = ge(
        a(function (e, t = 0) {
            return qn(
                this,
                e,
                t,
                -BigInt("0x8000000000000000"),
                BigInt("0x7fffffffffffffff")
            );
        }, "writeBigInt64BE")
    );
    function Qn(r, e, t, n, i, s) {
        if (t + n > r.length) throw new RangeError("Index out of range");
        if (t < 0) throw new RangeError("Index out of range");
    }
    a(Qn, "checkIEEE754");
    function Wn(r, e, t, n, i) {
        return (
            (e = +e),
            (t = t >>> 0),
            i ||
                Qn(
                    r,
                    e,
                    t,
                    4,
                    340282346638528860000000000000000000000,
                    -340282346638528860000000000000000000000
                ),
            Pe.write(r, e, t, n, 23, 4),
            t + 4
        );
    }
    a(Wn, "writeFloat");
    f.prototype.writeFloatLE = a(function (e, t, n) {
        return Wn(this, e, t, true, n);
    }, "writeFloatLE");
    f.prototype.writeFloatBE = a(function (e, t, n) {
        return Wn(this, e, t, false, n);
    }, "writeFloatBE");
    function jn(r, e, t, n, i) {
        return (
            (e = +e),
            (t = t >>> 0),
            i ||
                Qn(
                    r,
                    e,
                    t,
                    8,
                    179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
                    -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
                ),
            Pe.write(r, e, t, n, 52, 8),
            t + 8
        );
    }
    a(jn, "writeDouble");
    f.prototype.writeDoubleLE = a(function (e, t, n) {
        return jn(this, e, t, true, n);
    }, "writeDoubleLE");
    f.prototype.writeDoubleBE = a(function (e, t, n) {
        return jn(this, e, t, false, n);
    }, "writeDoubleBE");
    f.prototype.copy = a(function (e, t, n, i) {
        if (!f.isBuffer(e)) throw new TypeError("argument should be a Buffer");
        if (
            (n || (n = 0),
            !i && i !== 0 && (i = this.length),
            t >= e.length && (t = e.length),
            t || (t = 0),
            i > 0 && i < n && (i = n),
            i === n || e.length === 0 || this.length === 0)
        )
            return 0;
        if (t < 0) throw new RangeError("targetStart out of bounds");
        if (n < 0 || n >= this.length)
            throw new RangeError("Index out of range");
        if (i < 0) throw new RangeError("sourceEnd out of bounds");
        i > this.length && (i = this.length),
            e.length - t < i - n && (i = e.length - t + n);
        let s = i - n;
        return (
            this === e && typeof Uint8Array.prototype.copyWithin == "function"
                ? this.copyWithin(t, n, i)
                : Uint8Array.prototype.set.call(e, this.subarray(n, i), t),
            s
        );
    }, "copy");
    f.prototype.fill = a(function (e, t, n, i) {
        if (typeof e == "string") {
            if (
                (typeof t == "string"
                    ? ((i = t), (t = 0), (n = this.length))
                    : typeof n == "string" && ((i = n), (n = this.length)),
                i !== undefined && typeof i != "string")
            )
                throw new TypeError("encoding must be a string");
            if (typeof i == "string" && !f.isEncoding(i))
                throw new TypeError("Unknown encoding: " + i);
            if (e.length === 1) {
                let o = e.charCodeAt(0);
                ((i === "utf8" && o < 128) || i === "latin1") && (e = o);
            }
        } else
            typeof e == "number"
                ? (e = e & 255)
                : typeof e == "boolean" && (e = Number(e));
        if (t < 0 || this.length < t || this.length < n)
            throw new RangeError("Out of range index");
        if (n <= t) return this;
        (t = t >>> 0),
            (n = n === undefined ? this.length : n >>> 0),
            e || (e = 0);
        let s;
        if (typeof e == "number") for (s = t; s < n; ++s) this[s] = e;
        else {
            let o = f.isBuffer(e) ? e : f.from(e, i),
                u = o.length;
            if (u === 0)
                throw new TypeError(
                    'The value "' + e + '" is invalid for argument "value"'
                );
            for (s = 0; s < n - t; ++s) this[s + t] = o[s % u];
        }
        return this;
    }, "fill");
    var Te = {};
    function Dt(r, e, t) {
        var n;
        Te[r] =
            ((n = class extends t {
                constructor() {
                    super(),
                        Object.defineProperty(this, "message", {
                            value: e.apply(this, arguments),
                            writable: true,
                            configurable: true,
                        }),
                        (this.name = `${this.name} [${r}]`),
                        this.stack,
                        delete this.name;
                }
                get code() {
                    return r;
                }
                set code(s) {
                    Object.defineProperty(this, "code", {
                        configurable: true,
                        enumerable: true,
                        value: s,
                        writable: true,
                    });
                }
                toString() {
                    return `${this.name} [${r}]: ${this.message}`;
                }
            }),
            a(n, "NodeError"),
            n);
    }
    a(Dt, "E");
    Dt(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function (r) {
            return r
                ? `${r} is outside of buffer bounds`
                : "Attempt to access memory outside buffer bounds";
        },
        RangeError
    );
    Dt(
        "ERR_INVALID_ARG_TYPE",
        function (r, e) {
            return `The "${r}" argument must be of type number. Received type ${typeof e}`;
        },
        TypeError
    );
    Dt(
        "ERR_OUT_OF_RANGE",
        function (r, e, t) {
            let n = `The value of "${r}" is out of range.`,
                i = t;
            return (
                Number.isInteger(t) && Math.abs(t) > 2 ** 32
                    ? (i = Fn(String(t)))
                    : typeof t == "bigint" &&
                      ((i = String(t)),
                      (t > BigInt(2) ** BigInt(32) ||
                          t < -(BigInt(2) ** BigInt(32))) &&
                          (i = Fn(i)),
                      (i += "n")),
                (n += ` It must be ${e}. Received ${i}`),
                n
            );
        },
        RangeError
    );
    function Fn(r) {
        let e = "",
            t = r.length,
            n = r[0] === "-" ? 1 : 0;
        for (; t >= n + 4; t -= 3) e = `_${r.slice(t - 3, t)}${e}`;
        return `${r.slice(0, t)}${e}`;
    }
    a(Fn, "addNumericalSeparator");
    function Ro(r, e, t) {
        Be(e, "offset"),
            (r[e] === undefined || r[e + t] === undefined) &&
                We(e, r.length - (t + 1));
    }
    a(Ro, "checkBounds");
    function Hn(r, e, t, n, i, s) {
        if (r > t || r < e) {
            let o = typeof e == "bigint" ? "n" : "",
                u;
            throw (
                (s > 3
                    ? e === 0 || e === BigInt(0)
                        ? (u = `>= 0${o} and < 2${o} ** ${(s + 1) * 8}${o}`)
                        : (u = `>= -(2${o} ** ${(s + 1) * 8 - 1}${o}) and < 2 ** ${(s + 1) * 8 - 1}${o}`)
                    : (u = `>= ${e}${o} and <= ${t}${o}`),
                new Te.ERR_OUT_OF_RANGE("value", u, r))
            );
        }
        Ro(n, i, s);
    }
    a(Hn, "checkIntBI");
    function Be(r, e) {
        if (typeof r != "number")
            throw new Te.ERR_INVALID_ARG_TYPE(e, "number", r);
    }
    a(Be, "validateNumber");
    function We(r, e, t) {
        throw Math.floor(r) !== r
            ? (Be(r, t),
              new Te.ERR_OUT_OF_RANGE(t || "offset", "an integer", r))
            : e < 0
              ? new Te.ERR_BUFFER_OUT_OF_BOUNDS()
              : new Te.ERR_OUT_OF_RANGE(
                    t || "offset",
                    `>= ${t ? 1 : 0} and <= ${e}`,
                    r
                );
    }
    a(We, "boundsError");
    var Fo = /[^+/0-9A-Za-z-_]/g;
    function Mo(r) {
        if (
            ((r = r.split("=")[0]),
            (r = r.trim().replace(Fo, "")),
            r.length < 2)
        )
            return "";
        for (; r.length % 4 !== 0; ) r = r + "=";
        return r;
    }
    a(Mo, "base64clean");
    function Rt(r, e) {
        e = e || 1 / 0;
        let t,
            n = r.length,
            i = null,
            s = [];
        for (let o = 0; o < n; ++o) {
            if (((t = r.charCodeAt(o)), t > 55295 && t < 57344)) {
                if (!i) {
                    if (t > 56319) {
                        (e -= 3) > -1 && s.push(239, 191, 189);
                        continue;
                    } else if (o + 1 === n) {
                        (e -= 3) > -1 && s.push(239, 191, 189);
                        continue;
                    }
                    i = t;
                    continue;
                }
                if (t < 56320) {
                    (e -= 3) > -1 && s.push(239, 191, 189), (i = t);
                    continue;
                }
                t = (((i - 55296) << 10) | (t - 56320)) + 65536;
            } else i && (e -= 3) > -1 && s.push(239, 191, 189);
            if (((i = null), t < 128)) {
                if ((e -= 1) < 0) break;
                s.push(t);
            } else if (t < 2048) {
                if ((e -= 2) < 0) break;
                s.push((t >> 6) | 192, (t & 63) | 128);
            } else if (t < 65536) {
                if ((e -= 3) < 0) break;
                s.push((t >> 12) | 224, ((t >> 6) & 63) | 128, (t & 63) | 128);
            } else if (t < 1114112) {
                if ((e -= 4) < 0) break;
                s.push(
                    (t >> 18) | 240,
                    ((t >> 12) & 63) | 128,
                    ((t >> 6) & 63) | 128,
                    (t & 63) | 128
                );
            } else throw new Error("Invalid code point");
        }
        return s;
    }
    a(Rt, "utf8ToBytes");
    function Do(r) {
        let e = [];
        for (let t = 0; t < r.length; ++t) e.push(r.charCodeAt(t) & 255);
        return e;
    }
    a(Do, "asciiToBytes");
    function ko(r, e) {
        let t,
            n,
            i,
            s = [];
        for (let o = 0; o < r.length && !((e -= 2) < 0); ++o)
            (t = r.charCodeAt(o)),
                (n = t >> 8),
                (i = t % 256),
                s.push(i),
                s.push(n);
        return s;
    }
    a(ko, "utf16leToBytes");
    function Gn(r) {
        return Pt.toByteArray(Mo(r));
    }
    a(Gn, "base64ToBytes");
    function st(r, e, t, n) {
        let i;
        for (i = 0; i < n && !(i + t >= e.length || i >= r.length); ++i)
            e[i + t] = r[i];
        return i;
    }
    a(st, "blitBuffer");
    function ue(r, e) {
        return (
            r instanceof e ||
            (r != null &&
                r.constructor != null &&
                r.constructor.name != null &&
                r.constructor.name === e.name)
        );
    }
    a(ue, "isInstance");
    function kt(r) {
        return r !== r;
    }
    a(kt, "numberIsNaN");
    var Uo = (function () {
        let r = "0123456789abcdef",
            e = new Array(256);
        for (let t = 0; t < 16; ++t) {
            let n = t * 16;
            for (let i = 0; i < 16; ++i) e[n + i] = r[t] + r[i];
        }
        return e;
    })();
    function ge(r) {
        return typeof BigInt > "u" ? Oo : r;
    }
    a(ge, "defineBigIntMethod");
    function Oo() {
        throw new Error("BigInt not supported");
    }
    a(Oo, "BufferBigIntNotDefined");
});
var b2;
var S;
var v;
var g;
var d;
var m;
var p = z(() => {
    (b2 = globalThis),
        (S = globalThis.setImmediate ?? ((r) => setTimeout(r, 0))),
        (v = globalThis.clearImmediate ?? ((r) => clearTimeout(r))),
        (g = globalThis.crypto ?? {});
    g.subtle ?? (g.subtle = {});
    (d =
        typeof globalThis.Buffer == "function" &&
        typeof globalThis.Buffer.allocUnsafe == "function"
            ? globalThis.Buffer
            : $n().Buffer),
        (m = globalThis.process ?? {});
    m.env ?? (m.env = {});
    try {
        m.nextTick(() => {});
    } catch {
        let e = Promise.resolve();
        m.nextTick = e.then.bind(e);
    }
});
var we = T((Jc, Ut) => {
    p();
    var Re = typeof Reflect == "object" ? Reflect : null,
        Vn =
            Re && typeof Re.apply == "function"
                ? Re.apply
                : a(function (e, t, n) {
                      return Function.prototype.apply.call(e, t, n);
                  }, "ReflectApply"),
        ot;
    Re && typeof Re.ownKeys == "function"
        ? (ot = Re.ownKeys)
        : Object.getOwnPropertySymbols
          ? (ot = a(function (e) {
                return Object.getOwnPropertyNames(e).concat(
                    Object.getOwnPropertySymbols(e)
                );
            }, "ReflectOwnKeys"))
          : (ot = a(function (e) {
                return Object.getOwnPropertyNames(e);
            }, "ReflectOwnKeys"));
    function No(r) {
        console && console.warn && console.warn(r);
    }
    a(No, "ProcessEmitWarning");
    var zn =
        Number.isNaN ||
        a(function (e) {
            return e !== e;
        }, "NumberIsNaN");
    function L() {
        L.init.call(this);
    }
    a(L, "EventEmitter");
    Ut.exports = L;
    Ut.exports.once = jo;
    L.EventEmitter = L;
    L.prototype._events = undefined;
    L.prototype._eventsCount = 0;
    L.prototype._maxListeners = undefined;
    var Kn = 10;
    function at(r) {
        if (typeof r != "function")
            throw new TypeError(
                'The "listener" argument must be of type Function. Received type ' +
                    typeof r
            );
    }
    a(at, "checkListener");
    Object.defineProperty(L, "defaultMaxListeners", {
        enumerable: true,
        get: a(function () {
            return Kn;
        }, "get"),
        set: a(function (r) {
            if (typeof r != "number" || r < 0 || zn(r))
                throw new RangeError(
                    'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
                        r +
                        "."
                );
            Kn = r;
        }, "set"),
    });
    L.init = function () {
        (this._events === undefined ||
            this._events === Object.getPrototypeOf(this)._events) &&
            ((this._events = Object.create(null)), (this._eventsCount = 0)),
            (this._maxListeners = this._maxListeners || undefined);
    };
    L.prototype.setMaxListeners = a(function (e) {
        if (typeof e != "number" || e < 0 || zn(e))
            throw new RangeError(
                'The value of "n" is out of range. It must be a non-negative number. Received ' +
                    e +
                    "."
            );
        return (this._maxListeners = e), this;
    }, "setMaxListeners");
    function Yn(r) {
        return r._maxListeners === undefined
            ? L.defaultMaxListeners
            : r._maxListeners;
    }
    a(Yn, "_getMaxListeners");
    L.prototype.getMaxListeners = a(function () {
        return Yn(this);
    }, "getMaxListeners");
    L.prototype.emit = a(function (e) {
        for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
        var i = e === "error",
            s = this._events;
        if (s !== undefined) i = i && s.error === undefined;
        else if (!i) return false;
        if (i) {
            var o;
            if ((t.length > 0 && (o = t[0]), o instanceof Error)) throw o;
            var u = new Error(
                "Unhandled error." + (o ? " (" + o.message + ")" : "")
            );
            throw ((u.context = o), u);
        }
        var c = s[e];
        if (c === undefined) return false;
        if (typeof c == "function") Vn(c, this, t);
        else
            for (var h = c.length, l = ti(c, h), n = 0; n < h; ++n)
                Vn(l[n], this, t);
        return true;
    }, "emit");
    function Zn(r, e, t, n) {
        var i, s, o;
        if (
            (at(t),
            (s = r._events),
            s === undefined
                ? ((s = r._events = Object.create(null)), (r._eventsCount = 0))
                : (s.newListener !== undefined &&
                      (r.emit("newListener", e, t.listener ? t.listener : t),
                      (s = r._events)),
                  (o = s[e])),
            o === undefined)
        )
            (o = s[e] = t), ++r._eventsCount;
        else if (
            (typeof o == "function"
                ? (o = s[e] = n ? [t, o] : [o, t])
                : n
                  ? o.unshift(t)
                  : o.push(t),
            (i = Yn(r)),
            i > 0 && o.length > i && !o.warned)
        ) {
            o.warned = true;
            var u = new Error(
                "Possible EventEmitter memory leak detected. " +
                    o.length +
                    " " +
                    String(e) +
                    " listeners added. Use emitter.setMaxListeners() to increase limit"
            );
            (u.name = "MaxListenersExceededWarning"),
                (u.emitter = r),
                (u.type = e),
                (u.count = o.length),
                No(u);
        }
        return r;
    }
    a(Zn, "_addListener");
    L.prototype.addListener = a(function (e, t) {
        return Zn(this, e, t, false);
    }, "addListener");
    L.prototype.on = L.prototype.addListener;
    L.prototype.prependListener = a(function (e, t) {
        return Zn(this, e, t, true);
    }, "prependListener");
    function qo() {
        if (!this.fired)
            return (
                this.target.removeListener(this.type, this.wrapFn),
                (this.fired = true),
                arguments.length === 0
                    ? this.listener.call(this.target)
                    : this.listener.apply(this.target, arguments)
            );
    }
    a(qo, "onceWrapper");
    function Jn(r, e, t) {
        var n = {
                fired: false,
                wrapFn: undefined,
                target: r,
                type: e,
                listener: t,
            },
            i = qo.bind(n);
        return (i.listener = t), (n.wrapFn = i), i;
    }
    a(Jn, "_onceWrap");
    L.prototype.once = a(function (e, t) {
        return at(t), this.on(e, Jn(this, e, t)), this;
    }, "once");
    L.prototype.prependOnceListener = a(function (e, t) {
        return at(t), this.prependListener(e, Jn(this, e, t)), this;
    }, "prependOnceListener");
    L.prototype.removeListener = a(function (e, t) {
        var n, i, s, o, u;
        if ((at(t), (i = this._events), i === undefined)) return this;
        if (((n = i[e]), n === undefined)) return this;
        if (n === t || n.listener === t)
            --this._eventsCount === 0
                ? (this._events = Object.create(null))
                : (delete i[e],
                  i.removeListener &&
                      this.emit("removeListener", e, n.listener || t));
        else if (typeof n != "function") {
            for (s = -1, o = n.length - 1; o >= 0; o--)
                if (n[o] === t || n[o].listener === t) {
                    (u = n[o].listener), (s = o);
                    break;
                }
            if (s < 0) return this;
            s === 0 ? n.shift() : Qo(n, s),
                n.length === 1 && (i[e] = n[0]),
                i.removeListener !== undefined &&
                    this.emit("removeListener", e, u || t);
        }
        return this;
    }, "removeListener");
    L.prototype.off = L.prototype.removeListener;
    L.prototype.removeAllListeners = a(function (e) {
        var t, n, i;
        if (((n = this._events), n === undefined)) return this;
        if (n.removeListener === undefined)
            return (
                arguments.length === 0
                    ? ((this._events = Object.create(null)),
                      (this._eventsCount = 0))
                    : n[e] !== undefined &&
                      (--this._eventsCount === 0
                          ? (this._events = Object.create(null))
                          : delete n[e]),
                this
            );
        if (arguments.length === 0) {
            var s = Object.keys(n),
                o;
            for (i = 0; i < s.length; ++i)
                (o = s[i]),
                    o !== "removeListener" && this.removeAllListeners(o);
            return (
                this.removeAllListeners("removeListener"),
                (this._events = Object.create(null)),
                (this._eventsCount = 0),
                this
            );
        }
        if (((t = n[e]), typeof t == "function")) this.removeListener(e, t);
        else if (t !== undefined)
            for (i = t.length - 1; i >= 0; i--) this.removeListener(e, t[i]);
        return this;
    }, "removeAllListeners");
    function Xn(r, e, t) {
        var n = r._events;
        if (n === undefined) return [];
        var i = n[e];
        return i === undefined
            ? []
            : typeof i == "function"
              ? t
                  ? [i.listener || i]
                  : [i]
              : t
                ? Wo(i)
                : ti(i, i.length);
    }
    a(Xn, "_listeners");
    L.prototype.listeners = a(function (e) {
        return Xn(this, e, true);
    }, "listeners");
    L.prototype.rawListeners = a(function (e) {
        return Xn(this, e, false);
    }, "rawListeners");
    L.listenerCount = function (r, e) {
        return typeof r.listenerCount == "function"
            ? r.listenerCount(e)
            : ei.call(r, e);
    };
    L.prototype.listenerCount = ei;
    function ei(r) {
        var e = this._events;
        if (e !== undefined) {
            var t = e[r];
            if (typeof t == "function") return 1;
            if (t !== undefined) return t.length;
        }
        return 0;
    }
    a(ei, "listenerCount");
    L.prototype.eventNames = a(function () {
        return this._eventsCount > 0 ? ot(this._events) : [];
    }, "eventNames");
    function ti(r, e) {
        for (var t = new Array(e), n = 0; n < e; ++n) t[n] = r[n];
        return t;
    }
    a(ti, "arrayClone");
    function Qo(r, e) {
        for (; e + 1 < r.length; e++) r[e] = r[e + 1];
        r.pop();
    }
    a(Qo, "spliceOne");
    function Wo(r) {
        for (var e = new Array(r.length), t = 0; t < e.length; ++t)
            e[t] = r[t].listener || r[t];
        return e;
    }
    a(Wo, "unwrapListeners");
    function jo(r, e) {
        return new Promise(function (t, n) {
            function i(o) {
                r.removeListener(e, s), n(o);
            }
            a(i, "errorListener");
            function s() {
                typeof r.removeListener == "function" &&
                    r.removeListener("error", i),
                    t([].slice.call(arguments));
            }
            a(s, "resolver"),
                ri(r, e, s, { once: true }),
                e !== "error" && Ho(r, i, { once: true });
        });
    }
    a(jo, "once");
    function Ho(r, e, t) {
        typeof r.on == "function" && ri(r, "error", e, t);
    }
    a(Ho, "addErrorHandlerIfEventEmitter");
    function ri(r, e, t, n) {
        if (typeof r.on == "function") n.once ? r.once(e, t) : r.on(e, t);
        else if (typeof r.addEventListener == "function")
            r.addEventListener(
                e,
                a(function i(s) {
                    n.once && r.removeEventListener(e, i), t(s);
                }, "wrapListener")
            );
        else
            throw new TypeError(
                'The "emitter" argument must be of type EventEmitter. Received type ' +
                    typeof r
            );
    }
    a(ri, "eventTargetAgnosticAddListener");
});
var je = {};
ie(je, { default: () => Go });
var Go;
var He = z(() => {
    p();
    Go = {};
});
var ni = z(() => {
    p();
    a(Ge, "sha256");
});
var U;
var $e;
var ii = z(() => {
    p();
    U = class U2 {
        constructor() {
            _(this, "_dataLength", 0);
            _(this, "_bufferLength", 0);
            _(this, "_state", new Int32Array(4));
            _(this, "_buffer", new ArrayBuffer(68));
            _(this, "_buffer8");
            _(this, "_buffer32");
            (this._buffer8 = new Uint8Array(this._buffer, 0, 68)),
                (this._buffer32 = new Uint32Array(this._buffer, 0, 17)),
                this.start();
        }
        static hashByteArray(e, t = false) {
            return this.onePassHasher.start().appendByteArray(e).end(t);
        }
        static hashStr(e, t = false) {
            return this.onePassHasher.start().appendStr(e).end(t);
        }
        static hashAsciiStr(e, t = false) {
            return this.onePassHasher.start().appendAsciiStr(e).end(t);
        }
        static _hex(e) {
            let { hexChars: t, hexOut: n } = U2,
                i,
                s,
                o,
                u;
            for (u = 0; u < 4; u += 1)
                for (s = u * 8, i = e[u], o = 0; o < 8; o += 2)
                    (n[s + 1 + o] = t.charAt(i & 15)),
                        (i >>>= 4),
                        (n[s + 0 + o] = t.charAt(i & 15)),
                        (i >>>= 4);
            return n.join("");
        }
        static _md5cycle(e, t) {
            let n = e[0],
                i = e[1],
                s = e[2],
                o = e[3];
            (n += (((i & s) | (~i & o)) + t[0] - 680876936) | 0),
                (n = (((n << 7) | (n >>> 25)) + i) | 0),
                (o += (((n & i) | (~n & s)) + t[1] - 389564586) | 0),
                (o = (((o << 12) | (o >>> 20)) + n) | 0),
                (s += (((o & n) | (~o & i)) + t[2] + 606105819) | 0),
                (s = (((s << 17) | (s >>> 15)) + o) | 0),
                (i += (((s & o) | (~s & n)) + t[3] - 1044525330) | 0),
                (i = (((i << 22) | (i >>> 10)) + s) | 0),
                (n += (((i & s) | (~i & o)) + t[4] - 176418897) | 0),
                (n = (((n << 7) | (n >>> 25)) + i) | 0),
                (o += (((n & i) | (~n & s)) + t[5] + 1200080426) | 0),
                (o = (((o << 12) | (o >>> 20)) + n) | 0),
                (s += (((o & n) | (~o & i)) + t[6] - 1473231341) | 0),
                (s = (((s << 17) | (s >>> 15)) + o) | 0),
                (i += (((s & o) | (~s & n)) + t[7] - 45705983) | 0),
                (i = (((i << 22) | (i >>> 10)) + s) | 0),
                (n += (((i & s) | (~i & o)) + t[8] + 1770035416) | 0),
                (n = (((n << 7) | (n >>> 25)) + i) | 0),
                (o += (((n & i) | (~n & s)) + t[9] - 1958414417) | 0),
                (o = (((o << 12) | (o >>> 20)) + n) | 0),
                (s += (((o & n) | (~o & i)) + t[10] - 42063) | 0),
                (s = (((s << 17) | (s >>> 15)) + o) | 0),
                (i += (((s & o) | (~s & n)) + t[11] - 1990404162) | 0),
                (i = (((i << 22) | (i >>> 10)) + s) | 0),
                (n += (((i & s) | (~i & o)) + t[12] + 1804603682) | 0),
                (n = (((n << 7) | (n >>> 25)) + i) | 0),
                (o += (((n & i) | (~n & s)) + t[13] - 40341101) | 0),
                (o = (((o << 12) | (o >>> 20)) + n) | 0),
                (s += (((o & n) | (~o & i)) + t[14] - 1502002290) | 0),
                (s = (((s << 17) | (s >>> 15)) + o) | 0),
                (i += (((s & o) | (~s & n)) + t[15] + 1236535329) | 0),
                (i = (((i << 22) | (i >>> 10)) + s) | 0),
                (n += (((i & o) | (s & ~o)) + t[1] - 165796510) | 0),
                (n = (((n << 5) | (n >>> 27)) + i) | 0),
                (o += (((n & s) | (i & ~s)) + t[6] - 1069501632) | 0),
                (o = (((o << 9) | (o >>> 23)) + n) | 0),
                (s += (((o & i) | (n & ~i)) + t[11] + 643717713) | 0),
                (s = (((s << 14) | (s >>> 18)) + o) | 0),
                (i += (((s & n) | (o & ~n)) + t[0] - 373897302) | 0),
                (i = (((i << 20) | (i >>> 12)) + s) | 0),
                (n += (((i & o) | (s & ~o)) + t[5] - 701558691) | 0),
                (n = (((n << 5) | (n >>> 27)) + i) | 0),
                (o += (((n & s) | (i & ~s)) + t[10] + 38016083) | 0),
                (o = (((o << 9) | (o >>> 23)) + n) | 0),
                (s += (((o & i) | (n & ~i)) + t[15] - 660478335) | 0),
                (s = (((s << 14) | (s >>> 18)) + o) | 0),
                (i += (((s & n) | (o & ~n)) + t[4] - 405537848) | 0),
                (i = (((i << 20) | (i >>> 12)) + s) | 0),
                (n += (((i & o) | (s & ~o)) + t[9] + 568446438) | 0),
                (n = (((n << 5) | (n >>> 27)) + i) | 0),
                (o += (((n & s) | (i & ~s)) + t[14] - 1019803690) | 0),
                (o = (((o << 9) | (o >>> 23)) + n) | 0),
                (s += (((o & i) | (n & ~i)) + t[3] - 187363961) | 0),
                (s = (((s << 14) | (s >>> 18)) + o) | 0),
                (i += (((s & n) | (o & ~n)) + t[8] + 1163531501) | 0),
                (i = (((i << 20) | (i >>> 12)) + s) | 0),
                (n += (((i & o) | (s & ~o)) + t[13] - 1444681467) | 0),
                (n = (((n << 5) | (n >>> 27)) + i) | 0),
                (o += (((n & s) | (i & ~s)) + t[2] - 51403784) | 0),
                (o = (((o << 9) | (o >>> 23)) + n) | 0),
                (s += (((o & i) | (n & ~i)) + t[7] + 1735328473) | 0),
                (s = (((s << 14) | (s >>> 18)) + o) | 0),
                (i += (((s & n) | (o & ~n)) + t[12] - 1926607734) | 0),
                (i = (((i << 20) | (i >>> 12)) + s) | 0),
                (n += ((i ^ s ^ o) + t[5] - 378558) | 0),
                (n = (((n << 4) | (n >>> 28)) + i) | 0),
                (o += ((n ^ i ^ s) + t[8] - 2022574463) | 0),
                (o = (((o << 11) | (o >>> 21)) + n) | 0),
                (s += ((o ^ n ^ i) + t[11] + 1839030562) | 0),
                (s = (((s << 16) | (s >>> 16)) + o) | 0),
                (i += ((s ^ o ^ n) + t[14] - 35309556) | 0),
                (i = (((i << 23) | (i >>> 9)) + s) | 0),
                (n += ((i ^ s ^ o) + t[1] - 1530992060) | 0),
                (n = (((n << 4) | (n >>> 28)) + i) | 0),
                (o += ((n ^ i ^ s) + t[4] + 1272893353) | 0),
                (o = (((o << 11) | (o >>> 21)) + n) | 0),
                (s += ((o ^ n ^ i) + t[7] - 155497632) | 0),
                (s = (((s << 16) | (s >>> 16)) + o) | 0),
                (i += ((s ^ o ^ n) + t[10] - 1094730640) | 0),
                (i = (((i << 23) | (i >>> 9)) + s) | 0),
                (n += ((i ^ s ^ o) + t[13] + 681279174) | 0),
                (n = (((n << 4) | (n >>> 28)) + i) | 0),
                (o += ((n ^ i ^ s) + t[0] - 358537222) | 0),
                (o = (((o << 11) | (o >>> 21)) + n) | 0),
                (s += ((o ^ n ^ i) + t[3] - 722521979) | 0),
                (s = (((s << 16) | (s >>> 16)) + o) | 0),
                (i += ((s ^ o ^ n) + t[6] + 76029189) | 0),
                (i = (((i << 23) | (i >>> 9)) + s) | 0),
                (n += ((i ^ s ^ o) + t[9] - 640364487) | 0),
                (n = (((n << 4) | (n >>> 28)) + i) | 0),
                (o += ((n ^ i ^ s) + t[12] - 421815835) | 0),
                (o = (((o << 11) | (o >>> 21)) + n) | 0),
                (s += ((o ^ n ^ i) + t[15] + 530742520) | 0),
                (s = (((s << 16) | (s >>> 16)) + o) | 0),
                (i += ((s ^ o ^ n) + t[2] - 995338651) | 0),
                (i = (((i << 23) | (i >>> 9)) + s) | 0),
                (n += ((s ^ (i | ~o)) + t[0] - 198630844) | 0),
                (n = (((n << 6) | (n >>> 26)) + i) | 0),
                (o += ((i ^ (n | ~s)) + t[7] + 1126891415) | 0),
                (o = (((o << 10) | (o >>> 22)) + n) | 0),
                (s += ((n ^ (o | ~i)) + t[14] - 1416354905) | 0),
                (s = (((s << 15) | (s >>> 17)) + o) | 0),
                (i += ((o ^ (s | ~n)) + t[5] - 57434055) | 0),
                (i = (((i << 21) | (i >>> 11)) + s) | 0),
                (n += ((s ^ (i | ~o)) + t[12] + 1700485571) | 0),
                (n = (((n << 6) | (n >>> 26)) + i) | 0),
                (o += ((i ^ (n | ~s)) + t[3] - 1894986606) | 0),
                (o = (((o << 10) | (o >>> 22)) + n) | 0),
                (s += ((n ^ (o | ~i)) + t[10] - 1051523) | 0),
                (s = (((s << 15) | (s >>> 17)) + o) | 0),
                (i += ((o ^ (s | ~n)) + t[1] - 2054922799) | 0),
                (i = (((i << 21) | (i >>> 11)) + s) | 0),
                (n += ((s ^ (i | ~o)) + t[8] + 1873313359) | 0),
                (n = (((n << 6) | (n >>> 26)) + i) | 0),
                (o += ((i ^ (n | ~s)) + t[15] - 30611744) | 0),
                (o = (((o << 10) | (o >>> 22)) + n) | 0),
                (s += ((n ^ (o | ~i)) + t[6] - 1560198380) | 0),
                (s = (((s << 15) | (s >>> 17)) + o) | 0),
                (i += ((o ^ (s | ~n)) + t[13] + 1309151649) | 0),
                (i = (((i << 21) | (i >>> 11)) + s) | 0),
                (n += ((s ^ (i | ~o)) + t[4] - 145523070) | 0),
                (n = (((n << 6) | (n >>> 26)) + i) | 0),
                (o += ((i ^ (n | ~s)) + t[11] - 1120210379) | 0),
                (o = (((o << 10) | (o >>> 22)) + n) | 0),
                (s += ((n ^ (o | ~i)) + t[2] + 718787259) | 0),
                (s = (((s << 15) | (s >>> 17)) + o) | 0),
                (i += ((o ^ (s | ~n)) + t[9] - 343485551) | 0),
                (i = (((i << 21) | (i >>> 11)) + s) | 0),
                (e[0] = (n + e[0]) | 0),
                (e[1] = (i + e[1]) | 0),
                (e[2] = (s + e[2]) | 0),
                (e[3] = (o + e[3]) | 0);
        }
        start() {
            return (
                (this._dataLength = 0),
                (this._bufferLength = 0),
                this._state.set(U2.stateIdentity),
                this
            );
        }
        appendStr(e) {
            let t = this._buffer8,
                n = this._buffer32,
                i = this._bufferLength,
                s,
                o;
            for (o = 0; o < e.length; o += 1) {
                if (((s = e.charCodeAt(o)), s < 128)) t[i++] = s;
                else if (s < 2048)
                    (t[i++] = (s >>> 6) + 192), (t[i++] = (s & 63) | 128);
                else if (s < 55296 || s > 56319)
                    (t[i++] = (s >>> 12) + 224),
                        (t[i++] = ((s >>> 6) & 63) | 128),
                        (t[i++] = (s & 63) | 128);
                else {
                    if (
                        ((s =
                            (s - 55296) * 1024 +
                            (e.charCodeAt(++o) - 56320) +
                            65536),
                        s > 1114111)
                    )
                        throw new Error(
                            "Unicode standard supports code points up to U+10FFFF"
                        );
                    (t[i++] = (s >>> 18) + 240),
                        (t[i++] = ((s >>> 12) & 63) | 128),
                        (t[i++] = ((s >>> 6) & 63) | 128),
                        (t[i++] = (s & 63) | 128);
                }
                i >= 64 &&
                    ((this._dataLength += 64),
                    U2._md5cycle(this._state, n),
                    (i -= 64),
                    (n[0] = n[16]));
            }
            return (this._bufferLength = i), this;
        }
        appendAsciiStr(e) {
            let t = this._buffer8,
                n = this._buffer32,
                i = this._bufferLength,
                s,
                o = 0;
            for (;;) {
                for (s = Math.min(e.length - o, 64 - i); s--; )
                    t[i++] = e.charCodeAt(o++);
                if (i < 64) break;
                (this._dataLength += 64), U2._md5cycle(this._state, n), (i = 0);
            }
            return (this._bufferLength = i), this;
        }
        appendByteArray(e) {
            let t = this._buffer8,
                n = this._buffer32,
                i = this._bufferLength,
                s,
                o = 0;
            for (;;) {
                for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e[o++];
                if (i < 64) break;
                (this._dataLength += 64), U2._md5cycle(this._state, n), (i = 0);
            }
            return (this._bufferLength = i), this;
        }
        getState() {
            let e = this._state;
            return {
                buffer: String.fromCharCode.apply(
                    null,
                    Array.from(this._buffer8)
                ),
                buflen: this._bufferLength,
                length: this._dataLength,
                state: [e[0], e[1], e[2], e[3]],
            };
        }
        setState(e) {
            let { buffer: t, state: n } = e,
                i = this._state,
                s;
            for (
                this._dataLength = e.length,
                    this._bufferLength = e.buflen,
                    i[0] = n[0],
                    i[1] = n[1],
                    i[2] = n[2],
                    i[3] = n[3],
                    s = 0;
                s < t.length;
                s += 1
            )
                this._buffer8[s] = t.charCodeAt(s);
        }
        end(e = false) {
            let t = this._bufferLength,
                n = this._buffer8,
                i = this._buffer32,
                s = (t >> 2) + 1;
            this._dataLength += t;
            let o = this._dataLength * 8;
            if (
                ((n[t] = 128),
                (n[t + 1] = n[t + 2] = n[t + 3] = 0),
                i.set(U2.buffer32Identity.subarray(s), s),
                t > 55 &&
                    (U2._md5cycle(this._state, i), i.set(U2.buffer32Identity)),
                o <= 4294967295)
            )
                i[14] = o;
            else {
                let u = o.toString(16).match(/(.*?)(.{0,8})$/);
                if (u === null) return;
                let c = parseInt(u[2], 16),
                    h = parseInt(u[1], 16) || 0;
                (i[14] = c), (i[15] = h);
            }
            return (
                U2._md5cycle(this._state, i),
                e ? this._state : U2._hex(this._state)
            );
        }
    };
    a(U, "Md5"),
        _(
            U,
            "stateIdentity",
            new Int32Array([1732584193, -271733879, -1732584194, 271733878])
        ),
        _(
            U,
            "buffer32Identity",
            new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        ),
        _(U, "hexChars", "0123456789abcdef"),
        _(U, "hexOut", []),
        _(U, "onePassHasher", new U());
    $e = U;
});
var Ot = {};
ie(Ot, { createHash: () => Vo, createHmac: () => Ko, randomBytes: () => $o });
var Nt = z(() => {
    p();
    ni();
    ii();
    a($o, "randomBytes");
    a(Vo, "createHash");
    a(Ko, "createHmac");
});
var Qt = T((si) => {
    p();
    si.parse = function (r, e) {
        return new qt(r, e).parse();
    };
    var ut = class ut2 {
        constructor(e, t) {
            (this.source = e),
                (this.transform = t || zo),
                (this.position = 0),
                (this.entries = []),
                (this.recorded = []),
                (this.dimension = 0);
        }
        isEof() {
            return this.position >= this.source.length;
        }
        nextCharacter() {
            var e = this.source[this.position++];
            return e === "\\"
                ? { value: this.source[this.position++], escaped: true }
                : { value: e, escaped: false };
        }
        record(e) {
            this.recorded.push(e);
        }
        newEntry(e) {
            var t;
            (this.recorded.length > 0 || e) &&
                ((t = this.recorded.join("")),
                t === "NULL" && !e && (t = null),
                t !== null && (t = this.transform(t)),
                this.entries.push(t),
                (this.recorded = []));
        }
        consumeDimensions() {
            if (this.source[0] === "[")
                for (; !this.isEof(); ) {
                    var e = this.nextCharacter();
                    if (e.value === "=") break;
                }
        }
        parse(e) {
            var t, n, i;
            for (this.consumeDimensions(); !this.isEof(); )
                if (((t = this.nextCharacter()), t.value === "{" && !i))
                    this.dimension++,
                        this.dimension > 1 &&
                            ((n = new ut2(
                                this.source.substr(this.position - 1),
                                this.transform
                            )),
                            this.entries.push(n.parse(true)),
                            (this.position += n.position - 2));
                else if (t.value === "}" && !i) {
                    if (
                        (this.dimension--,
                        !this.dimension && (this.newEntry(), e))
                    )
                        return this.entries;
                } else
                    t.value === '"' && !t.escaped
                        ? (i && this.newEntry(true), (i = !i))
                        : t.value === "," && !i
                          ? this.newEntry()
                          : this.record(t.value);
            if (this.dimension !== 0)
                throw new Error("array dimension not balanced");
            return this.entries;
        }
    };
    a(ut, "ArrayParser");
    var qt = ut;
    function zo(r) {
        return r;
    }
    a(zo, "identity");
});
var Wt = T((yh, oi) => {
    p();
    var Yo = Qt();
    oi.exports = {
        create: a(function (r, e) {
            return {
                parse: a(function () {
                    return Yo.parse(r, e);
                }, "parse"),
            };
        }, "create"),
    };
});
var ci = T((wh, ui) => {
    p();
    var Zo =
            /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/,
        Jo = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/,
        Xo = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/,
        ea = /^-?infinity$/;
    ui.exports = a(function (e) {
        if (ea.test(e)) return Number(e.replace("i", "I"));
        var t = Zo.exec(e);
        if (!t) return ta(e) || null;
        var n = !!t[8],
            i = parseInt(t[1], 10);
        n && (i = ai(i));
        var s = parseInt(t[2], 10) - 1,
            o = t[3],
            u = parseInt(t[4], 10),
            c = parseInt(t[5], 10),
            h = parseInt(t[6], 10),
            l = t[7];
        l = l ? 1000 * parseFloat(l) : 0;
        var y,
            x = ra(e);
        return (
            x != null
                ? ((y = new Date(Date.UTC(i, s, o, u, c, h, l))),
                  jt(i) && y.setUTCFullYear(i),
                  x !== 0 && y.setTime(y.getTime() - x))
                : ((y = new Date(i, s, o, u, c, h, l)),
                  jt(i) && y.setFullYear(i)),
            y
        );
    }, "parseDate");
    function ta(r) {
        var e = Jo.exec(r);
        if (e) {
            var t = parseInt(e[1], 10),
                n = !!e[4];
            n && (t = ai(t));
            var i = parseInt(e[2], 10) - 1,
                s = e[3],
                o = new Date(t, i, s);
            return jt(t) && o.setFullYear(t), o;
        }
    }
    a(ta, "getDate");
    function ra(r) {
        if (r.endsWith("+00")) return 0;
        var e = Xo.exec(r.split(" ")[1]);
        if (e) {
            var t = e[1];
            if (t === "Z") return 0;
            var n = t === "-" ? -1 : 1,
                i =
                    parseInt(e[2], 10) * 3600 +
                    parseInt(e[3] || 0, 10) * 60 +
                    parseInt(e[4] || 0, 10);
            return i * n * 1000;
        }
    }
    a(ra, "timeZoneOffset");
    function ai(r) {
        return -(r - 1);
    }
    a(ai, "bcYearToNegativeYear");
    function jt(r) {
        return r >= 0 && r < 100;
    }
    a(jt, "is0To99");
});
var li = T((xh, hi) => {
    p();
    hi.exports = ia;
    var na = Object.prototype.hasOwnProperty;
    function ia(r) {
        for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var n in t) na.call(t, n) && (r[n] = t[n]);
        }
        return r;
    }
    a(ia, "extend");
});
var di = T((_h, pi) => {
    p();
    var sa = li();
    pi.exports = Fe;
    function Fe(r) {
        if (!(this instanceof Fe)) return new Fe(r);
        sa(this, ga(r));
    }
    a(Fe, "PostgresInterval");
    var oa = ["seconds", "minutes", "hours", "days", "months", "years"];
    Fe.prototype.toPostgres = function () {
        var r = oa.filter(this.hasOwnProperty, this);
        return (
            this.milliseconds && r.indexOf("seconds") < 0 && r.push("seconds"),
            r.length === 0
                ? "0"
                : r
                      .map(function (e) {
                          var t = this[e] || 0;
                          return (
                              e === "seconds" &&
                                  this.milliseconds &&
                                  (t = (t + this.milliseconds / 1000)
                                      .toFixed(6)
                                      .replace(/\.?0+$/, "")),
                              t + " " + e
                          );
                      }, this)
                      .join(" ")
        );
    };
    var aa = {
            years: "Y",
            months: "M",
            days: "D",
            hours: "H",
            minutes: "M",
            seconds: "S",
        },
        ua = ["years", "months", "days"],
        ca = ["hours", "minutes", "seconds"];
    Fe.prototype.toISOString = Fe.prototype.toISO = function () {
        var r = ua.map(t, this).join(""),
            e = ca.map(t, this).join("");
        return "P" + r + "T" + e;
        function t(n) {
            var i = this[n] || 0;
            return (
                n === "seconds" &&
                    this.milliseconds &&
                    (i = (i + this.milliseconds / 1000)
                        .toFixed(6)
                        .replace(/0+$/, "")),
                i + aa[n]
            );
        }
    };
    var Ht = "([+-]?\\d+)",
        ha = Ht + "\\s+years?",
        la = Ht + "\\s+mons?",
        fa = Ht + "\\s+days?",
        pa = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?",
        da = new RegExp(
            [ha, la, fa, pa]
                .map(function (r) {
                    return "(" + r + ")?";
                })
                .join("\\s*")
        ),
        fi = {
            years: 2,
            months: 4,
            days: 6,
            hours: 9,
            minutes: 10,
            seconds: 11,
            milliseconds: 12,
        },
        ya = ["hours", "minutes", "seconds", "milliseconds"];
    function ma(r) {
        var e = r + "000000".slice(r.length);
        return parseInt(e, 10) / 1000;
    }
    a(ma, "parseMilliseconds");
    function ga(r) {
        if (!r) return {};
        var e = da.exec(r),
            t = e[8] === "-";
        return Object.keys(fi).reduce(function (n, i) {
            var s = fi[i],
                o = e[s];
            return (
                !o ||
                    ((o = i === "milliseconds" ? ma(o) : parseInt(o, 10)),
                    !o) ||
                    (t && ~ya.indexOf(i) && (o *= -1), (n[i] = o)),
                n
            );
        }, {});
    }
    a(ga, "parse");
});
var mi = T((Ih, yi) => {
    p();
    yi.exports = a(function (e) {
        if (/^\\x/.test(e)) return new d(e.substr(2), "hex");
        for (var t = "", n = 0; n < e.length; )
            if (e[n] !== "\\") (t += e[n]), ++n;
            else if (/[0-7]{3}/.test(e.substr(n + 1, 3)))
                (t += String.fromCharCode(parseInt(e.substr(n + 1, 3), 8))),
                    (n += 4);
            else {
                for (var i = 1; n + i < e.length && e[n + i] === "\\"; ) i++;
                for (var s = 0; s < Math.floor(i / 2); ++s) t += "\\";
                n += Math.floor(i / 2) * 2;
            }
        return new d(t, "binary");
    }, "parseBytea");
});
var Ei = T((Bh, vi) => {
    p();
    var Ve = Qt(),
        Ke = Wt(),
        ct = ci(),
        wi = di(),
        bi = mi();
    function ht(r) {
        return a(function (t) {
            return t === null ? t : r(t);
        }, "nullAllowed");
    }
    a(ht, "allowNull");
    function Si(r) {
        return r === null
            ? r
            : r === "TRUE" ||
                  r === "t" ||
                  r === "true" ||
                  r === "y" ||
                  r === "yes" ||
                  r === "on" ||
                  r === "1";
    }
    a(Si, "parseBool");
    function wa(r) {
        return r ? Ve.parse(r, Si) : null;
    }
    a(wa, "parseBoolArray");
    function ba(r) {
        return parseInt(r, 10);
    }
    a(ba, "parseBaseTenInt");
    function Gt(r) {
        return r ? Ve.parse(r, ht(ba)) : null;
    }
    a(Gt, "parseIntegerArray");
    function Sa(r) {
        return r
            ? Ve.parse(
                  r,
                  ht(function (e) {
                      return xi(e).trim();
                  })
              )
            : null;
    }
    a(Sa, "parseBigIntegerArray");
    var xa = a(function (r) {
            if (!r) return null;
            var e = Ke.create(r, function (t) {
                return t !== null && (t = zt(t)), t;
            });
            return e.parse();
        }, "parsePointArray"),
        $t = a(function (r) {
            if (!r) return null;
            var e = Ke.create(r, function (t) {
                return t !== null && (t = parseFloat(t)), t;
            });
            return e.parse();
        }, "parseFloatArray"),
        re = a(function (r) {
            if (!r) return null;
            var e = Ke.create(r);
            return e.parse();
        }, "parseStringArray"),
        Vt = a(function (r) {
            if (!r) return null;
            var e = Ke.create(r, function (t) {
                return t !== null && (t = ct(t)), t;
            });
            return e.parse();
        }, "parseDateArray"),
        va = a(function (r) {
            if (!r) return null;
            var e = Ke.create(r, function (t) {
                return t !== null && (t = wi(t)), t;
            });
            return e.parse();
        }, "parseIntervalArray"),
        Ea = a(function (r) {
            return r ? Ve.parse(r, ht(bi)) : null;
        }, "parseByteAArray"),
        Kt = a(function (r) {
            return parseInt(r, 10);
        }, "parseInteger"),
        xi = a(function (r) {
            var e = String(r);
            return /^\d+$/.test(e) ? e : r;
        }, "parseBigInteger"),
        gi = a(function (r) {
            return r ? Ve.parse(r, ht(JSON.parse)) : null;
        }, "parseJsonArray"),
        zt = a(function (r) {
            return r[0] !== "("
                ? null
                : ((r = r.substring(1, r.length - 1).split(",")),
                  { x: parseFloat(r[0]), y: parseFloat(r[1]) });
        }, "parsePoint"),
        _a = a(function (r) {
            if (r[0] !== "<" && r[1] !== "(") return null;
            for (var e = "(", t = "", n = false, i = 2; i < r.length - 1; i++) {
                if ((n || (e += r[i]), r[i] === ")")) {
                    n = true;
                    continue;
                } else if (!n) continue;
                r[i] !== "," && (t += r[i]);
            }
            var s = zt(e);
            return (s.radius = parseFloat(t)), s;
        }, "parseCircle"),
        Aa = a(function (r) {
            r(20, xi),
                r(21, Kt),
                r(23, Kt),
                r(26, Kt),
                r(700, parseFloat),
                r(701, parseFloat),
                r(16, Si),
                r(1082, ct),
                r(1114, ct),
                r(1184, ct),
                r(600, zt),
                r(651, re),
                r(718, _a),
                r(1000, wa),
                r(1001, Ea),
                r(1005, Gt),
                r(1007, Gt),
                r(1028, Gt),
                r(1016, Sa),
                r(1017, xa),
                r(1021, $t),
                r(1022, $t),
                r(1231, $t),
                r(1014, re),
                r(1015, re),
                r(1008, re),
                r(1009, re),
                r(1040, re),
                r(1041, re),
                r(1115, Vt),
                r(1182, Vt),
                r(1185, Vt),
                r(1186, wi),
                r(1187, va),
                r(17, bi),
                r(114, JSON.parse.bind(JSON)),
                r(3802, JSON.parse.bind(JSON)),
                r(199, gi),
                r(3807, gi),
                r(3907, re),
                r(2951, re),
                r(791, re),
                r(1183, re),
                r(1270, re);
        }, "init");
    vi.exports = { init: Aa };
});
var Ai = T((Fh, _i) => {
    p();
    var Z = 1e6;
    function Ca(r) {
        var e = r.readInt32BE(0),
            t = r.readUInt32BE(4),
            n = "";
        e < 0 && ((e = ~e + (t === 0)), (t = (~t + 1) >>> 0), (n = "-"));
        var i = "",
            s,
            o,
            u,
            c,
            h,
            l;
        {
            if (
                ((s = e % Z),
                (e = (e / Z) >>> 0),
                (o = 4294967296 * s + t),
                (t = (o / Z) >>> 0),
                (u = "" + (o - Z * t)),
                t === 0 && e === 0)
            )
                return n + u + i;
            for (c = "", h = 6 - u.length, l = 0; l < h; l++) c += "0";
            i = c + u + i;
        }
        {
            if (
                ((s = e % Z),
                (e = (e / Z) >>> 0),
                (o = 4294967296 * s + t),
                (t = (o / Z) >>> 0),
                (u = "" + (o - Z * t)),
                t === 0 && e === 0)
            )
                return n + u + i;
            for (c = "", h = 6 - u.length, l = 0; l < h; l++) c += "0";
            i = c + u + i;
        }
        {
            if (
                ((s = e % Z),
                (e = (e / Z) >>> 0),
                (o = 4294967296 * s + t),
                (t = (o / Z) >>> 0),
                (u = "" + (o - Z * t)),
                t === 0 && e === 0)
            )
                return n + u + i;
            for (c = "", h = 6 - u.length, l = 0; l < h; l++) c += "0";
            i = c + u + i;
        }
        return (
            (s = e % Z), (o = 4294967296 * s + t), (u = "" + (o % Z)), n + u + i
        );
    }
    a(Ca, "readInt8");
    _i.exports = Ca;
});
var Bi = T((kh, Pi) => {
    p();
    var Ia = Ai(),
        F = a(function (r, e, t, n, i) {
            (t = t || 0),
                (n = n || false),
                (i =
                    i ||
                    function (C, B, W) {
                        return C * Math.pow(2, W) + B;
                    });
            var s = t >> 3,
                o = a(function (C) {
                    return n ? ~C & 255 : C;
                }, "inv"),
                u = 255,
                c = 8 - (t % 8);
            e < c && ((u = (255 << (8 - e)) & 255), (c = e)),
                t && (u = u >> t % 8);
            var h = 0;
            (t % 8) + e >= 8 && (h = i(0, o(r[s]) & u, c));
            for (var l = (e + t) >> 3, y = s + 1; y < l; y++)
                h = i(h, o(r[y]), 8);
            var x = (e + t) % 8;
            return x > 0 && (h = i(h, o(r[l]) >> (8 - x), x)), h;
        }, "parseBits"),
        Ti = a(function (r, e, t) {
            var n = Math.pow(2, t - 1) - 1,
                i = F(r, 1),
                s = F(r, t, 1);
            if (s === 0) return 0;
            var o = 1,
                u = a(function (h, l, y) {
                    h === 0 && (h = 1);
                    for (var x = 1; x <= y; x++)
                        (o /= 2), (l & (1 << (y - x))) > 0 && (h += o);
                    return h;
                }, "parsePrecisionBits"),
                c = F(r, e, t + 1, false, u);
            return s == Math.pow(2, t + 1) - 1
                ? c === 0
                    ? i === 0
                        ? 1 / 0
                        : -1 / 0
                    : NaN
                : (i === 0 ? 1 : -1) * Math.pow(2, s - n) * c;
        }, "parseFloatFromBits"),
        Ta = a(function (r) {
            return F(r, 1) == 1 ? -1 * (F(r, 15, 1, true) + 1) : F(r, 15, 1);
        }, "parseInt16"),
        Ci = a(function (r) {
            return F(r, 1) == 1 ? -1 * (F(r, 31, 1, true) + 1) : F(r, 31, 1);
        }, "parseInt32"),
        Pa = a(function (r) {
            return Ti(r, 23, 8);
        }, "parseFloat32"),
        Ba = a(function (r) {
            return Ti(r, 52, 11);
        }, "parseFloat64"),
        La = a(function (r) {
            var e = F(r, 16, 32);
            if (e == 49152) return NaN;
            for (
                var t = Math.pow(1e4, F(r, 16, 16)),
                    n = 0,
                    i = [],
                    s = F(r, 16),
                    o = 0;
                o < s;
                o++
            )
                (n += F(r, 16, 64 + 16 * o) * t), (t /= 1e4);
            var u = Math.pow(10, F(r, 16, 48));
            return ((e === 0 ? 1 : -1) * Math.round(n * u)) / u;
        }, "parseNumeric"),
        Ii = a(function (r, e) {
            var t = F(e, 1),
                n = F(e, 63, 1),
                i = new Date(((t === 0 ? 1 : -1) * n) / 1000 + 946684800000);
            return (
                r || i.setTime(i.getTime() + i.getTimezoneOffset() * 60000),
                (i.usec = n % 1000),
                (i.getMicroSeconds = function () {
                    return this.usec;
                }),
                (i.setMicroSeconds = function (s) {
                    this.usec = s;
                }),
                (i.getUTCMicroSeconds = function () {
                    return this.usec;
                }),
                i
            );
        }, "parseDate"),
        ze = a(function (r) {
            for (
                var e = F(r, 32),
                    t = F(r, 32, 32),
                    n = F(r, 32, 64),
                    i = 96,
                    s = [],
                    o = 0;
                o < e;
                o++
            )
                (s[o] = F(r, 32, i)), (i += 32), (i += 32);
            var u = a(function (h) {
                    var l = F(r, 32, i);
                    if (((i += 32), l == 4294967295)) return null;
                    var y;
                    if (h == 23 || h == 20)
                        return (y = F(r, l * 8, i)), (i += l * 8), y;
                    if (h == 25)
                        return (
                            (y = r.toString(
                                this.encoding,
                                i >> 3,
                                (i += l << 3) >> 3
                            )),
                            y
                        );
                    console.log("ERROR: ElementType not implemented: " + h);
                }, "parseElement"),
                c = a(function (h, l) {
                    var y = [],
                        x;
                    if (h.length > 1) {
                        var C = h.shift();
                        for (x = 0; x < C; x++) y[x] = c(h, l);
                        h.unshift(C);
                    } else for (x = 0; x < h[0]; x++) y[x] = u(l);
                    return y;
                }, "parse");
            return c(s, n);
        }, "parseArray"),
        Ra = a(function (r) {
            return r.toString("utf8");
        }, "parseText"),
        Fa = a(function (r) {
            return r === null ? null : F(r, 8) > 0;
        }, "parseBool"),
        Ma = a(function (r) {
            r(20, Ia),
                r(21, Ta),
                r(23, Ci),
                r(26, Ci),
                r(1700, La),
                r(700, Pa),
                r(701, Ba),
                r(16, Fa),
                r(1114, Ii.bind(null, false)),
                r(1184, Ii.bind(null, true)),
                r(1000, ze),
                r(1007, ze),
                r(1016, ze),
                r(1008, ze),
                r(1009, ze),
                r(25, Ra);
        }, "init");
    Pi.exports = { init: Ma };
});
var Ri = T((Nh, Li) => {
    p();
    Li.exports = {
        BOOL: 16,
        BYTEA: 17,
        CHAR: 18,
        INT8: 20,
        INT2: 21,
        INT4: 23,
        REGPROC: 24,
        TEXT: 25,
        OID: 26,
        TID: 27,
        XID: 28,
        CID: 29,
        JSON: 114,
        XML: 142,
        PG_NODE_TREE: 194,
        SMGR: 210,
        PATH: 602,
        POLYGON: 604,
        CIDR: 650,
        FLOAT4: 700,
        FLOAT8: 701,
        ABSTIME: 702,
        RELTIME: 703,
        TINTERVAL: 704,
        CIRCLE: 718,
        MACADDR8: 774,
        MONEY: 790,
        MACADDR: 829,
        INET: 869,
        ACLITEM: 1033,
        BPCHAR: 1042,
        VARCHAR: 1043,
        DATE: 1082,
        TIME: 1083,
        TIMESTAMP: 1114,
        TIMESTAMPTZ: 1184,
        INTERVAL: 1186,
        TIMETZ: 1266,
        BIT: 1560,
        VARBIT: 1562,
        NUMERIC: 1700,
        REFCURSOR: 1790,
        REGPROCEDURE: 2202,
        REGOPER: 2203,
        REGOPERATOR: 2204,
        REGCLASS: 2205,
        REGTYPE: 2206,
        UUID: 2950,
        TXID_SNAPSHOT: 2970,
        PG_LSN: 3220,
        PG_NDISTINCT: 3361,
        PG_DEPENDENCIES: 3402,
        TSVECTOR: 3614,
        TSQUERY: 3615,
        GTSVECTOR: 3642,
        REGCONFIG: 3734,
        REGDICTIONARY: 3769,
        JSONB: 3802,
        REGNAMESPACE: 4089,
        REGROLE: 4096,
    };
});
var Je = T((Ze) => {
    p();
    var Da = Ei(),
        ka = Bi(),
        Ua = Wt(),
        Oa = Ri();
    Ze.getTypeParser = Na;
    Ze.setTypeParser = qa;
    Ze.arrayParser = Ua;
    Ze.builtins = Oa;
    var Ye = { text: {}, binary: {} };
    function Fi(r) {
        return String(r);
    }
    a(Fi, "noParse");
    function Na(r, e) {
        return (e = e || "text"), (Ye[e] && Ye[e][r]) || Fi;
    }
    a(Na, "getTypeParser");
    function qa(r, e, t) {
        typeof e == "function" && ((t = e), (e = "text")), (Ye[e][r] = t);
    }
    a(qa, "setTypeParser");
    Da.init(function (r, e) {
        Ye.text[r] = e;
    });
    ka.init(function (r, e) {
        Ye.binary[r] = e;
    });
});
var Xe = T((Hh, Yt) => {
    p();
    Yt.exports = {
        host: "localhost",
        user: m.platform === "win32" ? m.env.USERNAME : m.env.USER,
        database: undefined,
        password: null,
        connectionString: undefined,
        port: 5432,
        rows: 0,
        binary: false,
        max: 10,
        idleTimeoutMillis: 30000,
        client_encoding: "",
        ssl: false,
        application_name: undefined,
        fallback_application_name: undefined,
        options: undefined,
        parseInputDatesAsUTC: false,
        statement_timeout: false,
        lock_timeout: false,
        idle_in_transaction_session_timeout: false,
        query_timeout: false,
        connect_timeout: 0,
        keepalives: 1,
        keepalives_idle: 0,
    };
    var Me = Je(),
        Qa = Me.getTypeParser(20, "text"),
        Wa = Me.getTypeParser(1016, "text");
    Yt.exports.__defineSetter__("parseInt8", function (r) {
        Me.setTypeParser(20, "text", r ? Me.getTypeParser(23, "text") : Qa),
            Me.setTypeParser(
                1016,
                "text",
                r ? Me.getTypeParser(1007, "text") : Wa
            );
    });
});
var et = T(($h, Di) => {
    p();
    var ja = (Nt(), N(Ot)),
        Ha = Xe();
    function Ga(r) {
        var e = r.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        return '"' + e + '"';
    }
    a(Ga, "escapeElement");
    function Mi(r) {
        for (var e = "{", t = 0; t < r.length; t++)
            t > 0 && (e = e + ","),
                r[t] === null || typeof r[t] > "u"
                    ? (e = e + "NULL")
                    : Array.isArray(r[t])
                      ? (e = e + Mi(r[t]))
                      : r[t] instanceof d
                        ? (e += "\\\\x" + r[t].toString("hex"))
                        : (e += Ga(lt2(r[t])));
        return (e = e + "}"), e;
    }
    a(Mi, "arrayString");
    var lt2 = a(function (r, e) {
        if (r == null) return null;
        if (r instanceof d) return r;
        if (ArrayBuffer.isView(r)) {
            var t = d.from(r.buffer, r.byteOffset, r.byteLength);
            return t.length === r.byteLength
                ? t
                : t.slice(r.byteOffset, r.byteOffset + r.byteLength);
        }
        return r instanceof Date
            ? Ha.parseInputDatesAsUTC
                ? Ka(r)
                : Va(r)
            : Array.isArray(r)
              ? Mi(r)
              : typeof r == "object"
                ? $a(r, e)
                : r.toString();
    }, "prepareValue");
    function $a(r, e) {
        if (r && typeof r.toPostgres == "function") {
            if (((e = e || []), e.indexOf(r) !== -1))
                throw new Error(
                    'circular reference detected while preparing "' +
                        r +
                        '" for query'
                );
            return e.push(r), lt2(r.toPostgres(lt2), e);
        }
        return JSON.stringify(r);
    }
    a($a, "prepareObject");
    function H(r, e) {
        for (r = "" + r; r.length < e; ) r = "0" + r;
        return r;
    }
    a(H, "pad");
    function Va(r) {
        var e = -r.getTimezoneOffset(),
            t = r.getFullYear(),
            n = t < 1;
        n && (t = Math.abs(t) + 1);
        var i =
            H(t, 4) +
            "-" +
            H(r.getMonth() + 1, 2) +
            "-" +
            H(r.getDate(), 2) +
            "T" +
            H(r.getHours(), 2) +
            ":" +
            H(r.getMinutes(), 2) +
            ":" +
            H(r.getSeconds(), 2) +
            "." +
            H(r.getMilliseconds(), 3);
        return (
            e < 0 ? ((i += "-"), (e *= -1)) : (i += "+"),
            (i += H(Math.floor(e / 60), 2) + ":" + H(e % 60, 2)),
            n && (i += " BC"),
            i
        );
    }
    a(Va, "dateToString");
    function Ka(r) {
        var e = r.getUTCFullYear(),
            t = e < 1;
        t && (e = Math.abs(e) + 1);
        var n =
            H(e, 4) +
            "-" +
            H(r.getUTCMonth() + 1, 2) +
            "-" +
            H(r.getUTCDate(), 2) +
            "T" +
            H(r.getUTCHours(), 2) +
            ":" +
            H(r.getUTCMinutes(), 2) +
            ":" +
            H(r.getUTCSeconds(), 2) +
            "." +
            H(r.getUTCMilliseconds(), 3);
        return (n += "+00:00"), t && (n += " BC"), n;
    }
    a(Ka, "dateToStringUTC");
    function za(r, e, t) {
        return (
            (r = typeof r == "string" ? { text: r } : r),
            e && (typeof e == "function" ? (r.callback = e) : (r.values = e)),
            t && (r.callback = t),
            r
        );
    }
    a(za, "normalizeQueryConfig");
    var Zt = a(function (r) {
            return ja.createHash("md5").update(r, "utf-8").digest("hex");
        }, "md5"),
        Ya = a(function (r, e, t) {
            var n = Zt(e + r),
                i = Zt(d.concat([d.from(n), t]));
            return "md5" + i;
        }, "postgresMd5PasswordHash");
    Di.exports = {
        prepareValue: a(function (e) {
            return lt2(e);
        }, "prepareValueWrapper"),
        normalizeQueryConfig: za,
        postgresMd5PasswordHash: Ya,
        md5: Zt,
    };
});
var qi = T((zh, Ni) => {
    p();
    var Jt = (Nt(), N(Ot));
    function Za(r) {
        if (r.indexOf("SCRAM-SHA-256") === -1)
            throw new Error(
                "SASL: Only mechanism SCRAM-SHA-256 is currently supported"
            );
        let e = Jt.randomBytes(18).toString("base64");
        return {
            mechanism: "SCRAM-SHA-256",
            clientNonce: e,
            response: "n,,n=*,r=" + e,
            message: "SASLInitialResponse",
        };
    }
    a(Za, "startSession");
    function Ja(r, e, t) {
        if (r.message !== "SASLInitialResponse")
            throw new Error("SASL: Last message was not SASLInitialResponse");
        if (typeof e != "string")
            throw new Error(
                "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"
            );
        if (typeof t != "string")
            throw new Error(
                "SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string"
            );
        let n = tu(t);
        if (n.nonce.startsWith(r.clientNonce)) {
            if (n.nonce.length === r.clientNonce.length)
                throw new Error(
                    "SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short"
                );
        } else
            throw new Error(
                "SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce"
            );
        var i = d.from(n.salt, "base64"),
            s = iu(e, i, n.iteration),
            o = De(s, "Client Key"),
            u = nu(o),
            c = "n=*,r=" + r.clientNonce,
            h = "r=" + n.nonce + ",s=" + n.salt + ",i=" + n.iteration,
            l = "c=biws,r=" + n.nonce,
            y = c + "," + h + "," + l,
            x = De(u, y),
            C = Oi(o, x),
            B = C.toString("base64"),
            W = De(s, "Server Key"),
            X = De(W, y);
        (r.message = "SASLResponse"),
            (r.serverSignature = X.toString("base64")),
            (r.response = l + ",p=" + B);
    }
    a(Ja, "continueSession");
    function Xa(r, e) {
        if (r.message !== "SASLResponse")
            throw new Error("SASL: Last message was not SASLResponse");
        if (typeof e != "string")
            throw new Error(
                "SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string"
            );
        let { serverSignature: t } = ru(e);
        if (t !== r.serverSignature)
            throw new Error(
                "SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match"
            );
    }
    a(Xa, "finalizeSession");
    function eu(r) {
        if (typeof r != "string")
            throw new TypeError("SASL: text must be a string");
        return r
            .split("")
            .map((e, t) => r.charCodeAt(t))
            .every((e) => (e >= 33 && e <= 43) || (e >= 45 && e <= 126));
    }
    a(eu, "isPrintableChars");
    function ki(r) {
        return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(
            r
        );
    }
    a(ki, "isBase64");
    function Ui(r) {
        if (typeof r != "string")
            throw new TypeError("SASL: attribute pairs text must be a string");
        return new Map(
            r.split(",").map((e) => {
                if (!/^.=/.test(e))
                    throw new Error("SASL: Invalid attribute pair entry");
                let t = e[0],
                    n = e.substring(2);
                return [t, n];
            })
        );
    }
    a(Ui, "parseAttributePairs");
    function tu(r) {
        let e = Ui(r),
            t = e.get("r");
        if (t) {
            if (!eu(t))
                throw new Error(
                    "SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters"
                );
        } else
            throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
        let n = e.get("s");
        if (n) {
            if (!ki(n))
                throw new Error(
                    "SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64"
                );
        } else
            throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
        let i = e.get("i");
        if (i) {
            if (!/^[1-9][0-9]*$/.test(i))
                throw new Error(
                    "SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count"
                );
        } else
            throw new Error(
                "SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing"
            );
        let s = parseInt(i, 10);
        return { nonce: t, salt: n, iteration: s };
    }
    a(tu, "parseServerFirstMessage");
    function ru(r) {
        let t = Ui(r).get("v");
        if (t) {
            if (!ki(t))
                throw new Error(
                    "SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64"
                );
        } else
            throw new Error(
                "SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing"
            );
        return { serverSignature: t };
    }
    a(ru, "parseServerFinalMessage");
    function Oi(r, e) {
        if (!d.isBuffer(r))
            throw new TypeError("first argument must be a Buffer");
        if (!d.isBuffer(e))
            throw new TypeError("second argument must be a Buffer");
        if (r.length !== e.length) throw new Error("Buffer lengths must match");
        if (r.length === 0) throw new Error("Buffers cannot be empty");
        return d.from(r.map((t, n) => r[n] ^ e[n]));
    }
    a(Oi, "xorBuffers");
    function nu(r) {
        return Jt.createHash("sha256").update(r).digest();
    }
    a(nu, "sha256");
    function De(r, e) {
        return Jt.createHmac("sha256", r).update(e).digest();
    }
    a(De, "hmacSha256");
    function iu(r, e, t) {
        for (
            var n = De(r, d.concat([e, d.from([0, 0, 0, 1])])), i = n, s = 0;
            s < t - 1;
            s++
        )
            (n = De(r, n)), (i = Oi(i, n));
        return i;
    }
    a(iu, "Hi");
    Ni.exports = { startSession: Za, continueSession: Ja, finalizeSession: Xa };
});
var Xt = {};
ie(Xt, { join: () => su });
var er = z(() => {
    p();
    a(su, "join");
});
var tr = {};
ie(tr, { stat: () => ou });
var rr = z(() => {
    p();
    a(ou, "stat");
});
var nr = {};
ie(nr, { default: () => au });
var au;
var ir = z(() => {
    p();
    au = {};
});
var Qi = {};
ie(Qi, { StringDecoder: () => sr });
var or2;
var sr;
var Wi = z(() => {
    p();
    or2 = class or3 {
        constructor(e) {
            _(this, "td");
            this.td = new TextDecoder(e);
        }
        write(e) {
            return this.td.decode(e, { stream: true });
        }
        end(e) {
            return this.td.decode(e);
        }
    };
    a(or2, "StringDecoder");
    sr = or2;
});
var $i = T((sl, Gi) => {
    p();
    var { Transform: uu } = (ir(), N(nr)),
        { StringDecoder: cu } = (Wi(), N(Qi)),
        be = Symbol("last"),
        ft = Symbol("decoder");
    function hu(r, e, t) {
        let n;
        if (this.overflow) {
            if (((n = this[ft].write(r).split(this.matcher)), n.length === 1))
                return t();
            n.shift(), (this.overflow = false);
        } else
            (this[be] += this[ft].write(r)), (n = this[be].split(this.matcher));
        this[be] = n.pop();
        for (let i = 0; i < n.length; i++)
            try {
                Hi(this, this.mapper(n[i]));
            } catch (s) {
                return t(s);
            }
        if (
            ((this.overflow = this[be].length > this.maxLength),
            this.overflow && !this.skipOverflow)
        ) {
            t(new Error("maximum buffer reached"));
            return;
        }
        t();
    }
    a(hu, "transform");
    function lu(r) {
        if (((this[be] += this[ft].end()), this[be]))
            try {
                Hi(this, this.mapper(this[be]));
            } catch (e) {
                return r(e);
            }
        r();
    }
    a(lu, "flush");
    function Hi(r, e) {
        e !== undefined && r.push(e);
    }
    a(Hi, "push");
    function ji(r) {
        return r;
    }
    a(ji, "noop");
    function fu(r, e, t) {
        switch (
            ((r = r || /\r?\n/), (e = e || ji), (t = t || {}), arguments.length)
        ) {
            case 1:
                typeof r == "function"
                    ? ((e = r), (r = /\r?\n/))
                    : typeof r == "object" &&
                      !(r instanceof RegExp) &&
                      !r[Symbol.split] &&
                      ((t = r), (r = /\r?\n/));
                break;
            case 2:
                typeof r == "function"
                    ? ((t = e), (e = r), (r = /\r?\n/))
                    : typeof e == "object" && ((t = e), (e = ji));
        }
        (t = Object.assign({}, t)),
            (t.autoDestroy = true),
            (t.transform = hu),
            (t.flush = lu),
            (t.readableObjectMode = true);
        let n = new uu(t);
        return (
            (n[be] = ""),
            (n[ft] = new cu("utf8")),
            (n.matcher = r),
            (n.mapper = e),
            (n.maxLength = t.maxLength),
            (n.skipOverflow = t.skipOverflow || false),
            (n.overflow = false),
            (n._destroy = function (i, s) {
                (this._writableState.errorEmitted = false), s(i);
            }),
            n
        );
    }
    a(fu, "split");
    Gi.exports = fu;
});
var zi = T((ul, pe) => {
    p();
    var Vi = (er(), N(Xt)),
        pu = (ir(), N(nr)).Stream,
        du = $i(),
        Ki = (He(), N(je)),
        yu = 5432,
        pt = m.platform === "win32",
        tt = m.stderr,
        mu = 56,
        gu = 7,
        wu = 61440,
        bu = 32768;
    function Su(r) {
        return (r & wu) == bu;
    }
    a(Su, "isRegFile");
    var ke = ["host", "port", "database", "user", "password"],
        ar = ke.length,
        xu = ke[ar - 1];
    function ur() {
        var r = tt instanceof pu && tt.writable === true;
        if (r) {
            var e = Array.prototype.slice.call(arguments).concat(`
`);
            tt.write(Ki.format.apply(Ki, e));
        }
    }
    a(ur, "warn");
    Object.defineProperty(pe.exports, "isWin", {
        get: a(function () {
            return pt;
        }, "get"),
        set: a(function (r) {
            pt = r;
        }, "set"),
    });
    pe.exports.warnTo = function (r) {
        var e = tt;
        return (tt = r), e;
    };
    pe.exports.getFileName = function (r) {
        var e = r || m.env,
            t =
                e.PGPASSFILE ||
                (pt
                    ? Vi.join(e.APPDATA || "./", "postgresql", "pgpass.conf")
                    : Vi.join(e.HOME || "./", ".pgpass"));
        return t;
    };
    pe.exports.usePgPass = function (r, e) {
        return Object.prototype.hasOwnProperty.call(m.env, "PGPASSWORD")
            ? false
            : pt
              ? true
              : ((e = e || "<unkn>"),
                Su(r.mode)
                    ? r.mode & (mu | gu)
                        ? (ur(
                              'WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less',
                              e
                          ),
                          false)
                        : true
                    : (ur('WARNING: password file "%s" is not a plain file', e),
                      false));
    };
    var vu = (pe.exports.match = function (r, e) {
        return ke.slice(0, -1).reduce(function (t, n, i) {
            return i == 1 && Number(r[n] || yu) === Number(e[n])
                ? t && true
                : t && (e[n] === "*" || e[n] === r[n]);
        }, true);
    });
    pe.exports.getPassword = function (r, e, t) {
        var n,
            i = e.pipe(du());
        function s(c) {
            var h = Eu(c);
            h && _u(h) && vu(r, h) && ((n = h[xu]), i.end());
        }
        a(s, "onLine");
        var o = a(function () {
                e.destroy(), t(n);
            }, "onEnd"),
            u = a(function (c) {
                e.destroy(),
                    ur("WARNING: error on reading file: %s", c),
                    t(undefined);
            }, "onErr");
        e.on("error", u), i.on("data", s).on("end", o).on("error", u);
    };
    var Eu = (pe.exports.parseLine = function (r) {
            if (r.length < 11 || r.match(/^\s+#/)) return null;
            for (
                var e = "",
                    t = "",
                    n = 0,
                    i = 0,
                    s = 0,
                    o = {},
                    u = false,
                    c = a(function (l, y, x) {
                        var C = r.substring(y, x);
                        Object.hasOwnProperty.call(
                            m.env,
                            "PGPASS_NO_DEESCAPE"
                        ) || (C = C.replace(/\\([:\\])/g, "$1")),
                            (o[ke[l]] = C);
                    }, "addToObj"),
                    h = 0;
                h < r.length - 1;
                h += 1
            ) {
                if (
                    ((e = r.charAt(h + 1)),
                    (t = r.charAt(h)),
                    (u = n == ar - 1),
                    u)
                ) {
                    c(n, i);
                    break;
                }
                h >= 0 &&
                    e == ":" &&
                    t !== "\\" &&
                    (c(n, i, h + 1), (i = h + 2), (n += 1));
            }
            return (o = Object.keys(o).length === ar ? o : null), o;
        }),
        _u = (pe.exports.isValidEntry = function (r) {
            for (
                var e = {
                        0: function (o) {
                            return o.length > 0;
                        },
                        1: function (o) {
                            return o === "*"
                                ? true
                                : ((o = Number(o)),
                                  isFinite(o) &&
                                      o > 0 &&
                                      o < 9007199254740992 &&
                                      Math.floor(o) === o);
                        },
                        2: function (o) {
                            return o.length > 0;
                        },
                        3: function (o) {
                            return o.length > 0;
                        },
                        4: function (o) {
                            return o.length > 0;
                        },
                    },
                    t = 0;
                t < ke.length;
                t += 1
            ) {
                var n = e[t],
                    i = r[ke[t]] || "",
                    s = n(i);
                if (!s) return false;
            }
            return true;
        });
});
var Zi = T((fl, cr) => {
    p();
    var ll = (er(), N(Xt)),
        Yi = (rr(), N(tr)),
        dt = zi();
    cr.exports = function (r, e) {
        var t = dt.getFileName();
        Yi.stat(t, function (n, i) {
            if (n || !dt.usePgPass(i, t)) return e(undefined);
            var s = Yi.createReadStream(t);
            dt.getPassword(r, s, e);
        });
    };
    cr.exports.warnTo = dt.warnTo;
});
var hr = T((dl, Ji) => {
    p();
    var Au = Je();
    function yt(r) {
        (this._types = r || Au), (this.text = {}), (this.binary = {});
    }
    a(yt, "TypeOverrides");
    yt.prototype.getOverrides = function (r) {
        switch (r) {
            case "text":
                return this.text;
            case "binary":
                return this.binary;
            default:
                return {};
        }
    };
    yt.prototype.setTypeParser = function (r, e, t) {
        typeof e == "function" && ((t = e), (e = "text")),
            (this.getOverrides(e)[r] = t);
    };
    yt.prototype.getTypeParser = function (r, e) {
        return (
            (e = e || "text"),
            this.getOverrides(e)[r] || this._types.getTypeParser(r, e)
        );
    };
    Ji.exports = yt;
});
var Xi = {};
ie(Xi, { default: () => Cu });
var Cu;
var es = z(() => {
    p();
    Cu = {};
});
var ts = {};
ie(ts, { parse: () => lr });
var fr = z(() => {
    p();
    a(lr, "parse");
});
var ns = T((Sl, rs) => {
    p();
    var Iu = (fr(), N(ts)),
        pr = (rr(), N(tr));
    function dr(r) {
        if (r.charAt(0) === "/") {
            var t = r.split(" ");
            return { host: t[0], database: t[1] };
        }
        var e = Iu.parse(
                / |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(r)
                    ? encodeURI(r).replace(/\%25(\d\d)/g, "%$1")
                    : r,
                true
            ),
            t = e.query;
        for (var n in t) Array.isArray(t[n]) && (t[n] = t[n][t[n].length - 1]);
        var i = (e.auth || ":").split(":");
        if (
            ((t.user = i[0]),
            (t.password = i.splice(1).join(":")),
            (t.port = e.port),
            e.protocol == "socket:")
        )
            return (
                (t.host = decodeURI(e.pathname)),
                (t.database = e.query.db),
                (t.client_encoding = e.query.encoding),
                t
            );
        t.host || (t.host = e.hostname);
        var s = e.pathname;
        if (!t.host && s && /^%2f/i.test(s)) {
            var o = s.split("/");
            (t.host = decodeURIComponent(o[0])), (s = o.splice(1).join("/"));
        }
        switch (
            (s && s.charAt(0) === "/" && (s = s.slice(1) || null),
            (t.database = s && decodeURI(s)),
            (t.ssl === "true" || t.ssl === "1") && (t.ssl = true),
            t.ssl === "0" && (t.ssl = false),
            (t.sslcert || t.sslkey || t.sslrootcert || t.sslmode) &&
                (t.ssl = {}),
            t.sslcert && (t.ssl.cert = pr.readFileSync(t.sslcert).toString()),
            t.sslkey && (t.ssl.key = pr.readFileSync(t.sslkey).toString()),
            t.sslrootcert &&
                (t.ssl.ca = pr.readFileSync(t.sslrootcert).toString()),
            t.sslmode)
        ) {
            case "disable": {
                t.ssl = false;
                break;
            }
            case "prefer":
            case "require":
            case "verify-ca":
            case "verify-full":
                break;
            case "no-verify": {
                t.ssl.rejectUnauthorized = false;
                break;
            }
        }
        return t;
    }
    a(dr, "parse");
    rs.exports = dr;
    dr.parse = dr;
});
var mt = T((El, os2) => {
    p();
    var Tu = (es(), N(Xi)),
        ss = Xe(),
        is2 = ns().parse,
        $ = a(function (r, e, t) {
            return (
                t === undefined
                    ? (t = m.env["PG" + r.toUpperCase()])
                    : t === false || (t = m.env[t]),
                e[r] || t || ss[r]
            );
        }, "val"),
        Pu = a(function () {
            switch (m.env.PGSSLMODE) {
                case "disable":
                    return false;
                case "prefer":
                case "require":
                case "verify-ca":
                case "verify-full":
                    return true;
                case "no-verify":
                    return { rejectUnauthorized: false };
            }
            return ss.ssl;
        }, "readSSLConfigFromEnvironment"),
        Ue = a(function (r) {
            return (
                "'" + ("" + r).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'"
            );
        }, "quoteParamValue"),
        ne2 = a(function (r, e, t) {
            var n = e[t];
            n != null && r.push(t + "=" + Ue(n));
        }, "add"),
        mr = class mr2 {
            constructor(e) {
                (e = typeof e == "string" ? is2(e) : e || {}),
                    e.connectionString &&
                        (e = Object.assign({}, e, is2(e.connectionString))),
                    (this.user = $("user", e)),
                    (this.database = $("database", e)),
                    this.database === undefined && (this.database = this.user),
                    (this.port = parseInt($("port", e), 10)),
                    (this.host = $("host", e)),
                    Object.defineProperty(this, "password", {
                        configurable: true,
                        enumerable: false,
                        writable: true,
                        value: $("password", e),
                    }),
                    (this.binary = $("binary", e)),
                    (this.options = $("options", e)),
                    (this.ssl = typeof e.ssl > "u" ? Pu() : e.ssl),
                    typeof this.ssl == "string" &&
                        this.ssl === "true" &&
                        (this.ssl = true),
                    this.ssl === "no-verify" &&
                        (this.ssl = { rejectUnauthorized: false }),
                    this.ssl &&
                        this.ssl.key &&
                        Object.defineProperty(this.ssl, "key", {
                            enumerable: false,
                        }),
                    (this.client_encoding = $("client_encoding", e)),
                    (this.replication = $("replication", e)),
                    (this.isDomainSocket = !(this.host || "").indexOf("/")),
                    (this.application_name = $(
                        "application_name",
                        e,
                        "PGAPPNAME"
                    )),
                    (this.fallback_application_name = $(
                        "fallback_application_name",
                        e,
                        false
                    )),
                    (this.statement_timeout = $("statement_timeout", e, false)),
                    (this.lock_timeout = $("lock_timeout", e, false)),
                    (this.idle_in_transaction_session_timeout = $(
                        "idle_in_transaction_session_timeout",
                        e,
                        false
                    )),
                    (this.query_timeout = $("query_timeout", e, false)),
                    e.connectionTimeoutMillis === undefined
                        ? (this.connect_timeout = m.env.PGCONNECT_TIMEOUT || 0)
                        : (this.connect_timeout = Math.floor(
                              e.connectionTimeoutMillis / 1000
                          )),
                    e.keepAlive === false
                        ? (this.keepalives = 0)
                        : e.keepAlive === true && (this.keepalives = 1),
                    typeof e.keepAliveInitialDelayMillis == "number" &&
                        (this.keepalives_idle = Math.floor(
                            e.keepAliveInitialDelayMillis / 1000
                        ));
            }
            getLibpqConnectionString(e) {
                var t = [];
                ne2(t, this, "user"),
                    ne2(t, this, "password"),
                    ne2(t, this, "port"),
                    ne2(t, this, "application_name"),
                    ne2(t, this, "fallback_application_name"),
                    ne2(t, this, "connect_timeout"),
                    ne2(t, this, "options");
                var n =
                    typeof this.ssl == "object"
                        ? this.ssl
                        : this.ssl
                          ? { sslmode: this.ssl }
                          : {};
                if (
                    (ne2(t, n, "sslmode"),
                    ne2(t, n, "sslca"),
                    ne2(t, n, "sslkey"),
                    ne2(t, n, "sslcert"),
                    ne2(t, n, "sslrootcert"),
                    this.database && t.push("dbname=" + Ue(this.database)),
                    this.replication &&
                        t.push("replication=" + Ue(this.replication)),
                    this.host && t.push("host=" + Ue(this.host)),
                    this.isDomainSocket)
                )
                    return e(null, t.join(" "));
                this.client_encoding &&
                    t.push("client_encoding=" + Ue(this.client_encoding)),
                    Tu.lookup(this.host, function (i, s) {
                        return i
                            ? e(i, null)
                            : (t.push("hostaddr=" + Ue(s)),
                              e(null, t.join(" ")));
                    });
            }
        };
    a(mr, "ConnectionParameters");
    var yr = mr;
    os2.exports = yr;
});
var cs = T((Cl, us) => {
    p();
    var Bu = Je(),
        as = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/,
        wr = class wr2 {
            constructor(e, t) {
                (this.command = null),
                    (this.rowCount = null),
                    (this.oid = null),
                    (this.rows = []),
                    (this.fields = []),
                    (this._parsers = undefined),
                    (this._types = t),
                    (this.RowCtor = null),
                    (this.rowAsArray = e === "array"),
                    this.rowAsArray && (this.parseRow = this._parseRowAsArray);
            }
            addCommandComplete(e) {
                var t;
                e.text ? (t = as.exec(e.text)) : (t = as.exec(e.command)),
                    t &&
                        ((this.command = t[1]),
                        t[3]
                            ? ((this.oid = parseInt(t[2], 10)),
                              (this.rowCount = parseInt(t[3], 10)))
                            : t[2] && (this.rowCount = parseInt(t[2], 10)));
            }
            _parseRowAsArray(e) {
                for (
                    var t = new Array(e.length), n = 0, i = e.length;
                    n < i;
                    n++
                ) {
                    var s = e[n];
                    s !== null ? (t[n] = this._parsers[n](s)) : (t[n] = null);
                }
                return t;
            }
            parseRow(e) {
                for (var t = {}, n = 0, i = e.length; n < i; n++) {
                    var s = e[n],
                        o = this.fields[n].name;
                    s !== null ? (t[o] = this._parsers[n](s)) : (t[o] = null);
                }
                return t;
            }
            addRow(e) {
                this.rows.push(e);
            }
            addFields(e) {
                (this.fields = e),
                    this.fields.length && (this._parsers = new Array(e.length));
                for (var t = 0; t < e.length; t++) {
                    var n = e[t];
                    this._types
                        ? (this._parsers[t] = this._types.getTypeParser(
                              n.dataTypeID,
                              n.format || "text"
                          ))
                        : (this._parsers[t] = Bu.getTypeParser(
                              n.dataTypeID,
                              n.format || "text"
                          ));
                }
            }
        };
    a(wr, "Result");
    var gr = wr;
    us.exports = gr;
});
var ps = T((Pl, fs2) => {
    p();
    var { EventEmitter: Lu } = we(),
        hs = cs(),
        ls = et(),
        Sr = class Sr2 extends Lu {
            constructor(e, t, n) {
                super(),
                    (e = ls.normalizeQueryConfig(e, t, n)),
                    (this.text = e.text),
                    (this.values = e.values),
                    (this.rows = e.rows),
                    (this.types = e.types),
                    (this.name = e.name),
                    (this.binary = e.binary),
                    (this.portal = e.portal || ""),
                    (this.callback = e.callback),
                    (this._rowMode = e.rowMode),
                    m.domain &&
                        e.callback &&
                        (this.callback = m.domain.bind(e.callback)),
                    (this._result = new hs(this._rowMode, this.types)),
                    (this._results = this._result),
                    (this.isPreparedStatement = false),
                    (this._canceledDueToError = false),
                    (this._promise = null);
            }
            requiresPreparation() {
                return this.name || this.rows
                    ? true
                    : !this.text || !this.values
                      ? false
                      : this.values.length > 0;
            }
            _checkForMultirow() {
                this._result.command &&
                    (Array.isArray(this._results) ||
                        (this._results = [this._result]),
                    (this._result = new hs(this._rowMode, this.types)),
                    this._results.push(this._result));
            }
            handleRowDescription(e) {
                this._checkForMultirow(),
                    this._result.addFields(e.fields),
                    (this._accumulateRows =
                        this.callback || !this.listeners("row").length);
            }
            handleDataRow(e) {
                let t;
                if (!this._canceledDueToError) {
                    try {
                        t = this._result.parseRow(e.fields);
                    } catch (n) {
                        this._canceledDueToError = n;
                        return;
                    }
                    this.emit("row", t, this._result),
                        this._accumulateRows && this._result.addRow(t);
                }
            }
            handleCommandComplete(e, t) {
                this._checkForMultirow(),
                    this._result.addCommandComplete(e),
                    this.rows && t.sync();
            }
            handleEmptyQuery(e) {
                this.rows && e.sync();
            }
            handleError(e, t) {
                if (
                    (this._canceledDueToError &&
                        ((e = this._canceledDueToError),
                        (this._canceledDueToError = false)),
                    this.callback)
                )
                    return this.callback(e);
                this.emit("error", e);
            }
            handleReadyForQuery(e) {
                if (this._canceledDueToError)
                    return this.handleError(this._canceledDueToError, e);
                if (this.callback)
                    try {
                        this.callback(null, this._results);
                    } catch (t) {
                        m.nextTick(() => {
                            throw t;
                        });
                    }
                this.emit("end", this._results);
            }
            submit(e) {
                if (
                    typeof this.text != "string" &&
                    typeof this.name != "string"
                )
                    return new Error(
                        "A query must have either text or a name. Supplying neither is unsupported."
                    );
                let t = e.parsedStatements[this.name];
                return this.text && t && this.text !== t
                    ? new Error(
                          `Prepared statements must be unique - '${this.name}' was used for a different statement`
                      )
                    : this.values && !Array.isArray(this.values)
                      ? new Error("Query values must be an array")
                      : (this.requiresPreparation()
                            ? this.prepare(e)
                            : e.query(this.text),
                        null);
            }
            hasBeenParsed(e) {
                return this.name && e.parsedStatements[this.name];
            }
            handlePortalSuspended(e) {
                this._getRows(e, this.rows);
            }
            _getRows(e, t) {
                e.execute({ portal: this.portal, rows: t }),
                    t ? e.flush() : e.sync();
            }
            prepare(e) {
                (this.isPreparedStatement = true),
                    this.hasBeenParsed(e) ||
                        e.parse({
                            text: this.text,
                            name: this.name,
                            types: this.types,
                        });
                try {
                    e.bind({
                        portal: this.portal,
                        statement: this.name,
                        values: this.values,
                        binary: this.binary,
                        valueMapper: ls.prepareValue,
                    });
                } catch (t) {
                    this.handleError(t, e);
                    return;
                }
                e.describe({ type: "P", name: this.portal || "" }),
                    this._getRows(e, this.rows);
            }
            handleCopyInResponse(e) {
                e.sendCopyFail("No source stream defined");
            }
            handleCopyData(e, t) {}
        };
    a(Sr, "Query");
    var br = Sr;
    fs2.exports = br;
});
var ys = {};
ie(ys, { Socket: () => Ae, isIP: () => Ru });
var ds;
var Fu;
var E;
var Ae;
var gt2 = z(() => {
    p();
    ds = Qe(we(), 1);
    a(Ru, "isIP");
    (Fu = a((r) => r.replace(/^[^.]+\./, "api."), "transformHost")),
        (E = class E2 extends ds.EventEmitter {
            constructor() {
                super(...arguments);
                _(this, "opts", {});
                _(this, "connecting", false);
                _(this, "pending", true);
                _(this, "writable", true);
                _(this, "encrypted", false);
                _(this, "authorized", false);
                _(this, "destroyed", false);
                _(this, "ws", null);
                _(this, "writeBuffer");
                _(this, "tlsState", 0);
                _(this, "tlsRead");
                _(this, "tlsWrite");
            }
            static get poolQueryViaFetch() {
                return (
                    E2.opts.poolQueryViaFetch ?? E2.defaults.poolQueryViaFetch
                );
            }
            static set poolQueryViaFetch(t) {
                E2.opts.poolQueryViaFetch = t;
            }
            static get fetchEndpoint() {
                return E2.opts.fetchEndpoint ?? E2.defaults.fetchEndpoint;
            }
            static set fetchEndpoint(t) {
                E2.opts.fetchEndpoint = t;
            }
            static get fetchConnectionCache() {
                return true;
            }
            static set fetchConnectionCache(t) {
                console.warn(
                    "The `fetchConnectionCache` option is deprecated (now always `true`)"
                );
            }
            static get fetchFunction() {
                return E2.opts.fetchFunction ?? E2.defaults.fetchFunction;
            }
            static set fetchFunction(t) {
                E2.opts.fetchFunction = t;
            }
            static get webSocketConstructor() {
                return (
                    E2.opts.webSocketConstructor ??
                    E2.defaults.webSocketConstructor
                );
            }
            static set webSocketConstructor(t) {
                E2.opts.webSocketConstructor = t;
            }
            get webSocketConstructor() {
                return (
                    this.opts.webSocketConstructor ?? E2.webSocketConstructor
                );
            }
            set webSocketConstructor(t) {
                this.opts.webSocketConstructor = t;
            }
            static get wsProxy() {
                return E2.opts.wsProxy ?? E2.defaults.wsProxy;
            }
            static set wsProxy(t) {
                E2.opts.wsProxy = t;
            }
            get wsProxy() {
                return this.opts.wsProxy ?? E2.wsProxy;
            }
            set wsProxy(t) {
                this.opts.wsProxy = t;
            }
            static get coalesceWrites() {
                return E2.opts.coalesceWrites ?? E2.defaults.coalesceWrites;
            }
            static set coalesceWrites(t) {
                E2.opts.coalesceWrites = t;
            }
            get coalesceWrites() {
                return this.opts.coalesceWrites ?? E2.coalesceWrites;
            }
            set coalesceWrites(t) {
                this.opts.coalesceWrites = t;
            }
            static get useSecureWebSocket() {
                return (
                    E2.opts.useSecureWebSocket ?? E2.defaults.useSecureWebSocket
                );
            }
            static set useSecureWebSocket(t) {
                E2.opts.useSecureWebSocket = t;
            }
            get useSecureWebSocket() {
                return this.opts.useSecureWebSocket ?? E2.useSecureWebSocket;
            }
            set useSecureWebSocket(t) {
                this.opts.useSecureWebSocket = t;
            }
            static get forceDisablePgSSL() {
                return (
                    E2.opts.forceDisablePgSSL ?? E2.defaults.forceDisablePgSSL
                );
            }
            static set forceDisablePgSSL(t) {
                E2.opts.forceDisablePgSSL = t;
            }
            get forceDisablePgSSL() {
                return this.opts.forceDisablePgSSL ?? E2.forceDisablePgSSL;
            }
            set forceDisablePgSSL(t) {
                this.opts.forceDisablePgSSL = t;
            }
            static get disableSNI() {
                return E2.opts.disableSNI ?? E2.defaults.disableSNI;
            }
            static set disableSNI(t) {
                E2.opts.disableSNI = t;
            }
            get disableSNI() {
                return this.opts.disableSNI ?? E2.disableSNI;
            }
            set disableSNI(t) {
                this.opts.disableSNI = t;
            }
            static get pipelineConnect() {
                return E2.opts.pipelineConnect ?? E2.defaults.pipelineConnect;
            }
            static set pipelineConnect(t) {
                E2.opts.pipelineConnect = t;
            }
            get pipelineConnect() {
                return this.opts.pipelineConnect ?? E2.pipelineConnect;
            }
            set pipelineConnect(t) {
                this.opts.pipelineConnect = t;
            }
            static get subtls() {
                return E2.opts.subtls ?? E2.defaults.subtls;
            }
            static set subtls(t) {
                E2.opts.subtls = t;
            }
            get subtls() {
                return this.opts.subtls ?? E2.subtls;
            }
            set subtls(t) {
                this.opts.subtls = t;
            }
            static get pipelineTLS() {
                return E2.opts.pipelineTLS ?? E2.defaults.pipelineTLS;
            }
            static set pipelineTLS(t) {
                E2.opts.pipelineTLS = t;
            }
            get pipelineTLS() {
                return this.opts.pipelineTLS ?? E2.pipelineTLS;
            }
            set pipelineTLS(t) {
                this.opts.pipelineTLS = t;
            }
            static get rootCerts() {
                return E2.opts.rootCerts ?? E2.defaults.rootCerts;
            }
            static set rootCerts(t) {
                E2.opts.rootCerts = t;
            }
            get rootCerts() {
                return this.opts.rootCerts ?? E2.rootCerts;
            }
            set rootCerts(t) {
                this.opts.rootCerts = t;
            }
            wsProxyAddrForHost(t, n) {
                let i = this.wsProxy;
                if (i === undefined)
                    throw new Error(
                        "No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string"
                    );
                return typeof i == "function"
                    ? i(t, n)
                    : `${i}?address=${t}:${n}`;
            }
            setNoDelay() {
                return this;
            }
            setKeepAlive() {
                return this;
            }
            ref() {
                return this;
            }
            unref() {
                return this;
            }
            connect(t, n, i) {
                (this.connecting = true), i && this.once("connect", i);
                let s = a(() => {
                        (this.connecting = false),
                            (this.pending = false),
                            this.emit("connect"),
                            this.emit("ready");
                    }, "handleWebSocketOpen"),
                    o = a((c, h = false) => {
                        (c.binaryType = "arraybuffer"),
                            c.addEventListener("error", (l) => {
                                this.emit("error", l), this.emit("close");
                            }),
                            c.addEventListener("message", (l) => {
                                if (this.tlsState === 0) {
                                    let y = d.from(l.data);
                                    this.emit("data", y);
                                }
                            }),
                            c.addEventListener("close", () => {
                                this.emit("close");
                            }),
                            h ? s() : c.addEventListener("open", s);
                    }, "configureWebSocket"),
                    u;
                try {
                    u = this.wsProxyAddrForHost(
                        n,
                        typeof t == "string" ? parseInt(t, 10) : t
                    );
                } catch (c) {
                    this.emit("error", c), this.emit("close");
                    return;
                }
                try {
                    let h =
                        (this.useSecureWebSocket ? "wss:" : "ws:") + "//" + u;
                    if (this.webSocketConstructor !== undefined)
                        (this.ws = new this.webSocketConstructor(h)),
                            o(this.ws);
                    else
                        try {
                            (this.ws = new WebSocket(h)), o(this.ws);
                        } catch {
                            (this.ws = new __unstable_WebSocket(h)), o(this.ws);
                        }
                } catch (c) {
                    let l =
                        (this.useSecureWebSocket ? "https:" : "http:") +
                        "//" +
                        u;
                    fetch(l, { headers: { Upgrade: "websocket" } })
                        .then((y) => {
                            if (((this.ws = y.webSocket), this.ws == null))
                                throw c;
                            this.ws.accept(), o(this.ws, true);
                        })
                        .catch((y) => {
                            this.emit(
                                "error",
                                new Error(
                                    `All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${y.message}`
                                )
                            ),
                                this.emit("close");
                        });
                }
            }
            async startTls(t) {
                if (this.subtls === undefined)
                    throw new Error(
                        "For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information."
                    );
                this.tlsState = 1;
                let n = this.subtls.TrustedCert.fromPEM(this.rootCerts),
                    i = new this.subtls.WebSocketReadQueue(this.ws),
                    s = i.read.bind(i),
                    o = this.rawWrite.bind(this),
                    [u, c] = await this.subtls.startTls(t, n, s, o, {
                        useSNI: !this.disableSNI,
                        expectPreData: this.pipelineTLS
                            ? new Uint8Array([83])
                            : undefined,
                    });
                (this.tlsRead = u),
                    (this.tlsWrite = c),
                    (this.tlsState = 2),
                    (this.encrypted = true),
                    (this.authorized = true),
                    this.emit("secureConnection", this),
                    this.tlsReadLoop();
            }
            async tlsReadLoop() {
                for (;;) {
                    let t = await this.tlsRead();
                    if (t === undefined) break;
                    {
                        let n = d.from(t);
                        this.emit("data", n);
                    }
                }
            }
            rawWrite(t) {
                if (!this.coalesceWrites) {
                    this.ws.send(t);
                    return;
                }
                if (this.writeBuffer === undefined)
                    (this.writeBuffer = t),
                        setTimeout(() => {
                            this.ws.send(this.writeBuffer),
                                (this.writeBuffer = undefined);
                        }, 0);
                else {
                    let n = new Uint8Array(this.writeBuffer.length + t.length);
                    n.set(this.writeBuffer),
                        n.set(t, this.writeBuffer.length),
                        (this.writeBuffer = n);
                }
            }
            write(t, n = "utf8", i = (s) => {}) {
                return t.length === 0
                    ? (i(), true)
                    : (typeof t == "string" && (t = d.from(t, n)),
                      this.tlsState === 0
                          ? (this.rawWrite(t), i())
                          : this.tlsState === 1
                            ? this.once("secureConnection", () => {
                                  this.write(t, n, i);
                              })
                            : (this.tlsWrite(t), i()),
                      true);
            }
            end(t = d.alloc(0), n = "utf8", i = () => {}) {
                return (
                    this.write(t, n, () => {
                        this.ws.close(), i();
                    }),
                    this
                );
            }
            destroy() {
                return (this.destroyed = true), this.end();
            }
        });
    a(E, "Socket"),
        _(E, "defaults", {
            poolQueryViaFetch: false,
            fetchEndpoint: a(
                (t) => "https://" + Fu(t) + "/sql",
                "fetchEndpoint"
            ),
            fetchConnectionCache: true,
            fetchFunction: undefined,
            webSocketConstructor: undefined,
            wsProxy: a((t) => t + "/v2", "wsProxy"),
            useSecureWebSocket: true,
            forceDisablePgSSL: true,
            coalesceWrites: true,
            pipelineConnect: "password",
            subtls: undefined,
            rootCerts: "",
            pipelineTLS: false,
            disableSNI: false,
        }),
        _(E, "opts", {});
    Ae = E;
});
var zr = T((I) => {
    p();
    Object.defineProperty(I, "__esModule", { value: true });
    I.NoticeMessage =
        I.DataRowMessage =
        I.CommandCompleteMessage =
        I.ReadyForQueryMessage =
        I.NotificationResponseMessage =
        I.BackendKeyDataMessage =
        I.AuthenticationMD5Password =
        I.ParameterStatusMessage =
        I.ParameterDescriptionMessage =
        I.RowDescriptionMessage =
        I.Field =
        I.CopyResponse =
        I.CopyDataMessage =
        I.DatabaseError =
        I.copyDone =
        I.emptyQuery =
        I.replicationStart =
        I.portalSuspended =
        I.noData =
        I.closeComplete =
        I.bindComplete =
        I.parseComplete =
            undefined;
    I.parseComplete = { name: "parseComplete", length: 5 };
    I.bindComplete = { name: "bindComplete", length: 5 };
    I.closeComplete = { name: "closeComplete", length: 5 };
    I.noData = { name: "noData", length: 5 };
    I.portalSuspended = { name: "portalSuspended", length: 5 };
    I.replicationStart = { name: "replicationStart", length: 4 };
    I.emptyQuery = { name: "emptyQuery", length: 4 };
    I.copyDone = { name: "copyDone", length: 4 };
    var Dr = class Dr2 extends Error {
        constructor(e, t, n) {
            super(e), (this.length = t), (this.name = n);
        }
    };
    a(Dr, "DatabaseError");
    var xr = Dr;
    I.DatabaseError = xr;
    var kr = class kr2 {
        constructor(e, t) {
            (this.length = e), (this.chunk = t), (this.name = "copyData");
        }
    };
    a(kr, "CopyDataMessage");
    var vr = kr;
    I.CopyDataMessage = vr;
    var Ur = class Ur2 {
        constructor(e, t, n, i) {
            (this.length = e),
                (this.name = t),
                (this.binary = n),
                (this.columnTypes = new Array(i));
        }
    };
    a(Ur, "CopyResponse");
    var Er = Ur;
    I.CopyResponse = Er;
    var Or = class Or2 {
        constructor(e, t, n, i, s, o, u) {
            (this.name = e),
                (this.tableID = t),
                (this.columnID = n),
                (this.dataTypeID = i),
                (this.dataTypeSize = s),
                (this.dataTypeModifier = o),
                (this.format = u);
        }
    };
    a(Or, "Field");
    var _r = Or;
    I.Field = _r;
    var Nr = class Nr2 {
        constructor(e, t) {
            (this.length = e),
                (this.fieldCount = t),
                (this.name = "rowDescription"),
                (this.fields = new Array(this.fieldCount));
        }
    };
    a(Nr, "RowDescriptionMessage");
    var Ar = Nr;
    I.RowDescriptionMessage = Ar;
    var qr = class qr2 {
        constructor(e, t) {
            (this.length = e),
                (this.parameterCount = t),
                (this.name = "parameterDescription"),
                (this.dataTypeIDs = new Array(this.parameterCount));
        }
    };
    a(qr, "ParameterDescriptionMessage");
    var Cr = qr;
    I.ParameterDescriptionMessage = Cr;
    var Qr = class Qr2 {
        constructor(e, t, n) {
            (this.length = e),
                (this.parameterName = t),
                (this.parameterValue = n),
                (this.name = "parameterStatus");
        }
    };
    a(Qr, "ParameterStatusMessage");
    var Ir = Qr;
    I.ParameterStatusMessage = Ir;
    var Wr = class Wr2 {
        constructor(e, t) {
            (this.length = e),
                (this.salt = t),
                (this.name = "authenticationMD5Password");
        }
    };
    a(Wr, "AuthenticationMD5Password");
    var Tr = Wr;
    I.AuthenticationMD5Password = Tr;
    var jr = class jr2 {
        constructor(e, t, n) {
            (this.length = e),
                (this.processID = t),
                (this.secretKey = n),
                (this.name = "backendKeyData");
        }
    };
    a(jr, "BackendKeyDataMessage");
    var Pr = jr;
    I.BackendKeyDataMessage = Pr;
    var Hr = class Hr2 {
        constructor(e, t, n, i) {
            (this.length = e),
                (this.processId = t),
                (this.channel = n),
                (this.payload = i),
                (this.name = "notification");
        }
    };
    a(Hr, "NotificationResponseMessage");
    var Br = Hr;
    I.NotificationResponseMessage = Br;
    var Gr = class Gr2 {
        constructor(e, t) {
            (this.length = e), (this.status = t), (this.name = "readyForQuery");
        }
    };
    a(Gr, "ReadyForQueryMessage");
    var Lr = Gr;
    I.ReadyForQueryMessage = Lr;
    var $r = class $r2 {
        constructor(e, t) {
            (this.length = e), (this.text = t), (this.name = "commandComplete");
        }
    };
    a($r, "CommandCompleteMessage");
    var Rr = $r;
    I.CommandCompleteMessage = Rr;
    var Vr = class Vr2 {
        constructor(e, t) {
            (this.length = e),
                (this.fields = t),
                (this.name = "dataRow"),
                (this.fieldCount = t.length);
        }
    };
    a(Vr, "DataRowMessage");
    var Fr = Vr;
    I.DataRowMessage = Fr;
    var Kr = class Kr2 {
        constructor(e, t) {
            (this.length = e), (this.message = t), (this.name = "notice");
        }
    };
    a(Kr, "NoticeMessage");
    var Mr = Kr;
    I.NoticeMessage = Mr;
});
var ms = T((wt) => {
    p();
    Object.defineProperty(wt, "__esModule", { value: true });
    wt.Writer = undefined;
    var Zr = class Zr2 {
        constructor(e = 256) {
            (this.size = e),
                (this.offset = 5),
                (this.headerPosition = 0),
                (this.buffer = d.allocUnsafe(e));
        }
        ensure(e) {
            var t = this.buffer.length - this.offset;
            if (t < e) {
                var n = this.buffer,
                    i = n.length + (n.length >> 1) + e;
                (this.buffer = d.allocUnsafe(i)), n.copy(this.buffer);
            }
        }
        addInt32(e) {
            return (
                this.ensure(4),
                (this.buffer[this.offset++] = (e >>> 24) & 255),
                (this.buffer[this.offset++] = (e >>> 16) & 255),
                (this.buffer[this.offset++] = (e >>> 8) & 255),
                (this.buffer[this.offset++] = (e >>> 0) & 255),
                this
            );
        }
        addInt16(e) {
            return (
                this.ensure(2),
                (this.buffer[this.offset++] = (e >>> 8) & 255),
                (this.buffer[this.offset++] = (e >>> 0) & 255),
                this
            );
        }
        addCString(e) {
            if (!e) this.ensure(1);
            else {
                var t = d.byteLength(e);
                this.ensure(t + 1),
                    this.buffer.write(e, this.offset, "utf-8"),
                    (this.offset += t);
            }
            return (this.buffer[this.offset++] = 0), this;
        }
        addString(e = "") {
            var t = d.byteLength(e);
            return (
                this.ensure(t),
                this.buffer.write(e, this.offset),
                (this.offset += t),
                this
            );
        }
        add(e) {
            return (
                this.ensure(e.length),
                e.copy(this.buffer, this.offset),
                (this.offset += e.length),
                this
            );
        }
        join(e) {
            if (e) {
                this.buffer[this.headerPosition] = e;
                let t = this.offset - (this.headerPosition + 1);
                this.buffer.writeInt32BE(t, this.headerPosition + 1);
            }
            return this.buffer.slice(e ? 0 : 5, this.offset);
        }
        flush(e) {
            var t = this.join(e);
            return (
                (this.offset = 5),
                (this.headerPosition = 0),
                (this.buffer = d.allocUnsafe(this.size)),
                t
            );
        }
    };
    a(Zr, "Writer");
    var Yr = Zr;
    wt.Writer = Yr;
});
var ws = T((St) => {
    p();
    Object.defineProperty(St, "__esModule", { value: true });
    St.serialize = undefined;
    var Jr = ms(),
        M = new Jr.Writer(),
        Mu = a((r) => {
            M.addInt16(3).addInt16(0);
            for (let n of Object.keys(r)) M.addCString(n).addCString(r[n]);
            M.addCString("client_encoding").addCString("UTF8");
            var e = M.addCString("").flush(),
                t = e.length + 4;
            return new Jr.Writer().addInt32(t).add(e).flush();
        }, "startup"),
        Du = a(() => {
            let r = d.allocUnsafe(8);
            return r.writeInt32BE(8, 0), r.writeInt32BE(80877103, 4), r;
        }, "requestSsl"),
        ku = a((r) => M.addCString(r).flush(112), "password"),
        Uu = a(function (r, e) {
            return (
                M.addCString(r).addInt32(d.byteLength(e)).addString(e),
                M.flush(112)
            );
        }, "sendSASLInitialResponseMessage"),
        Ou = a(function (r) {
            return M.addString(r).flush(112);
        }, "sendSCRAMClientFinalMessage"),
        Nu = a((r) => M.addCString(r).flush(81), "query"),
        gs = [],
        qu = a((r) => {
            let e = r.name || "";
            e.length > 63 &&
                (console.error(
                    "Warning! Postgres only supports 63 characters for query names."
                ),
                console.error("You supplied %s (%s)", e, e.length),
                console.error(
                    "This can cause conflicts and silent errors executing queries"
                ));
            let t = r.types || gs;
            for (
                var n = t.length,
                    i = M.addCString(e).addCString(r.text).addInt16(n),
                    s = 0;
                s < n;
                s++
            )
                i.addInt32(t[s]);
            return M.flush(80);
        }, "parse"),
        Oe = new Jr.Writer(),
        Qu = a(function (r, e) {
            for (let t = 0; t < r.length; t++) {
                let n = e ? e(r[t], t) : r[t];
                n == null
                    ? (M.addInt16(0), Oe.addInt32(-1))
                    : n instanceof d
                      ? (M.addInt16(1), Oe.addInt32(n.length), Oe.add(n))
                      : (M.addInt16(0),
                        Oe.addInt32(d.byteLength(n)),
                        Oe.addString(n));
            }
        }, "writeValues"),
        Wu = a((r = {}) => {
            let e = r.portal || "",
                t = r.statement || "",
                n = r.binary || false,
                i = r.values || gs,
                s = i.length;
            return (
                M.addCString(e).addCString(t),
                M.addInt16(s),
                Qu(i, r.valueMapper),
                M.addInt16(s),
                M.add(Oe.flush()),
                M.addInt16(n ? 1 : 0),
                M.flush(66)
            );
        }, "bind"),
        ju = d.from([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]),
        Hu = a((r) => {
            if (!r || (!r.portal && !r.rows)) return ju;
            let e = r.portal || "",
                t = r.rows || 0,
                n = d.byteLength(e),
                i = 4 + n + 1 + 4,
                s = d.allocUnsafe(1 + i);
            return (
                (s[0] = 69),
                s.writeInt32BE(i, 1),
                s.write(e, 5, "utf-8"),
                (s[n + 5] = 0),
                s.writeUInt32BE(t, s.length - 4),
                s
            );
        }, "execute"),
        Gu = a((r, e) => {
            let t = d.allocUnsafe(16);
            return (
                t.writeInt32BE(16, 0),
                t.writeInt16BE(1234, 4),
                t.writeInt16BE(5678, 6),
                t.writeInt32BE(r, 8),
                t.writeInt32BE(e, 12),
                t
            );
        }, "cancel"),
        Xr = a((r, e) => {
            let n = 4 + d.byteLength(e) + 1,
                i = d.allocUnsafe(1 + n);
            return (
                (i[0] = r),
                i.writeInt32BE(n, 1),
                i.write(e, 5, "utf-8"),
                (i[n] = 0),
                i
            );
        }, "cstringMessage"),
        $u = M.addCString("P").flush(68),
        Vu = M.addCString("S").flush(68),
        Ku = a(
            (r) =>
                r.name
                    ? Xr(68, `${r.type}${r.name || ""}`)
                    : r.type === "P"
                      ? $u
                      : Vu,
            "describe"
        ),
        zu = a((r) => {
            let e = `${r.type}${r.name || ""}`;
            return Xr(67, e);
        }, "close"),
        Yu = a((r) => M.add(r).flush(100), "copyData"),
        Zu = a((r) => Xr(102, r), "copyFail"),
        bt = a((r) => d.from([r, 0, 0, 0, 4]), "codeOnlyBuffer"),
        Ju = bt(72),
        Xu = bt(83),
        ec = bt(88),
        tc = bt(99),
        rc = {
            startup: Mu,
            password: ku,
            requestSsl: Du,
            sendSASLInitialResponseMessage: Uu,
            sendSCRAMClientFinalMessage: Ou,
            query: Nu,
            parse: qu,
            bind: Wu,
            execute: Hu,
            describe: Ku,
            close: zu,
            flush: a(() => Ju, "flush"),
            sync: a(() => Xu, "sync"),
            end: a(() => ec, "end"),
            copyData: Yu,
            copyDone: a(() => tc, "copyDone"),
            copyFail: Zu,
            cancel: Gu,
        };
    St.serialize = rc;
});
var bs = T((xt) => {
    p();
    Object.defineProperty(xt, "__esModule", { value: true });
    xt.BufferReader = undefined;
    var nc = d.allocUnsafe(0),
        tn = class tn2 {
            constructor(e = 0) {
                (this.offset = e),
                    (this.buffer = nc),
                    (this.encoding = "utf-8");
            }
            setBuffer(e, t) {
                (this.offset = e), (this.buffer = t);
            }
            int16() {
                let e = this.buffer.readInt16BE(this.offset);
                return (this.offset += 2), e;
            }
            byte() {
                let e = this.buffer[this.offset];
                return this.offset++, e;
            }
            int32() {
                let e = this.buffer.readInt32BE(this.offset);
                return (this.offset += 4), e;
            }
            string(e) {
                let t = this.buffer.toString(
                    this.encoding,
                    this.offset,
                    this.offset + e
                );
                return (this.offset += e), t;
            }
            cstring() {
                let e = this.offset,
                    t = e;
                for (; this.buffer[t++] !== 0; );
                return (
                    (this.offset = t),
                    this.buffer.toString(this.encoding, e, t - 1)
                );
            }
            bytes(e) {
                let t = this.buffer.slice(this.offset, this.offset + e);
                return (this.offset += e), t;
            }
        };
    a(tn, "BufferReader");
    var en = tn;
    xt.BufferReader = en;
});
var vs = T((vt) => {
    p();
    Object.defineProperty(vt, "__esModule", { value: true });
    vt.Parser = undefined;
    var D = zr(),
        ic = bs(),
        rn = 1,
        sc = 4,
        Ss = rn + sc,
        xs = d.allocUnsafe(0),
        sn = class sn2 {
            constructor(e) {
                if (
                    ((this.buffer = xs),
                    (this.bufferLength = 0),
                    (this.bufferOffset = 0),
                    (this.reader = new ic.BufferReader()),
                    e?.mode === "binary")
                )
                    throw new Error("Binary mode not supported yet");
                this.mode = e?.mode || "text";
            }
            parse(e, t) {
                this.mergeBuffer(e);
                let n = this.bufferOffset + this.bufferLength,
                    i = this.bufferOffset;
                for (; i + Ss <= n; ) {
                    let s = this.buffer[i],
                        o = this.buffer.readUInt32BE(i + rn),
                        u = rn + o;
                    if (u + i <= n) {
                        let c = this.handlePacket(i + Ss, s, o, this.buffer);
                        t(c), (i += u);
                    } else break;
                }
                i === n
                    ? ((this.buffer = xs),
                      (this.bufferLength = 0),
                      (this.bufferOffset = 0))
                    : ((this.bufferLength = n - i), (this.bufferOffset = i));
            }
            mergeBuffer(e) {
                if (this.bufferLength > 0) {
                    let t = this.bufferLength + e.byteLength;
                    if (t + this.bufferOffset > this.buffer.byteLength) {
                        let i;
                        if (
                            t <= this.buffer.byteLength &&
                            this.bufferOffset >= this.bufferLength
                        )
                            i = this.buffer;
                        else {
                            let s = this.buffer.byteLength * 2;
                            for (; t >= s; ) s *= 2;
                            i = d.allocUnsafe(s);
                        }
                        this.buffer.copy(
                            i,
                            0,
                            this.bufferOffset,
                            this.bufferOffset + this.bufferLength
                        ),
                            (this.buffer = i),
                            (this.bufferOffset = 0);
                    }
                    e.copy(this.buffer, this.bufferOffset + this.bufferLength),
                        (this.bufferLength = t);
                } else
                    (this.buffer = e),
                        (this.bufferOffset = 0),
                        (this.bufferLength = e.byteLength);
            }
            handlePacket(e, t, n, i) {
                switch (t) {
                    case 50:
                        return D.bindComplete;
                    case 49:
                        return D.parseComplete;
                    case 51:
                        return D.closeComplete;
                    case 110:
                        return D.noData;
                    case 115:
                        return D.portalSuspended;
                    case 99:
                        return D.copyDone;
                    case 87:
                        return D.replicationStart;
                    case 73:
                        return D.emptyQuery;
                    case 68:
                        return this.parseDataRowMessage(e, n, i);
                    case 67:
                        return this.parseCommandCompleteMessage(e, n, i);
                    case 90:
                        return this.parseReadyForQueryMessage(e, n, i);
                    case 65:
                        return this.parseNotificationMessage(e, n, i);
                    case 82:
                        return this.parseAuthenticationResponse(e, n, i);
                    case 83:
                        return this.parseParameterStatusMessage(e, n, i);
                    case 75:
                        return this.parseBackendKeyData(e, n, i);
                    case 69:
                        return this.parseErrorMessage(e, n, i, "error");
                    case 78:
                        return this.parseErrorMessage(e, n, i, "notice");
                    case 84:
                        return this.parseRowDescriptionMessage(e, n, i);
                    case 116:
                        return this.parseParameterDescriptionMessage(e, n, i);
                    case 71:
                        return this.parseCopyInMessage(e, n, i);
                    case 72:
                        return this.parseCopyOutMessage(e, n, i);
                    case 100:
                        return this.parseCopyData(e, n, i);
                    default:
                        return new D.DatabaseError(
                            "received invalid response: " + t.toString(16),
                            n,
                            "error"
                        );
                }
            }
            parseReadyForQueryMessage(e, t, n) {
                this.reader.setBuffer(e, n);
                let i = this.reader.string(1);
                return new D.ReadyForQueryMessage(t, i);
            }
            parseCommandCompleteMessage(e, t, n) {
                this.reader.setBuffer(e, n);
                let i = this.reader.cstring();
                return new D.CommandCompleteMessage(t, i);
            }
            parseCopyData(e, t, n) {
                let i = n.slice(e, e + (t - 4));
                return new D.CopyDataMessage(t, i);
            }
            parseCopyInMessage(e, t, n) {
                return this.parseCopyMessage(e, t, n, "copyInResponse");
            }
            parseCopyOutMessage(e, t, n) {
                return this.parseCopyMessage(e, t, n, "copyOutResponse");
            }
            parseCopyMessage(e, t, n, i) {
                this.reader.setBuffer(e, n);
                let s = this.reader.byte() !== 0,
                    o = this.reader.int16(),
                    u = new D.CopyResponse(t, i, s, o);
                for (let c = 0; c < o; c++)
                    u.columnTypes[c] = this.reader.int16();
                return u;
            }
            parseNotificationMessage(e, t, n) {
                this.reader.setBuffer(e, n);
                let i = this.reader.int32(),
                    s = this.reader.cstring(),
                    o = this.reader.cstring();
                return new D.NotificationResponseMessage(t, i, s, o);
            }
            parseRowDescriptionMessage(e, t, n) {
                this.reader.setBuffer(e, n);
                let i = this.reader.int16(),
                    s = new D.RowDescriptionMessage(t, i);
                for (let o = 0; o < i; o++) s.fields[o] = this.parseField();
                return s;
            }
            parseField() {
                let e = this.reader.cstring(),
                    t = this.reader.int32(),
                    n = this.reader.int16(),
                    i = this.reader.int32(),
                    s = this.reader.int16(),
                    o = this.reader.int32(),
                    u = this.reader.int16() === 0 ? "text" : "binary";
                return new D.Field(e, t, n, i, s, o, u);
            }
            parseParameterDescriptionMessage(e, t, n) {
                this.reader.setBuffer(e, n);
                let i = this.reader.int16(),
                    s = new D.ParameterDescriptionMessage(t, i);
                for (let o = 0; o < i; o++)
                    s.dataTypeIDs[o] = this.reader.int32();
                return s;
            }
            parseDataRowMessage(e, t, n) {
                this.reader.setBuffer(e, n);
                let i = this.reader.int16(),
                    s = new Array(i);
                for (let o = 0; o < i; o++) {
                    let u = this.reader.int32();
                    s[o] = u === -1 ? null : this.reader.string(u);
                }
                return new D.DataRowMessage(t, s);
            }
            parseParameterStatusMessage(e, t, n) {
                this.reader.setBuffer(e, n);
                let i = this.reader.cstring(),
                    s = this.reader.cstring();
                return new D.ParameterStatusMessage(t, i, s);
            }
            parseBackendKeyData(e, t, n) {
                this.reader.setBuffer(e, n);
                let i = this.reader.int32(),
                    s = this.reader.int32();
                return new D.BackendKeyDataMessage(t, i, s);
            }
            parseAuthenticationResponse(e, t, n) {
                this.reader.setBuffer(e, n);
                let i = this.reader.int32(),
                    s = { name: "authenticationOk", length: t };
                switch (i) {
                    case 0:
                        break;
                    case 3:
                        s.length === 8 &&
                            (s.name = "authenticationCleartextPassword");
                        break;
                    case 5:
                        if (s.length === 12) {
                            s.name = "authenticationMD5Password";
                            let u = this.reader.bytes(4);
                            return new D.AuthenticationMD5Password(t, u);
                        }
                        break;
                    case 10:
                        (s.name = "authenticationSASL"), (s.mechanisms = []);
                        let o;
                        do
                            (o = this.reader.cstring()),
                                o && s.mechanisms.push(o);
                        while (o);
                        break;
                    case 11:
                        (s.name = "authenticationSASLContinue"),
                            (s.data = this.reader.string(t - 8));
                        break;
                    case 12:
                        (s.name = "authenticationSASLFinal"),
                            (s.data = this.reader.string(t - 8));
                        break;
                    default:
                        throw new Error(
                            "Unknown authenticationOk message type " + i
                        );
                }
                return s;
            }
            parseErrorMessage(e, t, n, i) {
                this.reader.setBuffer(e, n);
                let s = {},
                    o = this.reader.string(1);
                for (; o !== "\0"; )
                    (s[o] = this.reader.cstring()), (o = this.reader.string(1));
                let u = s.M,
                    c =
                        i === "notice"
                            ? new D.NoticeMessage(t, u)
                            : new D.DatabaseError(u, t, i);
                return (
                    (c.severity = s.S),
                    (c.code = s.C),
                    (c.detail = s.D),
                    (c.hint = s.H),
                    (c.position = s.P),
                    (c.internalPosition = s.p),
                    (c.internalQuery = s.q),
                    (c.where = s.W),
                    (c.schema = s.s),
                    (c.table = s.t),
                    (c.column = s.c),
                    (c.dataType = s.d),
                    (c.constraint = s.n),
                    (c.file = s.F),
                    (c.line = s.L),
                    (c.routine = s.R),
                    c
                );
            }
        };
    a(sn, "Parser");
    var nn = sn;
    vt.Parser = nn;
});
var on = T((Se) => {
    p();
    Object.defineProperty(Se, "__esModule", { value: true });
    Se.DatabaseError = Se.serialize = Se.parse = undefined;
    var oc = zr();
    Object.defineProperty(Se, "DatabaseError", {
        enumerable: true,
        get: a(function () {
            return oc.DatabaseError;
        }, "get"),
    });
    var ac = ws();
    Object.defineProperty(Se, "serialize", {
        enumerable: true,
        get: a(function () {
            return ac.serialize;
        }, "get"),
    });
    var uc = vs();
    function cc(r, e) {
        let t = new uc.Parser();
        return (
            r.on("data", (n) => t.parse(n, e)),
            new Promise((n) => r.on("end", () => n()))
        );
    }
    a(cc, "parse");
    Se.parse = cc;
});
var Es = {};
ie(Es, { connect: () => hc });
var _s = z(() => {
    p();
    a(hc, "connect");
});
var cn = T((ef, Is) => {
    p();
    var As = (gt2(), N(ys)),
        lc = we().EventEmitter,
        { parse: fc, serialize: Q } = on(),
        Cs = Q.flush(),
        pc = Q.sync(),
        dc = Q.end(),
        un = class un2 extends lc {
            constructor(e) {
                super(),
                    (e = e || {}),
                    (this.stream = e.stream || new As.Socket()),
                    (this._keepAlive = e.keepAlive),
                    (this._keepAliveInitialDelayMillis =
                        e.keepAliveInitialDelayMillis),
                    (this.lastBuffer = false),
                    (this.parsedStatements = {}),
                    (this.ssl = e.ssl || false),
                    (this._ending = false),
                    (this._emitMessage = false);
                var t = this;
                this.on("newListener", function (n) {
                    n === "message" && (t._emitMessage = true);
                });
            }
            connect(e, t) {
                var n = this;
                (this._connecting = true),
                    this.stream.setNoDelay(true),
                    this.stream.connect(e, t),
                    this.stream.once("connect", function () {
                        n._keepAlive &&
                            n.stream.setKeepAlive(
                                true,
                                n._keepAliveInitialDelayMillis
                            ),
                            n.emit("connect");
                    });
                let i = a(function (s) {
                    (n._ending &&
                        (s.code === "ECONNRESET" || s.code === "EPIPE")) ||
                        n.emit("error", s);
                }, "reportStreamError");
                if (
                    (this.stream.on("error", i),
                    this.stream.on("close", function () {
                        n.emit("end");
                    }),
                    !this.ssl)
                )
                    return this.attachListeners(this.stream);
                this.stream.once("data", function (s) {
                    var o = s.toString("utf8");
                    switch (o) {
                        case "S":
                            break;
                        case "N":
                            return (
                                n.stream.end(),
                                n.emit(
                                    "error",
                                    new Error(
                                        "The server does not support SSL connections"
                                    )
                                )
                            );
                        default:
                            return (
                                n.stream.end(),
                                n.emit(
                                    "error",
                                    new Error(
                                        "There was an error establishing an SSL connection"
                                    )
                                )
                            );
                    }
                    var u = (_s(), N(Es));
                    let c = { socket: n.stream };
                    n.ssl !== true &&
                        (Object.assign(c, n.ssl),
                        "key" in n.ssl && (c.key = n.ssl.key)),
                        As.isIP(t) === 0 && (c.servername = t);
                    try {
                        n.stream = u.connect(c);
                    } catch (h) {
                        return n.emit("error", h);
                    }
                    n.attachListeners(n.stream),
                        n.stream.on("error", i),
                        n.emit("sslconnect");
                });
            }
            attachListeners(e) {
                e.on("end", () => {
                    this.emit("end");
                }),
                    fc(e, (t) => {
                        var n = t.name === "error" ? "errorMessage" : t.name;
                        this._emitMessage && this.emit("message", t),
                            this.emit(n, t);
                    });
            }
            requestSsl() {
                this.stream.write(Q.requestSsl());
            }
            startup(e) {
                this.stream.write(Q.startup(e));
            }
            cancel(e, t) {
                this._send(Q.cancel(e, t));
            }
            password(e) {
                this._send(Q.password(e));
            }
            sendSASLInitialResponseMessage(e, t) {
                this._send(Q.sendSASLInitialResponseMessage(e, t));
            }
            sendSCRAMClientFinalMessage(e) {
                this._send(Q.sendSCRAMClientFinalMessage(e));
            }
            _send(e) {
                return this.stream.writable ? this.stream.write(e) : false;
            }
            query(e) {
                this._send(Q.query(e));
            }
            parse(e) {
                this._send(Q.parse(e));
            }
            bind(e) {
                this._send(Q.bind(e));
            }
            execute(e) {
                this._send(Q.execute(e));
            }
            flush() {
                this.stream.writable && this.stream.write(Cs);
            }
            sync() {
                (this._ending = true), this._send(Cs), this._send(pc);
            }
            ref() {
                this.stream.ref();
            }
            unref() {
                this.stream.unref();
            }
            end() {
                if (
                    ((this._ending = true),
                    !this._connecting || !this.stream.writable)
                ) {
                    this.stream.end();
                    return;
                }
                return this.stream.write(dc, () => {
                    this.stream.end();
                });
            }
            close(e) {
                this._send(Q.close(e));
            }
            describe(e) {
                this._send(Q.describe(e));
            }
            sendCopyFromChunk(e) {
                this._send(Q.copyData(e));
            }
            endCopyFrom() {
                this._send(Q.copyDone());
            }
            sendCopyFail(e) {
                this._send(Q.copyFail(e));
            }
        };
    a(un, "Connection");
    var an = un;
    Is.exports = an;
});
var Bs = T((sf, Ps) => {
    p();
    var yc = we().EventEmitter,
        nf = (He(), N(je)),
        mc = et(),
        hn = qi(),
        gc = Zi(),
        wc = hr(),
        bc = mt(),
        Ts = ps(),
        Sc = Xe(),
        xc = cn(),
        ln = class ln2 extends yc {
            constructor(e) {
                super(),
                    (this.connectionParameters = new bc(e)),
                    (this.user = this.connectionParameters.user),
                    (this.database = this.connectionParameters.database),
                    (this.port = this.connectionParameters.port),
                    (this.host = this.connectionParameters.host),
                    Object.defineProperty(this, "password", {
                        configurable: true,
                        enumerable: false,
                        writable: true,
                        value: this.connectionParameters.password,
                    }),
                    (this.replication = this.connectionParameters.replication);
                var t = e || {};
                (this._Promise = t.Promise || b2.Promise),
                    (this._types = new wc(t.types)),
                    (this._ending = false),
                    (this._connecting = false),
                    (this._connected = false),
                    (this._connectionError = false),
                    (this._queryable = true),
                    (this.connection =
                        t.connection ||
                        new xc({
                            stream: t.stream,
                            ssl: this.connectionParameters.ssl,
                            keepAlive: t.keepAlive || false,
                            keepAliveInitialDelayMillis:
                                t.keepAliveInitialDelayMillis || 0,
                            encoding:
                                this.connectionParameters.client_encoding ||
                                "utf8",
                        })),
                    (this.queryQueue = []),
                    (this.binary = t.binary || Sc.binary),
                    (this.processID = null),
                    (this.secretKey = null),
                    (this.ssl = this.connectionParameters.ssl || false),
                    this.ssl &&
                        this.ssl.key &&
                        Object.defineProperty(this.ssl, "key", {
                            enumerable: false,
                        }),
                    (this._connectionTimeoutMillis =
                        t.connectionTimeoutMillis || 0);
            }
            _errorAllQueries(e) {
                let t = a((n) => {
                    m.nextTick(() => {
                        n.handleError(e, this.connection);
                    });
                }, "enqueueError");
                this.activeQuery &&
                    (t(this.activeQuery), (this.activeQuery = null)),
                    this.queryQueue.forEach(t),
                    (this.queryQueue.length = 0);
            }
            _connect(e) {
                var t = this,
                    n = this.connection;
                if (
                    ((this._connectionCallback = e),
                    this._connecting || this._connected)
                ) {
                    let i = new Error(
                        "Client has already been connected. You cannot reuse a client."
                    );
                    m.nextTick(() => {
                        e(i);
                    });
                    return;
                }
                (this._connecting = true),
                    this.connectionTimeoutHandle,
                    this._connectionTimeoutMillis > 0 &&
                        (this.connectionTimeoutHandle = setTimeout(() => {
                            (n._ending = true),
                                n.stream.destroy(new Error("timeout expired"));
                        }, this._connectionTimeoutMillis)),
                    this.host && this.host.indexOf("/") === 0
                        ? n.connect(this.host + "/.s.PGSQL." + this.port)
                        : n.connect(this.port, this.host),
                    n.on("connect", function () {
                        t.ssl ? n.requestSsl() : n.startup(t.getStartupConf());
                    }),
                    n.on("sslconnect", function () {
                        n.startup(t.getStartupConf());
                    }),
                    this._attachListeners(n),
                    n.once("end", () => {
                        let i = this._ending
                            ? new Error("Connection terminated")
                            : new Error("Connection terminated unexpectedly");
                        clearTimeout(this.connectionTimeoutHandle),
                            this._errorAllQueries(i),
                            this._ending ||
                                (this._connecting && !this._connectionError
                                    ? this._connectionCallback
                                        ? this._connectionCallback(i)
                                        : this._handleErrorEvent(i)
                                    : this._connectionError ||
                                      this._handleErrorEvent(i)),
                            m.nextTick(() => {
                                this.emit("end");
                            });
                    });
            }
            connect(e) {
                if (e) {
                    this._connect(e);
                    return;
                }
                return new this._Promise((t, n) => {
                    this._connect((i) => {
                        i ? n(i) : t();
                    });
                });
            }
            _attachListeners(e) {
                e.on(
                    "authenticationCleartextPassword",
                    this._handleAuthCleartextPassword.bind(this)
                ),
                    e.on(
                        "authenticationMD5Password",
                        this._handleAuthMD5Password.bind(this)
                    ),
                    e.on("authenticationSASL", this._handleAuthSASL.bind(this)),
                    e.on(
                        "authenticationSASLContinue",
                        this._handleAuthSASLContinue.bind(this)
                    ),
                    e.on(
                        "authenticationSASLFinal",
                        this._handleAuthSASLFinal.bind(this)
                    ),
                    e.on(
                        "backendKeyData",
                        this._handleBackendKeyData.bind(this)
                    ),
                    e.on("error", this._handleErrorEvent.bind(this)),
                    e.on("errorMessage", this._handleErrorMessage.bind(this)),
                    e.on("readyForQuery", this._handleReadyForQuery.bind(this)),
                    e.on("notice", this._handleNotice.bind(this)),
                    e.on(
                        "rowDescription",
                        this._handleRowDescription.bind(this)
                    ),
                    e.on("dataRow", this._handleDataRow.bind(this)),
                    e.on(
                        "portalSuspended",
                        this._handlePortalSuspended.bind(this)
                    ),
                    e.on("emptyQuery", this._handleEmptyQuery.bind(this)),
                    e.on(
                        "commandComplete",
                        this._handleCommandComplete.bind(this)
                    ),
                    e.on("parseComplete", this._handleParseComplete.bind(this)),
                    e.on(
                        "copyInResponse",
                        this._handleCopyInResponse.bind(this)
                    ),
                    e.on("copyData", this._handleCopyData.bind(this)),
                    e.on("notification", this._handleNotification.bind(this));
            }
            _checkPgPass(e) {
                let t = this.connection;
                typeof this.password == "function"
                    ? this._Promise
                          .resolve()
                          .then(() => this.password())
                          .then((n) => {
                              if (n !== undefined) {
                                  if (typeof n != "string") {
                                      t.emit(
                                          "error",
                                          new TypeError(
                                              "Password must be a string"
                                          )
                                      );
                                      return;
                                  }
                                  this.connectionParameters.password =
                                      this.password = n;
                              } else
                                  this.connectionParameters.password =
                                      this.password = null;
                              e();
                          })
                          .catch((n) => {
                              t.emit("error", n);
                          })
                    : this.password !== null
                      ? e()
                      : gc(this.connectionParameters, (n) => {
                            n !== undefined &&
                                (this.connectionParameters.password =
                                    this.password =
                                        n),
                                e();
                        });
            }
            _handleAuthCleartextPassword(e) {
                this._checkPgPass(() => {
                    this.connection.password(this.password);
                });
            }
            _handleAuthMD5Password(e) {
                this._checkPgPass(() => {
                    let t = mc.postgresMd5PasswordHash(
                        this.user,
                        this.password,
                        e.salt
                    );
                    this.connection.password(t);
                });
            }
            _handleAuthSASL(e) {
                this._checkPgPass(() => {
                    (this.saslSession = hn.startSession(e.mechanisms)),
                        this.connection.sendSASLInitialResponseMessage(
                            this.saslSession.mechanism,
                            this.saslSession.response
                        );
                });
            }
            _handleAuthSASLContinue(e) {
                hn.continueSession(this.saslSession, this.password, e.data),
                    this.connection.sendSCRAMClientFinalMessage(
                        this.saslSession.response
                    );
            }
            _handleAuthSASLFinal(e) {
                hn.finalizeSession(this.saslSession, e.data),
                    (this.saslSession = null);
            }
            _handleBackendKeyData(e) {
                (this.processID = e.processID), (this.secretKey = e.secretKey);
            }
            _handleReadyForQuery(e) {
                this._connecting &&
                    ((this._connecting = false),
                    (this._connected = true),
                    clearTimeout(this.connectionTimeoutHandle),
                    this._connectionCallback &&
                        (this._connectionCallback(null, this),
                        (this._connectionCallback = null)),
                    this.emit("connect"));
                let { activeQuery: t } = this;
                (this.activeQuery = null),
                    (this.readyForQuery = true),
                    t && t.handleReadyForQuery(this.connection),
                    this._pulseQueryQueue();
            }
            _handleErrorWhileConnecting(e) {
                if (!this._connectionError) {
                    if (
                        ((this._connectionError = true),
                        clearTimeout(this.connectionTimeoutHandle),
                        this._connectionCallback)
                    )
                        return this._connectionCallback(e);
                    this.emit("error", e);
                }
            }
            _handleErrorEvent(e) {
                if (this._connecting)
                    return this._handleErrorWhileConnecting(e);
                (this._queryable = false),
                    this._errorAllQueries(e),
                    this.emit("error", e);
            }
            _handleErrorMessage(e) {
                if (this._connecting)
                    return this._handleErrorWhileConnecting(e);
                let t = this.activeQuery;
                if (!t) {
                    this._handleErrorEvent(e);
                    return;
                }
                (this.activeQuery = null), t.handleError(e, this.connection);
            }
            _handleRowDescription(e) {
                this.activeQuery.handleRowDescription(e);
            }
            _handleDataRow(e) {
                this.activeQuery.handleDataRow(e);
            }
            _handlePortalSuspended(e) {
                this.activeQuery.handlePortalSuspended(this.connection);
            }
            _handleEmptyQuery(e) {
                this.activeQuery.handleEmptyQuery(this.connection);
            }
            _handleCommandComplete(e) {
                this.activeQuery.handleCommandComplete(e, this.connection);
            }
            _handleParseComplete(e) {
                this.activeQuery.name &&
                    (this.connection.parsedStatements[this.activeQuery.name] =
                        this.activeQuery.text);
            }
            _handleCopyInResponse(e) {
                this.activeQuery.handleCopyInResponse(this.connection);
            }
            _handleCopyData(e) {
                this.activeQuery.handleCopyData(e, this.connection);
            }
            _handleNotification(e) {
                this.emit("notification", e);
            }
            _handleNotice(e) {
                this.emit("notice", e);
            }
            getStartupConf() {
                var e = this.connectionParameters,
                    t = { user: e.user, database: e.database },
                    n = e.application_name || e.fallback_application_name;
                return (
                    n && (t.application_name = n),
                    e.replication && (t.replication = "" + e.replication),
                    e.statement_timeout &&
                        (t.statement_timeout = String(
                            parseInt(e.statement_timeout, 10)
                        )),
                    e.lock_timeout &&
                        (t.lock_timeout = String(parseInt(e.lock_timeout, 10))),
                    e.idle_in_transaction_session_timeout &&
                        (t.idle_in_transaction_session_timeout = String(
                            parseInt(e.idle_in_transaction_session_timeout, 10)
                        )),
                    e.options && (t.options = e.options),
                    t
                );
            }
            cancel(e, t) {
                if (e.activeQuery === t) {
                    var n = this.connection;
                    this.host && this.host.indexOf("/") === 0
                        ? n.connect(this.host + "/.s.PGSQL." + this.port)
                        : n.connect(this.port, this.host),
                        n.on("connect", function () {
                            n.cancel(e.processID, e.secretKey);
                        });
                } else
                    e.queryQueue.indexOf(t) !== -1 &&
                        e.queryQueue.splice(e.queryQueue.indexOf(t), 1);
            }
            setTypeParser(e, t, n) {
                return this._types.setTypeParser(e, t, n);
            }
            getTypeParser(e, t) {
                return this._types.getTypeParser(e, t);
            }
            escapeIdentifier(e) {
                return '"' + e.replace(/"/g, '""') + '"';
            }
            escapeLiteral(e) {
                for (var t = false, n = "'", i = 0; i < e.length; i++) {
                    var s = e[i];
                    s === "'"
                        ? (n += s + s)
                        : s === "\\"
                          ? ((n += s + s), (t = true))
                          : (n += s);
                }
                return (n += "'"), t === true && (n = " E" + n), n;
            }
            _pulseQueryQueue() {
                if (this.readyForQuery === true)
                    if (
                        ((this.activeQuery = this.queryQueue.shift()),
                        this.activeQuery)
                    ) {
                        (this.readyForQuery = false), (this.hasExecuted = true);
                        let e = this.activeQuery.submit(this.connection);
                        e &&
                            m.nextTick(() => {
                                this.activeQuery.handleError(
                                    e,
                                    this.connection
                                ),
                                    (this.readyForQuery = true),
                                    this._pulseQueryQueue();
                            });
                    } else
                        this.hasExecuted &&
                            ((this.activeQuery = null), this.emit("drain"));
            }
            query(e, t, n) {
                var i, s, o, u, c;
                if (e == null)
                    throw new TypeError(
                        "Client was passed a null or undefined query"
                    );
                return (
                    typeof e.submit == "function"
                        ? ((o =
                              e.query_timeout ||
                              this.connectionParameters.query_timeout),
                          (s = i = e),
                          typeof t == "function" &&
                              (i.callback = i.callback || t))
                        : ((o = this.connectionParameters.query_timeout),
                          (i = new Ts(e, t, n)),
                          i.callback ||
                              (s = new this._Promise((h, l) => {
                                  i.callback = (y, x) => (y ? l(y) : h(x));
                              }))),
                    o &&
                        ((c = i.callback),
                        (u = setTimeout(() => {
                            var h = new Error("Query read timeout");
                            m.nextTick(() => {
                                i.handleError(h, this.connection);
                            }),
                                c(h),
                                (i.callback = () => {});
                            var l = this.queryQueue.indexOf(i);
                            l > -1 && this.queryQueue.splice(l, 1),
                                this._pulseQueryQueue();
                        }, o)),
                        (i.callback = (h, l) => {
                            clearTimeout(u), c(h, l);
                        })),
                    this.binary && !i.binary && (i.binary = true),
                    i._result &&
                        !i._result._types &&
                        (i._result._types = this._types),
                    this._queryable
                        ? this._ending
                            ? (m.nextTick(() => {
                                  i.handleError(
                                      new Error(
                                          "Client was closed and is not queryable"
                                      ),
                                      this.connection
                                  );
                              }),
                              s)
                            : (this.queryQueue.push(i),
                              this._pulseQueryQueue(),
                              s)
                        : (m.nextTick(() => {
                              i.handleError(
                                  new Error(
                                      "Client has encountered a connection error and is not queryable"
                                  ),
                                  this.connection
                              );
                          }),
                          s)
                );
            }
            ref() {
                this.connection.ref();
            }
            unref() {
                this.connection.unref();
            }
            end(e) {
                if (((this._ending = true), !this.connection._connecting))
                    if (e) e();
                    else return this._Promise.resolve();
                if (
                    (this.activeQuery || !this._queryable
                        ? this.connection.stream.destroy()
                        : this.connection.end(),
                    e)
                )
                    this.connection.once("end", e);
                else
                    return new this._Promise((t) => {
                        this.connection.once("end", t);
                    });
            }
        };
    a(ln, "Client");
    var Et = ln;
    Et.Query = Ts;
    Ps.exports = Et;
});
var Ms = T((uf, Fs) => {
    p();
    var vc = we().EventEmitter,
        Ls = a(function () {}, "NOOP"),
        Rs = a((r, e) => {
            let t = r.findIndex(e);
            return t === -1 ? undefined : r.splice(t, 1)[0];
        }, "removeWhere"),
        dn = class dn2 {
            constructor(e, t, n) {
                (this.client = e),
                    (this.idleListener = t),
                    (this.timeoutId = n);
            }
        };
    a(dn, "IdleItem");
    var fn = dn,
        yn = class yn2 {
            constructor(e) {
                this.callback = e;
            }
        };
    a(yn, "PendingItem");
    var Ne = yn;
    function Ec() {
        throw new Error(
            "Release called on client which has already been released to the pool."
        );
    }
    a(Ec, "throwOnDoubleRelease");
    function _t(r, e) {
        if (e) return { callback: e, result: undefined };
        let t,
            n,
            i = a(function (o, u) {
                o ? t(o) : n(u);
            }, "cb"),
            s = new r(function (o, u) {
                (n = o), (t = u);
            }).catch((o) => {
                throw (Error.captureStackTrace(o), o);
            });
        return { callback: i, result: s };
    }
    a(_t, "promisify");
    function _c(r, e) {
        return a(function t(n) {
            (n.client = e),
                e.removeListener("error", t),
                e.on("error", () => {
                    r.log(
                        "additional client error after disconnection due to error",
                        n
                    );
                }),
                r._remove(e),
                r.emit("error", n, e);
        }, "idleListener");
    }
    a(_c, "makeIdleListener");
    var mn = class mn2 extends vc {
        constructor(e, t) {
            super(),
                (this.options = Object.assign({}, e)),
                e != null &&
                    "password" in e &&
                    Object.defineProperty(this.options, "password", {
                        configurable: true,
                        enumerable: false,
                        writable: true,
                        value: e.password,
                    }),
                e != null &&
                    e.ssl &&
                    e.ssl.key &&
                    Object.defineProperty(this.options.ssl, "key", {
                        enumerable: false,
                    }),
                (this.options.max =
                    this.options.max || this.options.poolSize || 10),
                (this.options.maxUses = this.options.maxUses || 1 / 0),
                (this.options.allowExitOnIdle =
                    this.options.allowExitOnIdle || false),
                (this.options.maxLifetimeSeconds =
                    this.options.maxLifetimeSeconds || 0),
                (this.log = this.options.log || function () {}),
                (this.Client = this.options.Client || t || At().Client),
                (this.Promise = this.options.Promise || b2.Promise),
                typeof this.options.idleTimeoutMillis > "u" &&
                    (this.options.idleTimeoutMillis = 1e4),
                (this._clients = []),
                (this._idle = []),
                (this._expired = new WeakSet()),
                (this._pendingQueue = []),
                (this._endCallback = undefined),
                (this.ending = false),
                (this.ended = false);
        }
        _isFull() {
            return this._clients.length >= this.options.max;
        }
        _pulseQueue() {
            if ((this.log("pulse queue"), this.ended)) {
                this.log("pulse queue ended");
                return;
            }
            if (this.ending) {
                this.log("pulse queue on ending"),
                    this._idle.length &&
                        this._idle.slice().map((t) => {
                            this._remove(t.client);
                        }),
                    this._clients.length ||
                        ((this.ended = true), this._endCallback());
                return;
            }
            if (!this._pendingQueue.length) {
                this.log("no queued requests");
                return;
            }
            if (!this._idle.length && this._isFull()) return;
            let e = this._pendingQueue.shift();
            if (this._idle.length) {
                let t = this._idle.pop();
                clearTimeout(t.timeoutId);
                let n = t.client;
                n.ref && n.ref();
                let i = t.idleListener;
                return this._acquireClient(n, e, i, false);
            }
            if (!this._isFull()) return this.newClient(e);
            throw new Error("unexpected condition");
        }
        _remove(e) {
            let t = Rs(this._idle, (n) => n.client === e);
            t !== undefined && clearTimeout(t.timeoutId),
                (this._clients = this._clients.filter((n) => n !== e)),
                e.end(),
                this.emit("remove", e);
        }
        connect(e) {
            if (this.ending) {
                let i = new Error(
                    "Cannot use a pool after calling end on the pool"
                );
                return e ? e(i) : this.Promise.reject(i);
            }
            let t = _t(this.Promise, e),
                n = t.result;
            if (this._isFull() || this._idle.length) {
                if (
                    (this._idle.length && m.nextTick(() => this._pulseQueue()),
                    !this.options.connectionTimeoutMillis)
                )
                    return this._pendingQueue.push(new Ne(t.callback)), n;
                let i = a((u, c, h) => {
                        clearTimeout(o), t.callback(u, c, h);
                    }, "queueCallback"),
                    s = new Ne(i),
                    o = setTimeout(() => {
                        Rs(this._pendingQueue, (u) => u.callback === i),
                            (s.timedOut = true),
                            t.callback(
                                new Error(
                                    "timeout exceeded when trying to connect"
                                )
                            );
                    }, this.options.connectionTimeoutMillis);
                return this._pendingQueue.push(s), n;
            }
            return this.newClient(new Ne(t.callback)), n;
        }
        newClient(e) {
            let t = new this.Client(this.options);
            this._clients.push(t);
            let n = _c(this, t);
            this.log("checking client timeout");
            let i,
                s = false;
            this.options.connectionTimeoutMillis &&
                (i = setTimeout(() => {
                    this.log("ending client due to timeout"),
                        (s = true),
                        t.connection ? t.connection.stream.destroy() : t.end();
                }, this.options.connectionTimeoutMillis)),
                this.log("connecting new client"),
                t.connect((o) => {
                    if ((i && clearTimeout(i), t.on("error", n), o))
                        this.log("client failed to connect", o),
                            (this._clients = this._clients.filter(
                                (u) => u !== t
                            )),
                            s &&
                                (o.message =
                                    "Connection terminated due to connection timeout"),
                            this._pulseQueue(),
                            e.timedOut || e.callback(o, undefined, Ls);
                    else {
                        if (
                            (this.log("new client connected"),
                            this.options.maxLifetimeSeconds !== 0)
                        ) {
                            let u = setTimeout(() => {
                                this.log(
                                    "ending client due to expired lifetime"
                                ),
                                    this._expired.add(t),
                                    this._idle.findIndex(
                                        (h) => h.client === t
                                    ) !== -1 &&
                                        this._acquireClient(
                                            t,
                                            new Ne((h, l, y) => y()),
                                            n,
                                            false
                                        );
                            }, this.options.maxLifetimeSeconds * 1000);
                            u.unref(), t.once("end", () => clearTimeout(u));
                        }
                        return this._acquireClient(t, e, n, true);
                    }
                });
        }
        _acquireClient(e, t, n, i) {
            i && this.emit("connect", e),
                this.emit("acquire", e),
                (e.release = this._releaseOnce(e, n)),
                e.removeListener("error", n),
                t.timedOut
                    ? i && this.options.verify
                        ? this.options.verify(e, e.release)
                        : e.release()
                    : i && this.options.verify
                      ? this.options.verify(e, (s) => {
                            if (s)
                                return (
                                    e.release(s), t.callback(s, undefined, Ls)
                                );
                            t.callback(undefined, e, e.release);
                        })
                      : t.callback(undefined, e, e.release);
        }
        _releaseOnce(e, t) {
            let n = false;
            return (i) => {
                n && Ec(), (n = true), this._release(e, t, i);
            };
        }
        _release(e, t, n) {
            if (
                (e.on("error", t),
                (e._poolUseCount = (e._poolUseCount || 0) + 1),
                this.emit("release", n, e),
                n ||
                    this.ending ||
                    !e._queryable ||
                    e._ending ||
                    e._poolUseCount >= this.options.maxUses)
            ) {
                e._poolUseCount >= this.options.maxUses &&
                    this.log("remove expended client"),
                    this._remove(e),
                    this._pulseQueue();
                return;
            }
            if (this._expired.has(e)) {
                this.log("remove expired client"),
                    this._expired.delete(e),
                    this._remove(e),
                    this._pulseQueue();
                return;
            }
            let s;
            this.options.idleTimeoutMillis &&
                ((s = setTimeout(() => {
                    this.log("remove idle client"), this._remove(e);
                }, this.options.idleTimeoutMillis)),
                this.options.allowExitOnIdle && s.unref()),
                this.options.allowExitOnIdle && e.unref(),
                this._idle.push(new fn(e, t, s)),
                this._pulseQueue();
        }
        query(e, t, n) {
            if (typeof e == "function") {
                let s = _t(this.Promise, e);
                return (
                    S(function () {
                        return s.callback(
                            new Error(
                                "Passing a function as the first parameter to pool.query is not supported"
                            )
                        );
                    }),
                    s.result
                );
            }
            typeof t == "function" && ((n = t), (t = undefined));
            let i = _t(this.Promise, n);
            return (
                (n = i.callback),
                this.connect((s, o) => {
                    if (s) return n(s);
                    let u = false,
                        c = a((h) => {
                            u || ((u = true), o.release(h), n(h));
                        }, "onError");
                    o.once("error", c), this.log("dispatching query");
                    try {
                        o.query(e, t, (h, l) => {
                            if (
                                (this.log("query dispatched"),
                                o.removeListener("error", c),
                                !u)
                            )
                                return (
                                    (u = true),
                                    o.release(h),
                                    h ? n(h) : n(undefined, l)
                                );
                        });
                    } catch (h) {
                        return o.release(h), n(h);
                    }
                }),
                i.result
            );
        }
        end(e) {
            if ((this.log("ending"), this.ending)) {
                let n = new Error("Called end on pool more than once");
                return e ? e(n) : this.Promise.reject(n);
            }
            this.ending = true;
            let t = _t(this.Promise, e);
            return (
                (this._endCallback = t.callback), this._pulseQueue(), t.result
            );
        }
        get waitingCount() {
            return this._pendingQueue.length;
        }
        get idleCount() {
            return this._idle.length;
        }
        get expiredCount() {
            return this._clients.reduce(
                (e, t) => e + (this._expired.has(t) ? 1 : 0),
                0
            );
        }
        get totalCount() {
            return this._clients.length;
        }
    };
    a(mn, "Pool");
    var pn = mn;
    Fs.exports = pn;
});
var Ds = {};
ie(Ds, { default: () => Ac });
var Ac;
var ks = z(() => {
    p();
    Ac = {};
});
var Us = T((ff, Cc) => {
    Cc.exports = {
        name: "pg",
        version: "8.8.0",
        description:
            "PostgreSQL client - pure javascript & libpq with the same API",
        keywords: [
            "database",
            "libpq",
            "pg",
            "postgre",
            "postgres",
            "postgresql",
            "rdbms",
        ],
        homepage: "https://github.com/brianc/node-postgres",
        repository: {
            type: "git",
            url: "git://github.com/brianc/node-postgres.git",
            directory: "packages/pg",
        },
        author: "Brian Carlson <brian.m.carlson@gmail.com>",
        main: "./lib",
        dependencies: {
            "buffer-writer": "2.0.0",
            "packet-reader": "1.0.0",
            "pg-connection-string": "^2.5.0",
            "pg-pool": "^3.5.2",
            "pg-protocol": "^1.5.0",
            "pg-types": "^2.1.0",
            pgpass: "1.x",
        },
        devDependencies: {
            async: "2.6.4",
            bluebird: "3.5.2",
            co: "4.6.0",
            "pg-copy-streams": "0.3.0",
        },
        peerDependencies: { "pg-native": ">=3.0.1" },
        peerDependenciesMeta: {
            "pg-native": { optional: true },
        },
        scripts: { test: "make test-all" },
        files: ["lib", "SPONSORS.md"],
        license: "MIT",
        engines: { node: ">= 8.0.0" },
        gitHead: "c99fb2c127ddf8d712500db2c7b9a5491a178655",
    };
});
var qs = T((pf, Ns) => {
    p();
    var Os = we().EventEmitter,
        Ic = (He(), N(je)),
        gn = et(),
        qe = (Ns.exports = function (r, e, t) {
            Os.call(this),
                (r = gn.normalizeQueryConfig(r, e, t)),
                (this.text = r.text),
                (this.values = r.values),
                (this.name = r.name),
                (this.callback = r.callback),
                (this.state = "new"),
                (this._arrayMode = r.rowMode === "array"),
                (this._emitRowEvents = false),
                this.on(
                    "newListener",
                    function (n) {
                        n === "row" && (this._emitRowEvents = true);
                    }.bind(this)
                );
        });
    Ic.inherits(qe, Os);
    var Tc = {
        sqlState: "code",
        statementPosition: "position",
        messagePrimary: "message",
        context: "where",
        schemaName: "schema",
        tableName: "table",
        columnName: "column",
        dataTypeName: "dataType",
        constraintName: "constraint",
        sourceFile: "file",
        sourceLine: "line",
        sourceFunction: "routine",
    };
    qe.prototype.handleError = function (r) {
        var e = this.native.pq.resultErrorFields();
        if (e)
            for (var t in e) {
                var n = Tc[t] || t;
                r[n] = e[t];
            }
        this.callback ? this.callback(r) : this.emit("error", r),
            (this.state = "error");
    };
    qe.prototype.then = function (r, e) {
        return this._getPromise().then(r, e);
    };
    qe.prototype.catch = function (r) {
        return this._getPromise().catch(r);
    };
    qe.prototype._getPromise = function () {
        return this._promise
            ? this._promise
            : ((this._promise = new Promise(
                  function (r, e) {
                      this._once("end", r), this._once("error", e);
                  }.bind(this)
              )),
              this._promise);
    };
    qe.prototype.submit = function (r) {
        this.state = "running";
        var e = this;
        (this.native = r.native), (r.native.arrayMode = this._arrayMode);
        var t = a(function (s, o, u) {
            if (
                ((r.native.arrayMode = false),
                S(function () {
                    e.emit("_done");
                }),
                s)
            )
                return e.handleError(s);
            e._emitRowEvents &&
                (u.length > 1
                    ? o.forEach((c, h) => {
                          c.forEach((l) => {
                              e.emit("row", l, u[h]);
                          });
                      })
                    : o.forEach(function (c) {
                          e.emit("row", c, u);
                      })),
                (e.state = "end"),
                e.emit("end", u),
                e.callback && e.callback(null, u);
        }, "after");
        if ((m.domain && (t = m.domain.bind(t)), this.name)) {
            this.name.length > 63 &&
                (console.error(
                    "Warning! Postgres only supports 63 characters for query names."
                ),
                console.error(
                    "You supplied %s (%s)",
                    this.name,
                    this.name.length
                ),
                console.error(
                    "This can cause conflicts and silent errors executing queries"
                ));
            var n = (this.values || []).map(gn.prepareValue);
            if (r.namedQueries[this.name]) {
                if (this.text && r.namedQueries[this.name] !== this.text) {
                    let s = new Error(
                        `Prepared statements must be unique - '${this.name}' was used for a different statement`
                    );
                    return t(s);
                }
                return r.native.execute(this.name, n, t);
            }
            return r.native.prepare(
                this.name,
                this.text,
                n.length,
                function (s) {
                    return s
                        ? t(s)
                        : ((r.namedQueries[e.name] = e.text),
                          e.native.execute(e.name, n, t));
                }
            );
        } else if (this.values) {
            if (!Array.isArray(this.values)) {
                let s = new Error("Query values must be an array");
                return t(s);
            }
            var i = this.values.map(gn.prepareValue);
            r.native.query(this.text, i, t);
        } else r.native.query(this.text, t);
    };
});
var Hs = T((gf, js) => {
    p();
    var Pc = (ks(), N(Ds)),
        Bc = hr(),
        mf = Us(),
        Qs = we().EventEmitter,
        Lc = (He(), N(je)),
        Rc = mt(),
        Ws = qs(),
        J = (js.exports = function (r) {
            Qs.call(this),
                (r = r || {}),
                (this._Promise = r.Promise || b2.Promise),
                (this._types = new Bc(r.types)),
                (this.native = new Pc({ types: this._types })),
                (this._queryQueue = []),
                (this._ending = false),
                (this._connecting = false),
                (this._connected = false),
                (this._queryable = true);
            var e = (this.connectionParameters = new Rc(r));
            (this.user = e.user),
                Object.defineProperty(this, "password", {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: e.password,
                }),
                (this.database = e.database),
                (this.host = e.host),
                (this.port = e.port),
                (this.namedQueries = {});
        });
    J.Query = Ws;
    Lc.inherits(J, Qs);
    J.prototype._errorAllQueries = function (r) {
        let e = a((t) => {
            m.nextTick(() => {
                (t.native = this.native), t.handleError(r);
            });
        }, "enqueueError");
        this._hasActiveQuery() &&
            (e(this._activeQuery), (this._activeQuery = null)),
            this._queryQueue.forEach(e),
            (this._queryQueue.length = 0);
    };
    J.prototype._connect = function (r) {
        var e = this;
        if (this._connecting) {
            m.nextTick(() =>
                r(
                    new Error(
                        "Client has already been connected. You cannot reuse a client."
                    )
                )
            );
            return;
        }
        (this._connecting = true),
            this.connectionParameters.getLibpqConnectionString(function (t, n) {
                if (t) return r(t);
                e.native.connect(n, function (i) {
                    if (i) return e.native.end(), r(i);
                    (e._connected = true),
                        e.native.on("error", function (s) {
                            (e._queryable = false),
                                e._errorAllQueries(s),
                                e.emit("error", s);
                        }),
                        e.native.on("notification", function (s) {
                            e.emit("notification", {
                                channel: s.relname,
                                payload: s.extra,
                            });
                        }),
                        e.emit("connect"),
                        e._pulseQueryQueue(true),
                        r();
                });
            });
    };
    J.prototype.connect = function (r) {
        if (r) {
            this._connect(r);
            return;
        }
        return new this._Promise((e, t) => {
            this._connect((n) => {
                n ? t(n) : e();
            });
        });
    };
    J.prototype.query = function (r, e, t) {
        var n, i, s, o, u;
        if (r == null)
            throw new TypeError("Client was passed a null or undefined query");
        if (typeof r.submit == "function")
            (s = r.query_timeout || this.connectionParameters.query_timeout),
                (i = n = r),
                typeof e == "function" && (r.callback = e);
        else if (
            ((s = this.connectionParameters.query_timeout),
            (n = new Ws(r, e, t)),
            !n.callback)
        ) {
            let c, h;
            (i = new this._Promise((l, y) => {
                (c = l), (h = y);
            })),
                (n.callback = (l, y) => (l ? h(l) : c(y)));
        }
        return (
            s &&
                ((u = n.callback),
                (o = setTimeout(() => {
                    var c = new Error("Query read timeout");
                    m.nextTick(() => {
                        n.handleError(c, this.connection);
                    }),
                        u(c),
                        (n.callback = () => {});
                    var h = this._queryQueue.indexOf(n);
                    h > -1 && this._queryQueue.splice(h, 1),
                        this._pulseQueryQueue();
                }, s)),
                (n.callback = (c, h) => {
                    clearTimeout(o), u(c, h);
                })),
            this._queryable
                ? this._ending
                    ? ((n.native = this.native),
                      m.nextTick(() => {
                          n.handleError(
                              new Error(
                                  "Client was closed and is not queryable"
                              )
                          );
                      }),
                      i)
                    : (this._queryQueue.push(n), this._pulseQueryQueue(), i)
                : ((n.native = this.native),
                  m.nextTick(() => {
                      n.handleError(
                          new Error(
                              "Client has encountered a connection error and is not queryable"
                          )
                      );
                  }),
                  i)
        );
    };
    J.prototype.end = function (r) {
        var e = this;
        (this._ending = true),
            this._connected || this.once("connect", this.end.bind(this, r));
        var t;
        return (
            r ||
                (t = new this._Promise(function (n, i) {
                    r = a((s) => (s ? i(s) : n()), "cb");
                })),
            this.native.end(function () {
                e._errorAllQueries(new Error("Connection terminated")),
                    m.nextTick(() => {
                        e.emit("end"), r && r();
                    });
            }),
            t
        );
    };
    J.prototype._hasActiveQuery = function () {
        return (
            this._activeQuery &&
            this._activeQuery.state !== "error" &&
            this._activeQuery.state !== "end"
        );
    };
    J.prototype._pulseQueryQueue = function (r) {
        if (this._connected && !this._hasActiveQuery()) {
            var e = this._queryQueue.shift();
            if (!e) {
                r || this.emit("drain");
                return;
            }
            (this._activeQuery = e), e.submit(this);
            var t = this;
            e.once("_done", function () {
                t._pulseQueryQueue();
            });
        }
    };
    J.prototype.cancel = function (r) {
        this._activeQuery === r
            ? this.native.cancel(function () {})
            : this._queryQueue.indexOf(r) !== -1 &&
              this._queryQueue.splice(this._queryQueue.indexOf(r), 1);
    };
    J.prototype.ref = function () {};
    J.prototype.unref = function () {};
    J.prototype.setTypeParser = function (r, e, t) {
        return this._types.setTypeParser(r, e, t);
    };
    J.prototype.getTypeParser = function (r, e) {
        return this._types.getTypeParser(r, e);
    };
});
var wn = T((Sf, Gs) => {
    p();
    Gs.exports = Hs();
});
var At = T((vf, rt) => {
    p();
    var Fc = Bs(),
        Mc = Xe(),
        Dc = cn(),
        kc = Ms(),
        { DatabaseError: Uc } = on(),
        Oc = a((r) => {
            var e;
            return (
                (e = class extends kc {
                    constructor(n) {
                        super(n, r);
                    }
                }),
                a(e, "BoundPool"),
                e
            );
        }, "poolFactory"),
        bn = a(function (r) {
            (this.defaults = Mc),
                (this.Client = r),
                (this.Query = this.Client.Query),
                (this.Pool = Oc(this.Client)),
                (this._pools = []),
                (this.Connection = Dc),
                (this.types = Je()),
                (this.DatabaseError = Uc);
        }, "PG");
    typeof m.env.NODE_PG_FORCE_NATIVE < "u"
        ? (rt.exports = new bn(wn()))
        : ((rt.exports = new bn(Fc)),
          Object.defineProperty(rt.exports, "native", {
              configurable: true,
              enumerable: false,
              get() {
                  var r = null;
                  try {
                      r = new bn(wn());
                  } catch (e) {
                      if (e.code !== "MODULE_NOT_FOUND") throw e;
                  }
                  return (
                      Object.defineProperty(rt.exports, "native", { value: r }),
                      r
                  );
              },
          }));
});
p();
var Ct = Qe(At());
gt2();
p();
fr();
gt2();
var Ks = Qe(et());
var Sn = class Sn2 extends Error {
    constructor() {
        super(...arguments);
        _(this, "name", "NeonDbError");
        _(this, "severity");
        _(this, "code");
        _(this, "detail");
        _(this, "hint");
        _(this, "position");
        _(this, "internalPosition");
        _(this, "internalQuery");
        _(this, "where");
        _(this, "schema");
        _(this, "table");
        _(this, "column");
        _(this, "dataType");
        _(this, "constraint");
        _(this, "file");
        _(this, "line");
        _(this, "routine");
        _(this, "sourceError");
    }
};
a(Sn, "NeonDbError");
var Ce = Sn;
var $s =
    "transaction() expects an array of queries, or a function returning an array of queries";
var Nc = [
    "severity",
    "code",
    "detail",
    "hint",
    "position",
    "internalPosition",
    "internalQuery",
    "where",
    "schema",
    "table",
    "column",
    "dataType",
    "constraint",
    "file",
    "line",
    "routine",
];
a(zs, "neon");
a(qc, "createNeonQueryPromise");
a(Vs, "processQueryResult");
var Zs = Qe(mt());
var xe = Qe(At());
var vn = class vn2 extends Ct.Client {
    constructor(t) {
        super(t);
        this.config = t;
    }
    get neonConfig() {
        return this.connection.stream;
    }
    connect(t) {
        let { neonConfig: n } = this;
        n.forceDisablePgSSL && (this.ssl = this.connection.ssl = false),
            this.ssl &&
                n.useSecureWebSocket &&
                console.warn(
                    "SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true."
                );
        let i =
                this.config?.host !== undefined ||
                this.config?.connectionString !== undefined ||
                m.env.PGHOST !== undefined,
            s = m.env.USER ?? m.env.USERNAME;
        if (
            !i &&
            this.host === "localhost" &&
            this.user === s &&
            this.database === s &&
            this.password === null
        )
            throw new Error(
                `No database host or connection string was set, and key parameters have default values (host: localhost, user: ${s}, db: ${s}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`
            );
        let o = super.connect(t),
            u = n.pipelineTLS && this.ssl,
            c = n.pipelineConnect === "password";
        if (!u && !n.pipelineConnect) return o;
        let h = this.connection;
        if ((u && h.on("connect", () => h.stream.emit("data", "S")), c)) {
            h.removeAllListeners("authenticationCleartextPassword"),
                h.removeAllListeners("readyForQuery"),
                h.once("readyForQuery", () =>
                    h.on("readyForQuery", this._handleReadyForQuery.bind(this))
                );
            let l = this.ssl ? "sslconnect" : "connect";
            h.on(l, () => {
                this._handleAuthCleartextPassword(),
                    this._handleReadyForQuery();
            });
        }
        return o;
    }
    async _handleAuthSASLContinue(t) {
        let n = this.saslSession,
            i = this.password,
            s = t.data;
        if (
            n.message !== "SASLInitialResponse" ||
            typeof i != "string" ||
            typeof s != "string"
        )
            throw new Error("SASL: protocol error");
        let o = Object.fromEntries(
                s.split(",").map((O) => {
                    if (!/^.=/.test(O))
                        throw new Error("SASL: Invalid attribute pair entry");
                    let K = O[0],
                        le = O.substring(2);
                    return [K, le];
                })
            ),
            u = o.r,
            c = o.s,
            h = o.i;
        if (!u || !/^[!-+--~]+$/.test(u))
            throw new Error(
                "SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable"
            );
        if (
            !c ||
            !/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(
                c
            )
        )
            throw new Error(
                "SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64"
            );
        if (!h || !/^[1-9][0-9]*$/.test(h))
            throw new Error(
                "SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count"
            );
        if (!u.startsWith(n.clientNonce))
            throw new Error(
                "SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce"
            );
        if (u.length === n.clientNonce.length)
            throw new Error(
                "SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short"
            );
        let l = parseInt(h, 10),
            y = d.from(c, "base64"),
            x = new TextEncoder(),
            C = x.encode(i),
            B = await g.subtle.importKey(
                "raw",
                C,
                { name: "HMAC", hash: { name: "SHA-256" } },
                false,
                ["sign"]
            ),
            W = new Uint8Array(
                await g.subtle.sign(
                    "HMAC",
                    B,
                    d.concat([y, d.from([0, 0, 0, 1])])
                )
            ),
            X = W;
        for (var de = 0; de < l - 1; de++)
            (W = new Uint8Array(await g.subtle.sign("HMAC", B, W))),
                (X = d.from(X.map((O, K) => X[K] ^ W[K])));
        let A = X,
            w = await g.subtle.importKey(
                "raw",
                A,
                { name: "HMAC", hash: { name: "SHA-256" } },
                false,
                ["sign"]
            ),
            P = new Uint8Array(
                await g.subtle.sign("HMAC", w, x.encode("Client Key"))
            ),
            V = await g.subtle.digest("SHA-256", P),
            k = "n=*,r=" + n.clientNonce,
            j = "r=" + u + ",s=" + c + ",i=" + l,
            ce = "c=biws,r=" + u,
            ee = k + "," + j + "," + ce,
            R = await g.subtle.importKey(
                "raw",
                V,
                { name: "HMAC", hash: { name: "SHA-256" } },
                false,
                ["sign"]
            );
        var G = new Uint8Array(await g.subtle.sign("HMAC", R, x.encode(ee))),
            he = d.from(P.map((O, K) => P[K] ^ G[K])),
            ye = he.toString("base64");
        let ve = await g.subtle.importKey(
                "raw",
                A,
                { name: "HMAC", hash: { name: "SHA-256" } },
                false,
                ["sign"]
            ),
            me = await g.subtle.sign("HMAC", ve, x.encode("Server Key")),
            se = await g.subtle.importKey(
                "raw",
                me,
                { name: "HMAC", hash: { name: "SHA-256" } },
                false,
                ["sign"]
            );
        var oe = d.from(await g.subtle.sign("HMAC", se, x.encode(ee)));
        (n.message = "SASLResponse"),
            (n.serverSignature = oe.toString("base64")),
            (n.response = ce + ",p=" + ye),
            this.connection.sendSCRAMClientFinalMessage(
                this.saslSession.response
            );
    }
};
a(vn, "NeonClient");
var xn = vn;
a(Qc, "promisify");
var En = class En2 extends Ct.Pool {
    constructor() {
        super(...arguments);
        _(this, "Client", xn);
        _(this, "hasFetchUnsupportedListeners", false);
    }
    on(t, n) {
        return (
            t !== "error" && (this.hasFetchUnsupportedListeners = true),
            super.on(t, n)
        );
    }
    query(t, n, i) {
        if (
            !Ae.poolQueryViaFetch ||
            this.hasFetchUnsupportedListeners ||
            typeof t == "function"
        )
            return super.query(t, n, i);
        typeof n == "function" && ((i = n), (n = undefined));
        let s = Qc(this.Promise, i);
        i = s.callback;
        try {
            let o = new Zs.default(this.options),
                u = encodeURIComponent,
                c = encodeURI,
                h = `postgresql://${u(o.user)}:${u(o.password)}@${u(o.host)}/${c(o.database)}`,
                l = typeof t == "string" ? t : t.text,
                y = n ?? t.values ?? [];
            zs(h, { fullResults: true, arrayMode: t.rowMode === "array" })(l, y)
                .then((C) => i(undefined, C))
                .catch((C) => i(C));
        } catch (o) {
            i(o);
        }
        return s.result;
    }
};
a(En, "NeonPool");
var export_ClientBase = xe.ClientBase;
var export_Connection = xe.Connection;
var export_DatabaseError = xe.DatabaseError;
var export_Query = xe.Query;
var export_defaults = xe.defaults;
var export_types = xe.types;
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/

// ../../node_modules/drizzle-orm/logger.js
class ConsoleLogWriter {
    static [entityKind] = "ConsoleLogWriter";
    write(message) {
        console.log(message);
    }
}

class DefaultLogger {
    static [entityKind] = "DefaultLogger";
    writer;
    constructor(config) {
        this.writer = config?.writer ?? new ConsoleLogWriter();
    }
    logQuery(query5, params) {
        const stringifiedParams = params.map((p2) => {
            try {
                return JSON.stringify(p2);
            } catch {
                return String(p2);
            }
        });
        const paramsStr = stringifiedParams.length
            ? ` -- params: [${stringifiedParams.join(", ")}]`
            : "";
        this.writer.write(`Query: ${query5}${paramsStr}`);
    }
}

class NoopLogger {
    static [entityKind] = "NoopLogger";
    logQuery() {}
}

// ../../node_modules/drizzle-orm/postgres-js/session.js
class PostgresJsPreparedQuery extends PgPreparedQuery {
    constructor(
        client,
        queryString,
        params,
        logger2,
        fields,
        customResultMapper
    ) {
        super({ sql: queryString, params });
        this.client = client;
        this.queryString = queryString;
        this.params = params;
        this.logger = logger2;
        this.fields = fields;
        this.customResultMapper = customResultMapper;
    }
    static [entityKind] = "PostgresJsPreparedQuery";
    async execute(placeholderValues = {}) {
        return tracer.startActiveSpan("drizzle.execute", async (span) => {
            const params = fillPlaceholders(this.params, placeholderValues);
            span?.setAttributes({
                "drizzle.query.text": this.queryString,
                "drizzle.query.params": JSON.stringify(params),
            });
            this.logger.logQuery(this.queryString, params);
            const {
                fields,
                queryString: query5,
                client,
                joinsNotNullableMap,
                customResultMapper,
            } = this;
            if (!fields && !customResultMapper) {
                return tracer.startActiveSpan("drizzle.driver.execute", () => {
                    return client.unsafe(query5, params);
                });
            }
            const rows = await tracer.startActiveSpan(
                "drizzle.driver.execute",
                () => {
                    span?.setAttributes({
                        "drizzle.query.text": query5,
                        "drizzle.query.params": JSON.stringify(params),
                    });
                    return client.unsafe(query5, params).values();
                }
            );
            return tracer.startActiveSpan("drizzle.mapResponse", () => {
                return customResultMapper
                    ? customResultMapper(rows)
                    : rows.map((row) =>
                          mapResultRow(fields, row, joinsNotNullableMap)
                      );
            });
        });
    }
    all(placeholderValues = {}) {
        return tracer.startActiveSpan("drizzle.execute", async (span) => {
            const params = fillPlaceholders(this.params, placeholderValues);
            span?.setAttributes({
                "drizzle.query.text": this.queryString,
                "drizzle.query.params": JSON.stringify(params),
            });
            this.logger.logQuery(this.queryString, params);
            return tracer.startActiveSpan("drizzle.driver.execute", () => {
                span?.setAttributes({
                    "drizzle.query.text": this.queryString,
                    "drizzle.query.params": JSON.stringify(params),
                });
                return this.client.unsafe(this.queryString, params);
            });
        });
    }
}

class PostgresJsSession extends PgSession {
    constructor(client, dialect2, schema, options = {}) {
        super(dialect2);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.logger = options.logger ?? new NoopLogger();
    }
    static [entityKind] = "PostgresJsSession";
    logger;
    prepareQuery(query5, fields, name, customResultMapper) {
        return new PostgresJsPreparedQuery(
            this.client,
            query5.sql,
            query5.params,
            this.logger,
            fields,
            customResultMapper
        );
    }
    query(query5, params) {
        this.logger.logQuery(query5, params);
        return this.client.unsafe(query5, params).values();
    }
    queryObjects(query5, params) {
        return this.client.unsafe(query5, params);
    }
    transaction(transaction, config) {
        return this.client.begin(async (client) => {
            const session2 = new PostgresJsSession(
                client,
                this.dialect,
                this.schema,
                this.options
            );
            const tx = new PostgresJsTransaction(
                this.dialect,
                session2,
                this.schema
            );
            if (config) {
                await tx.setTransaction(config);
            }
            return transaction(tx);
        });
    }
}

class PostgresJsTransaction extends PgTransaction {
    constructor(dialect2, session2, schema, nestedIndex = 0) {
        super(dialect2, session2, schema, nestedIndex);
        this.session = session2;
    }
    static [entityKind] = "PostgresJsTransaction";
    transaction(transaction) {
        return this.session.client.savepoint((client) => {
            const session2 = new PostgresJsSession(
                client,
                this.dialect,
                this.schema,
                this.session.options
            );
            const tx = new PostgresJsTransaction(
                this.dialect,
                session2,
                this.schema
            );
            return transaction(tx);
        });
    }
}

// ../../node_modules/drizzle-orm/postgres-js/driver.js
var drizzle = function (client, config = {}) {
    const dialect3 = new PgDialect();
    let logger3;
    if (config.logger === true) {
        logger3 = new DefaultLogger();
    } else if (config.logger !== false) {
        logger3 = config.logger;
    }
    let schema;
    if (config.schema) {
        const tablesConfig = extractTablesRelationalConfig(
            config.schema,
            createTableRelationsHelpers
        );
        schema = {
            fullSchema: config.schema,
            schema: tablesConfig.tables,
            tableNamesMap: tablesConfig.tableNamesMap,
        };
    }
    const session3 = new PostgresJsSession(client, dialect3, schema, {
        logger: logger3,
    });
    return new PgDatabase(dialect3, session3, schema);
};

// ../../node_modules/drizzle-orm/neon-http/session.js
var rawQueryConfig = {
    arrayMode: false,
    fullResults: true,
};
var queryConfig = {
    arrayMode: true,
    fullResults: true,
};

class NeonHttpPreparedQuery extends PgPreparedQuery {
    constructor(client, query5, logger4, fields, customResultMapper) {
        super(query5);
        this.client = client;
        this.logger = logger4;
        this.fields = fields;
        this.customResultMapper = customResultMapper;
    }
    static [entityKind] = "NeonHttpPreparedQuery";
    async execute(placeholderValues = {}) {
        const params = fillPlaceholders(this.query.params, placeholderValues);
        this.logger.logQuery(this.query.sql, params);
        const { fields, client, query: query5, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            return client(query5.sql, params, rawQueryConfig);
        }
        const result2 = await client(query5.sql, params, queryConfig);
        return this.mapResult(result2);
    }
    mapResult(result2) {
        if (!this.fields && !this.customResultMapper) {
            return result2;
        }
        const rows = result2.rows;
        if (this.customResultMapper) {
            return this.customResultMapper(rows);
        }
        return rows.map((row) =>
            mapResultRow(this.fields, row, this.joinsNotNullableMap)
        );
    }
    all(placeholderValues = {}) {
        const params = fillPlaceholders(this.query.params, placeholderValues);
        this.logger.logQuery(this.query.sql, params);
        return this.client(this.query.sql, params, rawQueryConfig).then(
            (result2) => result2.rows
        );
    }
    values(placeholderValues = {}) {
        const params = fillPlaceholders(this.query.params, placeholderValues);
        this.logger.logQuery(this.query.sql, params);
        return this.client(this.query.sql, params).then(
            (result2) => result2.rows
        );
    }
}

class NeonHttpSession extends PgSession {
    constructor(client, dialect3, schema, options = {}) {
        super(dialect3);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.logger = options.logger ?? new NoopLogger();
    }
    static [entityKind] = "NeonHttpSession";
    logger;
    prepareQuery(query5, fields, name, customResultMapper) {
        return new NeonHttpPreparedQuery(
            this.client,
            query5,
            this.logger,
            fields,
            customResultMapper
        );
    }
    async batch(queries) {
        const preparedQueries = [];
        const builtQueries = [];
        for (const query5 of queries) {
            const preparedQuery = query5._prepare();
            const builtQuery = preparedQuery.getQuery();
            preparedQueries.push(preparedQuery);
            builtQueries.push(this.client(builtQuery.sql, builtQuery.params));
        }
        const batchResults = await this.client.transaction(
            builtQueries,
            queryConfig
        );
        return batchResults.map((result2, i) =>
            preparedQueries[i].mapResult(result2, true)
        );
    }
    async query(query5, params) {
        this.logger.logQuery(query5, params);
        const result2 = await this.client(query5, params, { arrayMode: true });
        return result2;
    }
    async queryObjects(query5, params) {
        return this.client(query5, params);
    }
    async transaction(_transaction, _config = {}) {
        throw new Error("No transactions support in neon-http driver");
    }
}

// ../../node_modules/drizzle-orm/neon-http/driver.js
var drizzle2 = function (client, config = {}) {
    const dialect4 = new PgDialect();
    let logger5;
    if (config.logger === true) {
        logger5 = new DefaultLogger();
    } else if (config.logger !== false) {
        logger5 = config.logger;
    }
    let schema;
    if (config.schema) {
        const tablesConfig = extractTablesRelationalConfig(
            config.schema,
            createTableRelationsHelpers
        );
        schema = {
            fullSchema: config.schema,
            schema: tablesConfig.tables,
            tableNamesMap: tablesConfig.tableNamesMap,
        };
    }
    const driver = new NeonHttpDriver(client, dialect4, { logger: logger5 });
    const session5 = driver.createSession(schema);
    return new NeonHttpDatabase(dialect4, session5, schema);
};

class NeonHttpDriver {
    constructor(client, dialect4, options = {}) {
        this.client = client;
        this.dialect = dialect4;
        this.options = options;
        this.initMappers();
    }
    static [entityKind] = "NeonDriver";
    createSession(schema) {
        return new NeonHttpSession(this.client, this.dialect, schema, {
            logger: this.options.logger,
        });
    }
    initMappers() {
        export_types.setTypeParser(
            export_types.builtins.TIMESTAMPTZ,
            (val) => val
        );
        export_types.setTypeParser(
            export_types.builtins.TIMESTAMP,
            (val) => val
        );
        export_types.setTypeParser(export_types.builtins.DATE, (val) => val);
    }
}

class NeonHttpDatabase extends PgDatabase {
    static [entityKind] = "NeonHttpDatabase";
    async batch(batch) {
        return this.session.batch(batch);
    }
}

// ../../node_modules/drizzle-orm/migrator.js
import crypto2 from "crypto";
import fs2 from "fs";
import path from "path";
var readMigrationFiles = function (config) {
    let migrationFolderTo;
    if (typeof config === "string") {
        const configAsString = fs2.readFileSync(
            path.resolve(".", config),
            "utf8"
        );
        const jsonConfig = JSON.parse(configAsString);
        migrationFolderTo = jsonConfig.out;
    } else {
        migrationFolderTo = config.migrationsFolder;
    }
    if (!migrationFolderTo) {
        throw new Error("no migration folder defined");
    }
    const migrationQueries = [];
    const journalPath = `${migrationFolderTo}/meta/_journal.json`;
    if (!fs2.existsSync(journalPath)) {
        throw new Error(`Can't find meta/_journal.json file`);
    }
    const journalAsString = fs2
        .readFileSync(`${migrationFolderTo}/meta/_journal.json`)
        .toString();
    const journal = JSON.parse(journalAsString);
    for (const journalEntry of journal.entries) {
        const migrationPath = `${migrationFolderTo}/${journalEntry.tag}.sql`;
        try {
            const query5 = fs2
                .readFileSync(`${migrationFolderTo}/${journalEntry.tag}.sql`)
                .toString();
            const result2 = query5
                .split("--> statement-breakpoint")
                .map((it) => {
                    return it;
                });
            migrationQueries.push({
                sql: result2,
                bps: journalEntry.breakpoints,
                folderMillis: journalEntry.when,
                hash: crypto2.createHash("sha256").update(query5).digest("hex"),
            });
        } catch {
            throw new Error(
                `No file ${migrationPath} found in ${migrationFolderTo} folder`
            );
        }
    }
    return migrationQueries;
};

// ../../node_modules/drizzle-orm/neon-http/migrator.js
async function migrate(db4, config) {
    const migrations = readMigrationFiles(config);
    const migrationsTable =
        typeof config === "string"
            ? "__drizzle_migrations"
            : config.migrationsTable ?? "__drizzle_migrations";
    const migrationsSchema =
        typeof config === "string"
            ? "drizzle"
            : config.migrationsSchema ?? "drizzle";
    const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at bigint
		)
	`;
    await db4.session.execute(
        sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(migrationsSchema)}`
    );
    await db4.session.execute(migrationTableCreate);
    const dbMigrations = await db4.session.all(
        sql`select id, hash, created_at from ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} order by created_at desc limit 1`
    );
    const lastDbMigration = dbMigrations[0];
    const rowsToInsert = [];
    for await (const migration of migrations) {
        if (
            !lastDbMigration ||
            Number(lastDbMigration.created_at) < migration.folderMillis
        ) {
            for (const stmt of migration.sql) {
                await db4.session.execute(sql.raw(stmt));
            }
            rowsToInsert.push(
                sql`insert into ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`
            );
        }
    }
    for await (const rowToInsert of rowsToInsert) {
        await db4.session.execute(rowToInsert);
    }
}

// ../../node_modules/drizzle-orm/postgres-js/migrator.js
async function migrate2(db4, config) {
    const migrations = readMigrationFiles(config);
    await db4.dialect.migrate(migrations, db4.session, config);
}

// src/connections.ts
class Connections {
    static connectionsCache = new Map();
    static loadConfig;
    static configs;
    static instance;
    static genericConnections = new Map();
    static privateConnections = new Map();
    constructor({ loadConfig }) {
        Connections.loadConfig = loadConfig;
        Connections.configs = Connections.loadConfig();
    }
    static getInstance(props) {
        if (!Connections.instance && props) {
            Connections.instance = new Connections(props);
        }
        return Connections.instance;
    }
    getShortLivedConnection(args) {
        return args
            ? this.getPrivateConnection({
                  url: args.overrideURL || "",
                  key: args.cacheKey || "",
                  type: "ll-connection",
              })
            : this.getGenericLLConnection();
    }
    getLongLivedDBConnection(args) {
        return args
            ? this.getPrivateConnection({
                  url: args.overrideURL || "",
                  key: args.cacheKey || "",
                  type: "sl-connection",
              })
            : this.getGenericSLConnection();
    }
    static log(args) {
        const { verbose } = Connections.configs;
        if (verbose) {
            console.log("[repository]", args);
        }
    }
    async getGenericLLConnection() {
        const key = "genericLongLivedConnection";
        const cache = Connections.genericConnections.get(key);
        const value = cache
            ? cache
            : (() => {
                  const { longLivedDbUrl: url, verbose } = Connections.configs;
                  const db4 = drizzle2(zs(url), {
                      schema: exports_schema,
                      logger: verbose || false,
                  });
                  Connections.log(
                      `New connection to Neon Db established using ${url}`
                  );
                  Connections.genericConnections.set(key, db4);
                  return db4;
              })();
        const { migrationsFolder } = Connections.configs;
        const migrate3 = async () => {
            await migrate2(value, { migrationsFolder });
            console.info("\uD83C\uDF92 Migrations on PostgresJS Db complete");
        };
        return { key, value, migrate: migrate3 };
    }
    getGenericSLConnection() {
        const key = "genericShortLivedConnection";
        const cache = Connections.genericConnections.get(key);
        const value = cache
            ? cache
            : (() => {
                  const { shortLivedDbUrl: url } = Connections.configs;
                  const db4 = drizzle(src_default(url), {
                      schema: exports_schema,
                  });
                  Connections.log(
                      `New connection to Neon Db established using ${url}`
                  );
                  Connections.genericConnections.set(key, db4);
                  return db4;
              })();
        const { migrationsFolder } = Connections.configs;
        const migrate3 = async () => {
            await migrate(value, { migrationsFolder });
            console.info("\uD83C\uDF92 Migrations on NeonDB complete!");
        };
        return { key, value, migrate: migrate3 };
    }
    getPrivateConnection(args) {
        const { url, key, type } = args;
        const { migrationsFolder } = Connections.configs;
        const cache = Connections.privateConnections.get(key);
        const value =
            cache || type === "sl-connection"
                ? (() => {
                      const { longLivedDbUrl: url2, verbose } =
                          Connections.configs;
                      const db4 = drizzle2(zs(url2), {
                          schema: exports_schema,
                          logger: verbose || false,
                      });
                      Connections.log(
                          `New connection to Neon Db established using ${url2}`
                      );
                      Connections.privateConnections.set(key, db4);
                      return db4;
                  })()
                : (() => {
                      const db4 = drizzle(src_default(url), {
                          schema: exports_schema,
                      });
                      Connections.log(
                          `New connection to Neon Db established using ${url}`
                      );
                      Connections.privateConnections.set(key, db4);
                      return db4;
                  })();
        const migrate3 =
            type === "sl-connection"
                ? async () => {
                      await migrate(value, { migrationsFolder });
                      console.info(
                          "\uD83C\uDF92 Migrations on NeonDB complete!"
                      );
                  }
                : async () => {
                      await migrate2(value, { migrationsFolder });
                      console.info(
                          "\uD83C\uDF92 Migrations on PostgresJS Db complete"
                      );
                  };
        return {
            key,
            value,
            migrate: migrate3,
        };
    }
    setupNeonDatabaseConnection(args) {
        const { shortLivedDbUrl: testingDbURL, verbose } = Connections.configs;
        const connectionsCache = Connections.connectionsCache;
        const key = args?.cacheKey || "testingConnection";
        console.log("Key used ", key);
        const cachedConnection = connectionsCache.get(key);
        if (cachedConnection) {
            console.info("\uD83D\uDC4D Read from cache");
            return cachedConnection;
        }
        const url = args?.overrideURL || testingDbURL;
        const neonDb = drizzle2(zs(url), {
            schema: exports_schema,
            logger: verbose || false,
        });
        console.info(
            `\u2705 New connection to Neon Db established using ${url}`
        );
        connectionsCache.set(key, neonDb);
        return connectionsCache.get(key);
    }
    getDatabaseInstance() {
        const { processEnvironment } = Connections.configs;
        if (processEnvironment === "test") {
            return (
                Connections.connectionsCache.get("PreloadKey") ||
                this.setupNeonDatabaseConnection()
            );
        }
        return this.setupPostgresDatabaseConnection();
    }
    async migrateNeonDb(args) {
        const { migrationsFolder } = Connections.configs;
        const neonDb = this.setupNeonDatabaseConnection({
            overrideURL: args?.overrideURL,
            cacheKey: args?.cacheKey,
        });
        await migrate(neonDb, { migrationsFolder });
        console.info("\uD83C\uDF92 Migrations on NeonDB complete!");
    }
    setupPostgresDatabaseConnection() {
        const prodKey = "prodConnection";
        const { longLivedDbUrl: localDbURL } = Connections.configs;
        const connectionsCache = Connections.connectionsCache;
        const cachedConnection = connectionsCache.get(prodKey);
        if (cachedConnection) {
            return cachedConnection;
        }
        const postgresDb = drizzle(src_default(localDbURL), {
            schema: exports_schema,
        });
        console.info("\u2705 Connection to Postgres database established");
        connectionsCache.set(prodKey, postgresDb);
        return connectionsCache.get(prodKey);
    }
    async migratePostgresDb(args) {
        const { migrationsFolder } = Connections.configs;
        const postDb = this.setupPostgresDatabaseConnection();
        await migrate2(postDb, { migrationsFolder });
        console.info("\uD83C\uDF92 Migrations on PostgresJS Db complete");
    }
}
// src/functional/tags.ts
class TagsRepository {
    static loadDb;
    constructor(props) {
        if (props) {
            TagsRepository.loadDb = props.loadDbInstance;
        }
        throw Error("Cannot invoke without init");
    }
    async insertNewTag(payload) {
        const pa = Array.isArray(payload) ? payload : [payload];
        const db4 = TagsRepository.loadDb();
        return await db4?.insert(tagsTable).values(pa).returning({
            id: tagsTable.id,
            name: tagsTable.name,
            description: tagsTable.description,
        });
    }
    async linkTagToTransaction(payload) {
        const db4 = TagsRepository.loadDb();
        return await db4
            ?.insert(transactionTagsTable)
            .values(payload)
            .returning({
                id: transactionTagsTable.id,
                tagId: transactionTagsTable.tagId,
                transactionId: transactionTagsTable.transactionId,
            });
    }
    async getAllUserTags(id) {
        const db4 = TagsRepository.loadDb();
        return await db4
            ?.select()
            .from(tagsTable)
            .where(eq(tagsTable.userId, id))
            .leftJoin(
                transactionTagsTable,
                eq(tagsTable.id, transactionTagsTable.tagId)
            )
            .leftJoin(
                transactionsTable,
                eq(transactionTagsTable.transactionId, transactionsTable.id)
            );
    }
    async getTagById(userId, tagId) {
        const db4 = TagsRepository.loadDb();
        return await Promise.all(
            tagId.map(async (id) => {
                return await db4
                    ?.select()
                    .from(tagsTable)
                    .where(
                        and(eq(tagsTable.userId, userId), eq(tagsTable.id, id))
                    )
                    .leftJoin(
                        transactionTagsTable,
                        eq(tagsTable.id, transactionTagsTable.tagId)
                    )
                    .leftJoin(
                        transactionsTable,
                        eq(
                            transactionTagsTable.transactionId,
                            transactionsTable.id
                        )
                    );
            })
        );
    }
}
// src/functional/transactions.ts
class TransactionsRepository {
    static loadDb;
    constructor(props) {
        if (props) {
            TransactionsRepository.loadDb = props.loadDbInstance;
        }
        throw Error("Cannot invoke without init");
    }
    static async insert(transaction) {
        const db4 = TransactionsRepository.loadDb();
        let newTransaction;
        try {
            newTransaction = await db4
                .insert(transactionsTable)
                .values(transaction)
                .returning({
                    id: transactionsTable.id,
                    messageId: transactionsTable.messageId,
                    transactionCode: transactionsTable.transactionCode,
                    dateAdded: transactionsTable.dateAdded,
                });
        } catch (e) {
            if (!(e instanceof Error)) {
                throw e;
            }
            if (
                e.message.includes(
                    "duplicate key value violates unique constraint"
                )
            ) {
                console.log("Duplicate key value violates unique constraint");
                return { message: "duplicate", payload: transaction };
            }
        }
        if (!newTransaction || newTransaction.length === 0) {
            console.log("Unknown error, Check logs.");
            return { message: "unknown" };
        }
        return { message: "success", value: newTransaction[0] };
    }
    async insertNewTransactions(transactions) {
        const insertTimingKey = `inserting ${transactions.length} transactions`;
        const db4 = TransactionsRepository.loadDb();
        console.time(insertTimingKey);
        const res = await Promise.all(
            transactions.map(async (transaction) => {
                return await TransactionsRepository.insert(transaction);
            })
        );
        console.timeEnd(insertTimingKey);
        let allSuccess = true;
        const oks = [];
        const duplicates = [];
        const failed = [];
        for (const response of res) {
            const { message, value, payload } = response;
            switch (message) {
                case "success":
                    oks.push(value);
                    break;
                case "duplicate":
                    duplicates.push(payload);
                    allSuccess = false;
                    break;
                case "unknown":
                    failed.push(value);
                    allSuccess = false;
                    break;
            }
        }
        return {
            message: allSuccess ? "success" : "partial",
            oks,
            duplicates,
            failed,
        };
    }
}
// src/functional/user.ts
class UserRepository {
    static loadDb;
    constructor(props) {
        if (props) {
            UserRepository.loadDb = props.loadDbInstance;
        }
        throw Error("Cannot invoke without init");
    }
    async insertUser(user) {
        const db4 = UserRepository.loadDb();
        const hash = Bun.password.hashSync(user.password);
        const [res] = await db4
            .insert(usersTable)
            .values({ ...user, password: hash })
            .returning({
                id: usersTable.id,
                username: usersTable.username,
                email: usersTable.email,
                phoneNumber: usersTable.phoneNumber,
                dateAdded: usersTable.dateAdded,
                lastModified: usersTable.lastModified,
            });
        return res;
    }
    async findUserByUsername(subject, pass) {
        const db4 = UserRepository.loadDb();
        const [res] = await db4
            .select({
                id: usersTable.id,
                username: usersTable.username,
                email: usersTable.email,
                phoneNumber: usersTable.phoneNumber,
                dateAdded: usersTable.dateAdded,
                lastModified: usersTable.lastModified,
                password: usersTable.password,
            })
            .from(usersTable)
            .where(eq(usersTable.username, subject));
        if (!res) {
            return "user_not_found";
        } else if (!Bun.password.verifySync(pass, res.password)) {
            return "incorrect_password";
        }
        const { password, ...publicUser } = res;
        return publicUser;
    }
    async findUserById(id) {
        const db4 = UserRepository.loadDb();
        const [res] = await db4
            .select({
                id: usersTable.id,
                username: usersTable.username,
                email: usersTable.email,
                phoneNumber: usersTable.phoneNumber,
                dateAdded: usersTable.dateAdded,
                lastModified: usersTable.lastModified,
            })
            .from(usersTable)
            .where(eq(usersTable.id, id));
        if (!res) {
            return null;
        }
        return res;
    }
    async deleteUser(id) {
        const db4 = UserRepository.loadDb();
        return await db4
            .delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning();
    }
}
// src/neon/api.ts
async function NeonAPIRequest(args) {
    const headers = {
        accept: "application/json",
        authorization: `Bearer ${args.apiKey}`,
        "content-type": "application/json",
        ...args.overrideHeaders,
    };
    return await fetch(args.url, {
        body: JSON.stringify(args.payload),
        method: args.method,
        headers,
    });
}
async function createNeonBranch(args) {
    const { id, apiKey } = args;
    const url = `${NEON_API_BASE_URL}/projects/${id}/branches`;
    const res = await NeonAPIRequest({
        method: "POST",
        url,
        apiKey,
        payload: {
            branch: { parent_id: NEON_TEST_BRANCH_ID },
            endpoints: [{ type: "read_write" }],
        },
    });
    const resPayload = await res.json();
    if (res.status != 201 || !resPayload) {
        throw Error(resPayload);
    }
    return resPayload;
}
async function loadNeonProject(args) {
    const url = `${NEON_API_BASE_URL}/projects`;
    const res = await NeonAPIRequest({
        method: "GET",
        url,
        apiKey: args.apiKey,
    });
    if (res.status !== 200) {
        throw Error(await res.text());
    }
    const resPayload = await res.json();
    if (!resPayload || !resPayload["projects"]) {
        throw Error(
            `\u2757\uFE0F Project payload lacks desired structure ${JSON.stringify(resPayload)}`
        );
    }
    const [project] = resPayload["projects"];
    return project;
}
async function destroyNeonTestingBranchDB(args) {
    const url = `${NEON_API_BASE_URL}/projects/${args.project}/branches/${args.branch}`;
    const res = await NeonAPIRequest({
        method: "DELETE",
        url,
        apiKey: args.apiKey,
    });
    const payload = await res.json();
    if (res.status !== 200 || !payload) {
        console.error("delete branches", payload);
        throw Error(payload);
    }
    return payload;
}
async function getAllBranches(args) {
    const url = `${NEON_API_BASE_URL}/projects/${args.project}/branches}`;
    const res = await NeonAPIRequest({
        method: "GET",
        url,
        apiKey: args.apiKey,
    });
    const payload = await res.json();
    if (res.status !== 200 || !payload) {
        console.error("get branches : ", payload);
        throw Error(payload);
    }
    return payload;
}
var NEON_API_BASE_URL = "https://console.neon.tech/api/v2";
var NEON_TEST_BRANCH_ID = "br-late-base-a21oviy0";
// src/neon/functional.ts
function applyNeonTemplate(templateURL, args) {
    const r = `<${args.key}>@</${args.key}>`;
    const url = templateURL.replaceAll(r, args.value);
    return url;
}
// src/seed/transactionsTypes.ts
async function seedTransactionTypes(dbInstance) {
    await dbInstance
        .insert(transactionTypeTable)
        .values(seedTransactionTypesValues);
    console.info("\uD83C\uDF31 Transaction types seeded");
}
var seedTransactionTypesValues = [
    {
        description: "For Deposit money MPESA transactions",
        name: "deposit",
    },
    {
        description: "For Withdraw money MPESA transactions",
        name: "withdraw",
    },
    {
        description: "send",
        name: "For Send money MPESA transactions",
    },
    {
        description: "For Receive money MPESA transactions",
        name: "receive",
    },
    {
        description: "For Paybill money MPESA transactions",
        name: "paybill",
    },
    {
        description: "For Buygoods money MPESA transactions",
        name: "buygoods",
    },
    {
        description: "For Airtime money MPESA transactions",
        name: "airtime",
    },
    {
        description: "For Fuliza MPESA transactions",
        name: "fuliza",
    },
    {
        description:
            "For Airtime money for other phone number MPESA transactions",
        name: "airtime_for",
    },
    {
        description: "For Invalid money MPESA transactions",
        name: "invalid",
    },
];
export {
    usersTable,
    transactionsTable,
    transactionTypeTable,
    transactionTagsTable,
    tagsTable,
    seedTransactionTypes,
    loadNeonProject,
    getAllBranches,
    destroyNeonTestingBranchDB,
    createNeonBranch,
    applyNeonTemplate,
    UserRepository,
    TransactionsRepository,
    TagsRepository,
    NeonAPIRequest,
    Connections,
};
